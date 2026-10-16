import type { Metadata } from "next";
import { ArchiveFilter } from "../../components/ArchiveFilter";
import { PdfReader } from "../../components/PdfReader";
import Link from "next/link";
import { PublicPage } from "../../components/PublicPage";
import { publicApi, searchable, type PublicEdition } from "../../../lib/publicApi";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ q?: string }> };
async function loadEdition(id: string) { return publicApi<{ edicao: PublicEdition }>(`/edicoes/${encodeURIComponent(id)}`); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { edicao } = await loadEdition(id);
  return { title: edicao.titulo, description: `${edicao.numeroTag} — ${edicao.titulo}. Leia o índice e as matérias da edição.`, alternates: { canonical: `/edicoes/${id}` }, openGraph: { images: [{ url: edicao.capaUrl, alt: edicao.titulo }] } };
}

export default async function EditionPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { edicao } = await publicApi<{ edicao: PublicEdition }>(`/edicoes/${encodeURIComponent(id)}`);
  const raw = (await searchParams).q;
  const q = typeof raw === "string" ? raw.slice(0, 150).trim() : "";
  const matches = (edicao.revistas ?? []).filter(materia => searchable(`${materia.titulo} ${materia.autores.map(autor => autor.nome).join(" ")} ${materia.conteudo_html}`).includes(searchable(q)));
  return <PublicPage title={edicao.titulo}>
    <p className="mb-8 text-neutral-500">{edicao.numeroTag}</p>
    {edicao.pdfUrl && <div className="mb-8"><PdfReader url={edicao.pdfUrl} title={edicao.titulo} label="Ler edição completa" /></div>}
    <h2 className="font-serif text-2xl mb-6">Índice / Matérias</h2>
    <ArchiveFilter action={`/edicoes/${id}`} query={q} placeholder="Título, autor ou conteúdo da matéria" />
    {!matches.length && <p>{q ? "Nenhuma matéria corresponde à pesquisa nesta edição." : "Nenhuma matéria publicada nesta edição."}</p>}
    <ul className="space-y-5">{matches.map(materia => <li key={materia.id}>
      <Link href={`/materias/${materia.id}`} className="font-serif text-2xl underline">{materia.titulo}</Link>
      <p className="text-neutral-500">{materia.autores.map(autor => autor.nome).join(", ")}</p>
    </li>)}</ul>
  </PublicPage>;
}
