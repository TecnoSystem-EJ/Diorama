"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from "next/link";
import { useAuth } from '../hooks/useAuth';
import { site } from '../../lib/site';

export default function Header() {
  // MODAIS
  const [modalmenu, setModalmenu] = useState(false);
  const [modalsearch, setModalsearch] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!modalmenu && !modalsearch) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const root = modalRef.current;
    const focusable = () => Array.from(root?.querySelectorAll<HTMLElement>('a[href], button:not(:disabled), input:not(:disabled)') ?? []);
    (root?.querySelector<HTMLInputElement>('input') ?? focusable()[0])?.focus();
    document.body.style.overflow = 'hidden';
    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') { setModalmenu(false); setModalsearch(false); }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [modalmenu, modalsearch]);

  return (
    <>
      <header className="w-full mb-8">
        <div className="p-4 flex justify-between items-center">
            <div className="flex gap-4">
                <button 
                    type="button" aria-label="Abrir menu" aria-expanded={modalmenu} aria-controls="menu-mobile" disabled={isLoading}
                    onClick={() => setModalmenu(!modalmenu)}
                    className="text-black text-2xl hover:opacity-50 transition-opacity duration-300 cursor-pointer"    
                >
                    <i className="bi bi-list"></i>
                </button>
                <button 
                    type="button" aria-label="Buscar no acervo" aria-expanded={modalsearch} disabled={isLoading}
                    onClick={() => setModalsearch(!modalsearch)}
                    className="text-black text-2xl hover:opacity-50 transition-opacity duration-300 cursor-pointer"    
                >
                    <i className="bi bi-search"></i>
                </button>
            </div>

            <div className="flex gap-8">
                <Link href="/newsletter" className='cursor-pointer hover:opacity-50 transition-opacity'>NEWSLETTER</Link>
                <Link href={isAuthenticated ? '/pages/dashboard' : '/login'} className='cursor-pointer hover:opacity-50 transition-opacity'>{isAuthenticated ? 'PAINEL' : 'LOGIN'}</Link>
            </div>
        </div>

        <div className="text-black flex flex-col gap-6 sm:flex-row sm:justify-between items-baseline border-b border-black px-4 pb-4 pt-2">
            <div>
                <h1 className="font-serif text-black text-5xl uppercase tracking-[0.15em] md:text-7xl"
                >
                    <Link href="/home">Diorama</Link>
                </h1>
            </div>
            <div className="flex flex-wrap text-black uppercase gap-4 sm:gap-8 text-xl font-bold items-baseline">
                <p className="font-light cursor-pointer hover:font-black hover:opacity-80 transition-opacity"><Link href="/edicoes">revista</Link></p>
                <p className="font-light cursor-pointer hover:font-black hover:opacity-80 transition-opacity"><Link href="/projetos">projetos</Link></p>
                <p className="font-light cursor-pointer hover:font-black hover:opacity-80 transition-opacity"><Link href="/blog">extra!</Link></p>
            </div>
        </div>
      </header>

      {/* MODAL MENU */}
      {modalmenu && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div ref={modalRef} id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu da Diorama" className="w-full max-w-9xl max-h-[90dvh] overflow-y-auto p-6 rounded-md shadow-md bg-green-700">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-serif text-white text-3xl uppercase tracking-[0.15em] sm:text-5xl md:text-7xl">
                        Diorama
                    </h1>

                    <div className="flex gap-4">
                        <button type="button" aria-label="Fechar menu" onClick={() => setModalmenu(false)}
                            className="text-white text-4xl sm:text-6xl hover:opacity-50 transition-opacity duration-300 cursor-pointer"
                        >
                            <i className="bi bi-x"></i>
                        </button>
                        <button type="button" aria-label="Buscar no acervo" onClick={() => { setModalmenu(false); setModalsearch(true); }}
                                className="text-white text-3xl hover:opacity-50 transition-opacity duration-300 cursor-pointer"    
                        >
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>

                <nav aria-label="Navegação do celular" className="text-white text-base sm:text-xl uppercase font-bold" onClick={event => { if ((event.target as HTMLElement).closest('a')) setModalmenu(false); }}>
                    <div className="grid grid-cols-2 items-center mb-8 border-b border-white pb-2 w-full">
                        <Link href="/edicoes">Revista</Link>
                        <span aria-disabled="true">Livros</span>
                    </div>
                    <div className="grid grid-cols-2 items-center mb-8 border-b border-white pb-2 w-full">
                        <p className='hover:opacity-50 transition-opacity duration-300 cursor-pointer'><Link href="/blog">extra!</Link></p>
                        <span aria-disabled="true">Loja</span>
                    </div>
                    <div className="grid grid-cols-2 items-center mb-8 border-b border-white pb-2 w-full">
                        <p className='hover:opacity-50 transition-opacity duration-300 cursor-pointer'><Link href="/about">Sobre</Link></p>
                        <p className='hover:opacity-50 transition-opacity duration-300 cursor-pointer'><Link href="/about/contato">Contato</Link></p>
                    </div>
                    <div className="grid grid-cols-2 items-center mb-8 border-b border-white pb-2 w-full">
                        <p className='hover:opacity-50 transition-opacity duration-300 cursor-pointer'><Link href="/about/ondeencontrar">Onde encontrar</Link></p>
                    </div>
                </nav>

                <div className="flex justify-between gap-4 mt-8">
                    <div className="flex gap-4">
                        {site.instagram && <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white text-3xl hover:opacity-50 transition-opacity duration-300 cursor-pointer">
                            <i className="bi bi-instagram"></i>
                        </a>}
                        {site.spotify && <a href={site.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify" className="text-white text-3xl hover:opacity-50 transition-opacity duration-300 cursor-pointer">
                            <i className="bi bi-spotify"></i>
                        </a>}
                    </div>
                    <div>
                        <Link href="/newsletter" onClick={() => setModalmenu(false)}>
                            <p className="italic uppercase font-light border border-white p-4 text-white rounded-full hover:bg-white hover:text-green-600 transition-all duration-300 cursor-pointer inline-block">newsletter <i className="bi bi-arrow-down-right"></i></p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* MODAL BUSCA */}
      {modalsearch && (
            <div ref={modalRef} role="dialog" aria-modal="true" aria-label="Pesquisar no acervo" className="fixed inset-0 bg-white text-black z-50 p-8 flex flex-col justify-between animate-fadeIn">
                <div className="flex justify-between items-center">
                    <span className="font-mono text-xs uppercase tracking-widest">Busca no acervo</span>
                    <button 
                    type="button" aria-label="Fechar busca"
                    onClick={() => setModalsearch(false)}
                    className="text-black text-3xl hover:opacity-50 transition-opacity cursor-pointer"
                    >
                    <i className="bi bi-x"></i>
                    </button>
                </div>
                <form action="/busca" role="search" className="max-w-2xl w-full mx-auto">
                    <input 
                    type="search" name="q" required minLength={2} maxLength={150} aria-label="Busca no acervo"
                    placeholder="Digite o que procura..." 
                    className="w-full text-3xl md:text-5xl font-serif border-b border-black pb-4 outline-none bg-transparent placeholder:text-neutral-300"
                    autoFocus 
                    />
                    <button type="submit" className="mt-6 border border-black px-6 py-3 uppercase text-xs tracking-widest">Buscar</button>
                </form>
                <div className="font-mono text-xs text-neutral-400 text-center">Pressione ESC para fechar</div>
            </div>
      )}
    </>
  );
}
