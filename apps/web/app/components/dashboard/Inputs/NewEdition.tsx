"use client";

import { useState, type FormEvent } from "react";

interface NewEditionProps {
  onSubmit: (data: { title: string; number: number; coverUrl: string }) => void;
  onCancel: () => void;
}

export function NewEdition({ onSubmit, onCancel }: NewEditionProps) {
  const [title, setTitle] = useState("");
  const [number, setNumber] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ title, number: Number(number), coverUrl });
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
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="text-sm font-semibold text-neutral-500 hover:text-black">
          CANCELAR
        </button>
        <button
          type="submit"
          className="bg-black text-white text-sm font-semibold px-5 py-2.5 hover:bg-neutral-800 transition"
        >
          GUARDAR REGISTRO
        </button>
      </div>
    </form>
  );
}