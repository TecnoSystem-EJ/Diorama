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
                <h2 className='font-bold uppercase mb-8 text-4xl'>apoie</h2>

                <div>
                  <p className="text-neutral-700 leading-relaxed text-lg text-justify">
                    A escassez de publicações que abordem de modo transdisciplinar questões e alianças urgentes para pensar a vida compartilhada neste mundo e a construção de outros mundos possíveis colide com a dificuldade de se financiar um projeto que aposta em modelos produtivos alternativos – sem publicidade, sem fins lucrativos e sem copyright. <br /> <br />

Ao longo dos últimos anos, a DIORAMA tem recorrido a editais (cada vez mais escassos) de subvenção pública, a modelos colaborativos de financiamento (como a campanha promovida pela revista em 2014 na plataforma Catarse) e à expansão de sua rede de leitores da revista impressa para manter suas atividades.
<br /> <br />
<span className='font-bold text-black'>Se você se identifica com o nosso projeto e tem interesse em nos apoiar, como pessoa física ou jurídica, entre em contato! Ficaremos felizes em discutir modelos e possibilidades de contrapartida.</span>
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