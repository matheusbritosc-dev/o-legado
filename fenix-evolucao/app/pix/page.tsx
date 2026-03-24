"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle, ArrowLeft, ShieldCheck, Clock, Zap } from "lucide-react";
import Link from "next/link";

// ====================================================
// CONFIGURAÇÃO PIX — ALTERE AQUI COM SEUS DADOS REAIS
// ====================================================
const PIX_CONFIG = {
  chave: "admin@legado.com",         // SUA CHAVE PIX (CPF, email, telefone ou chave aleatória)
  nome: "MATHEUS BRITO",             // Nome do recebedor (como aparece no banco)
  cidade: "SAO PAULO",               // Cidade do recebedor
  valor: "47.00",                    // Valor em reais
  descricao: "Legado Membro Founder", // Descrição do pagamento
};

// Gera o payload PIX no padrão EMV (BR Code)
function gerarPixPayload(chave: string, nome: string, cidade: string, valor: string, txid: string = "LEGADO"): string {
  const pad = (id: string, val: string) => id + String(val.length).padStart(2, "0") + val;

  const merchantAccount =
    pad("00", "BR.GOV.BCB.PIX") +
    pad("01", chave);

  let payload =
    pad("00", "01") +                          // Payload Format Indicator
    pad("26", merchantAccount) +                // Merchant Account
    pad("52", "0000") +                         // Merchant Category Code
    pad("53", "986") +                          // Transaction Currency (BRL)
    pad("54", valor) +                          // Transaction Amount
    pad("58", "BR") +                           // Country Code
    pad("59", nome.substring(0, 25)) +          // Merchant Name
    pad("60", cidade.substring(0, 15)) +        // Merchant City
    pad("62", pad("05", txid)) +                // Additional Data (txid)
    "6304";                                     // CRC16 placeholder

  // Calcula CRC16/CCITT-FALSE
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  crc &= 0xFFFF;
  return payload + crc.toString(16).toUpperCase().padStart(4, "0");
}

export default function PixCheckoutPage() {
  const [copied, setCopied] = useState(false);

  const pixPayload = gerarPixPayload(
    PIX_CONFIG.chave,
    PIX_CONFIG.nome,
    PIX_CONFIG.cidade,
    PIX_CONFIG.valor
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 relative">
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
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold mb-3">
              <Zap className="w-3 h-3" /> OFERTA DE LANÇAMENTO
            </div>
            <h1 className="text-2xl font-bold text-slate-50 mb-1">Membro Founder</h1>
            <p className="text-slate-400 text-sm">Acesso vitalício à comunidade Legado</p>
          </div>

          {/* Preço */}
          <div className="text-center py-6 border-b border-white/5">
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-sm text-slate-500 line-through">R$ 97</span>
              <span className="text-4xl font-extrabold text-emerald-400">R$ 47</span>
              <span className="text-slate-500 text-sm">,00</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Pagamento único · Sem mensalidade</p>
          </div>

          {/* QR Code */}
          <div className="px-6 py-8">
            <div className="bg-white rounded-2xl p-4 mx-auto w-fit mb-6">
              <QRCodeSVG
                value={pixPayload}
                size={220}
                level="M"
                includeMargin={false}
                bgColor="#FFFFFF"
                fgColor="#000000"
              />
            </div>

            <p className="text-center text-slate-400 text-sm mb-4">
              Escaneie o QR Code com o app do seu banco ou copie o código abaixo:
            </p>

            {/* Botão Copiar PIX */}
            <button
              onClick={handleCopy}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                copied
                  ? "bg-emerald-500 text-slate-950"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-white/10"
              }`}
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4" /> Código PIX Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" /> Copiar Código PIX
                </>
              )}
            </button>

            {/* Timer de urgência */}
            <div className="flex items-center justify-center gap-2 mt-4 text-amber-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              Esse preço é exclusivo para os primeiros Founders
            </div>
          </div>

          {/* Segurança */}
          <div className="border-t border-white/5 px-6 py-4 flex items-center justify-center gap-2 text-slate-500 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Pagamento via PIX · Instituído pelo Banco Central · 100% Seguro
          </div>

          {/* Botão pós pagamento */}
          <div className="px-6 pb-6">
            <Link
              href="/pix/sucesso"
              className="block w-full text-center py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-emerald-900/30"
            >
              Já fiz o PIX → Acessar Área VIP
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
