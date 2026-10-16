import Link from "next/link";
import { PublicPage } from "./components/PublicPage";

export default function NotFound() {
  return <PublicPage title="Página não encontrada"><p className="mb-8">Esse conteúdo não está disponível ou foi removido.</p><Link className="border border-black bg-black px-6 py-3 text-sm text-white hover:bg-neutral-800 disabled:opacity-50" href="/home">Voltar ao início</Link></PublicPage>;
}
