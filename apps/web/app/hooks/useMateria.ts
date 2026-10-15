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
      const removedMateria = materias.find((materia) => materia.id === id);
      const removedIndex = materias.findIndex((materia) => materia.id === id);
      setMaterias((current) => current.filter((m) => m.id !== id));
      try {
        await deleteMateria(id);
      } catch (err) {
        if (removedMateria && removedIndex >= 0) {
          setMaterias((current) => {
            if (current.some((materia) => materia.id === id)) {
              return current;
            }

            const updated = [...current];
            updated.splice(Math.min(removedIndex, updated.length), 0, removedMateria);
            return updated;
          });
        }
        setError(err instanceof Error ? err.message : "Erro ao remover matéria.");
      }
    },
    [materias]
  );

  return { materias, isLoading, error, removeMateria, refetch: load };
}
