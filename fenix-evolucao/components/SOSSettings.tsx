"use client";
import { useState, useEffect } from "react";
import { Settings, Shield, Smartphone, Save, Check } from "lucide-react";

export default function SOSSettings() {
  const [shakeCount, setShakeCount] = useState("3");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedShake = localStorage.getItem("legado_shake_count") || "3";
    const savedNumber = localStorage.getItem("legado_emergency_number") || "";
    setShakeCount(savedShake);
    setEmergencyNumber(savedNumber);
  }, []);

  const handleSave = () => {
    localStorage.setItem("legado_shake_count", shakeCount);
    localStorage.setItem("legado_emergency_number", emergencyNumber);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-violet-400" />
        <h2 className="text-xl font-bold text-slate-100">Configurações de Segurança</h2>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Padrão de Ativação (Chacoalhão)
          </label>
          <select 
            value={shakeCount}
            onChange={(e) => setShakeCount(e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500/50"
          >
            <option value="2">2 Chacoalhadas Rápidas</option>
            <option value="3">3 Chacoalhadas Rápidas (Recomendado)</option>
            <option value="5">5 Chacoalhadas (Máxima Precisão)</option>
          </select>
          <p className="text-[10px] text-slate-500 mt-2">
            Evita disparos acidentais ao deixar o celular na bolsa ou cair no chão.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
            <Settings className="w-4 h-4" /> Número da Central de Monitoramento
          </label>
          <input 
            type="tel"
            value={emergencyNumber}
            onChange={(e) => setEmergencyNumber(e.target.value)}
            placeholder="Ex: 62999999999"
            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-violet-500/50"
          />
          <p className="text-[10px] text-slate-500 mt-2">
            Em caso de emergência sem internet, um SMS será enviado para este número.
          </p>
        </div>

        <button 
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all"
        >
          {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? "Configurações Salvas!" : "Salvar Configurações"}
        </button>
      </div>
    </div>
  );
}
