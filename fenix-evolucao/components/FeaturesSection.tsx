"use client";
import { motion } from "framer-motion";
import { Shield, BookOpen, HeartHandshake, Brain, Lock, Globe } from "lucide-react";

const features = [
  {
    icon: Shield,
    color: "violet",
    title: "Proteção Real",
    description: "IA que monitora, alerta e aciona sua rede de apoio em tempo real. Botão SOS silencioso sempre disponível.",
  },
  {
    icon: BookOpen,
    color: "blue",
    title: "Escola de Pais",
    description: "Trilhas gamificadas ensinando empatia, respeito e inteligência emocional desde o berço.",
  },
  {
    icon: HeartHandshake,
    color: "violet",
    title: "Reinserção Digna",
    description: "Matching de vagas ocultas e encaminhamento para oportunidades reais com anonimato total.",
  },
  {
    icon: Brain,
    color: "amber",
    title: "Tutor IA Local",
    description: "Conselheiro IA rodando localmente — sem nuvem, sem rastreamento, com sigilo absoluto.",
  },
  {
    icon: Lock,
    color: "rose",
    title: "E2EE nativo",
    description: "Seus dados são criptografados no seu dispositivo antes de tocar qualquer servidor.",
  },
  {
    icon: Globe,
    color: "cyan",
    title: "Soberania de Dados",
    description: "100% LGPD compliant. Infraestrutura local, sem dependência de big techs estrangeiras.",
  },
];

const colorMap: Record<string, string> = {
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

export default function FeaturesSection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <p className="text-violet-400 font-semibold tracking-widest uppercase text-sm mb-4">Três Pilares. Uma Missão.</p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-6">
            Tecnologia que <span className="text-gradient">salva vidas</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Cada funcionalidade foi desenhada pensando na segurança real de mulheres em situação de vulnerabilidade.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            const cls = colorMap[feat.color];
            return (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-slate-500/50 hover:bg-slate-800/50 transition-all duration-300 group"
              >
                <div className={`inline-flex p-3 rounded-xl border ${cls} mb-5`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-violet-400 transition-colors">{feat.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
