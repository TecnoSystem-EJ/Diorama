import { useState, useEffect, useCallback } from "react";
import { Projeto } from "../types/projeto";
import { fetchProjetos, deleteProjeto } from "../service/projetoService";

export function useProjeto() {
  const [projetos, setProjetos] = useState<Projeto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProjetos(await fetchProjetos());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar projetos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeProjeto = useCallback(
    async (id: string) => {
      const removedProjeto = projetos.find((projeto) => projeto.id === id);
      const removedIndex = projetos.findIndex((projeto) => projeto.id === id);
      setProjetos((current) => current.filter((p) => p.id !== id));
      try {
        await deleteProjeto(id);
      } catch (err) {
        if (removedProjeto && removedIndex >= 0) {
          setProjetos((current) => {
            if (current.some((projeto) => projeto.id === id)) {
              return current;
            }

            const updated = [...current];
            updated.splice(Math.min(removedIndex, updated.length), 0, removedProjeto);
            return updated;
          });
        }
        setError(err instanceof Error ? err.message : "Erro ao remover projeto.");
      }
    },
    [projetos]
  );

  return { projetos, isLoading, error, removeProjeto, refetch: load };
}
