import Link from "next/link";

interface EditarEdicaoPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditarEdicaoPage({ params }: EditarEdicaoPageProps) {
  const { id } = await params;

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-serif text-3xl">Editar Edição</h1>
      <p className="mt-3 text-sm text-neutral-600">Fluxo de edição da edição {id} em implementação.</p>
      <Link href="/pages/dashboard" className="mt-6 inline-block text-sm font-semibold text-blue-700 hover:underline">
        Voltar ao painel
      </Link>
    </main>
  );
}
