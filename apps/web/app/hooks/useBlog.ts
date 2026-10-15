import { useState, useEffect, useCallback } from "react";
import { Blog } from "../types/blog";
import { fetchBlogs, deleteBlog } from "../service/blogService";

export function useBlog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setBlogs(await fetchBlogs());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar blogs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const removeBlog = useCallback(
    async (id: string) => {
      const removedBlog = blogs.find((blog) => blog.id === id);
      const removedIndex = blogs.findIndex((blog) => blog.id === id);
      setBlogs((current) => current.filter((e) => e.id !== id));
      try {
        await deleteBlog(id);
      } catch (err) {
        if (removedBlog && removedIndex >= 0) {
          setBlogs((current) => {
            if (current.some((blog) => blog.id === id)) {
              return current;
            }

            const updated = [...current];
            updated.splice(Math.min(removedIndex, updated.length), 0, removedBlog);
            return updated;
          });
        }
        setError(err instanceof Error ? err.message : "Erro ao remover blog.");
      }
    },
    [blogs]
  );

  return { blogs, isLoading, error, removeBlog, refetch: load };
}
