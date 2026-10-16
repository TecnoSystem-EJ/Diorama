import { notFound } from "next/navigation";

export interface PublicMateria {
  id: string; titulo: string; conteudo_html: string; imagemDestaque: string; pdfUrl: string;
  autores: { nome: string }[]; edicao: { id: string; titulo: string }; createdAt?: string;
}
export interface PublicEdition {
  id: string; titulo: string; numeroTag: string; capaUrl: string; pdfUrl?: string | null; revistas?: PublicMateria[]; createdAt?: string;
}
export interface PublicBlog { id: string; titulo: string; conteudoHtml: string; dataPublicacao: string }
export interface PublicProject { id: string; titulo: string; conteudoHtml: string; imagemUrl: string }
export interface PublicSearchResult { id: string; titulo: string; tipo: string; url: string; resumo: string }

export function plainText(html: string, limit?: number): string {
  const value = html.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
  return limit && value.length > limit ? `${value.slice(0, limit).trimEnd()}…` : value;
}

export function searchable(value: string): string {
  return plainText(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

export async function publicApi<T>(path: string): Promise<T> {
  const base = (process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001").replace(/\/$/, "");
  const response = await fetch(`${base}${path}`, { cache: "no-store" });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Não foi possível carregar o conteúdo. Tente novamente.");
  return response.json();
}
