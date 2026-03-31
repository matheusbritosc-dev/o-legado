"use client";
import { motion } from "framer-motion";
import { Crown, MessageCircle, Star, Heart, ShieldCheck, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ====================================================
// LINK DO GRUPO VIP
// ====================================================
const GRUPO_VIP_LINK = "https://chat.whatsapp.com/XXXXXXXXXXXXXXX"; 
const TELEGRAM_LINK = "https://t.me/+XXXXXXXXXXXXXXX";               

function SucessoContent() {
  const [founderNumber, setFounderNumber] = useState(0);
  const searchParams = useSearchParams();
  const isAlphaTester = searchParams.get("coupon") === "LEGADOFREE";

  useEffect(() => {
    if (isAlphaTester) {
      setFounderNumber(1);
    } else {
      const stored = localStorage.getItem("legado_founder_number");
      if (stored) {
        setFounderNumber(parseInt(stored));
      } else {
        const num = Math.floor(Math.random() * 50) + 2; 
        localStorage.setItem("legado_founder_number", String(num));
        setFounderNumber(num);
      }
    }
  }, [isAlphaTester]);

  return (
    <div className="max-w-lg w-full relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`bg-slate-900/60 backdrop-blur-2xl border rounded-3xl overflow-hidden shadow-2xl ${
          isAlphaTester ? "border-violet-500/30 shadow-violet-900/20" : "border-violet-500/30 shadow-violet-900/20"
        }`}
      >
        {/* Confetti Header */}
        <div className={`px-8 py-10 text-center border-b relative overflow-hidden ${
          isAlphaTester ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border-violet-500/20" : "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border-violet-500/20"
        }`}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }} className="absolute top-4 right-8 text-yellow-400/30">
            <Star className="w-6 h-6 fill-current" />
          </motion.div>
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className={`absolute top-12 left-6 ${isAlphaTester ? "text-violet-400/20" : "text-violet-400/20"}`}>
            <Star className="w-4 h-4 fill-current" />
          </motion.div>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`w-20 h-20 rounded-full border-2 flex items-center justify-center mx-auto mb-5 ${
              isAlphaTester ? "bg-violet-500/20 border-violet-500/40" : "bg-violet-500/20 border-violet-500/40"
            }`}
          >
            <Crown className={`w-10 h-10 ${isAlphaTester ? "text-violet-400" : "text-violet-400"}`} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-slate-50 mb-2"
          >
            {isAlphaTester ? "Bem-vinda, Guerreira #1!" : "Bem-vinda ao Legado!"}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${
              isAlphaTester ? "bg-amber-500/20 border-amber-500/30 text-amber-300" : "bg-amber-500/20 border-amber-500/30 text-amber-300"
            }`}>
              <Crown className="w-4 h-4" />
              {isAlphaTester ? "Alpha Tester VIP" : `Founder #${String(founderNumber).padStart(3, "0")}`}
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="px-8 py-8 space-y-6">
          <p className="text-slate-300 text-center text-sm leading-relaxed">
            {isAlphaTester 
              ? "Sua conta gratuita vitalícia foi ativada. Você é a nossa primeira usuária real e ajudará a moldar o futuro da plataforma. Acesse o grupo direto do criador agora."
              : "Seu pagamento será confirmado em breve. Enquanto isso, entre no nosso grupo exclusivo de Membros Fundadores para ter acesso direto a tudo."}
          </p>

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
                <Heart className={`w-3.5 h-3.5 flex-shrink-0 ${isAlphaTester ? "text-violet-400" : "text-violet-400"}`} />
                {item}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-white/5 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className={`w-3.5 h-3.5 ${isAlphaTester ? "text-violet-400" : "text-violet-400"}`} />
            {isAlphaTester ? "Convite Oficial Seguro" : "Pagamento protegido"}
          </div>
          <Link href="/dashboard" className="text-sm font-bold text-violet-400 hover:text-violet-300 transition-colors">
            Ir para o Dashboard →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function PixSucessoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <Suspense fallback={<div className="text-slate-400 animate-pulse">Carregando confirmação...</div>}>
        <SucessoContent />
      </Suspense>
    </main>
  );
}
