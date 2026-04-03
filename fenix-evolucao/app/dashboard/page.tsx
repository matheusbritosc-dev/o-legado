import Link from "next/link";
import { CheckCircle2, BookOpen, Star, LogOut, Zap } from "lucide-react";

import SOSSettings from "@/components/SOSSettings";

export default function DashboardPage() {
  return (
    <div className="min-h-screen relative flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/40 backdrop-blur-2xl border-r border-white/10 p-6 hidden md:flex flex-col relative z-10">
        <div className="flex items-center gap-2 mb-12">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-slate-100 tracking-wider">O Legado</span>
        </div>

        <nav className="flex-1 space-y-2">
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-violet-500/10 text-violet-400 font-semibold text-sm">
            <CheckCircle2 className="w-4 h-4" /> Assinatura
          </a>
          <Link href="/manifesto" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-sm transition-colors">
            <BookOpen className="w-4 h-4" /> Manifesto VIP
          </Link>
        </nav>

        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-400 text-sm transition-colors mt-auto">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 md:p-12 relative z-10 overflow-y-auto h-screen">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-50 mb-1">Bem-vinda, Apoiadora Fundadora! 🌟</h1>
          <p className="text-slate-400 text-sm">Sua assinatura está ativa e apoiando vidas agora mesmo.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
          {/* Status card */}
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/50 h-fit">
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/10">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wide mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" /> Ativo
                </span>
                <h2 className="text-xl font-bold text-slate-100">Plano Anual — Membro Fundadora</h2>
                <p className="text-slate-500 text-sm mt-1">Renovação em 18/03/2027</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-slate-50">R$ 500</p>
                <p className="text-slate-600 text-[10px]">Pago via Stripe · Mar 2026</p>
              </div>
            </div>

            <h3 className="font-bold text-slate-300 mb-4 text-xs uppercase tracking-wide">Benefícios Desbloqueados</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Escola de Pais", desc: "Aulas e trilhas gamificadas abertas.", link: "/escola" },
                { title: "Tutor IA (Conselheiro)", desc: "Chat privado, sem nuvem. Acesse agora.", link: "/dashboard/chat" },
              ].map((b) => (
                <Link key={b.title} href={b.link} className="block bg-black/40 border border-white/10 rounded-2xl p-4 hover:bg-black/60 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-4 h-4 text-violet-400" />
                    <h4 className="font-bold text-slate-200 text-sm">{b.title}</h4>
                  </div>
                  <p className="text-slate-500 text-[10px] mb-3">{b.desc}</p>
                  <span className="text-violet-400 hover:text-violet-300 text-[10px] font-semibold transition-colors">
                    Acessar →
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* SOS Settings Section */}
          <SOSSettings />
        </div>

        {/* Suporte VIP Floating Button */}
        <a
          href="https://wa.me/5562998485984"
          target="_blank"
          className="fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-2xl shadow-emerald-600/30 transition-all hover:-translate-y-1 group animate-bounce-slow"
        >
          <div className="relative">
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-emerald-600 rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-emerald-600 rounded-full" />
            <div className="w-6 h-6 flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.031 2C6.446 2 1.922 6.524 1.922 12.109c0 1.783.464 3.523 1.346 5.06l-1.433 5.228 5.348-1.404c1.472.802 3.12 1.226 4.848 1.226 5.584 0 10.108-4.524 10.108-10.11 0-5.584-4.524-10.109-10.108-10.109Zm5.94 14.331c-.246.688-1.46 1.256-2.016 1.345-.494.079-1.139.141-1.815-.078-.448-.145-1.025-.333-1.815-.678-3.344-1.46-5.507-4.857-5.673-5.077-.166-.22-.166-.22-1.353-1.78-.186-.246-.372-.493-.538-.718-1.554-2.091-.842-3.193-.584-3.52l.14-.176c.404-.51.842-.51.842-.51.27 0 .54.015.688.026l.464.015c.22.011.517-.038.742.493l.842 2.046c.079.186.14.372.22.56.246.58.166.842-.078 1.353l-.333.688c-.144.298-.291.597-.436.896-.165.333.166.688.493 1.139 1.173 1.637 2.656 2.502 3.829 3.078.333.165.58.114.783-.114l.842-1.011c.225-.264.448-.528.673-.792l.123-.153c.246-.307.718-.307.973-.153l2.046 1.011c.225.11.448.225.673.333.448.225.688.493.58.742Z"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] text-emerald-200 uppercase tracking-widest font-black mb-1">Suporte VIP</span>
            <span className="text-sm">Falar com Monitor</span>
          </div>
        </a>
      </main>
    </div>
  );
}
