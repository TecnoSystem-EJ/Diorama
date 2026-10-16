import { authHeaders, readResponse } from "./http";
import { API_ENDPOINTS, buildApiUrl } from "../config/api";

const BASE_URL = buildApiUrl(API_ENDPOINTS.sobreNos);


export async function fetchSobreContent(): Promise<string | null> {
  const response = await fetch(BASE_URL, { headers: authHeaders() });

  const data = await readResponse<Record<string, unknown>>(response);
  return typeof data?.textoCompletoHtml === "string" ? data.textoCompletoHtml : null;
}

export async function updateSobreContent(content: string): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ textoCompletoHtml: content }),
  });

  await readResponse(response);
}
