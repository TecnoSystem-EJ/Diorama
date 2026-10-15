"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Projetos", href: "/projetos" },
  { label: "Edições", href: "/edicoes" },
  { label: "Sobre Nós", href: "/sobre" },
  { label: "Blog", href: "/blog" },
];

type SiteHeaderProps = {
  isAuthenticated?: boolean;
  dashboardHref?: string;
  loginHref?: string;
  onLogout?: () => void;
  brand?: string;
  brandHref?: string;
};

export function SiteHeader({
  isAuthenticated = false,
  dashboardHref = "/pages/dashboard",
  loginHref = "/pages/login",
  onLogout,
  brand = "DIORAMA",
  brandHref = "/",
}: SiteHeaderProps) {
  const pathname = usePathname();

  function handleLogoutClick(e: React.MouseEvent) {
    if (onLogout) {
      e.preventDefault();
      onLogout();
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#F4F1EA]/90 px-6 backdrop-blur-md md:px-12">
      <div className="flex min-h-16 w-full flex-wrap items-center justify-between gap-4 py-3">
        <Link
          href={brandHref}
          className="font-serif text-3xl font-bold uppercase tracking-tight text-[#111111]"
        >
          {brand}
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-4 text-[10px] font-semibold uppercase tracking-widest text-[#111111] sm:text-[11px] sm:gap-8">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors hover:text-[#1A365D] ${
                  active ? "text-[#1A365D]" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}

          {isAuthenticated ? (
            <span className="ml-2 flex items-center gap-4 border-l border-black/20 pl-4 sm:pl-8">
              <Link
                href={dashboardHref}
                className="font-bold text-[#1A365D] hover:opacity-80"
              >
                Painel
              </Link>
              <Link
                href={loginHref}
                onClick={handleLogoutClick}
                className="font-bold text-red-500 hover:text-red-600"
              >
                Sair
              </Link>
            </span>
          ) : (
            <Link
              href={loginHref}
              className="ml-2 border-l border-black/20 pl-4 font-bold text-[#1A365D] hover:opacity-80 sm:pl-8"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
