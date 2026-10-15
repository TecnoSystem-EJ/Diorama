"use client";

import { createContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, TOKEN_STORAGE_KEY, buildApiUrl } from "../config/api";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | string;
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

interface LoginResponse {
  token: string;
}

function decodeJwtPayload(token: string): { id: string; role: string } | null {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const decoded = JSON.parse(atob(padded)) as { id?: unknown; role?: unknown };

    if (typeof decoded.id !== "string" || typeof decoded.role !== "string") {
      return null;
    }

    return { id: decoded.id, role: decoded.role };
  } catch {
    return null;
  }
}

function parseAdminFromToken(token: string, email = ""): User | null {
  const payload = decodeJwtPayload(token);
  if (!payload || payload.role !== "ADMIN") {
    return null;
  }

  return {
    id: payload.id,
    role: payload.role,
    email,
    name: email,
  };
}

async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(buildApiUrl(API_ENDPOINTS.auth), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha: password }),
  });

  if (!response.ok) {
    throw new Error("E-mail ou senha inválidos.");
  }

  return response.json();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    const adminUser = parseAdminFromToken(token);
    if (!adminUser) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      setUser(null);
    } else {
      setUser(adminUser);
    }

    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await loginRequest(email, password);
        const adminUser = parseAdminFromToken(data.token, email);

        if (!adminUser) {
          setError("Acesso restrito. Apenas administradores podem entrar.");
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setUser(null);
          return;
        }

        localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
        setUser(adminUser);
        router.push("/pages/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Credenciais inválidas. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
    router.push("/pages/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
