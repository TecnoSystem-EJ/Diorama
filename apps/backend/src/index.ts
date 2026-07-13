import cors from "cors";
import express from "express";
import { PORT } from "./config/enviroments.js";
import { runBackupJob } from "./jobs/backup-job.js";
import revistaRoutes from "./routes/revistaRoutes.js"
import edicaoRoutes from "./routes/edicaoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/static", express.static(path.resolve(__dirname, '..', 'static')))

app.use("/edicoes", edicaoRoutes);
app.use("/revistas", revistaRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/auth", authRoutes);


runBackupJob();

// Rota base de teste
app.get("/api/v1", async (_req, res) => {
  res.json({ message: "API Diorama" });
});

app.listen(PORT, () => {
  console.log(`ativo na porta ${PORT}`);
});
