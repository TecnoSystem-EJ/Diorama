import { publicApi } from "../../lib/publicApi";
import { EditorialContent } from "../components/PublicPage";



import Link from "next/link";


import Header from "../components/Header";
import Footer from "../components/Footer";

const About = async () => {
  const { textoCompletoHtml } = await publicApi<{ textoCompletoHtml: string }>("/sobre-nos");
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
                        <li><Link href="/about/equipe" className="hover:italic duration-500 transition-all">equipe</Link></li>
                        <li><Link href="/about/colaborar" className="hover:italic duration-500 transition-all">como colaborar</Link></li>
                        <li><Link href="/about/ondeencontrar" className="hover:italic duration-500 transition-all">onde encontrar</Link></li>
                        <li><Link href="/about/contato" className="hover:italic duration-500 transition-all">contato</Link></li>
                        <li><Link href="/about/apoie" className="hover:italic duration-500 transition-all">apoie</Link></li>
                    </ul>
                </aside>

                {/* texto principal */}
                <section className="md:col-span-2 space-y-6">
                <h1 className="font-serif text-5xl md:text-6xl uppercase tracking-[0.1em] font-light">
                    A DIORAMA
                </h1>
                <div className="w-24 h-[1px] bg-black my-4"></div>
                
                <EditorialContent html={textoCompletoHtml || "<p>A Diorama é uma plataforma editorial sobre cultura, natureza e novas formas de imaginar futuros.</p>"} />
                </section>
            </section>
        </main>
        <Footer />
    </div>
  )
}

export default About;