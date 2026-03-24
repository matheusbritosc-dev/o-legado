import Link from "next/link";
import { CheckCircle2, BookOpen, Star, LogOut, Zap } from "lucide-react";

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
          <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 font-semibold text-sm">
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
      <main className="flex-1 p-8 md:p-12 relative z-10">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-50 mb-1">Bem-vinda, Apoiadora Fundadora! 🌟</h1>
          <p className="text-slate-400">Sua assinatura está ativa e apoiando vidas agora mesmo.</p>
        </div>

        {/* Status card */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 max-w-2xl mb-8 shadow-2xl shadow-black/50">
          <div className="flex items-start justify-between mb-6 pb-6 border-b border-white/10">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wide mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ativo
              </span>
              <h2 className="text-xl font-bold text-slate-100">Plano Anual — Membro Fundadora</h2>
              <p className="text-slate-500 text-sm mt-1">Renovação em 18/03/2027</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-extrabold text-slate-50">R$ 500</p>
              <p className="text-slate-600 text-xs">Pago via Stripe · Mar 2026</p>
            </div>
          </div>

          <h3 className="font-bold text-slate-300 mb-4 text-sm uppercase tracking-wide">Benefícios Desbloqueados</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Escola de Pais", desc: "Aulas e trilhas gamificadas abertas.", link: "#" },
              { title: "Tutor IA (Conselheiro)", desc: "Chat privado, sem nuvem. Acesse agora.", link: "/dashboard/chat" },
            ].map((b) => (
              <Link key={b.title} href={b.link} className="block bg-black/40 border border-white/10 rounded-2xl p-4 hover:bg-black/60 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <h4 className="font-bold text-slate-200 text-sm">{b.title}</h4>
                </div>
                <p className="text-slate-500 text-xs mb-3">{b.desc}</p>
                <span className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold transition-colors">
                  Acessar →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
