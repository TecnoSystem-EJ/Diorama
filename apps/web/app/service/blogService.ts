import { API_ENDPOINTS, TOKEN_STORAGE_KEY, buildApiUrl } from "../config/api";
import { Blog } from "../types/blog";

const BASE_URL = buildApiUrl(API_ENDPOINTS.blogs);

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Token " + token } : {}),
  };
}

function mapBlog(item: Record<string, unknown>): Blog {
  return {
    id: String(item.id ?? ""),
    date: String(item.dataPublicacao ?? item.data_publicacao ?? ""),
    title: String(item.titulo ?? ""),
  };
}

export async function fetchBlogs(): Promise<Blog[]> {
  const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Não foi possível carregar os blogs.");

  const data = await response.json();
  const blogs = (Array.isArray(data?.blogs) ? data.blogs : []) as Record<string, unknown>[];
  return blogs.map(mapBlog);
}

export async function createBlog(data: { title: string; content: string }): Promise<void> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      titulo: data.title,
      conteudoHtml: data.content,
    }),
  });

  if (!response.ok) throw new Error("Não foi possível criar o ensaio.");
}

export async function deleteBlog(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Não foi possível remover o blog.");
}
