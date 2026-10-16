import Link from "next/link";
import Image from "next/image";
import { PublicPage } from "../components/PublicPage";
import { publicApi, type PublicProject } from "../../lib/publicApi";

export default async function ProjectsPage() {
  const { projetos } = await publicApi<{ projetos: PublicProject[] }>("/projetos");
  return <PublicPage title="Projetos Especiais">
    {!projetos.length && <p>Nenhum projeto publicado ainda.</p>}
    <div className="grid gap-8 sm:grid-cols-2">{projetos.map(projeto => <Link key={projeto.id} href={`/projetos/${projeto.id}`}>
      <div className="relative aspect-video mb-4"><Image src={projeto.imagemUrl} alt={projeto.titulo} fill unoptimized className="object-cover" /></div>
      <h2 className="font-serif text-2xl">{projeto.titulo}</h2>
    </Link>)}</div>
  </PublicPage>;
}
