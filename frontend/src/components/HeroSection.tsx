import { Shield, BookOpen, HeartHandshake, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="relative bg-legado-primary text-white overflow-hidden py-24">
      {/* Background Graphic */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-legado-accent via-legado-primary to-legado-primary"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          className="md:w-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-legado-gold font-bold tracking-wider uppercase text-sm mb-4 block">
            Lançamento Comunitário Oficial
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight mb-6">
            Nenhuma Mulher Deve Caminhar com Medo.
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-lg">
            A união entre a tecnologia mais avançada do mundo e a coragem de quem acredita que a transformação é possível.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#cadastro" className="inline-flex justify-center items-center px-8 py-3 rounded-full bg-legado-accent hover:bg-emerald-600 text-white font-bold transition-colors shadow-lg shadow-emerald-900/50">
              Faça Parte do Eco <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a href="/manifesto" className="inline-flex justify-center items-center px-8 py-3 rounded-full border border-slate-400 hover:border-white hover:bg-white/10 text-white font-semibold transition-colors">
              Leia o Manifesto
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          className="md:w-1/2 grid grid-cols-1 gap-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex gap-4">
            <div className="bg-legado-accent/20 p-3 rounded-full h-fit">
              <Shield className="w-6 h-6 text-legado-accent" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-white">Proteção Real</h3>
              <p className="text-slate-300">Monitoramento e alertas em tempo real com sigilo absoluto.</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex gap-4 ml-0 md:ml-8">
            <div className="bg-legado-gold/20 p-3 rounded-full h-fit">
              <BookOpen className="w-6 h-6 text-legado-gold" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-white">Educação de Base</h3>
              <p className="text-slate-300">Escola para pais, ensinando empatia e respeito desde o berço.</p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 flex gap-4">
            <div className="bg-blue-400/20 p-3 rounded-full h-fit">
              <HeartHandshake className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <h3 className="font-bold text-xl mb-2 text-white">Reinserção</h3>
              <p className="text-slate-300">Transformando vidas com oportunidades reais e seguras.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
