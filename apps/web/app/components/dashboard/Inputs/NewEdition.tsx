"use client";

import { useState, type FormEvent } from "react";

interface NewEditionProps {
  onSubmit: (data: { title: string; number: number; coverUrl: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function NewEdition({ onSubmit, onCancel, isSubmitting = false }: NewEditionProps) {
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ title, number: Number(number), coverUrl });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">TÍTULO</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">NÚMERO DA EDIÇÃO</label>
        <input
          type="number"
          min={1}
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">URL DA CAPA</label>
        <input
          value={coverUrl}
          onChange={(e) => setCoverUrl(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          placeholder="https://..."
          required
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
