import { Edition } from "../types/edition";

const BASE_URL = "/"; 

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("TOKEN");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
  return data.editions as Edition[];
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