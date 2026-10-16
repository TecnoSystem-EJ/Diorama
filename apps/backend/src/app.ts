import "./config/enviroments.js";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { db } from "@diorama/db";
import { WEB_ORIGIN } from "./config/enviroments.js";
import revistaRoutes from "./routes/revistaRoutes.js";
import edicaoRoutes from "./routes/edicaoRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { blogRoutes, projetoRoutes, sobreRoutes, subscriberRoutes } from "./routes/contentRoutes.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import { asyncHandler } from "./utils/asyncHandler.js";

export const app: express.Express = express();
app.disable("x-powered-by");
app.use(cors({ origin: WEB_ORIGIN.split(",").map(origin => origin.trim()) }));
app.use(express.json({ limit: "2mb" }));
app.use("/static", express.static(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../static"), {
  setHeaders(res) { res.setHeader("X-Content-Type-Options", "nosniff"); },
}));
app.get("/api/v1", (_req, res) => { res.json({ message: "API Diorama" }); });
app.get("/health", asyncHandler(async (_req, res) => {
  await db.$queryRaw`SELECT 1`;
  res.json({ status: "ok", database: "connected" });
}));
app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/edicoes", edicaoRoutes);
app.use("/revistas", revistaRoutes);
app.use("/blogs", blogRoutes);
app.use("/projetos", projetoRoutes);
app.use("/sobre-nos", sobreRoutes);
app.use("/subscribers", subscriberRoutes);
app.use((_req, res) => { res.status(404).json({ mensagem: "Rota não encontrada." }); });
app.use(errorMiddleware);
