"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, Check, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    id: "base_mensal",
    name: "Apoio Base",
    price: "R$ 49",
    period: "/ mês",
    description: "Contribua mensalmente e mantenha o movimento vivo.",
    color: "slate",
    features: ["Acesso à Escola de Pais (Beta)", "Newsletter exclusiva", "Nome na lista de apoiadoras"],
    cta: "Apoiar Mensalmente",
    highlight: false,
  },
  {
    id: "membro_anual",
    name: "Membro Fundadora",
    price: "R$ 500",
    period: "/ ano",
    savings: "Economize R$ 88",
    description: "Para quem quer fazer parte da história do Legado.",
    color: "emerald",
    features: [
      "Tudo do plano Base",
      "Acesso vitalício de fundadora",
      "Nome no Mural do Legado ✨",
      "Dashboard exclusivo",
      "Tutor IA (acesso Beta)",
      "Suporte prioritário",
    ],
    cta: "Tornar-me Fundadora",
    highlight: true,
  },
];

export default function AssinePage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setLoading(planId);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert("Erro ao iniciar checkout. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="min-h-screen relative py-20 px-6">
      <div className="max-w-4xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-sm font-medium mb-6">
            <Zap className="w-3.5 h-3.5" /> Membros Fundadores · Vagas Limitadas
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-50 mb-5">
            Seja parte da <span className="gold-gradient">história</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Seu apoio financia diretamente a proteção de mulheres vulneráveis e a educação que muda gerações.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative bg-slate-900/40 backdrop-blur-2xl border ${plan.highlight ? "border-emerald-500/40" : "border-white/10"} rounded-3xl p-8 flex flex-col shadow-2xl shadow-black/50`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold">
                    <Crown className="w-3.5 h-3.5" /> MAIS POPULAR
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h2 className={`text-xl font-bold mb-1 ${plan.highlight ? "text-emerald-400" : "text-slate-300"}`}>{plan.name}</h2>
                <p className="text-slate-500 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6 flex items-end gap-1">
                <span className="text-4xl font-extrabold text-slate-50">{plan.price}</span>
                <span className="text-slate-500 mb-1">{plan.period}</span>
              </div>
              {plan.savings && (
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold mb-6 w-fit">
                  {plan.savings}
                </span>
              )}

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(plan.id)}
                disabled={loading === plan.id}
                className={`w-full py-4 rounded-2xl font-bold text-sm transition-all duration-200 ${
                  plan.highlight
                    ? "bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-900/30 hover:-translate-y-0.5"
                    : "bg-slate-800 hover:bg-slate-700 text-slate-100 hover:-translate-y-0.5"
                } disabled:opacity-50`}
              >
                {loading === plan.id ? "Redirecionando..." : plan.cta}
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          🔐 Pagamentos processados com segurança pelo Stripe · HTTPS · PCI-DSS Compliant
        </p>
      </div>
    </main>
  );
}
