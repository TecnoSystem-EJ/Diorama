"use client";

import { useState } from "react";
import { createBlog } from "../../../../service/blogService";
import { SectionHeader } from "../SectionHeader";
import { BlogList } from "./BlogList";
import { CreateModal } from "../../../ui/CreateModal";
import { NewBlog } from "../../Inputs/NewBlog";

export function BlogSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  async function handleCreate(data: { title: string; content: string }) {
    setIsSubmitting(true);
    setCreateError(null);

    try {
      await createBlog(data);
      setRefreshSignal((current) => current + 1);
      setIsModalOpen(false);
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Não foi possível criar o ensaio.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section>
      <SectionHeader
        title="Ensaios Publicados"
        buttonLabel="+ NOVO ENSAIO"
        onButtonClick={() => setIsModalOpen(true)}
      />
      <BlogList refreshSignal={refreshSignal} />

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Novo Ensaio"
        size="large"
      >
        {createError && <p className="mb-4 text-sm text-red-600">{createError}</p>}
        <NewBlog
          onSubmit={handleCreate}
          onCancel={() => setIsModalOpen(false)}
          isSubmitting={isSubmitting}
        />
      </CreateModal>
    </section>
  );
}
