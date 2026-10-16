import { buildApiUrl } from "../config/api";
import { authHeaders, readResponse } from "./http";

export interface Campanha {
  id: string;
  assunto: string;
  conteudoHtml: string;
  status: "RASCUNHO" | "ENVIANDO" | "CONCLUIDA" | "PARCIAL";
  createdAt: string;
  enviadas: number;
  pendentes: number;
  falhas: number;
  incertas: number;
  canceladas: number;
  total: number;
}

const BASE_URL = buildApiUrl("/newsletter/campanhas");

export async function fetchCampanhas(): Promise<{ campanhas: Campanha[]; configurado: boolean }> {
  return readResponse(await fetch(BASE_URL, { headers: authHeaders() }));
}

export async function createCampanha(data: { assunto: string; conteudoHtml: string }): Promise<void> {
  await readResponse(await fetch(BASE_URL, { method: "POST", headers: authHeaders(), body: JSON.stringify(data) }));
}

export async function sendCampanha(id: string): Promise<{ campanha: Campanha; mensagem: string }> {
  return readResponse(await fetch(`${BASE_URL}/${encodeURIComponent(id)}/enviar`, { method: "POST", headers: authHeaders() }));
}
