"use client";

import { useRef, useState } from "react";
import { fetchMateria, updateMateria, createMateria, type MateriaInput } from "../../../../service/materiaService";
import type { Materia } from "../../../../types/materia";
import { SectionHeader } from "../SectionHeader";
import { MateriaList } from "./MateriaList";
import { CreateModal } from "../../../ui/CreateModal";
import { NewMateria } from "../../Inputs/NewMateria";

export function MateriasSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Materia | null>(null);
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
      const item = await fetchMateria(id);
      if (requestId.current === currentRequest) setEditingItem(item);
    } catch (err) {
      if (requestId.current === currentRequest) setCreateError(err instanceof Error ? err.message : "Não foi possível carregar o registro.");
    } finally {
      if (requestId.current === currentRequest) setIsLoading(false);
    }
  }

  async function handleCreate(data: MateriaInput) {
    setIsSubmitting(true);
    setCreateError(null);

    try {
      if (editingId) await updateMateria(editingId, data);
      else await createMateria(data);
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
        onButtonClick={openCreate}
      />
      <MateriaList refreshSignal={refreshSignal} onEdit={handleEdit} />

      <CreateModal
        isOpen={isModalOpen}
        onClose={close}
        title={editingId ? "Editar Matéria" : "Nova Matéria"}
        size="large"
      >
        {createError && <p role="alert" className="mb-4 text-sm text-red-600">{createError}</p>}
        {isLoading ? <p role="status">Carregando matéria...</p> : (!editingId || editingItem) && <NewMateria
          initialMateria={editingItem ?? undefined}
          onSubmit={handleCreate}
          onCancel={close}
          isSubmitting={isSubmitting}
        />}
      </CreateModal>
    </section>
  );
}
