import Link from "next/link";
import { PublicPage, EditorialContent } from "../../components/PublicPage";
import { publicApi, type PublicMateria } from "../../../lib/publicApi";

export default async function MateriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { revista } = await publicApi<{ revista: PublicMateria }>(`/revistas/${encodeURIComponent(id)}`);
  return <PublicPage title={revista.titulo}>
    <Link className="underline" href={`/edicoes/${revista.edicao.id}`}>{revista.edicao.titulo}</Link>
    <p className="text-neutral-500 my-6">{revista.autores.map(autor => autor.nome).join(", ")}</p>
    <EditorialContent html={revista.conteudo_html} />
    <a className="inline-block border border-black px-6 py-3 mt-10" href={revista.pdfUrl} target="_blank" rel="noopener noreferrer">Abrir PDF</a>
  </PublicPage>;
}
