"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  const [position, setPosition] = useState({
    x: 50,
    y: 50,
  });


  function handleMouseMove(
    e: React.MouseEvent<HTMLDivElement>
  ) {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;

    setPosition({
      x,
      y,
    });
  }


  return (
    <main
      onMouseMove={handleMouseMove}
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#F4F1EA]
      "
    >

      {/* IMAGEM DE FUNDO PARALLAX */}
      <div
        className="
          absolute
          inset-0
          scale-110
          transition-transform
          duration-700
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=2000')",

          backgroundSize: "cover",

          backgroundPosition:
            `${position.x}% ${position.y}%`,
        }}
      />


      {/* OVERLAY */}
      <div
        className="
          absolute
          inset-0
          bg-black/45
        "
      />


      {/* CONTEÚDO */}
      <div
        className="
          relative
          z-10
          min-h-screen
          text-[#F4F1EA]
        "
      >


        {/* MENU LATERAL */}
        <aside
          className="
            absolute
            left-8
            top-1/2
            -translate-y-1/2
          "
        >

          <nav
            className="
              flex
              flex-col
              gap-6
              text-lg
              uppercase
              tracking-[0.25em]
            "
          >

            <Link
              href="/projetos"
              className="
                hover:opacity-50
                transition
              "
            >
              Projetos
            </Link>


            <Link
              href="/sobre"
              className="
                hover:opacity-50
                transition
              "
            >
              Sobre Nós
            </Link>


            <Link
              href="/edicoes"
              className="
                hover:opacity-50
                transition
              "
            >
              Edições
            </Link>


            <Link
              href="/blog"
              className="
                hover:opacity-50
                transition
              "
            >
              Blog
            </Link>


          </nav>

        </aside>




        {/* CENTRO HERO */}
        <section
          className="
            flex
            min-h-screen
            flex-col
            items-center
            justify-center
            text-center
            px-6
          "
        >


          {/* LOGO */}
          <h1
            className="
              font-serif
              text-5xl
              md:text-7xl
              uppercase
              tracking-[0.15em]
            "
          >
            Diorama
          </h1>


          <p
            className="
              mt-4
              max-w-md
              text-sm
              text-white/70
              tracking-wide
            "
          >
            Uma plataforma editorial sobre cultura,
            natureza e novas formas de imaginar futuros.
          </p>




          {/* NEWSLETTER */}
          <div
            className="
              mt-20
              w-full
              max-w-md
            "
          >

            <h2
              className="
                font-serif
                text-xl
                md:text-2xl
                leading-relaxed
              "
            >
              Receba o Núcleo por email,
              <br />
              <span className="italic">
                100% de graça
              </span>
            </h2>



            <form
              className="
                mt-8
                flex
                flex-col
                gap-5
              "
            >

              <input
                type="email"
                placeholder="Seu email"
                className="
                  border-b
                  border-white/40
                  bg-transparent
                  py-3
                  text-sm
                  outline-none
                  placeholder:text-white/50
                  focus:border-white
                "
              />


              <button
                className="
                  mx-auto
                  border
                  border-white
                  px-8
                  py-3
                  text-[10px]
                  uppercase
                  tracking-[0.3em]
                  hover:bg-white
                  hover:text-black
                  transition
                "
              >
                Receber
              </button>


            </form>



            {/* LINKS */}
            <div
              className="
                mt-8
                flex
                justify-center
                gap-8
                text-[10px]
                uppercase
                tracking-widest
              "
            >

              <Link
                href="#"
                className="
                  border-b
                  border-white/50
                  pb-1
                  hover:border-white
                "
              >
                Conhecer as Newsletters
              </Link>


              <Link
                href="/login"
                className="
                  border-b
                  border-white/50
                  pb-1
                  hover:border-white
                "
              >
                Fazer Login
              </Link>

            </div>


          </div>


        </section>


      </div>


    </main>
  );
}