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
  const searchParams = useSearchParams();
  const router = useRouter();
  const coupon = searchParams.get("coupon");
  const isFree = coupon === "LEGADOFREE";

  const [copied, setCopied] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const pixPayload = gerarPixPayload(PIX_CONFIG.chave, PIX_CONFIG.nome, PIX_CONFIG.cidade, PIX_CONFIG.valor);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

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
          perfil_json: { is_alpha_tester: true, origem: "cupom_legadofree" }
        }),
      });
      // Mesmo se der erro (ex: e-mail já existe), deixamos passar para não bloquear a Alpha Tester
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
        className="bg-slate-900/60 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className={`px-6 py-6 text-center border-b ${isFree ? "bg-violet-500/10 border-violet-500/20" : "bg-emerald-500/10 border-emerald-500/20"}`}>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3 ${isFree ? "bg-violet-500/20 text-violet-400" : "bg-emerald-500/20 text-emerald-400"}`}>
            <Zap className="w-3 h-3" /> {isFree ? "CONVITE VIP ALPHA TESTER" : "OFERTA DE LANÇAMENTO"}
          </div>
          <h1 className="text-2xl font-bold text-slate-50 mb-1">Membro Founder</h1>
          <p className="text-slate-400 text-sm">Acesso vitalício à comunidade Legado</p>
        </div>

        {/* Preço */}
        <div className="text-center py-6 border-b border-white/5 relative overflow-hidden">
          {isFree && (
            <div className="absolute inset-0 bg-violet-500/5 flex items-center justify-center opacity-50">
              <div className="w-[200%] h-20 bg-violet-500/10 -rotate-12 transform origin-left" />
            </div>
          )}
          <div className="flex items-baseline justify-center gap-2 relative z-10">
            <span className="text-sm text-slate-500 line-through">R$ 97</span>
            {isFree ? (
              <span className="text-4xl font-extrabold text-violet-400 uppercase tracking-wider">Free</span>
            ) : (
              <>
                <span className="text-4xl font-extrabold text-emerald-400">R$ 47</span>
                <span className="text-slate-500 text-sm">,00</span>
              </>
            )}
          </div>
          <p className={`text-xs mt-2 font-medium ${isFree ? "text-violet-400" : "text-slate-500"}`}>
            {isFree ? "✅ Cupom LEGADOFREE Aplicado!" : "Pagamento único · Sem mensalidade"}
          </p>
        </div>

        {isFree ? (
           /* Form Gratuito Alpha Tester */
           <div className="px-6 py-8">
             <p className="text-center text-slate-300 text-sm mb-6">
               Crie seu acesso agora para ativar sua conta gratuita vitalícia como Alpha Tester.
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
                 {loading ? "Liberando Acesso..." : "Liberar Acesso Gratuito Agora"}
               </button>
             </form>
           </div>
        ) : (
          /* QR Code Padrão PIX */
          <div className="px-6 py-8">
            <div className="bg-white rounded-2xl p-4 mx-auto w-fit mb-6">
              <QRCodeSVG value={pixPayload} size={220} level="M" includeMargin={false} bgColor="#FFFFFF" fgColor="#000000" />
            </div>
            <p className="text-center text-slate-400 text-sm mb-4">Escaneie o QR Code ou copie o código abaixo:</p>
            <button onClick={handleCopy} className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all ${copied ? "bg-emerald-500 text-slate-950" : "bg-slate-800 text-slate-100 border border-white/10"}`}>
              {copied ? <><CheckCircle className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar Código PIX</>}
            </button>
            <div className="flex items-center justify-center gap-2 mt-4 text-amber-400 text-xs">
              <Clock className="w-3.5 h-3.5" /> Exclusivo para os primeiros Founders
            </div>
            {/* Segurança */}
            <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-center gap-2 text-slate-500 text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> PIX · 100% Seguro
            </div>
            <div className="mt-6">
              <Link href="/pix/sucesso" className="block w-full text-center py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all">
                Já fiz o PIX → Acessar Área VIP
              </Link>
            </div>
          </div>
        )}
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
