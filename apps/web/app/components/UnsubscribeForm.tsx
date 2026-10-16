"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { buildApiUrl } from "../config/api";
import { readResponse } from "../service/http";

export function UnsubscribeForm() {
  const token = useSearchParams().get("token");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  async function cancel() {
    setPending(true); setError("");
    try {
      const response = await fetch(buildApiUrl("/subscribers/cancelar"), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      await readResponse<{ mensagem: string }>(response);
      setDone(true);
    } catch (err) { setError(err instanceof Error ? err.message : "Não foi possível cancelar a inscrição."); }
    finally { setPending(false); }
  }
  if (!token) return <p role="alert">Link de cancelamento incompleto. Use o link enviado no rodapé da newsletter.</p>;
  return <div className="max-w-xl space-y-6">{done ? <><p role="status">Sua inscrição foi cancelada. Você não receberá novos envios da newsletter.</p><Link href="/newsletter" className="underline">Voltar à newsletter →</Link></> : <><p>Confirme para deixar de receber a newsletter da Diorama.</p><button type="button" className="border border-black bg-black px-6 py-3 text-sm text-white hover:bg-neutral-800 disabled:opacity-50" disabled={pending} onClick={cancel}>{pending ? "Cancelando..." : "Confirmar cancelamento"}</button><Link href="/home" className="underline block">Manter inscrição e voltar ao início</Link>{error && <p role="alert">{error}</p>}</>}</div>;
}
