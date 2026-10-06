"use client";

import { useState, type FormEvent } from "react";
import { RichTextEditor } from "../../ui/RichTextEditor";

interface NewBlogProps {
  onSubmit: (data: { title: string; content: string }) => void;
  onCancel: () => void;
}

export function NewBlog({ onSubmit, onCancel }: NewBlogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit({ title, content });
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
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">CONTEÚDO</label>
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
          CRIAR ENSAIO
        </button>
      </div>
    </form>
  );
}