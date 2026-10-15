import { API_ENDPOINTS, TOKEN_STORAGE_KEY, buildApiUrl } from "../config/api";
import { Edition } from "../types/edition";

const BASE_URL = buildApiUrl(API_ENDPOINTS.edicoes);

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Token " + token } : {}),
  };
}

function mapEdition(item: Record<string, unknown>): Edition {
  return {
    id: String(item.id ?? ""),
    number: Number(item.numeroTag ?? 0),
    title: String(item.titulo ?? ""),
    coverUrl: String(item.capaUrl ?? ""),
    documentsCount: Number(item.documentsCount ?? 0),
  };
}

export async function fetchEditions(): Promise<Edition[]> {
  const response = await fetch(BASE_URL, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar as edições.");
  }

  const data = await response.json();
  const editions = (Array.isArray(data?.edicoes) ? data.edicoes : []) as Record<string, unknown>[];
  return editions.map(mapEdition);
}

export async function createEdition(data: { title: string; number: number; coverUrl: string }): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      titulo: data.title,
      numeroTag: String(data.number),
      capaUrl: data.coverUrl,
    }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível criar a edição.");
  }
}

export async function deleteEdition(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Não foi possível remover a edição.");
  }
}
