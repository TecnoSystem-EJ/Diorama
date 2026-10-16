import { jest, beforeEach, it, expect } from "@jest/globals";
import express from "express";
import request from "supertest";
import { db } from "@diorama/db";
import { cancellationToken } from "../../services/newsletterService.js";
import { subscriberRoutes, newsletterRoutes } from "../../routes/newsletterRoutes.js";
import { errorMiddleware } from "../../middlewares/errorMiddleware.js";

const app = express();
app.use(express.json());
app.use("/subscribers", subscriberRoutes);
app.use("/newsletter", newsletterRoutes);
app.use(errorMiddleware);
const mock = db as any;
const subscriber = { id: 1, email: "local@example.test", nome: "Leitor", status: "ATIVO", subscribedAt: new Date() };
beforeEach(() => { jest.clearAllMocks(); mock.subscribers.findUnique.mockResolvedValue(subscriber); });
it("GET cancelar só verifica, sem desinscrever em previews de email", async () => {
  const response = await request(app).get(`/subscribers/cancelar?token=${cancellationToken(subscriber)}`);
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ valido: true, cancelado: false });
  expect(mock.subscribers.updateMany).not.toHaveBeenCalled();
});
it("POST cancelar efetiva sem retornar dados pessoais", async () => {
  const response = await request(app).post("/subscribers/cancelar").send({ token: cancellationToken(subscriber) });
  expect(response.status).toBe(200);
  expect(JSON.stringify(response.body)).not.toMatch(/local@example|Leitor/);
  expect(mock.subscribers.updateMany).toHaveBeenCalledTimes(1);
});
it("recusa cancelamento com token inválido", async () => {
  const response = await request(app).post("/subscribers/cancelar").send({ token: "invalid" });
  expect(response.status).toBe(400);
  expect(mock.subscribers.updateMany).not.toHaveBeenCalled();
});
it("não lista nem envia campanhas sem autenticação", async () => {
  expect((await request(app).get("/newsletter/campanhas")).status).toBe(401);
  expect((await request(app).post("/newsletter/campanhas/1/enviar")).status).toBe(401);
});
