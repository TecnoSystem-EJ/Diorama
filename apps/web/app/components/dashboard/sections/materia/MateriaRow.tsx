import Image from "next/image";
import { Materia } from "../../../../types/materia";

interface MateriaRowProps {
  materia: Materia;
  onRemove: (id: string) => void;
}

export function MateriaRow({ materia, onRemove }: MateriaRowProps) {
  function handleRemoveClick() {
    if (window.confirm(`Remover a matéria "${materia.title}"?`)) {
      onRemove(materia.id);
    }
  }

  return (
    <tr className="border-b border-neutral-200">
      <td className="py-4 pr-4 w-16">
        <div className="w-12 h-12 relative rounded overflow-hidden bg-neutral-100">
          <Image src={materia.imageUrl} alt={materia.title} fill className="object-cover" />
        </div>
      </td>
      <td className="py-4 pr-6 text-sm text-neutral-500 whitespace-nowrap">{materia.editionTitle}</td>
      <td className="py-4 pr-6">
        <p className="font-serif text-lg">{materia.title}</p>
        <p className="text-sm text-neutral-500">{materia.author}</p>
      </td>
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