import { useState, useEffect, useCallback } from "react";
import { Materia } from "../types/materia";
import { fetchMaterias, deleteMateria } from "../service/materiaService";

export function useMateria() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setMaterias(await fetchMaterias());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar matérias.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeMateria = useCallback(
    async (id: string) => {
      const previous = materias;
      setMaterias((current) => current.filter((m) => m.id !== id));
      try {
        await deleteMateria(id);
      } catch (err) {
        setMaterias(previous);
        setError(err instanceof Error ? err.message : "Erro ao remover matéria.");
      }
    },
    [materias]
  );

  return { materias, isLoading, error, removeMateria, refetch: load };
}