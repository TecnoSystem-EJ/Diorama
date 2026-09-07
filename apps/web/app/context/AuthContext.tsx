"use client";

import { createContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";

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

const TOKEN_KEY = "TOKEN";

interface LoginResponse {
  token: string;
  user: User;
}

async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("E-mail ou senha inválidos.");
    }
    throw new Error("Não foi possível realizar o login. Tente novamente.");
  }

  return response.json();
}

async function fetchMe(token: string): Promise<User> {
  const response = await fetch("/", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error("Sessão inválida.");
  }

  const data = await response.json();
  return data.user;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setIsLoading(false);
      return;
    }

    fetchMe(token)
      .then((fetchedUser) => {
        if (fetchedUser.role !== "ADMIN") {
          localStorage.removeItem(TOKEN_KEY);
          setUser(null);
          return;
        }
        setUser(fetchedUser);
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await loginRequest(email, password);

        if (data.user.role !== "ADMIN") {
          setError("Acesso restrito. Apenas administradores podem entrar.");
          return;
        }

        localStorage.setItem(TOKEN_KEY, data.token);
        setUser(data.user);
        router.push("/dashboard");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Credenciais inválidas. Tente novamente.");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}