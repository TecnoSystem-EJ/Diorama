import type { Metadata } from "next";
import Link from "next/link";
import { PublicPage } from "../components/PublicPage";
import { ArchiveFilter } from "../components/ArchiveFilter";
import { publicApi, type PublicSearchResult } from "../../lib/publicApi";

export const metadata: Metadata = { title: "Busca no acervo", robots: { index: false, follow: true } };
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const raw = (await searchParams).q;
  const q = typeof raw === "string" ? raw.slice(0, 150).trim() : "";
  const resultados = q.length >= 2 ? (await publicApi<{ resultados: PublicSearchResult[] }>(`/busca?q=${encodeURIComponent(q)}`)).resultados : [];
  return <PublicPage title="Busca no acervo"><ArchiveFilter action="/busca" query={q} placeholder="Título, autoria ou assunto" />{q.length < 2 ? <p>Digite pelo menos dois caracteres para pesquisar edições, matérias, ensaios e projetos.</p> : <><p role="status" className="mb-10 text-sm">{resultados.length} {resultados.length === 1 ? "resultado encontrado" : "resultados encontrados"} para “{q}”.</p>{!resultados.length && <p>Nenhum conteúdo corresponde à pesquisa. Tente outro termo.</p>}<ul className="max-w-3xl space-y-8">{resultados.map(item => <li key={`${item.tipo}-${item.id}`} className="border-b border-black/15 pb-8"><p className="text-xs uppercase tracking-widest mb-2">{item.tipo}</p><h2 className="font-serif text-2xl mb-3"><Link className="hover:underline" href={item.url}>{item.titulo}</Link></h2><p className="text-neutral-600 leading-relaxed">{item.resumo}</p><Link className="underline mt-4 inline-block" href={item.url}>Ler →</Link></li>)}</ul></>}</PublicPage>;
}
