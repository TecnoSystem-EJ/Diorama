import { PublicPage, EditorialContent } from "../../components/PublicPage";
import { publicApi, type PublicBlog } from "../../../lib/publicApi";

export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { blog } = await publicApi<{ blog: PublicBlog }>(`/blogs/${encodeURIComponent(id)}`);
  return <PublicPage title={blog.titulo}>
    <p className="mb-6 text-neutral-500">{new Date(blog.dataPublicacao).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
    <EditorialContent html={blog.conteudoHtml} />
  </PublicPage>;
}
