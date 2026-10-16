"use client";

import { useState } from "react";
import Link from "next/link";
import { NewsletterForm } from "../components/NewsletterForm";
import { useEditions } from "../hooks/useEdicao";

export default function Home() {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [aberto, setAberto] = useState(false);
  const { editions, error: editionsError } = useEditions();

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    setPosition({ x, y });
  }

  return (
    <main
      onMouseMove={handleMouseMove}
      className="relative min-h-screen overflow-hidden bg-[#F4F1EA]"
    >
      {/* IMAGEM DE FUNDO PARALLAX */}
      <div
        className="absolute inset-0 scale-110 transition-transform duration-700"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2000')",
          backgroundSize: "cover",
          backgroundPosition: `${position.x}% ${position.y}%`,
        }}
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/45" />

      {/* CONTEÚDO */}
      <div className="relative z-10 min-h-screen text-[#F4F1EA]">
        {/* LOGO + MENU + NEWSLETTER */}
        <div className="relative mx-auto flex w-full max-w-[1400px] py-20 justify-between px-6 md:px-12 flex-col gap-12 md:flex-row">
          
          {/* LOGO + MENU */}
          <div>
            <h1 className="font-serif text-5xl uppercase tracking-[0.15em] md:text-7xl">
              Diorama
            </h1>

            <p className="mt-4 max-w-md text-sm tracking-wide text-white/70">
              Uma plataforma editorial sobre cultura, natureza e novas formas
              de imaginar futuros.
            </p>

            {/* MENU */}
            <aside className="mt-10">
              <nav className="flex flex-col gap-6 text-lg uppercase tracking-[0.25em]">

                {/* EDIÇÕES */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setAberto(!aberto)}
                    className="flex items-center gap-3 transition-opacity duration-300 hover:opacity-50"
                  >
                    EDIÇÕES

                    <i
                      className={`bi ${
                        aberto
                          ? "bi-caret-up-fill"
                          : "bi-caret-down-fill"
                      }`}
                    />
                  </button>

                  {/* SUBMENU */}
                  <div
                    className={`ml-6 overflow-hidden ${
                      aberto
                        ? "mt-4 max-h-96 opacity-100 transition-all duration-700 ease-out"
                        : "mt-0 max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex flex-col gap-4 text-sm normal-case tracking-[0.15em]">
                      <Link href="/edicoes">Todas as edições</Link>
                      {editions.map(edition => <Link key={edition.id} href={`/edicoes/${edition.id}`}>{edition.title}</Link>)}
                      {editionsError && <p role="alert" className="text-sm">{editionsError}</p>}
                    </div>
                  </div>
                </div>

                {/* BLOG */}
                <Link
                  href="/blog"
                  className="transition-opacity duration-300 hover:opacity-50"
                >
                  BLOG
                </Link>

                {/* PROJETOS */}
                <Link
                  href="/projetos"
                  className="transition-opacity duration-300 hover:opacity-50"
                >
                  PROJETOS
                </Link>

                {/* SOBRE NÓS */}
                <Link
                  href="/about"
                  className="transition-opacity duration-300 hover:opacity-50"
                >
                  SOBRE NÓS
                </Link>

              </nav>
            </aside>

            <div className='mt-8 flex gap-3'>
              <button>
                <i className="bi bi-instagram cursor:pointer hover:opacity-50"></i>
              </button>

              <button>
                <i className="bi bi-facebook cursor:pointer hover:opacity-50"></i>
              </button>

              <button>
                <i className="bi bi-twitter-x cursor:pointer hover:opacity-50"></i>
              </button>
            </div>

            {/* FOOTER */}
            <footer className="mt-12 text-left">
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                © {new Date().getFullYear()} Diorama 
                <br />
                Projetado e Desenvolvido por TecnoSystem
              </p>
            </footer>
          </div>

          {/* NEWSLETTER */}
          <div className="w-full max-w-md mb-4">
            <div className="text-right">

              <h2 className="font-serif text-xl leading-relaxed md:text-2xl">
                Receba o Núcleo por email,
                <br />
                <span className="italic">100% de graça</span>
              </h2>

              <NewsletterForm />

              <div className="mt-8 flex justify-end gap-8 text-[10px] uppercase tracking-widest">

                <Link
                  href="/newsletter"
                  className="border-b border-white/50 pb-1 hover:border-white"
                >
                  CONHECER AS NEWSLETTERS
                </Link>

                <Link
                  href="/login"
                  className="border-b border-white/50 pb-1 hover:border-white"
                >
                  FAZER LOGIN
                </Link>

              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}