import type { Metadata } from "next";
import React from 'react'
import Link from "next/link";
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const equipe = () => {
  return (
    <div className="p-4">
      <Header />
        <main>
          <section className="p-12 grid grid-cols-1 md:grid-cols-3 gap-12 my-8 items-start w-full">
        
                {/* menu lateral */}
                <aside className="space-y-6 md:border-r md:border-black/20 md:pr-8">
                    <ul className="space-y-4 text-2xl uppercase text-justify">
                        <li><Link href="/about" className="hover:italic duration-500 transition-all">a diorama</Link></li>
                        <li><Link href="/about/equipe" className="hover:italic duration-500 transition-all">equipe</Link></li>
                        <li><Link href="/about/colaborar" className="hover:italic duration-500 transition-all">como colaborar</Link></li>
                        <li><Link href="/about/ondeencontrar" className="hover:italic duration-500 transition-all">onde encontrar</Link></li>
                        <li><Link href="/about/contato" className="hover:italic duration-500 transition-all">contato</Link></li>
                        <li><Link href="/about/apoie" className="hover:italic duration-500 transition-all">apoie</Link></li>
                    </ul>
                </aside>

                {/* texto principal */}
                <section className="md:col-span-2 space-y-6">
                <h2 className='font-bold uppercase mb-8 text-4xl'>equipe</h2>

                <div>
                  <h3 className="font-bold uppercase mb-0">Editores</h3>
                  <p className="text-neutral-700 leading-relaxed text-lg">A composição da equipe editorial será divulgada após a confirmação dos créditos oficiais.</p>
                </div>
                </section>
            </section>
        </main>
      <Footer />
    </div>
  )
}

export default equipe

export const metadata: Metadata = { title: "Equipe", description: "Créditos e informações sobre a equipe editorial da Diorama.", alternates: { canonical: "/about/equipe" } };
