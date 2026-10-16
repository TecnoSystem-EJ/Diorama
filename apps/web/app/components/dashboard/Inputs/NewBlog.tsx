"use client";

import { useState, type FormEvent } from "react";
import { RichTextEditor } from "../../ui/RichTextEditor";

interface NewBlogProps {
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function NewBlog({ onSubmit, onCancel, isSubmitting = false }: NewBlogProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await onSubmit({ title, content });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="blog-title" className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">TÍTULO</label>
        <input
          id="blog-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-neutral-300 px-3 py-2 text-sm"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-xs font-semibold tracking-wide text-neutral-500 mb-1">CONTEÚDO</label>
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
          {isSubmitting ? "CRIANDO..." : "CRIAR ENSAIO"}
        </button>
      </div>
    </form>
  );
}
