"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Shield, ArrowRight, Star, Heart, Scale, Users } from "lucide-react";

export default function JusticeirasPage() {
  return (
    <div className="min-h-screen relative flex flex-col p-6 overflow-hidden">
      <div className="absolute inset-0 bg-slate-950 -z-10" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(124,58,237,0.1),transparent)] -z-10" />

      <nav className="max-w-6xl mx-auto w-full flex items-center justify-between py-6">
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold text-slate-100 tracking-wider uppercase text-xs">O Legado</span>
        </div>
        <Link href="/" className="text-slate-400 hover:text-slate-200 text-xs transition-colors">Voltar para Home</Link>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full flex flex-col justify-center py-12 md:py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-bold uppercase tracking-widest mb-8">
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            Especial Justiceiras do Brasil
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-slate-50 mb-8 leading-[1.1]">
            A Tecnologia que <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-300 italic">Protege quem Protege.</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Bem-vindas ao <strong>O Legado</strong>. Nossa IA e SOS de Precisão foram criados para dar às 
            voluntárias e assistidas rastros jurídicos e segurança física real.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {[
            { 
              icon: Scale, 
              title: "Poder para Advogadas", 
              desc: "Gere logs auditáveis que provam a omissão do estado e fortalecem as medidas protetivas." 
            },
            { 
              icon: Shield, 
              title: "Segurança para Vítimas", 
              desc: "SOS silencioso que avisa a rede de apoio em 3 segundos com localização exata." 
            }
          ].map((item, i) => (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:bg-slate-800/50 transition-all shadow-2xl"
            >
              <item.icon className="w-10 h-10 text-violet-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="flex flex-col items-center gap-6"
        >
          <Link 
            href="/login?ref=justiceiras" 
            className="group flex items-center justify-center gap-3 px-10 py-5 bg-violet-600 hover:bg-violet-500 text-white font-black text-xl rounded-2xl shadow-xl shadow-violet-600/30 transition-all hover:-translate-y-1"
          >
            Resgatar Acesso Fundadora
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-slate-500 text-xs flex items-center gap-2">
            <Users className="w-3 h-3" /> Exclusivo para Membros do Justiceiras
          </p>
        </motion.div>
      </main>

      <footer className="text-center py-8 text-slate-600 text-[10px] uppercase tracking-widest font-bold">
        O Legado &copy; 2026 · Tecnologia Pela Vida
      </footer>
    </div>
  );
}
