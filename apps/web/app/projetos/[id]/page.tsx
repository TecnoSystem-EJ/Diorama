import type { Metadata } from "next";
import { PublicPage, EditorialContent } from "../../components/PublicPage";
import { publicApi, plainText, type PublicProject } from "../../../lib/publicApi";

type Props = { params: Promise<{ id: string }> };
async function loadProject(id: string) { return publicApi<{ projeto: PublicProject }>(`/projetos/${encodeURIComponent(id)}`); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { projeto } = await loadProject(id);
  return { title: projeto.titulo, description: plainText(projeto.conteudoHtml, 160), alternates: { canonical: `/projetos/${id}` }, openGraph: { images: [{ url: projeto.imagemUrl, alt: projeto.titulo }] } };
}
export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projeto } = await publicApi<{ projeto: PublicProject }>(`/projetos/${encodeURIComponent(id)}`);
  return <PublicPage title={projeto.titulo}><EditorialContent html={projeto.conteudoHtml} /></PublicPage>;
}
