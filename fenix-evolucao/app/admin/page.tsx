"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Users, Zap, AlertTriangle, ArrowUpRight, CheckCircle2 } from "lucide-react";

const KPICard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-110`} />
    <div className="flex justify-between items-start mb-4 relative z-10">
      <div className={`p-3 rounded-2xl bg-${color}-500/10 border border-${color}-500/20`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      {change && (
        <span className="flex items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          <ArrowUpRight className="w-3 h-3 mr-1" /> {change}
        </span>
      )}
    </div>
    <div className="relative z-10">
      <h3 className="text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-slate-50">{value}</p>
    </div>
  </div>
);

export default function AdminPage() {
  return (
    <div className="p-8 md:p-12">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-50 mb-2">Visão Geral Global</h2>
          <p className="text-slate-400">Monitoramento em tempo real do ecossistema O Legado.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-bold">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          SISTEMA ONLINE
        </div>
      </header>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <KPICard title="Vidas Protegidas" value="1.248" change="+12%" icon={ShieldCheck} color="emerald" />
        <KPICard title="Membros Fundadores" value="342" change="+5%" icon={Users} color="blue" />
        <KPICard title="Interações IA (Mensais)" value="45.2K" change="+28%" icon={Zap} color="amber" />
        <KPICard title="Alertas SOS Ativos" value="0" icon={AlertTriangle} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico Fake / Relatório IA */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Inteligência Preditiva (Nemotron)
          </h3>
          <div className="h-64 flex flex-col justify-center items-center border border-white/5 rounded-2xl bg-black/20 overflow-hidden relative">
            {/* Visual placeholder for a chart */}
            <div className="absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/20 to-transparent" />
            <svg className="w-full h-full absolute inset-0 opacity-50" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,100 L0,50 Q25,30 50,70 T100,40 L100,100 Z" fill="rgba(16, 185, 129, 0.1)" />
              <path d="M0,50 Q25,30 50,70 T100,40" fill="none" stroke="#34d399" strokeWidth="2" />
            </svg>
            <div className="relative z-10 text-center">
              <p className="text-emerald-400 font-mono text-sm mb-1">Análise de Risco Geográfica</p>
              <p className="text-slate-500 text-xs">Mapeamento dinâmico baseado em consultas ao Conselheiro IA</p>
            </div>
          </div>
        </div>

        {/* Feed de Alertas Recentes */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col">
          <h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            Feed de Operações
          </h3>
          <div className="flex-1 space-y-4">
            {[
              { id: "10x", tipo: "Geofencing Preventivo", status: "Resolvido", tempo: "Há 10 min", warning: false },
              { id: "10y", tipo: "Relato Furtivo (Placa)", status: "Criptografado", tempo: "Há 42 min", warning: false },
              { id: "10z", tipo: "SOS Falso Positivo", status: "Cancelado", tempo: "Há 2 horas", warning: true },
              { id: "11a", tipo: "Novo Membro Associado", status: "Pagamento Aprovado", tempo: "Há 3 horas", warning: false, icon: CheckCircle2 },
            ].map((alerta, i) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={alerta.id} 
                className={`p-4 rounded-2xl border ${alerta.warning ? 'bg-amber-500/5 border-amber-500/20' : 'bg-white/5 border-white/10'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-bold ${alerta.warning ? 'text-amber-400' : 'text-slate-300'}`}>
                    {alerta.tipo}
                  </span>
                  <span className="text-xs text-slate-500">{alerta.tempo}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  {alerta.icon ? <alerta.icon className="w-3.5 h-3.5 text-emerald-400" /> : <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />}
                  {alerta.status}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
