"use client";

import Image from 'next/image';
import CC from '../imgs/CC.png';
import React, { useState } from 'react';


export default function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({

        //   apikey: "CHAVE_AQUI", // colar chave aqui
          subject: "Nova assinatura de Newsletter - Diorama",
          email: email,
          message: `Um novo usuário se inscreveu na newsletter com o e-mail: ${email}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setFeedback({ success: true, message: 'Inscrição realizada com sucesso!' });
        setEmail('');
      } else {
        setFeedback({ success: false, message: 'Erro ao enviar. Tente novamente.' });
      }
    } catch (error) {
      console.error(error);
      setFeedback({ success: false, message: 'Erro de conexão. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };
  return ( 
    <>
        <footer>
        {/* rodapé */}
        <div className='flex justify-between border-b border-black mb-4 p-10'>
          <div className=''>
            <p className='uppercase font-bold'>diorama.org</p>
            <p className='uppercase font-light'>issn 0000-0000</p>
            <Image 
                src={CC} 
                alt="CC" 
                width={100} 
                height={100}
            />
        </div>
        <div className="flex gap-4 text-black">
            <button className=" text-3xl hover:opacity-50 transition-opacity duration-300 cursor-pointer">
              <i className="bi bi-instagram"></i>
            </button>
            <button className=" text-3xl hover:opacity-50 transition-opacity duration-300 cursor-pointer">
              <i className="bi bi-spotify"></i>
            </button>
        </div>   
        </div>      

           {/* newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-8 md:p-12">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl uppercase tracking-wider mb-2">
              Assine nossa newsletter
            </h2>
            <p className="text-neutral-600 text-sm font-sans">
              Receba novidades editoriais, chamadas de textos e lançamentos diretamente no seu e-mail.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="email" 
                name="email"
                required
                placeholder="Seu melhor e-mail..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white rounded-md border border-black px-4 py-3 text-black placeholder:text-neutral-400 outline-none flex-1 text-sm font-sans"
              />
              <button 
                type="submit"
                disabled={loading}
                className="bg-black rounded-full font-bold text-white hover:bg-neutral-800 transition-colors uppercase text-xs tracking-widest px-6 py-3 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Cadastrar'}
              </button>
            </div>
            {feedback && (
              <p className={`text-xs font-mono ${feedback.success ? 'text-green-700' : 'text-red-600'}`}>
                {feedback.message}
              </p>
            )}
          </form>
        </div>
        </footer>
    </>
  );
}