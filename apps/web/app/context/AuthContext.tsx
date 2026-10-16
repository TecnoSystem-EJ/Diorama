"use client";

import { createContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, TOKEN_STORAGE_KEY, buildApiUrl } from "../config/api";
import { readResponse } from "../service/http";

interface User {
  id: number;
  username: string;
  email: string;
  role: "ADMIN" | "AUTOR";
}

export interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextData | null>(null);

async function fetchSession(token: string, signal?: AbortSignal): Promise<User> {
  const response = await fetch(buildApiUrl(`${API_ENDPOINTS.auth}/me`), {
    headers: { Authorization: `Bearer ${token}` }, signal,
  });
  const data = await readResponse<{ user: User }>(response);
  if (data.user.role !== "ADMIN") throw new Error("Acesso restrito a administradores.");
  return data.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    window.location.assign("/login");
  }, []);

  useEffect(() => {
    window.addEventListener("diorama:unauthorized", logout);
    return () => window.removeEventListener("diorama:unauthorized", logout);
  }, [logout]);

  useEffect(() => {
    const abort = new AbortController();
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) { setIsLoading(false); return; }
    fetchSession(token, abort.signal)
      .then(setUser)
      .catch((err) => {
        if (!abort.signal.aborted) {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setUser(null);
          setError(err instanceof Error ? err.message : "Entre novamente.");
        }
      })
      .finally(() => { if (!abort.signal.aborted) setIsLoading(false); });
    return () => abort.abort();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(buildApiUrl(API_ENDPOINTS.auth), {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      });
      const { token } = await readResponse<{ token: string }>(response);
      const admin = await fetchSession(token);
      localStorage.setItem(TOKEN_STORAGE_KEY, token);
      setUser(admin);
      router.push("/pages/dashboard");
    } catch (err) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally { setIsLoading(false); }
  }, [router]);

  return <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, logout }}>{children}</AuthContext.Provider>;
}
