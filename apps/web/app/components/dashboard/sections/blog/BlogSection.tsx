"use client";

import { useState } from "react";
import { SectionHeader } from "../SectionHeader";
import { BlogList } from "./BlogList";
import { CreateModal } from "../../../ui/CreateModal";
import { NewBlog } from "../../Inputs/NewBlog";

export function BlogSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleCreate(data: { title: string; content: string }) {
    console.log("criar ensaio:", data);
    setIsModalOpen(false);
  }
  return (
    <section>
      <SectionHeader
        title="Ensaios Publicados"
        buttonLabel="+ NOVO ENSAIO"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <BlogList />

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Ensaio"
        size="large"
      >
        <NewBlog
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
        />
      </CreateModal>
    </section>
  );
}
