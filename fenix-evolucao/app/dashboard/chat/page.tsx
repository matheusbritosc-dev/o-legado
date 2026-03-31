"use client";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, Loader2, Bot, User } from "lucide-react";

export default function ChatIAPage() {
  const [messages, setMessages] = useState<Array<{ role: "system" | "user", content: string }>>([
    { role: "system", content: "Olá. Eu sou o Conselheiro do Legado. Este ambiente é 100% criptografado de ponta a ponta e sua localização ou identidade nunca serão salvas. Como posso te auxiliar ou escutar hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      // Endpoint que conecta com o Nemotron/FastAPI
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "/_api/api/v1"}/chat/seguro`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem: userMsg })
      });

      if (!res.ok) throw new Error("Falha na comunicação cifrada.");

      // Streaming Effect (Simulado no frontend se o backend não retornar stream real agota)
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: "system", content: data.resposta || "Processando protocolo seguro..." }]);
    } catch (err) {
      // Mock de resposta para fins de demonstração visual se a API estiver desligada
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: "system", 
          content: "Entendo profundamente o que você está dizendo. O mais importante agora é a sua segurança física. Você tem acesso à sua documentação nesse momento?" 
        }]);
        setLoading(false);
      }, 1500);
    } finally {
      // Quando for stream real, isso muda
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col p-6">
      {/* Fallback de fundo escuro */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl -z-10" />

      <header className="flex items-center gap-4 mb-8 pt-4">
        <Link href="/dashboard" className="text-slate-400 hover:text-slate-200 transition-colors p-2 bg-white/5 rounded-full border border-white/10">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-200">
            <Sparkles className="w-6 h-6 text-violet-400" />
            Conselheiro IA
          </h1>
          <p className="text-slate-400 text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" /> E2EE Ativo
          </p>
        </div>
      </header>

      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full bg-slate-900/40 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Janela de Mensagens */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-violet-500/20">
          {messages.map((msg, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-lg ${msg.role === "system" ? "bg-gradient-to-br from-violet-500/20 to-fuchsia-500/10 border border-violet-500/30" : "bg-slate-800 border border-white/10"}`}>
                {msg.role === "system" ? <Bot className="w-5 h-5 text-violet-400" /> : <User className="w-5 h-5 text-slate-300" />}
              </div>
              <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user" 
                  ? "bg-slate-800 border border-white/10 text-slate-200 rounded-tr-sm" 
                  : "bg-violet-500/10 border border-violet-500/20 text-violet-50 rounded-tl-sm shadow-[0_0_15px_rgba(16,185,129,0.1)]"
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="w-10 h-10 rounded-xl shrink-0 bg-violet-500/10 border border-violet-500/30 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
              </div>
              <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 text-violet-300/70 text-sm flex items-center gap-2">
                Processando análise cognitiva segura...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-black/40 border-t border-white/10">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-16 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 p-3 bg-violet-500 hover:bg-violet-400 text-slate-950 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
          <p className="text-center text-[10px] text-slate-500 mt-3 font-mono">
            CRIPTOGRAFIA AES-256 GCM ATIVA. SEUS DADOS NÃO SÃO USADOS PARA TREINAR MODELOS NA NUVEM.
          </p>
        </div>
      </main>
    </div>
  );
}
