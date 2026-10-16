"use client";

import { useEffect, useState } from "react";
import { fetchSobreContent, updateSobreContent } from "../../../service/sobreService";
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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSobreContent().then((savedContent) => {
      if (savedContent) {
        setContent(savedContent);
      }
    }).catch(err => setSaveError(err instanceof Error ? err.message : "Não foi possível carregar o conteúdo."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    setSaved(false);

    try {
      await updateSobreContent(content);
      setSaved(true);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Não foi possível guardar as alterações.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="w-full">
      <SectionHeader title='Editar Página "Sobre Nós"' />
      {isLoading && <p>Carregando conteúdo...</p>}

      <div className="mt-8 max-w-4xl border border-[#d9d4ca] bg-[#f5f2eb] p-4 sm:p-8">
        <div className="mb-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#111]">
            Editor avançado (adicione textos, imagens, negritos)
          </p>
        </div>

        <RichTextEditor
          value={content}
          onChange={setContent}
          disabled={isSaving || isLoading}
          label="Conteúdo da página Sobre Nós"
        />

        {saveError && <p role="alert" className="mt-4 text-sm text-red-600">{saveError}</p>}
        {saved && <p role="status" className="mt-4 text-sm text-green-700">Alterações salvas.</p>}

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isLoading}
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
