import type { Metadata } from "next";
import React from 'react'
import Link from "next/link";
import Header from '../../components/Header'
import Footer from '../../components/Footer'

const page = () => {
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
                <h2 className='font-bold uppercase mb-8 text-4xl'>como colaborar</h2>

                <div>
                  <p className="text-neutral-700 leading-relaxed text-lg text-justify">A DIORAMA é uma revista que se propõe a inventar uma outra forma de escrita e de leitura, densa e engajada, mas não acadêmica e acessível a um público amplo.
                    Publicamos ensaios visuais (desenhos, fotografias, ilustrações, etc) e textos entre 3 e 4 mil palavras e estamos abertos a propostas. Antes de submeter um ensaio, sugerimos um passeio pelas edições já publicadas.
                    Se tivermos interesse em publicar seu ensaio, responderemos em até 60 dias.
                  </p>
                </div>
                </section>
            </section>
        </main>
      <Footer />
    </div>
  )
}

export default page
export const metadata: Metadata = { title: "Como colaborar", description: "Conheça o acervo e acompanhe as chamadas editoriais da Diorama.", alternates: { canonical: "/about/colaborar" } };
