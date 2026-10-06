import Image from "next/image";
import { Projeto } from "../../../../types/projeto";

interface ProjetoRowProps {
  projeto: Projeto;
  onRemove: (id: string) => void;
}

export function ProjetoRow({ projeto, onRemove }: ProjetoRowProps) {
  function handleRemoveClick() {
    if (window.confirm(`Remover o projeto "${projeto.title}"?`)) {
      onRemove(projeto.id);
    }
  }

  return (
    <tr className="border-b border-neutral-200">
      <td className="py-4 pr-4 w-16">
        <div className="w-12 h-12 relative rounded overflow-hidden bg-neutral-100">
          <Image src={projeto.imageUrl} alt={projeto.title} fill className="object-cover" />
        </div>
      </td>
      <td className="py-4 pr-6 font-serif text-lg">{projeto.title}</td>
      <td className="py-4 text-right whitespace-nowrap">
        <button className="text-sm font-semibold tracking-wide text-blue-700 hover:underline mr-6">
          EDITAR
        </button>
        <button
          onClick={handleRemoveClick}
          className="text-sm font-semibold tracking-wide text-red-600 hover:underline"
        >
          REMOVER
        </button>
      </td>
    </tr>
  );
}