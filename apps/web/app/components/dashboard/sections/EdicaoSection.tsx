"use client";

import { useState } from "react";
import { createEdition } from "../../../service/editionService";
import { SectionHeader } from "./SectionHeader";
import { EditionList } from "../EditionList";
import { CreateModal } from "../../ui/CreateModal";
import { NewEdition } from "../Inputs/NewEdition";

export function EdicaoSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  async function handleCreate(data: { title: string; number: number; coverUrl: string }) {
    setIsSubmitting(true);
    setCreateError(null);

    try {
      await createEdition(data);
      setRefreshSignal((current) => current + 1);
      setIsModalOpen(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Não foi possível criar a edição.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <SectionHeader title="Edições Publicadas" buttonLabel="+ NOVA EDIÇÃO" onButtonClick={() => setIsModalOpen(true)} />
      <EditionList refreshSignal={refreshSignal} />

      <CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Edição" size="large">
        {createError && <p className="mb-4 text-sm text-red-600">{createError}</p>}
        <NewEdition onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} isSubmitting={isSubmitting} />
      </CreateModal>
    </section>
  );
}
