import { Router } from "express";
import { db } from "@diorama/db";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler.js";

export const searchRoutes: Router = Router();
searchRoutes.get("/", asyncHandler(async (req, res) => {
  const query = z.string().trim().max(160).parse(req.query.q ?? "");
  if (query.length < 2) { res.json({ resultados: [] }); return; }
  const contains = { contains: query, mode: "insensitive" as const };
  const [edicoes, revistas, blogs, projetos] = await Promise.all([
    db.edicao.findMany({ where: { deleted: false, OR: [{ titulo: contains }, { numeroTag: contains }] }, take: 20, orderBy: { createdAt: "desc" } }),
    db.revista.findMany({ where: { deleted: false, edicao: { deleted: false }, OR: [{ titulo: contains }, { conteudo_html: contains }, { autores: { some: { nome: contains } } }] }, take: 20, orderBy: { createdAt: "desc" } }),
    db.blog.findMany({ where: { deleted: false, OR: [{ titulo: contains }, { conteudoHtml: contains }] }, take: 20, orderBy: { dataPublicacao: "desc" } }),
    db.projeto.findMany({ where: { deleted: false, OR: [{ titulo: contains }, { conteudoHtml: contains }] }, take: 20, orderBy: { createdAt: "desc" } }),
  ]);
  const excerpt = (html: string) => sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim().slice(0, 220);
  res.json({ resultados: [
    ...edicoes.map(item => ({ id: item.id, titulo: item.titulo, tipo: "edicao", url: `/edicoes/${item.id}`, resumo: item.numeroTag })),
    ...revistas.map(item => ({ id: item.id, titulo: item.titulo, tipo: "materia", url: `/materias/${item.id}`, resumo: excerpt(item.conteudo_html) })),
    ...blogs.map(item => ({ id: item.id, titulo: item.titulo, tipo: "blog", url: `/blog/${item.id}`, resumo: excerpt(item.conteudoHtml) })),
    ...projetos.map(item => ({ id: item.id, titulo: item.titulo, tipo: "projeto", url: `/projetos/${item.id}`, resumo: excerpt(item.conteudoHtml) })),
  ] });
}));
