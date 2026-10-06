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
      const previous = projetos;
      setProjetos((current) => current.filter((p) => p.id !== id));
      try {
        await deleteProjeto(id);
      } catch (err) {
        setProjetos(previous);
        setError(err instanceof Error ? err.message : "Erro ao remover projeto.");
      }
    },
    [projetos]
  );

  return { projetos, isLoading, error, removeProjeto, refetch: load };
}