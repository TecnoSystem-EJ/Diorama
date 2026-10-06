// app/components/dashboard/MateriasSection.tsx
"use client";

import { useState } from "react";
import { SectionHeader } from "../SectionHeader";
import { MateriaList } from "./MateriaList";
import { CreateModal } from "../../../ui/CreateModal";
import { NewMateria } from "../../Inputs/NewMateria";

export function MateriasSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreate(data: {
    editionId: string;
    title: string;
    author: string;
    imageUrl: string;
    content: string;
  }) {
    console.log("criar matéria:", data);
    setIsModalOpen(false);
  }

  return (
    <section>
      <SectionHeader
        title="Matérias Publicadas"
        buttonLabel="+ NOVA MATÉRIA"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <MateriaList />

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Matéria"
        size="large"
      >
        <NewMateria
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
        />
      </CreateModal>
    </section>
  );
}
