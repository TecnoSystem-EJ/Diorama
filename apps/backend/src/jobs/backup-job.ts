import { spawn } from "node:child_process";
import { createWriteStream, createReadStream } from "node:fs";
import { mkdir, readdir, readFile, rename, rm, mkdtemp, stat, writeFile } from "node:fs/promises";
import { createHash, randomBytes } from "node:crypto";
import path from "node:path";
import os from "node:os";
import { pipeline } from "node:stream/promises";
import cron from "node-cron";
import { UPLOAD_DIR } from "../config/enviroments.js";

const BACKUP_DIR = process.env.BACKUP_DIR ?? path.resolve(UPLOAD_DIR, "../../../backups");

function database() {
  const url = new URL(process.env.DATABASE_URL!);
  if (!["postgres:", "postgresql:"].includes(url.protocol)) throw new Error("O backup requer uma conexão PostgreSQL direta.");
  return { user: decodeURIComponent(url.username), name: decodeURIComponent(url.pathname.slice(1)), env: {
    ...process.env, PGHOST: url.hostname, PGPORT: url.port || "5432", PGUSER: decodeURIComponent(url.username), PGPASSWORD: decodeURIComponent(url.password),
  } };
}

async function command(program: string, args: string[], options: { output?: string; input?: string } = {}): Promise<string> {
  const config = database();
  const docker = process.env.BACKUP_USE_DOCKER === "true";
  const composeArgs = process.env.BACKUP_COMPOSE_FILE ? ["-f", process.env.BACKUP_COMPOSE_FILE] : [];
  const executable = docker && program !== "tar" ? "docker" : program;
  const parameters = docker && program !== "tar" ? ["compose", ...composeArgs, "exec", "-T", "postgres", program, ...args] : args;
  const child = spawn(executable, parameters, { env: config.env, stdio: [options.input ? "pipe" : "ignore", "pipe", "pipe"] });
  let output = "", stderr = "";
  child.stderr!.on("data", chunk => { stderr = (stderr + String(chunk)).slice(-1500); });
  if (!options.output) child.stdout!.on("data", chunk => { output += String(chunk); });
  const completion = new Promise<void>((resolve, reject) => {
    child.on("error", () => reject(new Error(`Não foi possível iniciar ${program}. Instale o cliente PostgreSQL ou use BACKUP_USE_DOCKER=true no desenvolvimento.`)));
    child.on("close", code => code === 0 ? resolve() : reject(new Error(`${program} falhou (código ${code}): ${stderr.replace(config.env.PGPASSWORD, "[oculto]")}`)));
  });
  await Promise.all([
    completion,
    ...(options.output ? [pipeline(child.stdout!, createWriteStream(options.output, { flags: "wx" }))] : []),
    ...(options.input ? [pipeline(createReadStream(options.input), child.stdin!)] : []),
  ]);
  return output;
}

async function hash(file: string) {
  const digest = createHash("sha256");
  for await (const chunk of createReadStream(file)) digest.update(chunk);
  return digest.digest("hex");
}

async function filesIn(directory: string, prefix = ""): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  for (const entry of await readdir(path.join(directory, prefix), { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) Object.assign(result, await filesIn(directory, relative));
    else if (entry.isFile()) result[relative] = await hash(path.join(directory, relative));
  }
  return result;
}

export async function createBackup() {
  const config = database();
  await mkdir(BACKUP_DIR, { recursive: true });
  await mkdir(UPLOAD_DIR, { recursive: true });
  const name = `diorama-${new Date().toISOString().replace(/[:.]/g, "-")}-${randomBytes(3).toString("hex")}`;
  const temporary = path.join(BACKUP_DIR, `${name}.partial`);
  await mkdir(temporary);
  try {
    await command("pg_dump", ["--format=custom", "-U", config.user, config.name], { output: path.join(temporary, "database.dump") });
    await command("tar", ["-czf", path.join(temporary, "uploads.tar.gz"), "-C", UPLOAD_DIR, "."]);
    const manifest = {
      version: 1, createdAt: new Date().toISOString(), database: config.name,
      databaseSha256: await hash(path.join(temporary, "database.dump")),
      uploadsSha256: await hash(path.join(temporary, "uploads.tar.gz")),
      files: await filesIn(UPLOAD_DIR),
    };
    await writeFile(path.join(temporary, "manifest.json"), JSON.stringify(manifest, null, 2));
    const destination = path.join(BACKUP_DIR, name);
    await rename(temporary, destination);
    return destination;
  } catch (error) { await rm(temporary, { recursive: true, force: true }); throw error; }
}

export async function verifyBackup(directory: string) {
  const config = database();
  const manifest = JSON.parse(await readFile(path.join(directory, "manifest.json"), "utf8")) as { version: number; databaseSha256: string; uploadsSha256: string; files: Record<string, string> };
  if (manifest.version !== 1 || await hash(path.join(directory, "database.dump")) !== manifest.databaseSha256 || await hash(path.join(directory, "uploads.tar.gz")) !== manifest.uploadsSha256) throw new Error("Backup inválido: checksum ou versão incompatível.");
  const verificationDatabase = `diorama_verify_${randomBytes(8).toString("hex")}`;
  const extracted = await mkdtemp(path.join(os.tmpdir(), "diorama-restore-"));
  let created = false;
  try {
    const entries = await command("tar", ["-tzf", path.join(directory, "uploads.tar.gz")]);
    if (entries.split("\n").some(entry => path.isAbsolute(entry) || entry.split("/").includes(".."))) throw new Error("Arquivo de uploads contém um caminho inválido.");
    await command("createdb", ["-U", config.user, verificationDatabase]); created = true;
    await command("pg_restore", ["--exit-on-error", "--no-owner", "--no-acl", "-U", config.user, "--dbname", verificationDatabase], { input: path.join(directory, "database.dump") });
    const rows = await command("psql", ["-U", config.user, "-d", verificationDatabase, "-tAc", "SELECT count(*) FROM public.edicoes; SELECT count(*) FROM public.usuarios;"]);
    await command("tar", ["-xzf", path.join(directory, "uploads.tar.gz"), "-C", extracted, "--no-same-owner", "--no-same-permissions"]);
    for (const [file, expected] of Object.entries(manifest.files)) {
      const destination = path.resolve(extracted, file);
      if (!destination.startsWith(extracted + path.sep) || !(await stat(destination)).isFile() || await hash(destination) !== expected) throw new Error("Falha na recuperação dos arquivos publicados.");
    }
    return { databaseRestored: true, verifiedFiles: Object.keys(manifest.files).length, recoveredCounts: rows.trim().split("\n").map(Number) };
  } finally {
    if (created) await command("dropdb", ["-U", config.user, verificationDatabase]);
    await rm(extracted, { recursive: true, force: true });
  }
}

export function runBackupJob() {
  const schedule = process.env.BACKUP_SCHEDULE ?? "0 2 * * *";
  if (!cron.validate(schedule)) throw new Error("BACKUP_SCHEDULE inválido.");
  let running = false;
  return cron.schedule(schedule, async () => {
    if (running) return;
    running = true;
    try { console.log(`Backup concluído: ${await createBackup()}`); }
    catch (error) { console.error("Falha no backup:", error instanceof Error ? error.message : "erro desconhecido"); }
    finally { running = false; }
  }, { timezone: process.env.BACKUP_TIMEZONE ?? "America/Sao_Paulo" });
}
