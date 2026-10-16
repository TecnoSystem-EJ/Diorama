import { API_ENDPOINTS, buildApiUrl } from "../config/api";
import { Materia } from "../types/materia";
import { authHeaders, readResponse } from "./http";

const BASE_URL = buildApiUrl(API_ENDPOINTS.materias);

function mapMateria(item: Record<string, unknown>): Materia {
  const edicao = (item.edicao ?? {}) as Record<string, unknown>;
  return {
    id: String(item.id ?? ""),
    imageUrl: String(item.imagemDestaque ?? item.imagem_destaque ?? item.imageUrl ?? ""),
    editionTitle: String(edicao.titulo ?? item.edicaoTitulo ?? ""),
    title: String(item.titulo ?? item.title ?? ""),
    author: Array.isArray(item.autores) ? item.autores.map((autor: { nome: string }) => autor.nome).join(", ") : "",
  };
}

export async function fetchMaterias(): Promise<Materia[]> {
  const response = await fetch(BASE_URL, { headers: authHeaders() });

  const data = await readResponse<{ revistas: Record<string, unknown>[]; materias?: Record<string, unknown>[] }>(response);
  const materias = (Array.isArray(data?.revistas) ? data.revistas : data?.materias) as Record<string, unknown>[] | undefined;
  return (materias ?? []).map(mapMateria);
}

export interface MateriaInput {
  editionId: string;
  title: string;
  author: string;
  image: File | null;
  pdf: File | null;
  content: string;
}

export async function createMateria(data: MateriaInput): Promise<void> {
  const form = new FormData();
  form.set("edicaoId", data.editionId);
  form.set("titulo", data.title);
  form.set("autor", data.author);
  form.set("conteudo_html", data.content);
  if (data.image) form.set("imagemDestaque", data.image);
  if (data.pdf) form.set("revistaPdf", data.pdf);
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(false),
    body: form,
  });

  await readResponse(response);
}

export async function deleteMateria(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await readResponse(response);
}
