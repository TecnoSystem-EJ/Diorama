"use client";

import { useState } from "react";
import { SectionHeader } from "../SectionHeader";
import { ProjetoList } from "./ProjetoList";
import { CreateModal } from "../../../ui/CreateModal";
import { NewProjeto } from "../../Inputs/NewProject";

export function ProjetosSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreate(data: {
    title: string;
    imageUrl: string;
    content: string;
  }) {
    console.log("criar projeto:", data);
    setIsModalOpen(false);
  }

  return (
    <section>
      <SectionHeader
        title="Projetos Especiais"
        buttonLabel="+ NOVO PROJETO"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <ProjetoList />

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Projeto"
        size="large"
      >
        <NewProjeto
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
        />
      </CreateModal>
    </section>
  );
}
