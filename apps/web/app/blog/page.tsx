import Link from "next/link";
import { PublicPage } from "../components/PublicPage";
import { publicApi, type PublicBlog } from "../../lib/publicApi";

export default async function BlogPage() {
  const { blogs } = await publicApi<{ blogs: PublicBlog[] }>("/blogs");
  return <PublicPage title="Extra! / Ensaios">
    {!blogs.length && <p>Nenhum ensaio publicado ainda.</p>}
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">{blogs.map(blog => <article key={blog.id} className="border border-black/15 p-6">
      <h2 className="font-serif text-2xl mb-4">{blog.titulo}</h2>
      <p className="text-sm text-neutral-500 mb-6">{new Date(blog.dataPublicacao).toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" })}</p>
      <Link className="underline" href={`/blog/${blog.id}`}>Ler artigo</Link>
    </article>)}</div>
  </PublicPage>;
}
