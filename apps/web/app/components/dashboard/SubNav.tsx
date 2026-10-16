"use client";

import { useAuth } from "../../hooks/useAuth";

export type DashboardTab = "edicoes" | "materias" | "blog" | "projetos" | "sobre" | "newsletter";

const TABS: { label: string; value: DashboardTab }[] = [
  { label: "EDIÇÕES BASE", value: "edicoes" },
  { label: "MATÉRIAS DAS EDIÇÕES", value: "materias" },
  { label: "BLOG", value: "blog" },
  { label: "PROJETOS", value: "projetos" },
  { label: "SOBRE", value: "sobre" },
  { label: "NEWSLETTER", value: "newsletter" },
];

interface PainelSubNavProps {
  activeTab: DashboardTab;
  onChangeTab: (tab: DashboardTab) => void;
}

export function PainelSubNav({ activeTab, onChangeTab }: PainelSubNavProps) {
  const { logout } = useAuth();

  return (
    <div className="border-b border-neutral-200 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6 items-start justify-between xl:flex-row xl:items-end">
        <div>
          <h1 className="font-serif text-3xl">Painel Editorial</h1>
          <p className="text-xs tracking-widest text-neutral-500 mt-1">
            GESTÃO DE CONTEÚDO PROFISSIONAL
          </p>
        </div>

        <nav aria-label="Seções do painel editorial" className="flex flex-wrap items-center gap-x-6 gap-y-4 text-xs font-semibold tracking-wide">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onChangeTab(tab.value)}
                className={
                  isActive
                    ? "text-black border-b-2 border-black pb-1"
                    : "text-neutral-400 hover:text-black pb-1"
                }
              >
                {tab.label}
              </button>
            );
          })}
          <span className="text-neutral-300">|</span>
          <button onClick={logout} className="text-red-600 hover:underline">
            SAIR
          </button>
        </nav>
      </div>
    </div>
  );
}
