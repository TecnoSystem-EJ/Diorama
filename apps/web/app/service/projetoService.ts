import { authHeaders, readResponse } from "./http";
import { API_ENDPOINTS, buildApiUrl } from "../config/api";
import { Projeto } from "../types/projeto";

const BASE_URL = buildApiUrl(API_ENDPOINTS.projetos);


function mapProjeto(item: Record<string, unknown>): Projeto {
  return {
    id: String(item.id ?? ""),
    imageUrl: String(item.imagemUrl ?? item.imagem_url ?? item.imageUrl ?? ""),
    title: String(item.titulo ?? item.title ?? ""),
  };
}

export async function fetchProjetos(): Promise<Projeto[]> {
  const response = await fetch(BASE_URL, { headers: authHeaders() });
  const data = await readResponse<Record<string, unknown>>(response);
  const projetos = (Array.isArray(data?.projetos) ? data.projetos : []) as Record<string, unknown>[];
  return projetos.map(mapProjeto);
}

export async function createProjeto(data: { title: string; imageUrl: string; content: string }): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      titulo: data.title,
      imagemUrl: data.imageUrl,
      conteudoHtml: data.content,
    }),
  });

  await readResponse(response);
}

export async function deleteProjeto(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await readResponse(response);
}
