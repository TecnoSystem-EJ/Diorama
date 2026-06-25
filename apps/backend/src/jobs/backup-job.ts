import { exec } from "child_process";
import fs from "fs";
import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";
import {
  CONTAINER_NAME,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
} from "../config/enviroments.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const BACKUP_DIR = path.join(__dirname, "../../../../backups");

// Cria a pasta de backups se ela não existir
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR);
}

/**
 * Função responsável por executar o pg_dump via linha de comando
 */
const runBackup = () => {
  // Formata a data: YYYYMMDD_HHMMSS
  const date = new Date();
  const dateString = date
    .toISOString()
    .replace(/T/, "_")
    .replace(/:/g, "")
    .replace(/\..+/, "");
  const backupFile = path.join(
    BACKUP_DIR,
    `backup_${DB_NAME}_${dateString}.backup`,
  );

  console.log(
    `[${new Date().toLocaleString()}] Iniciando backup do banco '${DB_NAME}'...`,
  );

  // Usamos o "docker exec" para rodar o pg_dump de DENTRO do container.
  // O sinal ">" redireciona o arquivo gerado lá dentro para a pasta 'backups' da sua API no Windows.
  const command = `docker exec -e PGPASSWORD="${DB_PASSWORD}" ${CONTAINER_NAME} pg_dump -U ${DB_USER} -F c ${DB_NAME} > "${backupFile}"`;

  // Agora rodamos o comando normalmente.
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`[ERRO] Falha ao realizar o backup: ${error.message}`);
      return;
    }
    if (stderr) {
      // pg_dump pode enviar mensagens não-críticas para o stderr
      console.log(`[AVISO] pg_dump info: ${stderr}`);
    }
    console.log(
      `[${new Date().toLocaleString()}] Backup concluído com sucesso: ${backupFile}`,
    );
  });
};

// =========================================================
// Agendamento das Rotinas com Node-Cron
// =========================================================

export const runBackupJob = () => {
  // 1. Rotina Diária às 02:00 AM (Minuto 0, Hora 2)
  cron.schedule("0 2 * * *", () => {
    console.log("Executando rotina diária de backup (02:00 AM)...");
    runBackup();
  });

  // 2. Rotina de Teste a cada 2 minutos
  // descomente o código abaixo para testar
  // cron.schedule("*/2 * * * *", () => {
  //   console.log("Executando rotina de teste de backup (2 em 2 minutos)...");
  //   runBackup();
  // });

  console.log("Serviço automático de backup iniciado!");
};
