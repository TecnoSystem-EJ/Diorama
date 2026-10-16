"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-3xl p-10"><h1 className="font-serif text-3xl mb-6">Não foi possível carregar esta página.</h1><p className="mb-6">Verifique sua conexão e tente novamente.</p><button onClick={reset} className="border border-black px-6 py-3">Tentar novamente</button></main>;
}
