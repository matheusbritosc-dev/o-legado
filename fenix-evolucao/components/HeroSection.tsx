"use client";
import { motion } from "framer-motion";
import { Shield, ArrowRight, Lock } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Remover gradients pesados e deixar as partículas de luz do InteractiveBackground respirarem */}
      
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Lançamento Comunitário Oficial · 2026
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
            <span className="text-slate-50">Nenhuma Mulher</span>
            <br />
            <span className="text-gradient">Deve Caminhar</span>
            <br />
            <span className="text-slate-50">com Medo.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            O Legado une inteligência artificial de nível militar com educação de base e reinserção social
            para acabar com a violência na raiz — hoje e nas próximas gerações.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pix"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-lg transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
            >
              Quero ser Membro Founder
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/manifesto"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 font-semibold text-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Leia o Manifesto
            </Link>
          </div>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-2xl mx-auto border-t border-slate-800 pt-12"
        >
          {[
            { value: "15 mil", label: "Mulheres Apoiadas" },
            { value: "AES-256", label: "Criptografia Militar" },
            { value: "Zero", label: "Dados em Nuvem" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
