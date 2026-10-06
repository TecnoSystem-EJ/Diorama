import Link from "next/link";
import { useEditions } from "../../hooks/useEdicao";
import { EditionRow } from "./EditionRow";

export function EditionList() {
  const { editions, isLoading, error, removeEdition } = useEditions();

  if (isLoading) return <p className="text-sm text-neutral-500">Carregando edições...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (editions.length === 0) return <p className="text-sm text-neutral-500">Nenhuma edição publicada ainda.</p>;

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-neutral-300">
          <th className="pb-3" /><th className="pb-3" /><th className="pb-3" /><th className="pb-3" /><th className="pb-3" />
        </tr>
      </thead>
      <tbody>
        {editions.map((edition) => (
          <EditionRow key={edition.id} edition={edition} onRemove={removeEdition} />
        ))}
      </tbody>
    </table>
  );
}