import { useEffect } from "react";
import { useMateria } from "../../../../hooks/useMateria";
import { MateriaRow } from "./MateriaRow";

interface MateriaListProps {
  refreshSignal?: number;
  onEdit: (id: string) => void;
}

export function MateriaList({ refreshSignal = 0, onEdit }: MateriaListProps) {
  const { materias, isLoading, error, removeMateria, refetch } = useMateria();

  useEffect(() => {
    refetch();
  }, [refreshSignal, refetch]);

  if (isLoading) return <p className="text-sm text-neutral-500">Carregando matérias...</p>;
  if (error) return <p role="alert" className="text-sm text-red-600">{error}</p>;
  if (materias.length === 0) return <p className="text-sm text-neutral-500">Nenhuma matéria publicada ainda.</p>;

  return (
    <div role="region" aria-label="Lista de materias" tabIndex={0} className="relative overflow-x-auto focus-visible:outline-2 focus-visible:outline-black">
    <table className="min-w-[620px] w-full border-collapse">
      <thead>
        <tr className="border-b border-neutral-300">
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Imagem de capa</span></th>
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Edição</span></th>
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Detalhes da matéria</span></th>
          <th scope="col" className="pb-3 text-right"><span className="sr-only">Ações</span></th>
        </tr>
      </thead>
      <tbody>
        {materias.map((materia) => (
          <MateriaRow key={materia.id} materia={materia} onRemove={removeMateria} onEdit={onEdit} />
        ))}
      </tbody>
    </table>
    </div>
  );
}
