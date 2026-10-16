import { TOKEN_STORAGE_KEY } from "../config/api";

export function authHeaders(json = true): HeadersInit {
  const token = typeof window === "undefined" ? null : localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function readResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      window.dispatchEvent(new Event("diorama:unauthorized"));
    }
    throw new Error(data?.mensagem ?? data?.message ?? "Não foi possível concluir a operação.");
  }
  return data as T;
}
