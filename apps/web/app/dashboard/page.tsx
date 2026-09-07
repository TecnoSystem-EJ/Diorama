"use client";

import { useState } from "react";
import { PainelSubNav, type DashboardTab } from "../components/dashboard/SubNav";
import { EdicaoSection } from "../components/dashboard/sections/EdicaoSection";
import { MateriaSection } from "../components/dashboard/sections/MateriaSection";
import { BlogSection } from "../components/dashboard/sections/BlogSection";
import { ProjetoSection } from "../components/dashboard/sections/ProjetoSection";
import { SobreSection } from "../components/dashboard/sections/SobreSection";

const SECTIONS: Record<DashboardTab, () => React.JSX.Element> = {
  edicoes: EdicaoSection,
  materias: MateriaSection,
  blog: BlogSection,
  projetos: ProjetoSection,
  sobre: SobreSection,
};

export default function DashboardRoute() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("edicoes");

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