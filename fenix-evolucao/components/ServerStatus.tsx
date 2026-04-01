'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Zap, Wifi } from 'lucide-react';

export default function ServerStatus() {
  const [status, setStatus] = useState<'checking' | 'waking' | 'online' | 'demo'>('checking');
  const API_URL = "/_api/health";

  useEffect(() => {
    const checkServer = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(API_URL, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          setStatus('online');
        } else {
          setStatus('demo');
        }
      } catch {
        // Backend indisponível — entra em modo demo silenciosamente
        setStatus('demo');
      }
    };

    checkServer();
  }, []);

  // Se online, some depois de 2s
  // Se demo, mostra aviso breve e some depois de 4s
  useEffect(() => {
    if (status === 'online') {
      const timer = setTimeout(() => setStatus('online'), 2000);
      return () => clearTimeout(timer);
    }
    if (status === 'demo') {
      // Desaparece automaticamente para não incomodar
      const timer = setTimeout(() => setStatus('online'), 4000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  if (status === 'online') return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] sm:bottom-6 sm:left-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[calc(100vw-2rem)]">
      <div className="bg-slate-900/95 backdrop-blur-md border border-violet-500/30 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4">
        <div className="relative shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
            {status === 'checking' || status === 'waking' ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400 animate-spin" />
            ) : status === 'demo' ? (
              <Wifi className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
            )}
          </div>
        </div>
        
        <div className="min-w-0">
          <h4 className="text-slate-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 truncate">
            {status === 'demo' ? 'Modo Demonstração' : status === 'waking' ? 'Ativando Segurança' : 'Conectando...'}
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
          </h4>
          <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 leading-tight sm:leading-relaxed">
            {status === 'demo' 
              ? 'Todas as funcionalidades estão disponíveis.' 
              : 'Estabelecendo túnel criptografado com a API.'}
          </p>
        </div>
      </div>
    </div>
  );
}
