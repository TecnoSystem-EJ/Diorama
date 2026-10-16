import Link from "next/link";
import { PublicPage } from "../../components/PublicPage";
import { publicApi, type PublicEdition } from "../../../lib/publicApi";

export default async function EditionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { edicao } = await publicApi<{ edicao: PublicEdition }>(`/edicoes/${encodeURIComponent(id)}`);
  return <PublicPage title={edicao.titulo}>
    <p className="mb-8 text-neutral-500">Edição {edicao.numeroTag}</p>
    <h2 className="font-serif text-2xl mb-6">Índice / Matérias</h2>
    {!edicao.revistas?.length && <p>Nenhuma matéria publicada nesta edição.</p>}
    <ul className="space-y-5">{edicao.revistas?.map(materia => <li key={materia.id}>
      <Link href={`/materias/${materia.id}`} className="font-serif text-2xl underline">{materia.titulo}</Link>
      <p className="text-neutral-500">{materia.autores.map(autor => autor.nome).join(", ")}</p>
    </li>)}</ul>
  </PublicPage>;
}
