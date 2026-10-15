import { API_ENDPOINTS, TOKEN_STORAGE_KEY, buildApiUrl } from "../config/api";
import { Projeto } from "../types/projeto";

const BASE_URL = buildApiUrl(API_ENDPOINTS.projetos);

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Token " + token } : {}),
  };
}

function mapProjeto(item: Record<string, unknown>): Projeto {
  return {
    id: String(item.id ?? ""),
    imageUrl: String(item.imagemUrl ?? item.imagem_url ?? item.imageUrl ?? ""),
    title: String(item.titulo ?? item.title ?? ""),
  };
}

export async function fetchProjetos(): Promise<Projeto[]> {
  const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Não foi possível carregar os projetos.");

  const data = await response.json();
  const projetos = (Array.isArray(data?.projetos) ? data.projetos : []) as Record<string, unknown>[];
  return projetos.map(mapProjeto);
}

export async function createProjeto(data: { title: string; imageUrl: string; content: string }): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      titulo: data.title,
      imagemUrl: data.imageUrl,
      conteudoHtml: data.content,
    }),
  });

  if (!response.ok) throw new Error("Não foi possível criar o projeto.");
}

export async function deleteProjeto(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Não foi possível remover o projeto.");
}
