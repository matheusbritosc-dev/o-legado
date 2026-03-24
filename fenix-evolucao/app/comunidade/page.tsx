import Link from "next/link";
import RegisterForm from "../../components/RegisterForm";
import { Users, ShieldCheck, Heart } from "lucide-react";

export default function ComunidadePage() {
  return (
    <main className="min-h-screen relative">
      {/* Hero */}
      <section className="pt-24 pb-12 px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
            <Users className="w-3.5 h-3.5" /> Comunidade Legado
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-50 mb-6 leading-tight">
            Juntas somos{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">
              inquebráveis
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-4">
            Cadastre-se na nossa rede de proteção. Seus dados são blindados com criptografia AES-256 e nunca são compartilhados. 
          </p>

          <div className="flex flex-wrap justify-center gap-6 mt-8 mb-8">
            {[
              { icon: ShieldCheck, label: "Criptografia E2E" },
              { icon: Heart, label: "Zero Julgamento" },
              { icon: Users, label: "15.000+ Mulheres" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-slate-400 text-sm">
                <item.icon className="w-4 h-4 text-emerald-400" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <RegisterForm />

      {/* CTA para Assine */}
      <section className="pb-24 px-6 text-center relative z-10">
        <p className="text-slate-500 text-sm mb-4">Já faz parte? Quer ir além?</p>
        <Link
          href="/assine"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold transition-all border border-white/10 hover:-translate-y-0.5"
        >
          Ver Planos de Membro Fundadora →
        </Link>
      </section>
    </main>
  );
}
