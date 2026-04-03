"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, Play, Lock, ShieldCheck, Heart } from "lucide-react";

const AULAS = [
  {
    id: 1,
    titulo: "Proteção Digital e Modo Furtivo",
    descricao: "Como usar a tecnologia a seu favor sem deixar rastros para o agressor.",
    duracao: "10 min",
    icon: Lock,
    status: "disponivel"
  },
  {
    id: 2,
    titulo: "Seus Direitos: Lei Maria da Penha",
    descricao: "Um guia prático sobre medidas protetivas e como acioná-las em Goiás.",
    duracao: "15 min",
    icon: ShieldCheck,
    status: "disponivel"
  },
  {
    id: 3,
    titulo: "Quebrando o Ciclo: Pais e Filhos",
    descricao: "Como educar com afeto e evitar que a violência se repita na próxima geração.",
    duracao: "20 min",
    icon: Heart,
    status: "disponivel"
  }
];

export default function EscolaDePaisPage() {
  return (
    <div className="min-h-screen relative flex flex-col p-6">
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl -z-10" />

      <header className="flex items-center gap-4 mb-12 pt-4 max-w-5xl mx-auto w-full">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-200 transition-colors p-2 bg-white/5 rounded-full border border-white/10">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-50">
            <BookOpen className="w-8 h-8 text-violet-400" />
            Escola de Pais
          </h1>
          <p className="text-slate-400 text-sm">Trilha de Conhecimento e Proteção</p>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full space-y-8 pb-20">
        <div className="bg-gradient-to-br from-violet-600/20 to-fuchsia-600/10 border border-violet-500/20 rounded-3xl p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-4">Bem-vinda à sua jornada de evolução.</h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Aqui você encontra o conhecimento necessário para proteger a si mesma e garantir um futuro seguro para seus filhos. Cada aula concluída fortalece o seu legado.
              </p>
              <div className="flex items-center gap-4">
                <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-0 bg-violet-500" />
                </div>
                <span className="text-xs font-bold text-violet-400">0% Concluído</span>
              </div>
            </div>
            <div className="w-48 h-48 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-4">
              <GraduationCap className="w-24 h-24 text-violet-500/50" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {AULAS.map((aula, i) => (
            <motion.div 
              key={aula.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 hover:bg-slate-800/50 transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                  <aula.icon className="w-8 h-8 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-100 mb-1 group-hover:text-violet-400 transition-colors">
                    {aula.id}. {aula.titulo}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                    {aula.descricao}
                  </p>
                </div>
                <div className="flex items-center gap-4 shrink-0 w-full md:w-auto mt-4 md:mt-0">
                  <span className="text-xs text-slate-500 font-mono">{aula.duracao}</span>
                  <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all">
                    <Play className="w-4 h-4 fill-current" />
                    Iniciar Aula
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}

function GraduationCap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
