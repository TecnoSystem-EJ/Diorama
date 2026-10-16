import { Blog } from "../../../../types/blog";

interface BlogRowProps {
  blog: Blog;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}

export function BlogRow({ blog, onRemove, onEdit }: BlogRowProps) {
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
        <button type="button" onClick={() => onEdit(blog.id)} aria-label={`Editar ${blog.title}`} className="mr-5 text-sm font-semibold tracking-wide text-blue-700 hover:underline">EDITAR</button>
        <button
          aria-label={`Remover ${blog.title}`}
          onClick={handleRemoveClick}
          className="text-sm font-semibold tracking-wide text-red-600 hover:underline"
        >
          REMOVER
        </button>
      </td>
    </tr>
  );
}
