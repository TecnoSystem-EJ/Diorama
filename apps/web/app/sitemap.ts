import type { MetadataRoute } from "next";
import { publicApi, type PublicEdition, type PublicMateria, type PublicBlog, type PublicProject } from "../lib/publicApi";
import { site } from "../lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!site.isConfigured) return [];
  const paths = ["", "/edicoes", "/blog", "/projetos", "/about", "/about/equipe", "/about/colaborar", "/about/ondeencontrar", "/about/contato", "/about/apoie", "/newsletter"];
  const entries: MetadataRoute.Sitemap = paths.map(path => ({ url: `${site.url}${path}` }));
  const responses = await Promise.allSettled([
    publicApi<{ edicoes: PublicEdition[] }>("/edicoes").then(({ edicoes }) => edicoes.map(item => `/edicoes/${item.id}`)),
    publicApi<{ revistas: PublicMateria[] }>("/revistas").then(({ revistas }) => revistas.map(item => `/materias/${item.id}`)),
    publicApi<{ blogs: PublicBlog[] }>("/blogs").then(({ blogs }) => blogs.map(item => `/blog/${item.id}`)),
    publicApi<{ projetos: PublicProject[] }>("/projetos").then(({ projetos }) => projetos.map(item => `/projetos/${item.id}`)),
  ]);
  for (const result of responses) {
    if (result.status === "fulfilled") entries.push(...result.value.map(path => ({ url: `${site.url}${path}` })));
  }
  return entries;
}
