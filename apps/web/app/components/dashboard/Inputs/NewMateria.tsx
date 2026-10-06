"use client";

import { useState, type FormEvent } from "react";
import { RichTextEditor } from "../../ui/RichTextEditor";
import { useEditions } from "../../../hooks/useEdicao";

interface NewMateriaProps {
  onSubmit: (data: {
    editionId: string;
    title: string;
    author: string;
    imageUrl: string;
    content: string;
  }) => void;
  onCancel: () => void;
}

export function NewMateria({ onSubmit, onCancel }: NewMateriaProps) {
  const { editions, isLoading: editionsLoading } = useEditions();

  const [editionId, setEditionId] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ editionId, title, author, imageUrl, content });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">
          VINCULAR À EDIÇÃO
        </label>
        <select
          value={editionId}
          onChange={(e) => setEditionId(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm bg-white"
          required
          disabled={editionsLoading}
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
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">TÍTULO</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">
          AUTOR (CRÉDITOS)
        </label>
        <input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">
          URL DA IMAGEM DE CAPA
        </label>
        <input
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">
          CONTEÚDO DA MATÉRIA
        </label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-neutral-500 hover:text-black">
          CANCELAR
        </button>
        <button
          type="submit"
          className="bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-neutral-800 transition"
        >
          CRIAR MATÉRIA
        </button>
      </div>
    </form>
  );
}