"use client";

import { useState, type FormEvent } from "react";
import type { EditionInput } from "../../../service/editionService";
import type { Edition } from "../../../types/edition";

interface NewEditionProps {
  onSubmit: (data: EditionInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
  initialEdition?: Edition;
}

export function NewEdition({ onSubmit, onCancel, isSubmitting = false, initialEdition }: NewEditionProps) {
  const [title, setTitle] = useState(initialEdition?.title ?? "");
  const [number, setNumber] = useState(initialEdition ? String(initialEdition.number) : "");
  const [cover, setCover] = useState<File | null>(null);
  const [pdf, setPdf] = useState<File | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ title: title.trim(), number: number.trim(), cover, pdf });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="edition-title" className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">TÍTULO</label>
        <input
          id="edition-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="edition-number" className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">NÚMERO / TAG DA EDIÇÃO</label>
        <input
          id="edition-number"
          type="text"
          placeholder="Ex.: 01, Edição especial ou Primavera 2026"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="edition-pdf" className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">PDF DA EDIÇÃO COMPLETA (OPCIONAL)</label>
        {initialEdition?.pdfUrl && <a href={initialEdition.pdfUrl} target="_blank" rel="noopener noreferrer" className="mb-2 inline-block text-sm underline">Abrir PDF atual</a>}
        <input id="edition-pdf" type="file" accept="application/pdf" disabled={isSubmitting} onChange={(e) => setPdf(e.target.files?.[0] ?? null)} className="w-full border border-neutral-300 px-3 py-2 text-sm" />
        <p className="mt-1 text-xs text-neutral-600">O PDF de cada matéria continua obrigatório. Na edição, um arquivo novo substitui o atual; deixar vazio preserva o arquivo existente.</p>
      </div>

      <div>
        <label htmlFor="edition-cover" className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">IMAGEM DA CAPA{initialEdition ? " (OPCIONAL)" : ""}</label>
        <input
          id="edition-cover"
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => setCover(e.target.files?.[0] ?? null)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required={!initialEdition}
          disabled={isSubmitting}
        />
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
          {isSubmitting ? "GUARDANDO..." : "GUARDAR REGISTRO"}
        </button>
      </div>
    </form>
  );
}
