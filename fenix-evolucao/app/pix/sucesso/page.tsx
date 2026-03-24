"use client";
import { motion } from "framer-motion";
import { Crown, MessageCircle, Star, Heart, ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// ====================================================
// LINK DO GRUPO VIP — ALTERE AQUI COM SEU LINK REAL
// ====================================================
const GRUPO_VIP_LINK = "https://chat.whatsapp.com/XXXXXXXXXXXXXXX"; // Cole seu link real aqui
const TELEGRAM_LINK = "https://t.me/+XXXXXXXXXXXXXXX";               // Ou Telegram

export default function PixSucessoPage() {
  const [founderNumber, setFounderNumber] = useState(0);

  useEffect(() => {
    // Gera um número de founder baseado no timestamp
    const stored = localStorage.getItem("legado_founder_number");
    if (stored) {
      setFounderNumber(parseInt(stored));
    } else {
      const num = Math.floor(Math.random() * 50) + 1; // Primeiros 50 founders
      localStorage.setItem("legado_founder_number", String(num));
      setFounderNumber(num);
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <div className="max-w-lg w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/60 backdrop-blur-2xl border border-emerald-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-emerald-900/20"
        >
          {/* Confetti Header */}
          <div className="bg-gradient-to-br from-emerald-500/20 to-teal-500/10 px-8 py-10 text-center border-b border-emerald-500/20 relative overflow-hidden">
            {/* Decorative stars */}
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute top-4 right-8 text-yellow-400/30">
              <Star className="w-6 h-6 fill-current" />
            </motion.div>
            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute top-12 left-6 text-emerald-400/20">
              <Star className="w-4 h-4 fill-current" />
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 flex items-center justify-center mx-auto mb-5"
            >
              <Crown className="w-10 h-10 text-emerald-400" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-slate-50 mb-2"
            >
              Bem-vinda ao Legado!
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-sm font-bold">
                <Crown className="w-4 h-4" />
                Founder #{String(founderNumber).padStart(3, "0")}
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="px-8 py-8 space-y-6">
            <p className="text-slate-300 text-center text-sm leading-relaxed">
              Seu pagamento será confirmado em breve. Enquanto isso, entre no nosso grupo exclusivo de Membros Fundadores para ter acesso direto a tudo.
            </p>

            {/* WhatsApp CTA */}
            <motion.a
              href={GRUPO_VIP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-base transition-all shadow-lg shadow-[#25D366]/20 hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              Entrar no Grupo VIP (WhatsApp)
              <ExternalLink className="w-4 h-4" />
            </motion.a>

            {/* Telegram Alternative */}
            <motion.a
              href={TELEGRAM_LINK}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-center gap-3 w-full py-3.5 rounded-2xl bg-[#0088cc]/20 hover:bg-[#0088cc]/30 text-[#5BC8F5] font-semibold text-sm transition-all border border-[#0088cc]/30"
            >
              <MessageCircle className="w-4 h-4" />
              Ou entre pelo Telegram
            </motion.a>

            {/* Benefits */}
            <div className="pt-4 border-t border-white/5 space-y-3">
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">O que você desbloqueou:</p>
              {[
                "Acesso vitalício de Membro Fundadora",
                "Escola de Pais (IA Tutor exclusivo)",
                "Botão de Emergência SOS",
                "Suporte direto do criador",
                "Nome no Mural Eterno do Legado ✨",
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  className="flex items-center gap-2.5 text-sm text-slate-300"
                >
                  <Heart className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/5 px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Pagamento protegido
            </div>
            <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Voltar ao site
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
