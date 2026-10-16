import { useEffect } from "react";
import { useBlog } from "../../../../hooks/useBlog";
import { BlogRow } from "./BlogRow";

interface BlogListProps {
  refreshSignal?: number;
  onEdit: (id: string) => void;
}

export function BlogList({ refreshSignal = 0, onEdit }: BlogListProps) {
  const { blogs, isLoading, error, removeBlog, refetch } = useBlog();

  useEffect(() => {
    refetch();
  }, [refreshSignal, refetch]);

  if (isLoading) return <p className="text-sm text-neutral-500">Carregando blogs...</p>;
  if (error) return <p role="alert" className="text-sm text-red-600">{error}</p>;
  if (blogs.length === 0) return <p className="text-sm text-neutral-500">Nenhum blog publicado ainda.</p>;

  return (
    <div role="region" aria-label="Lista de blogs" tabIndex={0} className="relative overflow-x-auto focus-visible:outline-2 focus-visible:outline-black">
    <table className="min-w-[620px] w-full border-collapse">
      <thead>
        <tr className="border-b border-neutral-300">
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Data de publicação</span></th>
          <th scope="col" className="pb-3 text-left"><span className="sr-only">Título</span></th>
          <th scope="col" className="pb-3 text-right"><span className="sr-only">Ações</span></th>
        </tr>
      </thead>
      <tbody>
        {blogs.map((blog) => (
          <BlogRow key={blog.id} blog={blog} onRemove={removeBlog} onEdit={onEdit} />
        ))}
      </tbody>
    </table>
    </div>
  );
}
