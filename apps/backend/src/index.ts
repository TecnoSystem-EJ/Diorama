import cors from "cors";
import express from "express";
import { PORT } from "./config/enviroments.js";
import { runBackupJob } from "./jobs/backup-job.js";

const app = express();
app.use(cors());
app.use(express.json());

runBackupJob();

// Rota base de teste
app.get("/api/v1", async (_req, res) => {
  res.json({ message: "API Diorama" });
});

app.listen(PORT, () => {
  console.log(`ativo na porta ${PORT}`);
});
