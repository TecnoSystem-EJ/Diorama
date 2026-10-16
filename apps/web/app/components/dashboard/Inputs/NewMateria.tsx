"use client";

import { useState, type FormEvent } from "react";
import { RichTextEditor } from "../../ui/RichTextEditor";
import { useEditions } from "../../../hooks/useEdicao";
import type { MateriaInput } from "../../../service/materiaService";

interface NewMateriaProps {
  onSubmit: (data: MateriaInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function NewMateria({ onSubmit, onCancel, isSubmitting = false }: NewMateriaProps) {
  const { editions, isLoading: editionsLoading, error: editionsError } = useEditions();

  const [editionId, setEditionId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);
  const [content, setContent] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ editionId, title, author, image, pdf, content });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="materia-edition" className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">
          VINCULAR À EDIÇÃO
        </label>
        <select
          id="materia-edition"
          value={editionId}
          onChange={(e) => setEditionId(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white"
          required
          disabled={editionsLoading || isSubmitting}
        >
          <option value="" disabled>
            {editionsLoading ? "Carregando edições..." : "Selecione uma edição"}
          </option>
          {editions.map((edition) => (
            <option key={edition.id} value={edition.id}>
              Edição {String(edition.number).padStart(2, "0")} — {edition.title}
            </option>
          ))}
        </select>
        {editionsError && <p role="alert" className="text-sm text-red-600">{editionsError}</p>}
      </div>

      <div>
        <label htmlFor="materia-title" className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">TÍTULO</label>
        <input
          id="materia-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="materia-author" className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">
          AUTOR (CRÉDITOS)
        </label>
        <input
          id="materia-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="materia-image" className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">
          IMAGEM DE DESTAQUE
        </label>
        <input
          id="materia-image"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => setImage(e.target.files?.[0] ?? null)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="materia-pdf" className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">PDF DA MATÉRIA</label>
        <input id="materia-pdf" type="file" accept="application/pdf" required disabled={isSubmitting} onChange={(e) => setPdf(e.target.files?.[0] ?? null)} />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">
          CONTEÚDO DA MATÉRIA
        </label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-neutral-500 hover:text-black" disabled={isSubmitting}>
          CANCELAR
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-neutral-800 transition disabled:opacity-50"
        >
          {isSubmitting ? "CRIANDO..." : "CRIAR MATÉRIA"}
        </button>
      </div>
    </form>
  );
}
