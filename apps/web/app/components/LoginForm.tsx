"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { LoginInput } from "./LoginInput";
import { useAuth } from "../hooks/useAuth";

function validate(email: string, password: string) {
  const errors = { email: "", password: "" };
  if (!email.trim()) errors.email = "E-mail obrigatório.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "E-mail inválido.";
  if (!password) errors.password = "Senha obrigatória.";
  else if (password.length < 6) errors.password = "Mínimo de 6 caracteres.";
  return errors;
}

export function LoginForm() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ email: "", password: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errors = validate(email, password);
    setFieldErrors(errors);
    if (errors.email || errors.password) return;
    await login(email, password);
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">

      <LoginInput
        type="email"
        placeholder="admin@diorama.com"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={fieldErrors.email}
        disabled={isLoading}
      />

      <div className="relative">
        <LoginInput
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
          disabled={isLoading}
          className="pr-8"
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          className="absolute right-0 top-1.5 text-black/30 hover:text-[#1A365D] transition-colors"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-[11px] text-red-600 bg-red-50 border border-red-100 py-2 px-3 text-center uppercase tracking-widest font-bold">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-[#F4F1EA] py-5 text-[11px] font-bold uppercase tracking-widest
                   hover:bg-[#1A365D] disabled:opacity-60 disabled:cursor-not-allowed
                   transition-all transform hover:scale-[1.02]
                   flex items-center justify-center gap-2 mt-4"
      >
        {isLoading && <Loader2 size={14} className="animate-spin" />}
        {isLoading ? "A aceder…" : "Aceder ao Painel"}
      </button>

    </form>
  );
}