"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewEdition } from "../../../../components/dashboard/Inputs/NewEdition";
import { fetchEdition, updateEdition, type EditionInput } from "../../../../service/editionService";
import { useAuth } from "../../../../hooks/useAuth";
import type { Edition } from "../../../../types/edition";

export default function EditarEdicaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [edition, setEdition] = useState<Edition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) router.replace("/login");
  }, [isLoading, isAuthenticated, user, router]);
  useEffect(() => {
    if (isAuthenticated) fetchEdition(id).then(setEdition).catch(err => setError(err.message));
  }, [id, isAuthenticated]);

  async function save(data: EditionInput) {
    setIsSaving(true); setError(null);
    try { await updateEdition(id, data); router.push("/pages/dashboard"); }
    catch (err) { setError(err instanceof Error ? err.message : "Não foi possível salvar."); }
    finally { setIsSaving(false); }
  }

  if (isLoading || !isAuthenticated || user?.role !== "ADMIN") return <p className="p-10">Validando sessão...</p>;
  return <main className="mx-auto max-w-3xl px-6 py-10">
    <h1 className="font-serif text-3xl mb-8">Editar Edição</h1>
    {error && <p role="alert" className="mb-4 text-red-600">{error}</p>}
    {edition ? <NewEdition initialEdition={edition} onSubmit={save} onCancel={() => router.push("/pages/dashboard")} isSubmitting={isSaving} /> : !error && <p>Carregando edição...</p>}
  </main>;
}
