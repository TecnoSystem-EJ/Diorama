import { useBlog } from "../../../../hooks/useBlog";
import { BlogRow } from "./BlogRow";

export function BlogList() {
  const { blogs, isLoading, error, removeBlog } = useBlog();

  if (isLoading) return <p className="text-sm text-neutral-500">Carregando blogs...</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (blogs.length === 0) return <p className="text-sm text-neutral-500">Nenhum blog publicado ainda.</p>;

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-neutral-300">
          <th className="pb-3" /><th className="pb-3" /><th className="pb-3" />
        </tr>
      </thead>
      <tbody>
        {blogs.map((blog) => (
          <BlogRow key={blog.id} blog={blog} onRemove={removeBlog} />
        ))}
      </tbody>
    </table>
  );
}