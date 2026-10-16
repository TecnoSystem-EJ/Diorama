import { db, Prisma } from "@diorama/db";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import sanitizeHtml from "sanitize-html";
import { JWT_SECRET, WEB_ORIGIN } from "../config/enviroments.js";
import { HttpError } from "../utils/httpError.js";

const campaignSelect = {
  id: true, assunto: true, conteudoHtml: true, status: true, createdAt: true, updatedAt: true,
  entregas: { select: { status: true } },
} satisfies Prisma.NewsletterCampanhaSelect;

type Campaign = Prisma.NewsletterCampanhaGetPayload<{ select: typeof campaignSelect }>;

function summarize(campaign: Campaign) {
  const { entregas, ...details } = campaign;
  const count = (status: string) => entregas.filter(item => item.status === status).length;
  return {
    ...details, total: entregas.length, enviadas: count("ENVIADA"),
    pendentes: count("PENDENTE") + count("ENVIANDO"), falhas: count("FALHOU"),
    incertas: count("INCERTA"), canceladas: count("CANCELADA"),
  };
}

export function newsletterConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST?.trim() && process.env.NEWSLETTER_FROM?.trim());
}

function transport() {
  if (!newsletterConfigured()) throw new HttpError(503, "Configure o serviço SMTP e o remetente da newsletter antes de enviar campanhas.");
  const port = Number(process.env.SMTP_PORT ?? "587");
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new HttpError(503, "A porta do serviço SMTP é inválida.");
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST!, port, secure: process.env.SMTP_SECURE === "true",
    ...(process.env.SMTP_USER ? { auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD ?? "" } } : {}),
    connectionTimeout: 10_000, greetingTimeout: 10_000, socketTimeout: 10_000,
    disableFileAccess: true, disableUrlAccess: true,
  });
}

export function cancellationToken(subscriber: { id: number; subscribedAt: Date }): string {
  return jwt.sign({ subscriberId: subscriber.id, version: subscriber.subscribedAt.getTime() }, JWT_SECRET, {
    algorithm: "HS256", issuer: "diorama-newsletter", audience: "unsubscribe", expiresIn: "365d",
  });
}

export async function subscriberFromToken(token: string) {
  try {
    const payload = jwt.verify(token, JWT_SECRET, { algorithms: ["HS256"], issuer: "diorama-newsletter", audience: "unsubscribe" });
    if (typeof payload === "string" || !Number.isSafeInteger(payload.subscriberId) || !Number.isSafeInteger(payload.version)) return null;
    const subscriber = await db.subscribers.findUnique({ where: { id: payload.subscriberId } });
    return subscriber && subscriber.subscribedAt.getTime() === payload.version ? subscriber : null;
  } catch { return null; }
}

export async function cancelSubscription(token: string) {
  const subscriber = await subscriberFromToken(token);
  if (!subscriber) throw new HttpError(400, "O link de cancelamento é inválido ou expirou.");
  // Match the subscription version so a concurrently renewed consent is preserved.
  await db.subscribers.updateMany({
    where: { id: subscriber.id, subscribedAt: subscriber.subscribedAt },
    data: { status: "CANCELADO", canceledAt: new Date() },
  });
}

export async function listCampaigns() {
  return (await db.newsletterCampanha.findMany({ select: campaignSelect, orderBy: { createdAt: "desc" }, take: 100 })).map(summarize);
}

export async function createCampaign(data: { assunto: string; conteudoHtml: string }) {
  return summarize(await db.newsletterCampanha.create({ data, select: campaignSelect }));
}

export async function sendCampaign(id: string) {
  const smtp = transport();
  const campaign = await db.$transaction(async tx => {
    const current = await tx.newsletterCampanha.findUnique({ where: { id } });
    if (!current) throw new HttpError(404, "Campanha não encontrada.");
    if (current.status === "CONCLUIDA") return current;
    if (current.status === "ENVIANDO") {
      // After a crashed worker, SMTP acceptance is uncertain. Never resend these deliveries.
      const stale = new Date(Date.now() - 30 * 60_000);
      if (current.updatedAt >= stale) throw new HttpError(409, "Esta campanha já está sendo enviada. Atualize a lista para acompanhar.");
      const unlocked = await tx.newsletterCampanha.updateMany({ where: { id, status: "ENVIANDO", updatedAt: { lt: stale } }, data: { status: "PARCIAL" } });
      if (!unlocked.count) throw new HttpError(409, "Esta campanha já está sendo enviada.");
      await tx.newsletterEntrega.updateMany({ where: { campanhaId: id, status: "ENVIANDO" }, data: { status: "INCERTA" } });
    }
    const acquired = await tx.newsletterCampanha.updateMany({ where: { id, status: { not: "ENVIANDO" } }, data: { status: "ENVIANDO" } });
    if (!acquired.count) throw new HttpError(409, "Esta campanha já está sendo enviada.");
    if (!current.publicoFixadoEm) {
      const subscribers = await tx.subscribers.findMany({ where: { status: "ATIVO" }, select: { id: true } });
      if (subscribers.length) await tx.newsletterEntrega.createMany({ data: subscribers.map(subscriber => ({ campanhaId: id, subscriberId: subscriber.id })), skipDuplicates: true });
      await tx.newsletterCampanha.update({ where: { id }, data: { publicoFixadoEm: new Date() } });
    }
    return current;
  });
  if (campaign.status === "CONCLUIDA") {
    return summarize((await db.newsletterCampanha.findUnique({ where: { id }, select: campaignSelect }))!);
  }

  try {
    // Batches bound request duration. Repeated requests resume only safe, unsent deliveries.
    const deliveries = await db.newsletterEntrega.findMany({ where: { campanhaId: id, status: { in: ["PENDENTE", "FALHOU"] }, tentativas: { lt: 3 } }, orderBy: { id: "asc" }, take: 50 });
    for (const delivery of deliveries) {
      const claimed = await db.newsletterEntrega.updateMany({ where: { id: delivery.id, status: { in: ["PENDENTE", "FALHOU"] } }, data: { status: "ENVIANDO", tentativas: { increment: 1 } } });
      if (!claimed.count) continue;
      const subscriber = await db.subscribers.findUnique({ where: { id: delivery.subscriberId } });
      if (!subscriber || subscriber.status !== "ATIVO") {
        await db.newsletterEntrega.update({ where: { id: delivery.id }, data: { status: "CANCELADA" } });
        continue;
      }
      const token = cancellationToken(subscriber);
      const base = (process.env.NEWSLETTER_PUBLIC_URL || WEB_ORIGIN.split(",")[0]!).replace(/\/$/, "");
      const unsubscribeUrl = `${base}/newsletter/cancelar?token=${encodeURIComponent(token)}`;
      let accepted: boolean;
      try {
        const result = await smtp.sendMail({
          from: process.env.NEWSLETTER_FROM!, to: subscriber.email, subject: campaign.assunto,
          html: `${campaign.conteudoHtml}<hr><p><a href="${unsubscribeUrl}">Cancelar inscrição na newsletter Diorama</a></p>`,
          text: `${sanitizeHtml(campaign.conteudoHtml, { allowedTags: [], allowedAttributes: {} })}\n\nCancelar inscrição: ${unsubscribeUrl}`,
          messageId: `<${delivery.id}@newsletter.diorama>`,
        });
        accepted = result.accepted.length > 0;
      } catch (error) {
        // Explicit SMTP rejection guarantees no acceptance; connection errors can be ambiguous.
        const responseCode = (error as { responseCode?: number }).responseCode;
        const status = responseCode && responseCode >= 400 && responseCode <= 599 ? "FALHOU" : "INCERTA";
        await db.newsletterEntrega.update({ where: { id: delivery.id }, data: { status } });
        continue;
      }
      // Keep a successful SMTP handoff out of the catch: a DB failure must never enable a resend.
      await db.newsletterEntrega.update({ where: { id: delivery.id }, data: { status: accepted ? "ENVIADA" : "FALHOU", enviadoEm: accepted ? new Date() : null } });
    }
  } finally {
    smtp.close();
    // A DB failure after SMTP handoff leaves ENVIANDO: acceptance is uncertain, so never retry it.
    await db.newsletterEntrega.updateMany({ where: { campanhaId: id, status: "ENVIANDO" }, data: { status: "INCERTA" } });
    const outstanding = await db.newsletterEntrega.count({ where: { campanhaId: id, status: { in: ["PENDENTE", "FALHOU", "INCERTA"] } } });
    await db.newsletterCampanha.update({ where: { id }, data: { status: outstanding ? "PARCIAL" : "CONCLUIDA" } });
  }
  return summarize((await db.newsletterCampanha.findUnique({ where: { id }, select: campaignSelect }))!);
}
