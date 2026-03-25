'use client';

import { useState, useEffect } from 'react';
import { Loader2, ShieldCheck, Zap } from 'lucide-react';

export default function ServerStatus() {
  const [status, setStatus] = useState<'checking' | 'waking' | 'online'>('checking');
  const API_URL = "https://legado-api.onrender.com/api/v1/health";

  useEffect(() => {
    const checkServer = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 seconds timeout

        const response = await fetch(API_URL, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          setStatus('online');
        } else {
          setStatus('waking');
        }
      } catch (error) {
        // Se der timeout ou erro de conexão, provavelmente está dormindo
        setStatus('waking');
        
        // Tenta novamente sem timeout curto para esperar o despertar
        try {
          const longResponse = await fetch(API_URL);
          if (longResponse.ok) setStatus('online');
        } catch (e) {
          console.error("Servidor Offline", e);
        }
      }
    };

    checkServer();
  }, []);

  if (status === 'online') return null;

  return (
    <div className="fixed bottom-4 left-4 z-[100] sm:bottom-6 sm:left-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-[calc(100vw-2rem)]">
      <div className="bg-slate-900/95 backdrop-blur-md border border-violet-500/30 p-3 sm:p-4 rounded-2xl shadow-2xl flex items-center gap-3 sm:gap-4">
        <div className="relative shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
            {status === 'checking' || status === 'waking' ? (
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            )}
          </div>
          {status === 'waking' && (
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-violet-500"></span>
            </span>
          )}
        </div>
        
        <div className="min-w-0">
          <h4 className="text-slate-100 text-xs sm:text-sm font-bold flex items-center gap-1.5 truncate">
            {status === 'waking' ? 'Ativando Segurança' : 'Conectando...'}
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400 shrink-0" />
          </h4>
          <p className="text-slate-400 text-[10px] sm:text-xs mt-0.5 leading-tight sm:leading-relaxed">
            {status === 'waking' 
              ? 'O servidor seguro está sendo inicializado (partida a frio).' 
              : 'Estabelecendo túnel criptografado com a API.'}
          </p>
        </div>
      </div>
    </div>
  );
}
