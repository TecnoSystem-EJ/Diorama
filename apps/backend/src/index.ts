import { app } from "./app.js";
import { PORT } from "./config/enviroments.js";
import { runBackupJob } from "./jobs/backup-job.js";

if (process.env.ENABLE_BACKUP === "true") runBackupJob();

app.listen(PORT, () => {
  console.log(`API Diorama em http://localhost:${PORT}`);
});
