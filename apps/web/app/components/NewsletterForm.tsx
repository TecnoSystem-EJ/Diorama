"use client";

import { useId, useState, type FormEvent } from "react";
import { buildApiUrl } from "../config/api";
import { readResponse } from "../service/http";

export function NewsletterForm() {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [pending, setPending] = useState(false);
  async function subscribe(event: FormEvent) {
    event.preventDefault(); setPending(true); setMessage(""); setError(false);
    try {
      const response = await fetch(buildApiUrl("/subscribers"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const result = await readResponse<{ mensagem: string }>(response);
      setMessage(result.mensagem); setEmail("");
    } catch (err) { setError(true); setMessage(err instanceof Error ? err.message : "Não foi possível se inscrever."); }
    finally { setPending(false); }
  }
  return <form onSubmit={subscribe} aria-busy={pending} className="mt-8 flex flex-col gap-5">
    <label htmlFor={emailId} className="sr-only">Seu email</label>
    <input id={emailId} type="email" autoComplete="email" maxLength={254} value={email} onChange={event => setEmail(event.target.value)} required disabled={pending} placeholder="Seu email" className="border-b border-current bg-transparent py-2 outline-none" />
    <button disabled={pending} type="submit" className="ml-auto border border-current px-8 py-3 text-xs uppercase tracking-widest disabled:opacity-50">{pending ? "Enviando..." : "Receber"}</button>
    {message && <p role={error ? "alert" : "status"}>{message}</p>}
  </form>;
}
