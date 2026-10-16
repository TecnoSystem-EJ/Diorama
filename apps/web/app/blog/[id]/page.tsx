import type { Metadata } from "next";
import { PublicPage, EditorialContent } from "../../components/PublicPage";
import { publicApi, plainText, type PublicBlog } from "../../../lib/publicApi";

type Props = { params: Promise<{ id: string }> };
async function loadBlog(id: string) { return publicApi<{ blog: PublicBlog }>(`/blogs/${encodeURIComponent(id)}`); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { blog } = await loadBlog(id);
  return { title: blog.titulo, description: plainText(blog.conteudoHtml, 160), alternates: { canonical: `/blog/${id}` }, openGraph: { type: "article", publishedTime: blog.dataPublicacao } };
}
export default async function BlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { blog } = await publicApi<{ blog: PublicBlog }>(`/blogs/${encodeURIComponent(id)}`);
  return <PublicPage title={blog.titulo}>
    <p className="mb-6 text-neutral-500">{new Date(blog.dataPublicacao).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
    <EditorialContent html={blog.conteudoHtml} />
  </PublicPage>;
}
