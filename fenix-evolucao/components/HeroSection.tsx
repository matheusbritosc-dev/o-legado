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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            Lançamento: Piloto Governamental - Goiás 2026
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-8">
            <span className="text-slate-50">Sua Prefeitura Atende.</span>
            <br />
            <span className="text-gradient">Mas Sem Rastro,</span>
            <br />
            <span className="text-slate-50">é Omissão.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            O Legado acaba com a "Omissão Documentada". Nossa tecnologia de IA e SOS gera rastros jurídicos 
            blindados, forçando a rede de apoio a agir ou responder judicialmente.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://wa.me/5562998485984"
              target="_blank"
              className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg transition-all duration-200 shadow-xl shadow-emerald-600/30 hover:-translate-y-0.5"
            >
              Agendar Reunião VIP (Secretarias)
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 font-semibold text-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Acessar Piloto (Demo)
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
              <div className="text-2xl md:text-3xl font-bold text-violet-400 mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
