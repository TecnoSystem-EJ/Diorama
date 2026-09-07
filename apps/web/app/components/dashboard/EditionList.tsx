import Link from "next/link";
import { useEditions } from "../../hooks/useEdition";
import { EditionRow } from "./EditionRow";

export function EditionList() {
  const { editions, isLoading, error, removeEdition } = useEditions();

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-2xl">Edições Publicadas</h2>
        <Link
          href="/"
          className="bg-black text-white text-sm font-semibold tracking-wide px-5 py-2.5 hover:bg-neutral-800 transition"
        >
          + NOVA EDIÇÃO
        </Link>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      {isLoading ? (
        <p className="text-sm text-neutral-500">Carregando edições...</p>
      ) : editions.length === 0 ? (
        <p className="text-sm text-neutral-500">Nenhuma edição publicada ainda.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-neutral-300">
              <th className="pb-3" />
              <th className="pb-3" />
              <th className="pb-3" />
              <th className="pb-3" />
              <th className="pb-3" />
            </tr>
          </thead>
          <tbody>
            {editions.map((edition) => (
              <EditionRow key={edition.id} edition={edition} onRemove={removeEdition} />
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}