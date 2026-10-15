import { useEffect } from "react";
import { useEditions } from "../../hooks/useEdicao";
import { EditionRow } from "./EditionRow";

interface EditionListProps {
  refreshSignal?: number;
}

export function EditionList({ refreshSignal = 0 }: EditionListProps) {
  const { editions, isLoading, error, removeEdition, refetch } = useEditions();

  useEffect(() => {
    refetch();
  }, [refreshSignal, refetch]);

  if (isLoading) return <p className="text-sm text-neutral-500">Carregando edições...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (editions.length === 0) return <p className="text-sm text-neutral-500">Nenhuma edição publicada ainda.</p>;

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-neutral-300">
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Capa</span></th>
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Número da edição</span></th>
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Título</span></th>
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Quantidade de documentos</span></th>
          <th scope="col" className="pb-3 text-right"><span className="sr-only">Ações</span></th>
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
