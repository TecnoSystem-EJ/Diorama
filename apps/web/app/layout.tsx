import type { ReactNode } from "react";
import { AuthProvider } from "./context/AuthContext";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}