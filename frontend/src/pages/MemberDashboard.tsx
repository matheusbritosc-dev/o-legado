import { CheckCircle2, BookOpen, Star, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MemberDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Simples */}
      <aside className="w-64 bg-legado-primary text-white p-6 hidden md:flex flex-col">
        <div className="flex items-center gap-2 mb-12">
          <Star className="w-6 h-6 text-legado-gold fill-legado-gold" />
          <span className="font-serif font-bold text-xl tracking-wider">O Legado</span>
        </div>
        
        <nav className="flex-1 space-y-4">
          <a href="#" className="block px-4 py-3 rounded-lg bg-white/10 text-white font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-legado-accent" /> Assinatura
          </a>
          <a href="/manifesto" className="block px-4 py-3 rounded-lg hover:bg-white/5 text-slate-300 font-medium flex items-center gap-3 transition-colors">
            <BookOpen className="w-5 h-5" /> Manifesto VIP
          </a>
        </nav>
        
        <button className="flex items-center gap-2 text-slate-400 hover:text-white mt-auto">
          <LogOut className="w-5 h-5" /> Sair
        </button>
      </aside>

      {/* Area Principal */}
      <main className="flex-1 p-8 md:p-12">
        <header className="mb-12">
          <h1 className="text-3xl font-serif font-bold text-slate-800">Bem-vinda, Apoiadora Fundadora!</h1>
          <p className="text-slate-500 mt-2">Sua assinatura está ativa e salvando vidas agora mesmo.</p>
        </header>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 max-w-3xl"
        >
          <div className="flex items-start justify-between border-b border-slate-100 pb-6 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 uppercase tracking-wide mb-3">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Ativo
              </span>
              <h2 className="text-2xl font-bold text-slate-800">Plano Anual - Membro Fundador</h2>
              <p className="text-slate-500 mt-1">Sua renovação está agendada para 18/03/2027</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold text-legado-primary">R$ 500</span>
              <span className="block text-sm text-slate-400">Pago via PIX em Março 2026</span>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-bold text-lg text-slate-700">Seus Benefícios Desbloqueados:</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-legado-primary mb-1">Acesso à Escola de Pais</h4>
                <p className="text-sm text-slate-500 mb-3">Aulas e Trilhas de gamificação abertas.</p>
                <button className="text-sm font-bold text-legado-accent hover:underline">Acessar Plataforma &rarr;</button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-legado-primary mb-1">Tutor IA (Beta)</h4>
                <p className="text-sm text-slate-500 mb-3">Tire dúvidas sobre inteligência emocional na prática com nosso Tutor E2EE.</p>
                <button className="text-sm font-bold text-legado-accent hover:underline">Iniciar Chat &rarr;</button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
