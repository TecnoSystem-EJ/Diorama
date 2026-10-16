import { authHeaders, readResponse } from "./http";
import { API_ENDPOINTS, buildApiUrl } from "../config/api";
import { Blog } from "../types/blog";

const BASE_URL = buildApiUrl(API_ENDPOINTS.blogs);


function mapBlog(item: Record<string, unknown>): Blog {
  return {
    id: String(item.id ?? ""),
    date: String(item.dataPublicacao ?? item.data_publicacao ?? ""),
    title: String(item.titulo ?? ""),
    content: String(item.conteudoHtml ?? ""),
  };
}

export async function fetchBlogs(): Promise<Blog[]> {
  const response = await fetch(BASE_URL, { headers: authHeaders() });
  const data = await readResponse<Record<string, unknown>>(response);
  const blogs = (Array.isArray(data?.blogs) ? data.blogs : []) as Record<string, unknown>[];
  return blogs.map(mapBlog);
}

export async function fetchBlog(id: string): Promise<Blog> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, { headers: authHeaders() });
  const data = await readResponse<{ blog: Record<string, unknown> }>(response);
  return mapBlog(data.blog);
}

export async function updateBlog(id: string, data: { title: string; content: string }): Promise<void> {
  const response = await fetch(`${BASE_URL}/${encodeURIComponent(id)}`, {
    method: "PUT", headers: authHeaders(),
    body: JSON.stringify({ titulo: data.title, conteudoHtml: data.content }),
  });
  await readResponse(response);
}

export async function createBlog(data: { title: string; content: string }): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      titulo: data.title,
      conteudoHtml: data.content,
    }),
  });

  await readResponse(response);
}

export async function deleteBlog(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  await readResponse(response);
}
