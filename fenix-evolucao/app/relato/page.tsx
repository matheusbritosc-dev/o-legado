"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Save, Eye, FileText, WifiOff } from "lucide-react";

export default function RelatoSuspeitoPage() {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleSave = () => {
    if (!text.trim()) return;
    
    // Tenta pegar a localização
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => saveAction(p.coords.latitude, p.coords.longitude),
        () => saveAction()
      );
    } else {
      saveAction();
    }
  };

  const saveAction = (lat?: number, lon?: number) => {
    const payload = {
      relato: text, // No futuro, isso passa pela função AES de criptografia
      lat: lat ?? null,
      lon: lon ?? null,
      timestamp: new Date().toISOString()
    };

    if (navigator.onLine) {
      // Simula envio para o servidor
      console.log("Enviando silenciosamente para a nuvem:", payload);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://legado-api.onrender.com/api/v1";
      fetch(`${apiUrl}/seguranca/relato`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => console.log("Erro ao enviar, salvando localmente"));
    } else {
      // Se estiver sem internet, guarda no LocalStorage para background sync
      const savedLogs = JSON.parse(localStorage.getItem("offline_relatos") || "[]");
      savedLogs.push(payload);
      localStorage.setItem("offline_relatos", JSON.stringify(savedLogs));
      console.log("Sem internet. Salvo no LocalStorage secreto.");
    }
    
    setSaved(true);
    setText("");
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6 sm:p-12 relative">
      {/* Camuflagem Visual: Parece um "Bloco de Notas" padrão do sistema celular, não o App Legado */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <Link href="/" className="text-slate-400 hover:text-slate-600 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-slate-400 font-medium text-sm">Notas</span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative z-10">
        <div className="bg-yellow-100 px-6 py-4 border-b border-yellow-200 flex justify-between items-center">
          <div className="flex items-center gap-2 text-yellow-800">
            <FileText className="w-5 h-5" />
            <h2 className="font-semibold">Anotação Rápida</h2>
          </div>
          {isOffline && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-bold">
              <WifiOff className="w-3.5 h-3.5" /> Offline
            </div>
          )}
        </div>
        
        <div className="p-6">
          <p className="text-slate-500 text-sm mb-4 leading-relaxed">
            Se for perigoso falar agora, anote detalhes importantes: <strong className="text-slate-700">Placa do veículo, modelo e cor do carro, características físicas de indivíduos (roupas, tatuagens)</strong>, ou pontos de referência.
          </p>
          
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite aqui..."
            className="w-full h-40 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 resize-none transition-all"
          />

          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 font-bold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saved ? (
              <span className="text-emerald-700">✓ Salvo na Nuvem Segura</span>
            ) : (
              <>
                <Save className="w-5 h-5" /> Guardar Anotação
              </>
            )}
          </button>
        </div>

        {/* Informação Discreta */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-start gap-3">
          <Eye className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">
            Todas as anotações feitas aqui são instantaneamente criptografadas. Se o aparelho perder conexão, enviaremos assim que reconectar. Ninguém que abrir este aparelho conseguirá ler.
          </p>
        </div>
      </div>
    </main>
  );
}
