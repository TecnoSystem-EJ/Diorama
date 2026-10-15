"use client";

import React, { useState } from 'react';
import Link from "next/link";
import CC from '../imgs/CC.png';
import Image from 'next/image';
import Header from "../components/Header";
import Footer from "../components/Footer";

const About = () => {
  return (
    <div className="p-4">
        <main>
            <Header />
            {/* conteúdo */}
            <section className="p-12 grid grid-cols-1 md:grid-cols-3 gap-12 my-8 items-start w-full">
        
                {/* menu lateral */}
                <aside className="space-y-6 md:border-r md:border-black/20 md:pr-8">
                    <ul className="space-y-4 text-2xl uppercase text-justify">
                        <li><Link href="/about" className="hover:italic duration-500 transition-all">a diorama</Link></li>
                        <li><Link href="about/equipe" className="hover:italic duration-500 transition-all">equipe</Link></li>
                        <li><Link href="/sobre" className="hover:italic duration-500 transition-all">como colaborar</Link></li>
                        <li><Link href="/contato" className="hover:italic duration-500 transition-all">onde encontrar</Link></li>
                        <li><Link href="/contato" className="hover:italic duration-500 transition-all">contato</Link></li>
                        <li><Link href="/contato" className="hover:italic duration-500 transition-all">apoie</Link></li>
                    </ul>
                </aside>

                {/* texto principal */}
                <section className="md:col-span-2 space-y-6">
                <h1 className="font-serif text-5xl md:text-6xl uppercase tracking-[0.1em] font-light">
                    A DIORAMA
                </h1>
                <div className="w-24 h-[1px] bg-black my-4"></div>
                
                <div className="space-y-4 text-neutral-700 leading-relaxed font-sans text-lg">
                    <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                    <p>
                    Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.
                    </p>
                </div>
                </section>
            </section>
        </main>
        <Footer />
    </div>
  )
}

export default About;