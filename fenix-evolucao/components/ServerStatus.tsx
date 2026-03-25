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
    <div className="fixed bottom-4 left-4 z-[100] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-900/90 backdrop-blur-md border border-violet-500/30 p-4 rounded-2xl shadow-2xl flex items-center gap-4 max-w-sm">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center">
            {status === 'checking' || status === 'waking' ? (
              <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            )}
          </div>
          {status === 'waking' && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-violet-500"></span>
            </span>
          )}
        </div>
        
        <div>
          <h4 className="text-slate-100 text-sm font-bold flex items-center gap-2">
            {status === 'waking' ? 'Ativando Camada de Segurança' : 'Verificando Conexão...'}
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
          </h4>
          <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
            {status === 'waking' 
              ? 'O servidor seguro está sendo inicializado. Pode levar até 40 segundos.' 
              : 'Estabelecendo túnel criptografado com a API da Legado.'}
          </p>
        </div>
      </div>
    </div>
  );
}
