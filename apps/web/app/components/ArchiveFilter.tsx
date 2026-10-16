import Link from "next/link";

export function ArchiveFilter({ query, placeholder, action }: { query: string; placeholder: string; action: string }) {
  return <form method="get" action={action} role="search" className="mb-10 flex flex-wrap items-end gap-3 max-w-2xl">
    <div className="flex-1 min-w-40"><label htmlFor="filtro-acervo" className="text-xs uppercase tracking-widest block mb-3">Pesquisar no acervo</label><input id="filtro-acervo" type="search" name="q" defaultValue={query} placeholder={placeholder} maxLength={150} className="w-full border-b border-current/30 bg-transparent py-3" /></div>
    <button type="submit" className="border border-black bg-black px-6 py-3 text-sm text-white hover:bg-neutral-800 disabled:opacity-50">Pesquisar</button>{query && <Link href={action} className="border border-black px-6 py-3 text-sm hover:bg-neutral-100 disabled:opacity-50">Limpar</Link>}
  </form>;
}
