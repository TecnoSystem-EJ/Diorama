import type { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

export function PublicPage({ title, children }: { title: string; children: ReactNode }) {
  return <div className="min-h-screen bg-[#F4F1EA]">
    <Header />
    <main className="mx-auto max-w-6xl px-6 py-12 min-h-[65vh]">
      <h1 className="font-serif text-4xl md:text-6xl mb-10">{title}</h1>
      {children}
    </main>
    <Footer />
  </div>;
}

export function EditorialContent({ html }: { html: string }) {
  return <div className="editorial-content max-w-3xl text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: html }} />;
}
