import type { Metadata } from "next";
import { ArchiveFilter } from "../components/ArchiveFilter";
import Link from "next/link";
import Image from "next/image";
import { PublicPage } from "../components/PublicPage";
import { publicApi, searchable, type PublicEdition } from "../../lib/publicApi";

export const metadata: Metadata = { title: "Edições", alternates: { canonical: "/edicoes" } };

export default async function EditionsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const raw = (await searchParams).q;
  const q = typeof raw === "string" ? raw.slice(0, 150).trim() : "";
  const { edicoes } = await publicApi<{ edicoes: PublicEdition[] }>("/edicoes");
  const matches = edicoes.filter(edicao => searchable(`${edicao.titulo} ${edicao.numeroTag}`).includes(searchable(q)));
  return <PublicPage title="Edições">
    <ArchiveFilter action="/edicoes" query={q} placeholder="Título ou número/tag da edição" />
    {!matches.length && <p>{q ? "Nenhuma edição corresponde à pesquisa." : "Nenhuma edição publicada ainda."}</p>}
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {matches.map(edicao => <Link key={edicao.id} href={`/edicoes/${edicao.id}`} className="min-w-0 space-y-3" aria-label={`Ler ${edicao.titulo}`}>
        <div className="relative aspect-[3/4]"><Image src={edicao.capaUrl} alt={edicao.titulo} fill unoptimized className="object-cover" /></div>
        <p className="text-sm text-neutral-500">{edicao.numeroTag}</p>
        <h2 className="font-serif text-2xl">{edicao.titulo}</h2>
      </Link>)}
    </div>
  </PublicPage>;
}
