import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { site } from "../lib/site";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "Diorama — Plataforma editorial", template: "%s | Diorama" },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: site.name,
    title: "Diorama — Plataforma editorial",
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  robots: { index: site.isConfigured, follow: true },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F4F1EA" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
