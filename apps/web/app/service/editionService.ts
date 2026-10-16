import { API_ENDPOINTS, buildApiUrl } from "../config/api";
import { Edition } from "../types/edition";
import { authHeaders, readResponse } from "./http";

const BASE_URL = buildApiUrl(API_ENDPOINTS.edicoes);

function mapEdition(item: Record<string, unknown>): Edition {
  return {
    id: String(item.id ?? ""),
    number: Number(item.numeroTag ?? 0),
    title: String(item.titulo ?? ""),
    coverUrl: String(item.capaUrl ?? ""),
    documentsCount: Number((item._count as { revistas?: number } | undefined)?.revistas ?? 0),
  };
}

export async function fetchEditions(): Promise<Edition[]> {
  const response = await fetch(BASE_URL, {
    headers: authHeaders(),
  });

  const data = await readResponse<{ edicoes: Record<string, unknown>[] }>(response);
  const editions = (Array.isArray(data?.edicoes) ? data.edicoes : []) as Record<string, unknown>[];
  return editions.map(mapEdition);
}

export interface EditionInput { title: string; number: number; cover: File | null }

function editionForm(data: EditionInput): FormData {
  const form = new FormData();
  form.set("titulo", data.title);
  form.set("numeroTag", String(data.number));
  if (data.cover) form.set("capa", data.cover);
  return form;
}

export async function createEdition(data: EditionInput): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(false),
    body: editionForm(data),
  });

  await readResponse(response);
}

export async function fetchEdition(id: string): Promise<Edition> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`);
  const data = await readResponse<{ edicao: Record<string, unknown> }>(response);
  return mapEdition(data.edicao);
}

export async function updateEdition(id: string, data: EditionInput): Promise<void> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, { method: "PUT", headers: authHeaders(false), body: editionForm(data) });
  await readResponse(response);
}

export async function deleteEdition(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  await readResponse(response);
}
