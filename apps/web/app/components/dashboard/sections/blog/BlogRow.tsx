import { Blog } from "../../../../types/blog";

interface BlogRowProps {
  blog: Blog;
  onRemove: (id: string) => void;
}

export function BlogRow({ blog, onRemove }: BlogRowProps) {
  function handleRemoveClick() {
    if (window.confirm(`Remover o blog "${blog.title}"?`)) {
      onRemove(blog.id);
    }
  }

  return (
    <tr className="border-b border-neutral-200">
      <td className="py-4 pr-6 text-sm text-neutral-500 whitespace-nowrap">{blog.date}</td>
      <td className="py-4 pr-6 font-serif text-lg">{blog.title}</td>
      <td className="py-4 text-right whitespace-nowrap">
        <button className="text-sm font-semibold tracking-wide text-blue-700 hover:underline mr-6">
          EDITAR
        </button>
        <button
          onClick={handleRemoveClick}
          className="text-sm font-semibold tracking-wide text-red-600 hover:underline"
        >
          REMOVER
        </button>
      </td>
    </tr>
  );
}