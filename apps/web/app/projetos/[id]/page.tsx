import { PublicPage, EditorialContent } from "../../components/PublicPage";
import { publicApi, type PublicProject } from "../../../lib/publicApi";

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { projeto } = await publicApi<{ projeto: PublicProject }>(`/projetos/${encodeURIComponent(id)}`);
  return <PublicPage title={projeto.titulo}><EditorialContent html={projeto.conteudoHtml} /></PublicPage>;
}
