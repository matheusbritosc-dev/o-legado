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
          className="fixed bottom-20 right-4 left-4 md:bottom-6 md:left-auto md:right-6 md:w-96 z-[90]"
        >
          <div className="bg-slate-900/98 backdrop-blur-2xl border border-violet-500/20 shadow-2xl shadow-black/80 rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-800 border border-slate-700 flex-shrink-0 flex items-center justify-center p-1.5 sm:p-2">
              <img src="/icon.svg" alt="App Icon" className="w-6 h-6 sm:w-8 sm:h-8 drop-shadow-lg" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-slate-50 font-bold text-xs sm:text-sm mb-0.5 truncate">Instalar Legado</h4>
              <p className="text-slate-400 text-[10px] sm:text-xs leading-tight line-clamp-2">
                {isIOS ? 'Toque em Compartilhar > Adicionar à Tela de Início' : 'Acesse offline como um aplicativo nativo.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {!isIOS && (
                <button
                  onClick={handleInstallClick}
                  className="px-3 py-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-[10px] sm:text-xs transition-all shadow-lg shadow-violet-500/20 whitespace-nowrap"
                >
                  Instalar
                </button>
              )}
              <button 
                onClick={() => setShowPrompt(false)}
                className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
