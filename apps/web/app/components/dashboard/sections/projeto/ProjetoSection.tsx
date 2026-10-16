"use client";

import { useRef, useState } from "react";
import { fetchProjeto, updateProjeto, createProjeto } from "../../../../service/projetoService";
import type { Projeto } from "../../../../types/projeto";
import { SectionHeader } from "../SectionHeader";
import { ProjetoList } from "./ProjetoList";
import { CreateModal } from "../../../ui/CreateModal";
import { NewProjeto } from "../../Inputs/NewProject";

export function ProjetosSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Projeto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const requestId = useRef(0);

  function openCreate() {
    requestId.current += 1;
    setEditingId(null);
    setEditingItem(null);
    setCreateError(null);
    setIsLoading(false);
    setIsModalOpen(true);
  }

  function close() {
    if (isSubmitting) return;
    requestId.current += 1;
    setIsModalOpen(false);
  }

  async function handleEdit(id: string) {
    const currentRequest = ++requestId.current;
    setEditingId(id);
    setEditingItem(null);
    setCreateError(null);
    setIsLoading(true);
    setIsModalOpen(true);
    try {
      const item = await fetchProjeto(id);
      if (requestId.current === currentRequest) setEditingItem(item);
    } catch (err) {
      if (requestId.current === currentRequest) setCreateError(err instanceof Error ? err.message : "Não foi possível carregar o registro.");
    } finally {
      if (requestId.current === currentRequest) setIsLoading(false);
    }
  }

  async function handleCreate(data: {
    title: string;
    imageUrl: string;
    content: string;
  }) {
    setIsSubmitting(true);
    setCreateError(null);

    try {
      if (editingId) await updateProjeto(editingId, data);
      else await createProjeto(data);
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
        onButtonClick={openCreate}
      />
      <ProjetoList refreshSignal={refreshSignal} onEdit={handleEdit} />

      <CreateModal
        isOpen={isModalOpen}
        onClose={close}
        title={editingId ? "Editar Projeto" : "Novo Projeto"}
        size="large"
      >
        {createError && <p role="alert" className="mb-4 text-sm text-red-600">{createError}</p>}
        {isLoading ? <p role="status">Carregando projeto...</p> : (!editingId || editingItem) && <NewProjeto
          initialProjeto={editingItem ?? undefined}
          onSubmit={handleCreate}
          onCancel={close}
          isSubmitting={isSubmitting}
        />}
      </CreateModal>
    </section>
  );
}
