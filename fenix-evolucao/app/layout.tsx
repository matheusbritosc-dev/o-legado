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
  title: "O Legado — Comand Center",
  description: "Plataforma de segurança e proteção.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="text-slate-50 antialiased min-h-screen relative">
        <InteractiveBackground />
        <InstallPrompt />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
