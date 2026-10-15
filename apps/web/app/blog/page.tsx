import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getArtigos } from "../../lib/posts";

export default async function Page() {
  const artigos = await getArtigos();

  return (
    <>
      <Header />
      
      <main className="p-8 max-w-7xl mx-auto min-h-[70vh]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {artigos.map((artigo) => (
            <article key={artigo.id} className="flex flex-col justify-between border border-neutral-200 p-4 rounded-md">
              <div>
                <div className="w-full aspect-3/4 relative mb-4 bg-neutral-100 overflow-hidden">
                  <Image 
                    src={artigo.imagem} 
                    alt={artigo.titulo}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <h2 className="font-serif text-xl uppercase tracking-wide mb-2">
                  {artigo.titulo}
                </h2>

                <p className="text-neutral-600 text-sm font-sans mb-4 line-clamp-3">
                  {artigo.descricao}
                </p>
              </div>

              <Link 
                href={`/blog/${artigo.slug}`}
                className="inline-block uppercase font-bold text-xs tracking-widest border border-black py-2 px-4 text-center hover:bg-black hover:text-white transition-colors duration-300"
              >
                Ler artigo <i className="bi bi-arrow-right"></i>
              </Link>
            </article>
          ))}
        </div>
      </main>

        <Footer />
    </>
  );
}