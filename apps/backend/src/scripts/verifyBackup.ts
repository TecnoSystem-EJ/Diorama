import path from "node:path";
import { verifyBackup } from "../jobs/backup-job.js";
const directory = process.argv[2];
if (!directory) { console.error("Informe o diretório do backup. A verificação restaura em um banco temporário e o remove ao terminar."); process.exitCode = 1; }
else { try { console.log(JSON.stringify(await verifyBackup(path.resolve(directory)), null, 2)); } catch (error) { console.error(error instanceof Error ? error.message : "Falha na restauração de teste."); process.exitCode = 1; } }
