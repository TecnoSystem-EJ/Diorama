import type { Metadata } from "next";
import { PublicPage } from "../components/PublicPage";
import { NewsletterForm } from "../components/NewsletterForm";

export const metadata: Metadata = { title: "Newsletter", description: "Receba novidades editoriais, novas edições e chamadas da Diorama por e-mail.", alternates: { canonical: "/newsletter" } };
export default function NewsletterPage() {
  return <PublicPage title="Newsletter"><div className="max-w-xl"><p className="font-serif text-2xl mb-5">Acompanhe a Diorama de perto.</p><p className="leading-relaxed text-neutral-600">Cadastre seu e-mail para receber novas edições, matérias, ensaios, projetos e chamadas editoriais. A inscrição é gratuita.</p><NewsletterForm /></div></PublicPage>;
}
