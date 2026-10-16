import { Router } from "express";
import { db } from "@diorama/db";
import { z } from "zod";
import { requireAdmin } from "../middlewares/authMilddleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanHtml } from "../utils/cleanHtml.js";
import { cancelSubscription, createCampaign, listCampaigns, newsletterConfigured, sendCampaign, subscriberFromToken } from "../services/newsletterService.js";
import { HttpError } from "../utils/httpError.js";

export const subscriberRoutes: Router = Router();
subscriberRoutes.post("/", asyncHandler(async (req, res) => {
  const data = z.object({ email: z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido.")), nome: z.string().trim().max(120).optional() }).parse(req.body);
  const nome = data.nome || data.email.split("@")[0]!;
  await db.subscribers.upsert({ where: { email: data.email }, create: { email: data.email, nome }, update: { nome, status: "ATIVO", canceledAt: null, subscribedAt: new Date() } });
  res.status(201).json({ mensagem: "Inscrição recebida com sucesso!" });
}));
const tokenSchema = z.string().min(1).max(2048);
subscriberRoutes.get("/cancelar", asyncHandler(async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const subscriber = await subscriberFromToken(tokenSchema.parse(req.query.token));
  if (!subscriber) throw new HttpError(400, "O link de cancelamento é inválido ou expirou.");
  res.json({ valido: true, cancelado: subscriber.status === "CANCELADO" });
}));
subscriberRoutes.post("/cancelar", asyncHandler(async (req, res) => {
  await cancelSubscription(tokenSchema.parse(req.body.token));
  res.json({ mensagem: "Inscrição cancelada. Você não receberá novas campanhas." });
}));

export const newsletterRoutes: Router = Router();
newsletterRoutes.use(...requireAdmin);
newsletterRoutes.get("/campanhas", asyncHandler(async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ campanhas: await listCampaigns(), configurado: newsletterConfigured() });
}));
newsletterRoutes.post("/campanhas", asyncHandler(async (req, res) => {
  const data = z.object({
    assunto: z.string().trim().min(1, "Informe o assunto.").max(180),
    conteudoHtml: z.string().min(1).max(200_000).transform(cleanHtml).refine(value => value.replace(/<[^>]+>/g, "").trim().length > 0, "Informe o conteúdo da campanha."),
  }).parse(req.body);
  res.status(201).json({ campanha: await createCampaign(data) });
}));
newsletterRoutes.post("/campanhas/:id/enviar", asyncHandler(async (req, res) => {
  const campanha = await sendCampaign(req.params.id!);
  res.json({ campanha, mensagem: campanha.status === "CONCLUIDA" ? "Envio concluído." : "Lote processado. Confira as contagens antes de continuar." });
}));
