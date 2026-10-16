import { jest, describe, beforeEach, it, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import jwt from "jsonwebtoken";
import { db } from "@diorama/db";
import { blogRoutes, projetoRoutes } from "../../routes/contentRoutes.js";
import { searchRoutes } from "../../routes/searchRoutes.js";
import { errorMiddleware } from "../../middlewares/errorMiddleware.js";

const app = express();
app.use(express.json());
app.use("/blogs", blogRoutes);
app.use("/projetos", projetoRoutes);
app.use("/busca", searchRoutes);
app.use(errorMiddleware);
const mock = db as any;
const token = jwt.sign({ id: 1, role: "ADMIN" }, "test-secret");
beforeEach(() => {
  jest.clearAllMocks();
  mock.usuario.findUnique.mockResolvedValue({ id: 1, role: "ADMIN" });
});
describe("rotas editoriais", () => {
  it("exige administrador na atualização de blog e projetos", async () => {
    expect((await request(app).put("/blogs/1").send({ titulo: "a", conteudoHtml: "<p>b</p>" })).status).toBe(401);
    expect((await request(app).put("/projetos/1").send({ titulo: "a", conteudoHtml: "<p>b</p>", imagemUrl: "https://example.test/image.png" })).status).toBe(401);
  });
  it("atualiza blog sanitizando o conteúdo e preserva a data de publicação", async () => {
    mock.blog.update.mockResolvedValue({ id: "1", titulo: "Novo" });
    const response = await request(app).put("/blogs/1").set("Authorization", `Bearer ${token}`).send({ titulo: "Novo", conteudoHtml: '<p>Texto</p><script>alert(1)</script>' });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ blog: { id: "1", titulo: "Novo" } });
    expect(mock.blog.update).toHaveBeenCalledWith({ where: { id: "1", deleted: false }, data: { titulo: "Novo", conteudoHtml: "<p>Texto</p>" } });
  });
  it("atualiza projeto com título, imagem e conteúdo", async () => {
    mock.projeto.update.mockResolvedValue({ id: "1" });
    const response = await request(app).put("/projetos/1").set("Authorization", `Bearer ${token}`).send({ titulo: "Novo", conteudoHtml: "<p>Texto</p>", imagemUrl: "https://example.test/image.png" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ projeto: { id: "1" } });
  });
  it("busca título, tag, autoria e textos somente no conteúdo ativo", async () => {
    mock.edicao.findMany.mockResolvedValue([{ id: "edicao", titulo: "Cidade", numeroTag: "Especial" }]);
    mock.revista.findMany.mockResolvedValue([{ id: "materia", titulo: "Cidade", conteudo_html: "<p>Descrição</p>" }]);
    mock.blog.findMany.mockResolvedValue([{ id: "blog", titulo: "Cidade", conteudoHtml: "<p>Ensaio</p>" }]);
    mock.projeto.findMany.mockResolvedValue([{ id: "projeto", titulo: "Cidade", conteudoHtml: "<p>Projeto</p>" }]);
    const response = await request(app).get("/busca?q=cidade");
    expect(response.status).toBe(200);
    expect(response.body.resultados).toEqual([
      { id: "edicao", titulo: "Cidade", tipo: "edicao", url: "/edicoes/edicao", resumo: "Especial" },
      { id: "materia", titulo: "Cidade", tipo: "materia", url: "/materias/materia", resumo: "Descrição" },
      { id: "blog", titulo: "Cidade", tipo: "blog", url: "/blog/blog", resumo: "Ensaio" },
      { id: "projeto", titulo: "Cidade", tipo: "projeto", url: "/projetos/projeto", resumo: "Projeto" },
    ]);
    expect(mock.revista.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ deleted: false, edicao: { deleted: false } }) }));
  });
  it("não faz varredura do banco com consulta vazia ou muito curta", async () => {
    expect((await request(app).get("/busca?q=a")).body).toEqual({ resultados: [] });
    expect(mock.revista.findMany).not.toHaveBeenCalled();
  });
});
