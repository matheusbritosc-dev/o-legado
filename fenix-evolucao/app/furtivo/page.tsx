"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EyeOff, Eye, Shield, StickyNote, Calculator, ChefHat, Plus, FileText, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

type DisguiseMode = "legado" | "notas" | "calculadora" | "receitas";

const DISGUISES: { id: DisguiseMode; name: string; icon: any; color: string }[] = [
  { id: "notas", name: "Bloco de Notas", icon: StickyNote, color: "bg-yellow-500" },
  { id: "calculadora", name: "Calculadora", icon: Calculator, color: "bg-slate-600" },
  { id: "receitas", name: "Receitas", icon: ChefHat, color: "bg-orange-500" },
];

// ==============================
// BLOCO DE NOTAS FALSO
// ==============================
function NotasUI() {
  return (
    <div className="bg-yellow-50 min-h-[480px] rounded-2xl overflow-hidden text-slate-800">
      <div className="bg-yellow-100 px-4 py-3 flex items-center justify-between border-b border-yellow-200">
        <span className="text-sm font-semibold text-yellow-800">📝 Minhas Notas</span>
        <Plus className="w-5 h-5 text-yellow-700" />
      </div>
      <div className="p-4 space-y-3">
        {[
          { title: "Lista de compras", preview: "Arroz, feijão, óleo, leite...", time: "Hoje, 09:30" },
          { title: "Aniversário da Ana", preview: "Comprar bolo e presente", time: "Ontem" },
          { title: "Reunião escola", preview: "Levar documentos do Pedro", time: "Seg, 14:00" },
          { title: "Receita de bolo", preview: "2 xícaras de farinha, 3 ovos...", time: "15/03" },
        ].map((nota) => (
          <div key={nota.title} className="bg-white rounded-xl p-3 border border-yellow-100 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-slate-800">{nota.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{nota.preview}</p>
              </div>
              <span className="text-[10px] text-slate-400">{nota.time}</span>
            </div>
          </div>
        ))}
      </div>
      {/* HIDDEN: botão secreto no canto */}
      <div className="px-4 pb-4">
        <div className="bg-yellow-100 rounded-xl p-3 text-center text-xs text-yellow-600 border border-yellow-200">
          Toque longo no logo para acessar ⚡
        </div>
      </div>
    </div>
  );
}

// ==============================
// CALCULADORA FALSA
// ==============================
function CalculadoraUI() {
  return (
    <div className="bg-slate-900 min-h-[480px] rounded-2xl overflow-hidden">
      <div className="px-6 pt-8 pb-4 text-right">
        <p className="text-slate-500 text-sm">0</p>
        <p className="text-4xl font-light text-white">847.32</p>
      </div>
      <div className="grid grid-cols-4 gap-[1px] bg-slate-800 p-[1px] rounded-t-2xl">
        {["AC", "+/-", "%", "÷", "7", "8", "9", "×", "4", "5", "6", "−", "1", "2", "3", "+", "0", "0", ".", "="].map((btn, i) => (
          <div
            key={`${btn}-${i}`}
            className={`py-4 text-center text-lg font-medium ${
              ["÷", "×", "−", "+", "="].includes(btn)
                ? "bg-violet-500 text-white"
                : ["AC", "+/-", "%"].includes(btn)
                ? "bg-slate-700 text-slate-300"
                : "bg-slate-800 text-white"
            }`}
          >
            {btn}
          </div>
        ))}
      </div>
      <div className="bg-slate-800 px-4 py-3 text-center text-[10px] text-slate-600">
        Digite 1379= para acessar modo protegido
      </div>
    </div>
  );
}

// ==============================
// RECEITAS FALSAS
// ==============================
function ReceitasUI() {
  return (
    <div className="bg-orange-50 min-h-[480px] rounded-2xl overflow-hidden text-slate-800">
      <div className="bg-gradient-to-r from-orange-400 to-red-400 px-4 py-4">
        <p className="text-white font-bold text-lg">🍳 Minhas Receitas</p>
        <p className="text-orange-100 text-xs">42 receitas salvas</p>
      </div>
      <div className="p-4 space-y-3">
        {[
          { name: "Bolo de Cenoura", time: "45 min", icon: "🥕", difficulty: "Fácil" },
          { name: "Frango à Parmegiana", time: "1h 20min", icon: "🍗", difficulty: "Médio" },
          { name: "Brigadeiro", time: "20 min", icon: "🍫", difficulty: "Fácil" },
          { name: "Pão Caseiro", time: "2h", icon: "🍞", difficulty: "Médio" },
        ].map((receita) => (
          <div key={receita.name} className="bg-white rounded-xl p-3 border border-orange-100 shadow-sm flex items-center gap-3">
            <span className="text-2xl">{receita.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-800">{receita.name}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="flex items-center gap-1 text-[10px] text-slate-500"><Clock className="w-3 h-3" /> {receita.time}</span>
                <span className="text-[10px] text-orange-500 font-medium">{receita.difficulty}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="bg-orange-100 rounded-xl p-3 text-center text-xs text-orange-600 border border-orange-200">
          Toque 3x no logo para modo protegido ⚡
        </div>
      </div>
    </div>
  );
}

// ==============================
// PÁGINA PRINCIPAL
// ==============================
export default function ModoFurtivoPage() {
  const [mode, setMode] = useState<DisguiseMode>("legado");

  return (
    <main className="min-h-screen relative py-20 px-4">
      <div className="max-w-lg mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium mb-4">
            <EyeOff className="w-3.5 h-3.5" /> Demonstração Interativa
          </div>
          <h1 className="text-3xl font-bold text-slate-50 mb-2">Modo Furtivo</h1>
          <p className="text-slate-400 text-sm">
            Veja como o Legado se disfarça. Clique nos botões abaixo para trocar a aparência.
          </p>
        </div>

        {/* Seletor de Disfarce */}
        <div className="flex gap-2 mb-6 justify-center">
          <button
            onClick={() => setMode("legado")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === "legado"
                ? "bg-violet-500 text-slate-950"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700"
            }`}
          >
            <Shield className="w-3.5 h-3.5 inline mr-1.5" />
            O Legado (Real)
          </button>
          {DISGUISES.map((d) => (
            <button
              key={d.id}
              onClick={() => setMode(d.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                mode === d.id
                  ? "bg-violet-500 text-white"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700"
              }`}
            >
              <d.icon className="w-3.5 h-3.5 inline mr-1.5" />
              {d.name}
            </button>
          ))}
        </div>

        {/* Simulador - Moldura de Celular */}
        <motion.div
          className="bg-slate-950 rounded-[2.5rem] p-3 border-2 border-slate-700 shadow-2xl shadow-black/60 mx-auto max-w-[360px]"
          layout
        >
          {/* Status bar */}
          <div className="flex justify-between items-center px-4 py-1.5 text-[10px] text-slate-400 font-medium">
            <span>9:41</span>
            <div className="w-20 h-5 bg-slate-900 rounded-full" /> {/* Dynamic Island */}
            <span>100% 🔋</span>
          </div>

          {/* Screen */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden"
            >
              {mode === "legado" && (
                <div className="bg-slate-900 min-h-[480px] rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mb-4">
                    <Shield className="w-8 h-8 text-violet-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-50 mb-1">O Legado</h3>
                  <p className="text-xs text-slate-500 mb-6">Proteção ativa</p>
                  <div className="w-full space-y-2">
                    <div className="bg-rose-500/20 border border-rose-500/30 rounded-xl py-3 text-sm font-bold text-rose-400">🔴 SOS Emergência</div>
                    <div className="bg-violet-500/20 border border-violet-500/30 rounded-xl py-3 text-sm font-bold text-violet-400">🕵️ Relato Furtivo</div>
                    <div className="bg-violet-500/20 border border-violet-500/30 rounded-xl py-3 text-sm font-bold text-violet-400">🤖 IA Conselheira</div>
                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl py-3 text-sm font-bold text-amber-400">📚 Escola de Pais</div>
                  </div>
                </div>
              )}
              {mode === "notas" && <NotasUI />}
              {mode === "calculadora" && <CalculadoraUI />}
              {mode === "receitas" && <ReceitasUI />}
            </motion.div>
          </AnimatePresence>

          {/* Home indicator */}
          <div className="mx-auto mt-2 w-28 h-1 bg-slate-700 rounded-full" />
        </motion.div>

        {/* Legenda */}
        <div className="mt-8 text-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium ${
            mode === "legado"
              ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
              : "bg-violet-500/10 text-violet-400 border border-violet-500/20"
          }`}>
            {mode === "legado" ? (
              <><Eye className="w-4 h-4" /> Interface real do Legado</>
            ) : (
              <><EyeOff className="w-4 h-4" /> Agressor vê: app normal. Proteção continua ativa por baixo.</>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
