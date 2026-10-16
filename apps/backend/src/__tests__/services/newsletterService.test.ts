import { jest, describe, beforeEach, it, expect } from "@jest/globals";
import { db } from "@diorama/db";
import jwt from "jsonwebtoken";

const sendMail = jest.fn();
const close = jest.fn();
await jest.unstable_mockModule("nodemailer", () => ({ default: { createTransport: jest.fn(() => ({ sendMail, close })) } }));
const { cancellationToken, subscriberFromToken, cancelSubscription, sendCampaign, listCampaigns } = await import("../../services/newsletterService.js");
const mock = db as any;
const subscriber = { id: 7, nome: "Leitora", email: "local@example.test", status: "ATIVO", subscribedAt: new Date("2026-01-01") };
const campaign = { id: "campaign", assunto: "Edição nova", conteudoHtml: "<p>Conteúdo</p>", status: "RASCUNHO", publicoFixadoEm: null, createdAt: new Date(), updatedAt: new Date() };

beforeEach(() => {
  jest.clearAllMocks();
  process.env.SMTP_HOST = "127.0.0.1";
  process.env.NEWSLETTER_FROM = "Diorama <newsletter@diorama.local>";
  mock.$transaction.mockImplementation((callback: any) => callback(mock));
  mock.newsletterCampanha.findUnique.mockResolvedValue({ ...campaign, entregas: [] });
  mock.newsletterCampanha.updateMany.mockResolvedValue({ count: 1 });
  mock.newsletterEntrega.updateMany.mockResolvedValue({ count: 1 });
  mock.newsletterEntrega.count.mockResolvedValue(0);
  mock.newsletterEntrega.findMany.mockResolvedValue([{ id: "delivery", subscriberId: 7 }]);
  mock.subscribers.findMany.mockResolvedValue([{ id: 7 }]);
  mock.subscribers.findUnique.mockResolvedValue(subscriber);
  sendMail.mockResolvedValue({ accepted: [subscriber.email] });
});

describe("newsletter", () => {
  it("token assinado não contém email e rejeita tokens de autenticação", async () => {
    const token = cancellationToken(subscriber);
    expect(JSON.stringify(jwt.decode(token))).not.toContain(subscriber.email);
    expect(await subscriberFromToken(token)).toEqual(subscriber);
    expect(await subscriberFromToken(jwt.sign({ id: 7, role: "ADMIN" }, "test-secret"))).toBeNull();
  });
  it("invalida o link antigo após nova inscrição", async () => {
    const token = cancellationToken(subscriber);
    mock.subscribers.findUnique.mockResolvedValue({ ...subscriber, subscribedAt: new Date("2026-02-01") });
    expect(await subscriberFromToken(token)).toBeNull();
  });
  it("cancela sem expor dados e considera versão da inscrição", async () => {
    await cancelSubscription(cancellationToken(subscriber));
    expect(mock.subscribers.updateMany).toHaveBeenCalledWith({ where: { id: 7, subscribedAt: subscriber.subscribedAt }, data: { status: "CANCELADO", canceledAt: expect.any(Date) } });
  });
  it("recusa envio sem SMTP configurado", async () => {
    delete process.env.SMTP_HOST;
    await expect(sendCampaign("campaign")).rejects.toMatchObject({ status: 503 });
    expect(sendMail).not.toHaveBeenCalled();
  });
  it("envia email individual com cancelamento e salva entrega", async () => {
    await sendCampaign("campaign");
    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({ to: subscriber.email, messageId: "<delivery@newsletter.diorama>", html: expect.stringContaining("/newsletter/cancelar?token=") }));
    expect(mock.newsletterEntrega.update).toHaveBeenCalledWith({ where: { id: "delivery" }, data: { status: "ENVIADA", enviadoEm: expect.any(Date) } });
  });
  it("reconfere status e impede envio a quem cancelou depois da criação", async () => {
    mock.subscribers.findUnique.mockResolvedValue({ ...subscriber, status: "CANCELADO" });
    await sendCampaign("campaign");
    expect(sendMail).not.toHaveBeenCalled();
    expect(mock.newsletterEntrega.update).toHaveBeenCalledWith({ where: { id: "delivery" }, data: { status: "CANCELADA" } });
  });
  it("campanha concluída não envia novamente", async () => {
    mock.newsletterCampanha.findUnique.mockResolvedValue({ ...campaign, status: "CONCLUIDA", entregas: [{ status: "ENVIADA" }] });
    await sendCampaign("campaign");
    expect(sendMail).not.toHaveBeenCalled();
    expect(mock.newsletterEntrega.findMany).not.toHaveBeenCalled();
  });
  it("bloqueia dois processadores simultâneos", async () => {
    mock.newsletterCampanha.findUnique.mockResolvedValue({ ...campaign, status: "ENVIANDO" });
    await expect(sendCampaign("campaign")).rejects.toMatchObject({ status: 409 });
    expect(sendMail).not.toHaveBeenCalled();
  });
  it("não repete entrega quando a aceitação SMTP ficou incerta", async () => {
    sendMail.mockRejectedValue(new Error("socket closed"));
    await sendCampaign("campaign");
    expect(mock.newsletterEntrega.update).toHaveBeenCalledWith({ where: { id: "delivery" }, data: { status: "INCERTA" } });
    expect(mock.newsletterEntrega.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: expect.objectContaining({ status: { in: ["PENDENTE", "FALHOU"] }, tentativas: { lt: 3 } }) }));
  });
  it("permite retentar rejeição SMTP explícita, sem marcar como entregue", async () => {
    sendMail.mockRejectedValue(Object.assign(new Error("temporarily rejected"), { responseCode: 451 }));
    await sendCampaign("campaign");
    expect(mock.newsletterEntrega.update).toHaveBeenCalledWith({ where: { id: "delivery" }, data: { status: "FALHOU" } });
  });
  it("lista somente contagens, sem nomes e emails dos assinantes", async () => {
    mock.newsletterCampanha.findMany.mockResolvedValue([{ ...campaign, entregas: [{ status: "ENVIADA" }, { status: "CANCELADA" }] }]);
    const rows = await listCampaigns();
    expect(rows[0]).toMatchObject({ enviadas: 1, canceladas: 1, total: 2 });
    expect(JSON.stringify(rows)).not.toMatch(/local@example|Leitora|subscriberId/);
  });
});
