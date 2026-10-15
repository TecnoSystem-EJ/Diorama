"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PainelSubNav, type DashboardTab } from "../../components/dashboard/SubNav";
import { EdicaoSection } from "../../components/dashboard/sections/EdicaoSection";
import { BlogSection } from "../../components/dashboard/sections/blog/BlogSection";
import { SobreSection } from "../../components/dashboard/sections/SobreSection";
import { ProjetosSection } from "../../components/dashboard/sections/projeto/ProjetoSection";
import { MateriasSection } from "../../components/dashboard/sections/materia/MateriaSection";
import { useAuth } from "../../hooks/useAuth";

const SECTIONS: Record<DashboardTab, () => React.JSX.Element> = {
  edicoes: EdicaoSection,
  materias: MateriasSection,
  blog: BlogSection,
  projetos: ProjetosSection,
  sobre: SobreSection,
};

export default function DashboardRoute() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("edicoes");
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.replace("/pages/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <p className="px-6 py-10 text-sm text-neutral-500">Validando sessão...</p>;
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  const ActiveSection = SECTIONS[activeTab];

  return (
    <div className="min-h-screen bg-white">
      <PainelSubNav activeTab={activeTab} onChangeTab={setActiveTab} />
      <main className="max-w-6xl mx-auto px-6 py-10">
        <ActiveSection />
      </main>
    </div>
  );
}
