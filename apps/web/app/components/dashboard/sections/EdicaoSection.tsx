"use client";

import { useState } from "react";
import { createEdition, type EditionInput } from "../../../service/editionService";
import { SectionHeader } from "./SectionHeader";
import { EditionList } from "../EditionList";
import { CreateModal } from "../../ui/CreateModal";
import { NewEdition } from "../Inputs/NewEdition";

export function EdicaoSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  function close() {
    if (!isSubmitting) setIsModalOpen(false);
  }

  async function handleCreate(data: EditionInput) {
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
      <SectionHeader title="Edições Publicadas" buttonLabel="+ NOVA EDIÇÃO" onButtonClick={() => { setCreateError(null); setIsModalOpen(true); }} />
      <EditionList refreshSignal={refreshSignal} />

      <CreateModal isOpen={isModalOpen} onClose={close} title="Nova Edição" size="large">
        {createError && <p role="alert" className="mb-4 text-sm text-red-600">{createError}</p>}
        <NewEdition onSubmit={handleCreate} onCancel={close} isSubmitting={isSubmitting} />
      </CreateModal>
    </section>
  );
}
