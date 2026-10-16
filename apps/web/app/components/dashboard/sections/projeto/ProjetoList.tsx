import { useEffect } from "react";
import { useProjeto } from "../../../../hooks/useProjeto";
import { ProjetoRow } from "./ProjetoRow";

interface ProjetoListProps {
  refreshSignal?: number;
  onEdit: (id: string) => void;
}

export function ProjetoList({ refreshSignal = 0, onEdit }: ProjetoListProps) {
  const { projetos, isLoading, error, removeProjeto, refetch } = useProjeto();

  useEffect(() => {
    refetch();
  }, [refreshSignal, refetch]);

  if (isLoading) return <p className="text-sm text-neutral-500">Carregando projetos...</p>;
  if (error) return <p role="alert" className="text-sm text-red-600">{error}</p>;
  if (projetos.length === 0) return <p className="text-sm text-neutral-500">Nenhum projeto publicado ainda.</p>;

  return (
    <div role="region" aria-label="Lista de projetos" tabIndex={0} className="relative overflow-x-auto focus-visible:outline-2 focus-visible:outline-black">
    <table className="min-w-[620px] w-full border-collapse">
      <thead>
        <tr className="border-b border-neutral-300">
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Imagem do projeto</span></th>
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Título do projeto</span></th>
          <th scope="col" className="pb-3 text-right"><span className="sr-only">Ações</span></th>
        </tr>
      </thead>
      <tbody>
        {projetos.map((projeto) => (
          <ProjetoRow key={projeto.id} projeto={projeto} onRemove={removeProjeto} onEdit={onEdit} />
        ))}
      </tbody>
    </table>
    </div>
  );
}
