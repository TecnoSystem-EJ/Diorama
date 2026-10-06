import { useMateria } from "../../../../hooks/useMateria";
import { MateriaRow } from "./MateriaRow";

export function MateriaList() {
  const { materias, isLoading, error, removeMateria } = useMateria();

  if (isLoading) return <p className="text-sm text-neutral-500">Carregando matérias...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (materias.length === 0) return <p className="text-sm text-neutral-500">Nenhuma matéria publicada ainda.</p>;

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-neutral-300">
          <th className="pb-3" /><th className="pb-3" /><th className="pb-3" /><th className="pb-3" />
        </tr>
      </thead>
      <tbody>
        {materias.map((materia) => (
          <MateriaRow key={materia.id} materia={materia} onRemove={removeMateria} />
        ))}
      </tbody>
    </table>
  );
}