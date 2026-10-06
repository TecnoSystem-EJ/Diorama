import { useProjeto } from "../../../../hooks/useProjeto";
import { ProjetoRow } from "./ProjetoRow";

export function ProjetoList() {
  const { projetos, isLoading, error, removeProjeto } = useProjeto();

  if (isLoading) return <p className="text-sm text-neutral-500">Carregando projetos...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (projetos.length === 0) return <p className="text-sm text-neutral-500">Nenhum projeto publicado ainda.</p>;

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-neutral-300">
          <th className="pb-3" /><th className="pb-3" /><th className="pb-3" />
        </tr>
      </thead>
      <tbody>
        {projetos.map((projeto) => (
          <ProjetoRow key={projeto.id} projeto={projeto} onRemove={removeProjeto} />
        ))}
      </tbody>
    </table>
  );
}