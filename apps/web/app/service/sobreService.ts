import { API_ENDPOINTS, TOKEN_STORAGE_KEY, buildApiUrl } from "../config/api";

const BASE_URL = buildApiUrl(API_ENDPOINTS.sobreNos);

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Token " + token } : {}),
  };
}

export async function fetchSobreContent(): Promise<string | null> {
  const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return typeof data?.textoCompletoHtml === "string" ? data.textoCompletoHtml : null;
}

export async function updateSobreContent(content: string): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ textoCompletoHtml: content }),
  });

  if (!response.ok) {
    throw new Error("Não foi possível guardar as alterações.");
  }
}
