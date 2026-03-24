"use client";
import { motion } from "framer-motion";
import { MessageCircle, Share2 } from "lucide-react";

export default function ShareSection() {
  const msg = encodeURIComponent(
    "Eu apoio o Legado: Proteção para todas nós. 🛡️✨ Junte-se ao movimento! https://legado.com.br"
  );

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-slate-900 to-slate-950 border-t border-slate-800">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="text-emerald-400 font-semibold tracking-widest uppercase text-sm mb-4">
            Espalhe o Legado
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-50 mb-5">
            Cada compartilhamento{" "}
            <span className="text-gradient">salva uma vida</span>
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Nós não estamos aqui para vender um software. Estamos aqui para fundar um movimento. Compartilhe com quem você ama.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/?text=${msg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1ebd5b] text-white font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-green-900/30"
            >
              <MessageCircle className="w-5 h-5" /> WhatsApp
            </a>
            <button
              onClick={() => navigator.share?.({ title: "O Legado", text: "Eu apoio o Legado: Proteção para todas nós.", url: "https://legado.com.br" })}
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 via-pink-500 to-orange-500 text-white font-bold transition-all hover:-translate-y-0.5 shadow-lg shadow-purple-900/30"
            >
              <Share2 className="w-5 h-5" /> Compartilhar
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
