import type { Metadata } from "next";
import { PdfReader } from "../../components/PdfReader";
import Link from "next/link";
import { PublicPage, EditorialContent } from "../../components/PublicPage";
import { publicApi, plainText, type PublicMateria } from "../../../lib/publicApi";

type Props = { params: Promise<{ id: string }> };
async function loadMateria(id: string) { return publicApi<{ revista: PublicMateria }>(`/revistas/${encodeURIComponent(id)}`); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { revista } = await loadMateria(id);
  return { title: revista.titulo, description: plainText(revista.conteudo_html, 160), authors: revista.autores.map(autor => ({ name: autor.nome })), alternates: { canonical: `/materias/${id}` }, openGraph: { type: "article", images: [{ url: revista.imagemDestaque, alt: revista.titulo }] } };
}
export default async function MateriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { revista } = await publicApi<{ revista: PublicMateria }>(`/revistas/${encodeURIComponent(id)}`);
  return <PublicPage title={revista.titulo}>
    <Link className="underline" href={`/edicoes/${revista.edicao.id}`}>{revista.edicao.titulo}</Link>
    <p className="text-neutral-500 my-6">{revista.autores.map(autor => autor.nome).join(", ")}</p>
    <EditorialContent html={revista.conteudo_html} />
    <div className="mt-10"><PdfReader url={revista.pdfUrl} title={revista.titulo} label="Ler PDF da matéria" /></div>
  </PublicPage>;
}
