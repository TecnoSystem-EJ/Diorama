export interface Artigo {
  id: number | string;
  titulo: string;
  descricao: string;
  imagem: string;
  slug: string;
}

export async function getArtigos(): Promise<Artigo[]> {
  return [
    {
      id: 1,
      titulo: "Arquitetura da Paisagem",
      descricao: "Texto de Ana Morim, Haroldo Cavalcante e José Diniz. Projeto Paubrasilia, fotografias de José Diniz.",
      imagem: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop",
      slug: "arquitetura-da-paisagem",
    },
    {
      id: 2,
      titulo: "Cartografias Contemporâneas",
      descricao: "Texto de Ana Morim, Haroldo Cavalcante e José Diniz. Projeto Paubrasilia, fotografias de José Diniz.",
      imagem: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=800&auto=format&fit=crop",
      slug: "cartografias-contemporaneas",
    },
  ];
}