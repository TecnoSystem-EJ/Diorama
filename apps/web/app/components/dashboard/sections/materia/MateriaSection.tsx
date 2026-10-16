"use client";

import { useState } from "react";
import { createMateria, type MateriaInput } from "../../../../service/materiaService";
import { SectionHeader } from "../SectionHeader";
import { MateriaList } from "./MateriaList";
import { CreateModal } from "../../../ui/CreateModal";
import { NewMateria } from "../../Inputs/NewMateria";

export function MateriasSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  async function handleCreate(data: MateriaInput) {
    setIsSubmitting(true);
    setCreateError(null);

    try {
      await createMateria(data);
      setRefreshSignal((current) => current + 1);
      setIsModalOpen(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Não foi possível criar a matéria.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <SectionHeader
        title="Matérias Publicadas"
        buttonLabel="+ NOVA MATÉRIA"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <MateriaList refreshSignal={refreshSignal} />

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Matéria"
        size="large"
      >
        {createError && <p className="mb-4 text-sm text-red-600">{createError}</p>}
        <NewMateria
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </CreateModal>
    </section>
  );
}
