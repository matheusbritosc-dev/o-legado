import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Manifesto() {
  return (
    <div className="min-h-screen bg-legado-bg">
      <header className="bg-legado-primary text-white py-6 px-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link to="/" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold font-serif tracking-wide">O Manifesto do Legado</h1>
        </div>
      </header>
      
      <main className="max-w-3xl mx-auto px-4 py-16">
        <motion.article 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100"
        >
          <span className="text-legado-accent font-bold tracking-widest uppercase text-sm mb-6 block">Nossa Missão</span>
          
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-legado-primary leading-tight mb-8">
            Nenhuma Mulher Deve Caminhar com Medo.
          </h1>
          
          <div className="prose prose-lg prose-slate max-w-none text-slate-700 space-y-6">
            <p className="text-xl font-medium leading-relaxed">
              Nós não estamos aqui para vender um software. Estamos aqui para fundar um movimento. 🛡️✨
            </p>
            
            <p>
              O Legado nasceu da união entre a tecnologia mais avançada do mundo e a coragem de quem acredita que a transformação é possível. Nós criamos um ecossistema que protege a mulher hoje com segurança de nível militar e educa o homem de amanhã para que a violência acabe na raiz.
            </p>

            <div className="bg-slate-50 p-8 rounded-2xl border-l-4 border-legado-gold my-8">
              <h3 className="text-2xl font-bold text-legado-primary mb-6">Nossos Pilares:</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-legado-accent mt-1">✦</span>
                  <span><strong>Proteção Real:</strong> Inteligência Artificial que monitora, alerta e protege em tempo real, com sigilo absoluto.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-legado-accent mt-1">✦</span>
                  <span><strong>Educação de Base:</strong> Uma escola para pais e mães, ensinando empatia e respeito desde o berço.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-legado-accent mt-1">✦</span>
                  <span><strong>Reinserção com Dignidade:</strong> Transformando vidas através de oportunidades reais e seguras.</span>
                </li>
              </ul>
            </div>

            <p className="text-xl font-serif text-legado-primary font-medium italic mt-12 text-center">
              "Este é o meu compromisso. Esta é a minha história. Este é o nosso Legado. Junte-se a nós e ajude a construir um Brasil onde o medo não tenha mais lugar."
            </p>
          </div>

          <div className="mt-16 text-center">
             <Link to="/" className="inline-flex justify-center items-center px-8 py-4 rounded-full bg-legado-primary hover:bg-slate-800 text-white font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                Fazer Parte do Movimento
             </Link>
          </div>
        </motion.article>
      </main>
    </div>
  );
}
