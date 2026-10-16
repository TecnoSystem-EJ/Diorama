import { notFound } from "next/navigation";

export interface PublicMateria {
  id: string; titulo: string; conteudo_html: string; imagemDestaque: string; pdfUrl: string;
  autores: { nome: string }[]; edicao: { id: string; titulo: string };
}
export interface PublicEdition {
  id: string; titulo: string; numeroTag: string; capaUrl: string; revistas?: PublicMateria[];
}
export interface PublicBlog { id: string; titulo: string; conteudoHtml: string; dataPublicacao: string }
export interface PublicProject { id: string; titulo: string; conteudoHtml: string; imagemUrl: string }

export async function publicApi<T>(path: string): Promise<T> {
  const base = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
  const response = await fetch(`${base}${path}`, { cache: "no-store" });
  if (response.status === 404) notFound();
  if (!response.ok) throw new Error("Não foi possível carregar o conteúdo. Tente novamente.");
  return response.json();
}
