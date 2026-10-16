import { createBackup } from "../jobs/backup-job.js";
try { console.log(await createBackup()); }
catch (error) { console.error(error instanceof Error ? error.message : "Falha no backup."); process.exitCode = 1; }
