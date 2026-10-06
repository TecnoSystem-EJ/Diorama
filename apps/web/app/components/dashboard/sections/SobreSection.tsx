"use client";

import { useState } from "react";
import { RichTextEditor } from "../../ui/RichTextEditor";
import { SectionHeader } from "./SectionHeader";

const initialContent = `
  <h3>A Nossa Missão</h3>

  <p>
    <strong>DIORAMA</strong> é uma plataforma editorial sem fins lucrativos,
    sem publicidade e open access que se dedica a inventar confluências e
    catalisar ideias.
  </p>

  <p>
    Em aliança com coletivos urbanos, a DIORAMA atua como um espaço de resistência.
  </p>
`;

export function SobreSection() {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Futuramente:
      // await api.put("/sobre", { content });

      console.log("Conteúdo salvo:", content);

      // Simulação de salvamento
      await new Promise((resolve) => setTimeout(resolve, 500));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="w-full">
      {/* Título da página */}
      <SectionHeader title='Editar Página "Sobre Nós"' />

      {/* Área do editor */}
      <div className="mt-8 max-w-4xl border border-[#d9d4ca] bg-[#f5f2eb] px-8 py-8">
        {/* Label */}
        <div className="mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#111]">
            Editor avançado (adicione textos, imagens, negritos)
          </p>
        </div>

        {/* Rich Text Editor */}
        <RichTextEditor
          value={content}
          onChange={setContent}
        />

        {/* Botão */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="
              min-w-56.5
              bg-black
              px-8
              py-3.5
              text-xs
              font-bold
              uppercase
              tracking-[0.08em]
              text-white
              transition
              hover:bg-neutral-800
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isSaving ? "A GUARDAR..." : "GUARDAR ALTERAÇÕES"}
          </button>
        </div>
      </div>
    </section>
  );
}