import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wide mb-8">
          Segurança de Grau Militar & Auditoria Contínua
        </p>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-4">
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1 border border-slate-100 p-4 rounded-xl shadow-sm items-center gap-3">
            <Lock className="w-8 h-8 text-legado-primary" />
            <span className="font-bold text-slate-700">Criptografia E2EE (AES-256)</span>
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1 border border-slate-100 p-4 rounded-xl shadow-sm items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-legado-accent" />
            <span className="font-bold text-slate-700">PostgreSQL Seguro</span>
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1 border border-slate-100 p-4 rounded-xl shadow-sm items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-legado-gold" />
            <span className="font-bold text-slate-700">100% LGPD Compliant</span>
          </div>
          <div className="col-span-1 flex justify-center md:col-span-2 lg:col-span-1 border border-slate-100 p-4 rounded-xl shadow-sm items-center gap-3">
            <Lock className="w-8 h-8 text-legado-secondary" />
            <span className="font-bold text-slate-700">Soberania de Dados</span>
          </div>
        </div>
      </div>
    </div>
  );
}
