import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import InteractiveBackground from "@/components/InteractiveBackground";
import InstallPrompt from "@/components/InstallPrompt";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Importante para comportamento nativo de App no iOS
};

export const metadata: Metadata = {
  title: "Proteção à mulher – Ligue 180 | O Legado",
  description: "Plataforma avançada de segurança e proteção à mulher. Apoio a vítimas de abuso, violência doméstica, e reinserção no mercado. Denúncia anônima e conexão com 180.",
  keywords: ["proteção à mulher", "Ligue 180", "denúncia violência contra mulher", "apoio a vítimas de abuso", "violência doméstica", "O Legado", "Goiás"],
  openGraph: {
    title: "O Legado — Proteção e Educação",
    description: "Tecnologia de ponta contra a violência doméstica. Modo Furtivo, Inteligência Artificial e apoio à mulher.",
    siteName: "O Legado",
    locale: "pt_BR",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "O Legado",
  },
  icons: {
    apple: "/icon.svg",
  },
};

import ServerStatus from "@/components/ServerStatus";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="text-slate-50 antialiased min-h-screen relative">
        <ServerStatus />
        <InteractiveBackground />
        <InstallPrompt />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
