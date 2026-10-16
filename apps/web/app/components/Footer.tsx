"use client";

import Image from 'next/image';
import CC from '../imgs/CC.png';
import React, { useState } from 'react';
import { buildApiUrl } from '../config/api';
import { readResponse } from '../service/http';
import { site } from '../../lib/site';


export default function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ success?: boolean; message?: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const response = await fetch(buildApiUrl("/subscribers"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({ email }),
      });

      const result = await readResponse<{ mensagem: string }>(response);
      setFeedback({ success: true, message: result.mensagem });
      setEmail('');
    } catch (error) {
      setFeedback({ success: false, message: error instanceof Error ? error.message : 'Erro de conexão. Tente novamente.' });
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
            <p className='uppercase font-bold'>{site.isConfigured ? new URL(site.url).hostname : 'Diorama'}</p>
            {site.issn && <p className='uppercase font-light'>ISSN {site.issn}</p>}
            <Image 
                src={CC} 
                alt="CC" 
                width={100} 
                height={100}
            />
        </div>
        <div className="flex gap-4 text-black">
            {site.instagram && <a href={site.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className=" text-3xl hover:opacity-50 transition-opacity duration-300 cursor-pointer">
              <i className="bi bi-instagram"></i>
            </a>}
            {site.spotify && <a href={site.spotify} target="_blank" rel="noopener noreferrer" aria-label="Spotify" className=" text-3xl hover:opacity-50 transition-opacity duration-300 cursor-pointer">
              <i className="bi bi-spotify"></i>
            </a>}
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
                aria-label="Seu email"
                autoComplete="email"
                maxLength={254}
                disabled={loading}
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
              <p role={feedback.success ? 'status' : 'alert'} className={`text-xs font-mono ${feedback.success ? 'text-green-700' : 'text-red-600'}`}>
                {feedback.message}
              </p>
            )}
          </form>
        </div>
        </footer>
    </>
  );
}
