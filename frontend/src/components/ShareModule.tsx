import { Share2, MessageCircle, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShareModule() {
  const shareMessage = "Eu apoio o Legado: Proteção para todas nós. Junte-se a esse movimento! 🛡️✨ https://legado.com.br";
  
  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'O Legado',
          text: 'Eu apoio o Legado: Proteção para todas nós.',
          url: 'https://legado.com.br',
        });
      } catch (err) {
        console.log('Erro ao compartilhar', err);
      }
    }
  };

  return (
    <div className="bg-legado-bg py-16 text-center px-4">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-3xl font-serif font-bold text-legado-primary mb-4">Espalhe o Legado</h2>
        <p className="text-legado-text/80 text-lg mb-8 max-w-xl mx-auto">
          Nós não estamos aqui para vender um software. Estamos aqui para fundar um movimento. Compartilhe com quem você ama.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={handleWhatsApp}
            className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebd5b] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
          >
            <MessageCircle className="w-5 h-5" /> Compartilhar no WhatsApp
          </button>
          
          <button 
            onClick={handleNativeShare}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:opacity-90 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg"
          >
            <Instagram className="w-5 h-5" /> Mais Opções
          </button>
        </div>
      </motion.div>
    </div>
  );
}
