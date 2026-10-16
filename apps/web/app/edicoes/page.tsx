import Link from "next/link";
import Image from "next/image";
import { PublicPage } from "../components/PublicPage";
import { publicApi, type PublicEdition } from "../../lib/publicApi";

export default async function EditionsPage() {
  const { edicoes } = await publicApi<{ edicoes: PublicEdition[] }>("/edicoes");
  return <PublicPage title="Edições">
    {!edicoes.length && <p>Nenhuma edição publicada ainda.</p>}
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {edicoes.map(edicao => <Link key={edicao.id} href={`/edicoes/${edicao.id}`} className="space-y-3">
        <div className="relative aspect-[3/4]"><Image src={edicao.capaUrl} alt={edicao.titulo} fill unoptimized className="object-cover" /></div>
        <p className="text-sm text-neutral-500">Edição {edicao.numeroTag}</p>
        <h2 className="font-serif text-2xl">{edicao.titulo}</h2>
      </Link>)}
    </div>
  </PublicPage>;
}
