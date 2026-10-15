import { API_ENDPOINTS, TOKEN_STORAGE_KEY, buildApiUrl } from "../config/api";
import { Materia } from "../types/materia";

const BASE_URL = buildApiUrl(API_ENDPOINTS.materias);

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Token " + token } : {}),
  };
}

function mapMateria(item: Record<string, unknown>): Materia {
  const edicao = (item.edicao ?? {}) as Record<string, unknown>;
  return {
    id: String(item.id ?? ""),
    imageUrl: String(item.imagemDestaque ?? item.imagem_destaque ?? item.imageUrl ?? ""),
    editionTitle: String(edicao.titulo ?? item.edicaoTitulo ?? ""),
    title: String(item.titulo ?? item.title ?? ""),
    author: String(item.author ?? item.autor ?? ""),
  };
}

export async function fetchMaterias(): Promise<Materia[]> {
  const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Não foi possível carregar as matérias.");

  const data = await response.json();
  const materias = (Array.isArray(data?.revistas) ? data.revistas : data?.materias) as Record<string, unknown>[] | undefined;
  return (materias ?? []).map(mapMateria);
}

export async function createMateria(data: {
  editionId: string;
  title: string;
  author: string;
  imageUrl: string;
  content: string;
}): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      edicaoId: data.editionId,
      titulo: data.title,
      autores: [data.author],
      imagemDestaque: data.imageUrl,
      conteudoHtml: data.content,
    }),
  });

  if (!response.ok) throw new Error("Não foi possível criar a matéria.");
}

export async function deleteMateria(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Não foi possível remover a matéria.");
}
