"use client";

import React, { useState } from 'react';
import Link from "next/link";

export default function Header() {
  // MODAIS
  const [modalmenu, setModalmenu] = useState(false);
  const [modalsearch, setModalsearch] = useState(false);

  return (
    <>
      <header className="w-full mb-8">
        <div className="p-4 flex justify-between items-center">
            <div className="flex gap-4">
                <button 
                    onClick={() => setModalmenu(!modalmenu)}
                    className="text-black text-2xl hover:opacity-50 transition-opacity duration-300 cursor-pointer"    
                >
                    <i className="bi bi-list"></i>
                </button>
                <button 
                    onClick={() => setModalsearch(!modalsearch)}
                    className="text-black text-2xl hover:opacity-50 transition-opacity duration-300 cursor-pointer"    
                >
                    <i className="bi bi-search"></i>
                </button>
            </div>

            <div className="flex gap-8">
                <p className='cursor-pointer hover:opacity-50 transition-opacity'>NEWSLETTER</p>
            </div>
        </div>

        <div className="text-black flex justify-between items-center border-b border-black px-4 pb-4 pt-2">
            <div>
                <h1 className="font-serif text-black text-5xl uppercase tracking-[0.15em] md:text-7xl"
                >
                    <Link href="/home">Diorama</Link>
                </h1>
            </div>
            <div className="flex text-black uppercase gap-8 items-center font-bold">
                <p className="cursor-pointer hover:opacity-50 transition-opacity"><Link href="/#">revista</Link></p>
                <p className="cursor-pointer hover:opacity-50 transition-opacity"><Link href="/#">livros</Link></p>
                <p className="cursor-pointer hover:opacity-50 transition-opacity"><Link href="/blog">extra!</Link></p>
            </div>
        </div>
      </header>

      {/* MODAL MENU */}
      {modalmenu && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="w-full max-w-9xl p-6 rounded-md shadow-md bg-green-700">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-serif text-white text-5xl uppercase tracking-[0.15em] md:text-7xl">
                        Diorama
                    </h1>

                    <div className="flex gap-4">
                        <button onClick={() => setModalmenu(false)}
                            className="text-white text-6xl hover:opacity-50 transition-opacity duration-300 cursor-pointer"    
                        >
                            <i className="bi bi-x"></i>
                        </button>
                        <button onClick={() => { setModalmenu(false); setModalsearch(!modalsearch); }}
                                className="text-white text-3xl hover:opacity-50 transition-opacity duration-300 cursor-pointer"    
                        >
                            <i className="bi bi-search"></i>
                        </button>
                    </div>
                </div>

                <div className="text-white text-xl uppercase font-bold">
                    <div className="grid grid-cols-2 items-center mb-8 border-b border-white pb-2 w-full">
                        <p>Revista</p>
                        <p>Livros</p>
                    </div>
                    <div className="grid grid-cols-2 items-center mb-8 border-b border-white pb-2 w-full">
                        <p className='hover:opacity-50 transition-opacity duration-300 cursor-pointer'><Link href="/blog">extra!</Link></p>
                        <p>Loja</p>
                    </div>
                    <div className="grid grid-cols-2 items-center mb-8 border-b border-white pb-2 w-full">
                        <p className='hover:opacity-50 transition-opacity duration-300 cursor-pointer'><Link href="/about">Sobre</Link></p>
                        <p className='hover:opacity-50 transition-opacity duration-300 cursor-pointer'><Link href="/about/contato">Contato</Link></p>
                    </div>
                    <div className="grid grid-cols-2 items-center mb-8 border-b border-white pb-2 w-full">
                        <p className='hover:opacity-50 transition-opacity duration-300 cursor-pointer'><Link href="/about/ondeencontrar">Onde encontrar</Link></p>
                    </div>
                </div>

                <div className="flex justify-between gap-4 mt-8">
                    <div className="flex gap-4">
                        <button className="text-white text-3xl hover:opacity-50 transition-opacity duration-300 cursor-pointer">
                            <i className="bi bi-instagram"></i>
                        </button>
                        <button className="text-white text-3xl hover:opacity-50 transition-opacity duration-300 cursor-pointer">
                            <i className="bi bi-spotify"></i>
                        </button>
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
            <div className="fixed inset-0 bg-white text-black z-50 p-8 flex flex-col justify-between animate-fadeIn">
                <div className="flex justify-between items-center">
                    <span className="font-mono text-xs uppercase tracking-widest">Busca no acervo</span>
                    <button 
                    onClick={() => setModalsearch(false)}
                    className="text-black text-3xl hover:opacity-50 transition-opacity cursor-pointer"
                    >
                    <i className="bi bi-x"></i>
                    </button>
                </div>
                <div className="max-w-2xl w-full mx-auto">
                    <input 
                    type="text" 
                    placeholder="Digite o que procura..." 
                    className="w-full text-3xl md:text-5xl font-serif border-b border-black pb-4 outline-none bg-transparent placeholder:text-neutral-300"
                    autoFocus 
                    />
                </div>
                <div className="font-mono text-xs text-neutral-400 text-center">Pressione ESC para fechar</div>
            </div>
      )}
    </>
  );
}