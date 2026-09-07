import Image from "next/image";
import { Edition } from "../../types/edition";

interface EditionRowProps {
  edition: Edition;
  onRemove: (id: string) => void;
}

export function EditionRow({ edition, onRemove }: EditionRowProps) {
  function handleRemoveClick() {
    const confirmed = window.confirm(
      `Remover a Edição ${String(edition.number).padStart(2, "0")} - "${edition.title}"?`
    );
    if (confirmed) {
      onRemove(edition.id);
    }
  }

  return (
    <tr className="border-b border-neutral-200">
      <td className="py-4 pr-4 w-16">
        <div className="w-12 h-12 relative rounded overflow-hidden bg-neutral-100">
          <Image
            src={edition.coverUrl}
            alt={`Capa da Edição ${edition.number}`}
            fill
            className="object-cover"
          />
        </div>
      </td>
      <td className="py-4 pr-4 text-sm font-medium whitespace-nowrap">
        Edição {String(edition.number).padStart(2, "0")}
      </td>
      <td className="py-4 pr-4 font-serif text-lg">{edition.title}</td>
      <td className="py-4 pr-4 text-sm text-neutral-500 whitespace-nowrap">
        {edition.documentsCount} Documento{edition.documentsCount !== 1 ? "s" : ""}
      </td>
      <td className="py-4 text-right whitespace-nowrap">
        
          href={`/painel/edicoes/${edition.id}/editar`}
          className="text-sm font-semibold tracking-wide text-blue-700 hover:underline mr-6"
        <a>
          EDITAR
        </a>
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