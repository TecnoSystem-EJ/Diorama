import { Router } from "express";
import { db } from "@diorama/db";
import { z } from "zod";
import { requireAdmin } from "../middlewares/authMilddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanHtml } from "../utils/cleanHtml.js";

const contentSchema = z.object({
  titulo: z.string().trim().min(1, "Informe o título."),
  conteudoHtml: z.string().trim().min(1, "Informe o conteúdo.").transform(cleanHtml),
});
const projectSchema = contentSchema.extend({ imagemUrl: z.url("Informe uma URL de imagem válida.").refine(value => /^https?:\/\//.test(value)) });

export const blogRoutes: Router = Router();
blogRoutes.get("/", asyncHandler(async (_req, res) => {
  const blogs = await db.blog.findMany({ where: { deleted: false }, orderBy: { dataPublicacao: "desc" } });
  res.json({ quantidade: blogs.length, blogs });
}));
blogRoutes.get("/:id", asyncHandler(async (req, res) => {
  const blog = await db.blog.findUnique({ where: { id: req.params.id!, deleted: false } });
  if (!blog) { res.status(404).json({ mensagem: "Ensaio não encontrado." }); return; }
  res.json({ blog });
}));
blogRoutes.post("/", ...requireAdmin, asyncHandler(async (req, res) => {
  const data = contentSchema.parse(req.body);
  const blog = await db.blog.create({ data: { ...data, dataPublicacao: new Date() } });
  res.status(201).json({ blog });
}));
blogRoutes.put("/:id", ...requireAdmin, asyncHandler(async (req, res) => {
  const blog = await db.blog.update({ where: { id: req.params.id!, deleted: false }, data: contentSchema.parse(req.body) });
  res.json({ blog });
}));
blogRoutes.delete("/:id", ...requireAdmin, asyncHandler(async (req, res) => {
  await db.blog.update({ where: { id: req.params.id!, deleted: false }, data: { deleted: true, deletedAt: new Date() } });
  res.json({ mensagem: "Ensaio removido." });
}));

export const projetoRoutes: Router = Router();
projetoRoutes.get("/", asyncHandler(async (_req, res) => {
  const projetos = await db.projeto.findMany({ where: { deleted: false }, orderBy: { createdAt: "desc" } });
  res.json({ quantidade: projetos.length, projetos });
}));
projetoRoutes.get("/:id", asyncHandler(async (req, res) => {
  const projeto = await db.projeto.findUnique({ where: { id: req.params.id!, deleted: false } });
  if (!projeto) { res.status(404).json({ mensagem: "Projeto não encontrado." }); return; }
  res.json({ projeto });
}));
projetoRoutes.post("/", ...requireAdmin, asyncHandler(async (req, res) => {
  const projeto = await db.projeto.create({ data: projectSchema.parse(req.body) });
  res.status(201).json({ projeto });
}));
projetoRoutes.put("/:id", ...requireAdmin, asyncHandler(async (req, res) => {
  const projeto = await db.projeto.update({ where: { id: req.params.id!, deleted: false }, data: projectSchema.parse(req.body) });
  res.json({ projeto });
}));
projetoRoutes.delete("/:id", ...requireAdmin, asyncHandler(async (req, res) => {
  await db.projeto.update({ where: { id: req.params.id!, deleted: false }, data: { deleted: true, deletedAt: new Date() } });
  res.json({ mensagem: "Projeto removido." });
}));

export const sobreRoutes: Router = Router();
sobreRoutes.get("/", asyncHandler(async (_req, res) => {
  const sobre = await db.sobreNos.findUnique({ where: { id: 1 } });
  res.json({ textoCompletoHtml: sobre?.textoCompletoHtml ?? "" });
}));
sobreRoutes.put("/", ...requireAdmin, asyncHandler(async (req, res) => {
  const { textoCompletoHtml } = z.object({ textoCompletoHtml: z.string().min(1).transform(cleanHtml) }).parse(req.body);
  const sobre = await db.sobreNos.upsert({ where: { id: 1 }, create: { id: 1, textoCompletoHtml }, update: { textoCompletoHtml } });
  res.json(sobre);
}));
