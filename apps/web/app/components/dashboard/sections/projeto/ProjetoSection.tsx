"use client";

import { useState } from "react";
import { createProjeto } from "../../../../service/projetoService";
import { SectionHeader } from "../SectionHeader";
import { ProjetoList } from "./ProjetoList";
import { CreateModal } from "../../../ui/CreateModal";
import { NewProjeto } from "../../Inputs/NewProject";

export function ProjetosSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  async function handleCreate(data: {
    title: string;
    imageUrl: string;
    content: string;
  }) {
    setIsSubmitting(true);
    setCreateError(null);

    try {
      await createProjeto(data);
      setRefreshSignal((current) => current + 1);
      setIsModalOpen(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Não foi possível criar o projeto.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <SectionHeader
        title="Projetos Especiais"
        buttonLabel="+ NOVO PROJETO"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <ProjetoList refreshSignal={refreshSignal} />

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Projeto"
        size="large"
      >
        {createError && <p className="mb-4 text-sm text-red-600">{createError}</p>}
        <NewProjeto
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </CreateModal>
    </section>
  );
}
