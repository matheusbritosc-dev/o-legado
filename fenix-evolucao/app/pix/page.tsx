"use client";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle, ArrowLeft, ShieldCheck, Clock, Zap, User, Mail, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

// ====================================================
// CONFIGURAÇÃO PIX
// ====================================================
const PIX_CONFIG = {
  chave: "admin@legado.com",
  nome: "MATHEUS BRITO",
  cidade: "SAO PAULO",
  valor: "47.00",
  descricao: "Legado Membro Founder",
};

function gerarPixPayload(chave: string, nome: string, cidade: string, valor: string, txid: string = "LEGADO"): string {
  const pad = (id: string, val: string) => id + String(val.length).padStart(2, "0") + val;
  const merchantAccount = pad("00", "BR.GOV.BCB.PIX") + pad("01", chave);
  let payload = pad("00", "01") + pad("26", merchantAccount) + pad("52", "0000") + pad("53", "986") + pad("54", valor) + pad("58", "BR") + pad("59", nome.substring(0, 25)) + pad("60", cidade.substring(0, 15)) + pad("62", pad("05", txid)) + "6304";
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) { crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1; }
  }
  return payload + (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
}

function PixContent() {
  const router = useRouter();
  
  // Usuário pediu para liberar 100 primeiros cadastros gratuitamente com 6 meses de acesso
  const isFree = true; 

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFreeRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001/api/v1";
      await fetch(`${apiUrl}/auth/registrar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          nome, 
          email, 
          senha,
          perfil_json: { gratis_6_meses: true, origem: "campanha_100_vagas" }
        }),
      });
      router.push("/pix/sucesso?coupon=LEGADOFREE");
    } catch {
      router.push("/pix/sucesso?coupon=LEGADOFREE");
    }
  };

  return (
    <div className="max-w-md w-full relative z-10">
      <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900/60 backdrop-blur-2xl border border-violet-500/30 rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/20"
      >
        {/* Header */}
        <div className="px-6 py-6 text-center border-b bg-violet-500/10 border-violet-500/20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 bg-violet-500/20 text-violet-400">
            <Zap className="w-3 h-3" /> CAMPANHA DE LANÇAMENTO
          </div>
          <h1 className="text-2xl font-bold text-slate-50 mb-1">Crie sua Conta</h1>
          <p className="text-slate-400 text-sm">6 Meses de Acesso 100% Gratuito</p>
        </div>

        {/* Preço */}
        <div className="text-center py-6 border-b border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-violet-500/5 flex items-center justify-center opacity-50">
            <div className="w-[200%] h-20 bg-violet-500/10 -rotate-12 transform origin-left" />
          </div>
          <div className="flex items-baseline justify-center gap-2 relative z-10">
            <span className="text-sm text-slate-500 line-through">R$ 97 / mês</span>
            <span className="text-4xl font-extrabold text-violet-400 uppercase tracking-wider">Grátis</span>
          </div>
          <p className="text-sm mt-3 font-semibold text-violet-300 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Vagas restantes: <span className="text-white px-2 py-0.5 bg-violet-600 rounded">87/100</span>
          </p>
        </div>

        {/* Form Gratuito Alpha Tester */}
        <div className="px-6 py-8">
          <p className="text-center text-slate-300 text-sm mb-6">
            Preencha os dados abaixo para garantir uma das primeiras 100 vagas com 6 meses de gratuidade total.
          </p>
          <form onSubmit={handleFreeRegistration} className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" required value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" disabled={loading} className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 focus:border-violet-500 rounded-xl text-slate-100 text-sm" />
            </div>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Seu melhor e-mail" disabled={loading} className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 focus:border-violet-500 rounded-xl text-slate-100 text-sm" />
            </div>
            <div className="relative">
              <LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="password" required value={senha} onChange={e => setSenha(e.target.value)} placeholder="Crie uma senha forte" disabled={loading} className="w-full pl-11 pr-4 py-3 bg-black/40 border border-white/10 focus:border-violet-500 rounded-xl text-slate-100 text-sm" />
            </div>
            <button type="submit" disabled={loading} className="w-full mt-2 py-4 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/30">
              {loading ? "Garantindo Vaga..." : "Garantir Meus 6 Meses Grátis"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function PixCheckoutPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative">
      <Suspense fallback={<div className="text-slate-400 animate-pulse">Carregando Checkout...</div>}>
        <PixContent />
      </Suspense>
    </main>
  );
}
