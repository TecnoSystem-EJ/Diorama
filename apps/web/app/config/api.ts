const DEFAULT_API_BASE_URL = "http://localhost:3001";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE_URL;
export const TOKEN_STORAGE_KEY = "TOKEN";

export const API_ENDPOINTS = {
  auth: "/auth",
  edicoes: "/edicoes",
  blogs: "/blogs",
  materias: "/revistas",
  projetos: "/projetos",
  sobreNos: "/sobre-nos",
} as const;

export function buildApiUrl(path: string): string {
  return `${API_BASE_URL}${path}`;
}