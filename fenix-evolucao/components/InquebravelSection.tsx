"use client";
import { motion } from "framer-motion";
import { Wifi, WifiOff, Eye, EyeOff, GraduationCap, Briefcase, Shield, Zap } from "lucide-react";

const PILARES = [
  {
    icon: Shield,
    tag: "IMPACTO JURÍDICO",
    titulo: "Prova de Omissão",
    subtitulo: "Rastro Digital Blindado",
    descricao: "O sistema gera um log de eventos criptografado que serve como prova judicial. Se a rede de apoio for acionada e não responder, a omissão está documentada e pronta para o processo.",
    stat: "Auditoria Forense",
    cor: "violet",
  },
  {
    icon: EyeOff,
    tag: "PRIVACIDADE",
    titulo: "Modo Furtivo",
    subtitulo: "Invisibilidade Total",
    descricao: "O Legado pode ser instalado como um PWA que não deixa rastros na App Store. O agressor não consegue deletar o que ele não consegue encontrar.",
    stat: "100% Indetectável",
    cor: "violet",
  },
  {
    icon: GraduationCap,
    tag: "PREVENÇÃO",
    titulo: "Escola de Pais",
    subtitulo: "Mudança de Base",
    descricao: "Não focamos apenas em remediar o dano. Nossas trilhas educacionais atacam a raiz da violência, focando na reeducação familiar e inteligência emocional.",
    stat: "Quebrando o Ciclo",
    cor: "amber",
  },
  {
    icon: Zap,
    tag: "TECNOLOGIA",
    titulo: "IA Conselheira",
    subtitulo: "Apoio 24/7",
    descricao: "Alimentada por tecnologia NVIDIA, nossa IA oferece acolhimento imediato e orientações sobre a Lei Maria da Penha sem julgamentos e com sigilo total.",
    stat: "Resposta Instantânea",
    cor: "sky",
  },
];

const corClasses: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  violet: { border: "border-violet-500/30", bg: "bg-violet-500/10", text: "text-violet-400", glow: "shadow-violet-900/20" },
  amber: { border: "border-amber-500/30", bg: "bg-amber-500/10", text: "text-amber-400", glow: "shadow-amber-900/20" },
  sky: { border: "border-sky-500/30", bg: "bg-sky-500/10", text: "text-sky-400", glow: "shadow-sky-900/20" },
};

export default function InquebravelSection() {
  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-sm font-medium mb-6">
            <Shield className="w-3.5 h-3.5" /> Análise Competitiva · Checada
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-50 mb-5">
            Por que o Legado é{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-300 to-cyan-400">
              Inquebrável
            </span>
            ?
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            4 tecnologias que <strong className="text-slate-200">nenhum outro sistema no Brasil</strong> oferece. Nem privado. Nem governamental.
          </p>
        </motion.div>

        {/* Pilares Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PILARES.map((pilar, i) => {
            const cores = corClasses[pilar.cor];
            return (
              <motion.div
                key={pilar.titulo}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative bg-slate-900/50 backdrop-blur-2xl border ${cores.border} rounded-3xl p-8 shadow-2xl ${cores.glow} group hover:-translate-y-1 transition-all duration-300`}
              >
                {/* Tag */}
                <div className={`absolute -top-3 left-6 px-3 py-1 rounded-full ${cores.bg} ${cores.text} text-[10px] font-bold tracking-wider`}>
                  {pilar.tag}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${cores.bg} border ${cores.border} flex items-center justify-center mb-5`}>
                  <pilar.icon className={`w-7 h-7 ${cores.text}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-50 mb-1">{pilar.titulo}</h3>
                <p className={`text-sm ${cores.text} font-medium mb-3`}>{pilar.subtitulo}</p>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{pilar.descricao}</p>

                {/* Stat */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg ${cores.bg} ${cores.text} text-xs font-semibold`}>
                  <Zap className="w-3 h-3" /> {pilar.stat}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-slate-500 text-sm mb-1">O Legado cobre o ciclo completo:</p>
          <p className="text-lg font-bold">
            <span className="text-amber-400">ANTES</span>
            <span className="text-slate-600 mx-2">→</span>
            <span className="text-violet-400">DURANTE</span>
            <span className="text-slate-600 mx-2">→</span>
            <span className="text-violet-400">DEPOIS</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
