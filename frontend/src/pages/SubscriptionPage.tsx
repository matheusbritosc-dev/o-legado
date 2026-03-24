import { Check, Shield, Star, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-legado-bg">
      <header className="bg-legado-primary text-white py-12 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-legado-gold font-bold uppercase tracking-wider text-sm mb-4 block">Apoio Financeiro & Acesso Antecipado</span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Seja um Membro Fundador</h1>
          <p className="text-xl text-slate-300">
            Mais do que uma assinatura, um investimento na proteção de milhares de mulheres. O valor gerado aqui financia a infraestrutura de IA e a gratuidade para quem mais precisa.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Plano Mensal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 border border-slate-100 flex flex-col"
          >
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Apoio Base</h3>
            <p className="text-slate-500 mb-6">Ajude a manter as operações ativas.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-legado-primary">R$ 49</span>
              <span className="text-slate-500 font-medium">/mês</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-700">
                <Check className="w-6 h-6 text-legado-accent flex-shrink-0" />
                <span>Acesso exclusivo ao <strong>Dashboard de Membro</strong></span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <Check className="w-6 h-6 text-legado-accent flex-shrink-0" />
                <span>Leia a íntegra do Manifesto Estendido</span>
              </li>
              <li className="flex gap-3 text-slate-700">
                <Check className="w-6 h-6 text-legado-accent flex-shrink-0" />
                <span>Certificado digital de 'Apoiadora Base'</span>
              </li>
            </ul>

            <button className="w-full py-4 rounded-xl border-2 border-legado-primary text-legado-primary font-bold hover:bg-slate-50 transition-colors">
              Apoiar Mensalmente
            </button>
          </motion.div>

          {/* Plano Fundador VIP */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-legado-primary rounded-3xl shadow-xl shadow-legado-primary/30 p-8 border border-legado-secondary/50 flex flex-col relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-legado-gold text-legado-primary text-xs font-bold uppercase py-1 px-4 rounded-bl-xl">
              Mais Escala
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">Membro Fundador <Star className="w-5 h-5 text-legado-gold fill-legado-gold" /></h3>
            <p className="text-slate-300 mb-6">Financie o equivalente a 10 acessos gratuitos.</p>
            <div className="mb-8">
              <span className="text-5xl font-extrabold text-white">R$ 500</span>
              <span className="text-slate-400 font-medium">/ano</span>
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex gap-3 text-slate-200">
                <Check className="w-6 h-6 text-legado-gold flex-shrink-0" />
                <span><strong>Acesso Beta Imediato</strong> à Tutoria IA</span>
              </li>
              <li className="flex gap-3 text-slate-200">
                <Check className="w-6 h-6 text-legado-gold flex-shrink-0" />
                <span>Acesso antecipado à <strong>Escola de Pais</strong></span>
              </li>
              <li className="flex gap-3 text-slate-200">
                <Check className="w-6 h-6 text-legado-gold flex-shrink-0" />
                <span><strong>Seu nome gravado</strong> no Mural do Legado (Opcional)</span>
              </li>
              <li className="flex gap-3 text-slate-200">
                <Check className="w-6 h-6 text-legado-gold flex-shrink-0" />
                <span>Prioridade no Matching de Vagas Ocultas</span>
              </li>
            </ul>

            <button className="w-full py-4 rounded-xl bg-legado-gold text-legado-primary font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 shadow-lg">
              <Lock className="w-4 h-4" /> Assinar via Checkout PIX
            </button>
            <p className="text-center text-xs text-slate-400 mt-4 flex justify-center items-center gap-1">
               <Shield className="w-3 h-3" /> PCI-DSS Compliant via Stripe/MercadoPago
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
