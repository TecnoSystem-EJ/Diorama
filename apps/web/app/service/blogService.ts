import { Blog } from "../types/blog";

const BASE_URL = "";

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchBlogs(): Promise<Blog[]> {
  const response = await fetch(BASE_URL, { headers: getAuthHeaders() });
  if (!response.ok) throw new Error("Não foi possível carregar os blogs.");
  const data = await response.json();
  return data.blogs as Blog[];
}

export async function deleteBlog(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) throw new Error("Não foi possível remover o blog.");
}