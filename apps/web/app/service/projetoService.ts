import { Projeto } from "../types/projeto";

const BASE_URL = "";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchProjetos(): Promise<Projeto[]> {
  const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Não foi possível carregar os projetos.");
  const data = await response.json();
  return data.projetos as Projeto[];
}

export async function deleteProjeto(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Não foi possível remover o projeto.");
}