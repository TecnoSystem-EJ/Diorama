"use client";

import { useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { EditionList } from "../EditionList";
import { CreateModal } from "../../ui/CreateModal";
import { NewEdition } from "../Inputs/NewEdition";

export function EdicaoSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreate(data: { title: string; number: number; coverUrl: string }) {
    // TODO: chamar createEdition (service) e refetch da lista
    console.log("criar edição:", data);
    setIsModalOpen(false);
  }

  return (
    <section>
      <SectionHeader title="Edições Publicadas" buttonLabel="+ NOVA EDIÇÃO" onButtonClick={() => setIsModalOpen(true)} />
      <EditionList />

      <CreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Edição" size="large">
        <NewEdition onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
      </CreateModal>
    </section>
  );
}