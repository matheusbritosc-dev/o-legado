import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import InquebravelSection from "@/components/InquebravelSection";
import RegisterForm from "@/components/RegisterForm";
import ShareSection from "@/components/ShareSection";
import Link from "next/link";
import { Star } from "lucide-react";

export default function Home() {
  return (
    <main>
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-base text-slate-100 tracking-wider">O Legado</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/manifesto" className="text-slate-400 hover:text-slate-100 transition-colors">Manifesto</Link>
          <Link href="/assine" className="text-slate-400 hover:text-slate-100 transition-colors">Assine</Link>
          <Link href="/vagas" className="text-slate-400 hover:text-slate-100 transition-colors">Vagas</Link>
          <Link href="/sos" className="text-rose-400 hover:text-rose-300 font-semibold transition-colors">SOS</Link>
        </div>
        <Link
          href="/pix"
          className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition-all"
        >
          Seja Membro Founder
        </Link>
      </nav>

      <div className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <InquebravelSection />
        <RegisterForm />
        <ShareSection />
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-slate-300">O Legado</span>
        </div>
        <p className="text-slate-600 text-sm mb-4">Proteção · Evolução · Esperança</p>
        <div className="flex justify-center gap-6 text-xs text-slate-600">
          <Link href="/manifesto" className="hover:text-slate-400">Manifesto</Link>
          <Link href="/assine" className="hover:text-slate-400">Membros Fundadores</Link>
          <Link href="/sos" className="hover:text-rose-400">Emergência SOS</Link>
        </div>
      </footer>
    </main>
  );
}
