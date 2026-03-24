"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X } from "lucide-react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Registra o Service Worker para habilitar recursos offline
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => console.log('PWA ServiceWorker registrado com escopo:', registration.scope),
        (err) => console.log('PWA ServiceWorker falhou:', err)
      );
    }

    // Android/Chrome: intercepta o evento nativo de instalação
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Detecta se é iOS para mostrar instruções nativas (já que a Apple não dispara o evento)
    const ua = window.navigator.userAgent;
    const isIOSDevice = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || // @ts-ignore
      window.navigator.standalone;

    if (isIOSDevice && !isStandalone) {
      setIsIOS(true);
      // Podemos mostrar depois de alguns segundos para não ser agressivo
      setTimeout(() => setShowPrompt(true), 3000);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    }
  };

  if (!showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-[9999]"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 shadow-2xl shadow-emerald-900/40 rounded-2xl p-4 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center p-2">
              {/* O icone oficial ou furitvo pode ir aqui */}
              <img src="/icon.svg" alt="App Icon" className="w-8 h-8 drop-shadow-lg" />
            </div>
            
            <div className="flex-1">
              <h4 className="text-slate-50 font-bold text-sm mb-1">Proteção na Tela Inicial</h4>
              {isIOS ? (
                <p className="text-slate-400 text-xs leading-relaxed">
                  Toque em <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-200">Compartilhar</span> 
                  e depois em <strong className="text-emerald-400">Adicionar à Tela de Início</strong> para instalar.
                </p>
              ) : (
                <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                  Instale o Legado como um aplicativo protegido no seu dispositivo para acesso <span className="text-emerald-400 font-bold">offline</span>.
                </p>
              )}

              {!isIOS && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  Instalar App (Acesso Rápido)
                </button>
              )}
            </div>

            <button 
              onClick={() => setShowPrompt(false)}
              className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors absolute top-2 right-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
