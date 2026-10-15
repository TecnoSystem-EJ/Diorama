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
                <h2 className='font-bold uppercase mb-8 text-4xl'>onde encontrar</h2>

                <div className='grid-cols-2 md:grid gap-4'>
                  <div>
                    <h5 className="font-bold uppercase mb-1">
                       Livraria da travessa IMS 
                    </h5>
                    <p className="text-neutral-700 leading-relaxed text-lg text-justify">
                        São Paulo
                    </p>
                    <a className='hover:underline duration-1000 ease-in-out' href="https://www.instagram.com/livrariadatravessa/" target="_blank" rel="noopener noreferrer">
                        instagram.com/livrariadatravessa
                    </a>
                  </div>
                  <div>
                    <h5 className="font-bold uppercase mb-1">
                          Livraria da travessa Ipanema
                    </h5>
                    <p className="text-neutral-700 leading-relaxed text-lg text-justify">
                        Rio de Janeiro
                    </p>
                    <a className='hover:underline duration-1000 ease-in-out' href="https://www.instagram.com/livrariadatravessa/" target="_blank" rel="noopener noreferrer">
                        instagram.com/livrariadatravessa
                    </a>
                  </div>
                </div>
                <p className="font-bold">Se você tem uma livraria e deseja vender nossos produtos, entre em contato!</p>
                </section>
            </section>
        </main>
      <Footer />
    </div>
  )
}

export default page