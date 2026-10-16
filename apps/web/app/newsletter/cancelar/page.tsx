import type { Metadata } from "next";
import { Suspense } from "react";
import { PublicPage } from "../../components/PublicPage";
import { UnsubscribeForm } from "../../components/UnsubscribeForm";

export const metadata: Metadata = { title: "Cancelar inscrição", robots: { index: false, follow: false }, referrer: "no-referrer" };
export default function UnsubscribePage() {
  return <PublicPage title="Cancelar inscrição"><Suspense fallback={<p role="status">Carregando…</p>}><UnsubscribeForm /></Suspense></PublicPage>;
}
