"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ManifestoPage() {
  return (
    <main className="min-h-screen relative py-20 px-6">
      <div className="max-w-3xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-12 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-violet-400 font-semibold tracking-widest uppercase text-sm mb-4">O Manifesto</p>
          <h1 className="text-4xl md:text-6xl font-bold text-slate-50 leading-tight mb-12">
            Porque Nenhuma Mulher Deve{" "}
            <span className="text-gradient">Caminhar com Medo.</span>
          </h1>

          <div className="prose prose-invert prose-lg max-w-none space-y-8 text-slate-300 leading-relaxed">
            <p className="text-xl text-slate-200">
              Nós não estamos aqui para vender um software. Estamos aqui para fundar um movimento. 🛡️✨
            </p>

            <p>
              O Legado nasceu da união entre a tecnologia mais avançada do mundo e a coragem de quem acredita que a transformação é possível. Nós criamos um ecossistema que protege a mulher hoje — com segurança de nível militar — e educa o homem de amanhã para que a violência acabe na raiz.
            </p>

            <h2 className="text-2xl font-bold text-slate-100 mt-12">Nossos Pilares</h2>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 border-l-4 border-l-violet-500">
              <h3 className="text-lg font-bold text-violet-400 mb-2">🛡️ Proteção Real</h3>
              <p>Inteligência Artificial que monitora, alerta e protege em tempo real, com sigilo absoluto. Sua localização nunca vai para nenhuma nuvem sem seu consentimento explícito.</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 border-l-4 border-l-blue-500">
              <h3 className="text-lg font-bold text-blue-400 mb-2">📚 Educação de Base</h3>
              <p>Uma escola para pais e mães, ensinando empatia e respeito desde o berço. Porque a violência que não existe no lar não precisa ser combatida nas ruas.</p>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 border-l-4 border-l-violet-500">
              <h3 className="text-lg font-bold text-violet-400 mb-2">💜 Reinserção com Dignidade</h3>
              <p>Transformando vidas através de oportunidades reais e seguras. O Legado conecta mulheres a empregadores verificados, com anonimato total até o momento escolhido por elas.</p>
            </div>

            <p className="text-xl text-slate-200 font-semibold mt-8">
              Este é o meu compromisso. Esta é a minha história. Este é o nosso Legado.
            </p>

            <p>
              Junte-se a nós e ajude a construir um Brasil onde o medo não tenha mais lugar.
            </p>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4">
            <Link
              href="/#cadastro"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold transition-all"
            >
              Fazer Parte do Movimento
            </Link>
            <Link
              href="/assine"
              className="inline-flex items-center justify-center px-8 py-4 rounded-2xl glass border-slate-600 text-slate-300 hover:text-slate-100 font-semibold transition-all"
            >
              Ser Membro Fundadora →
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
