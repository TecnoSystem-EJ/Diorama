import { useState, useEffect, useCallback } from "react";
import { Edition } from "../types/edition";
import { fetchEditions, deleteEdition } from "../service/editionService";

interface UseEditionsReturn {
  editions: Edition[];
  isLoading: boolean;
  error: string | null;
  removeEdition: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useEditions(): UseEditionsReturn {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEditions = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchEditions();
      setEditions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar edições.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEditions();
  }, [loadEditions]);

  const removeEdition = useCallback(async (id: string) => {
    const previousEditions = editions;
    setEditions((current) => current.filter((edition) => edition.id !== id));

    try {
      await deleteEdition(id);
    } catch (err) {
      setEditions(previousEditions);
      setError(err instanceof Error ? err.message : "Erro ao remover edição.");
    }
  }, [editions]);

  return { editions, isLoading, error, removeEdition, refetch: loadEditions };
}