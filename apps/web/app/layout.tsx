import type { ReactNode } from "react";
import { Providers } from "./providers";
import "./globals.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}