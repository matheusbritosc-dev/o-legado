import { useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Lock, Mail, Loader2, Heart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");
  const isJusticeira = ref === "justiceiras";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Se for Justiceira, salvamos a flag no localStorage para uso no Dashboard
      if (isJusticeira) {
        localStorage.setItem("legado_user_tag", "JUSTICEIRA");
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const errorMsg = typeof data.error === 'string' ? data.error : (data.detail || "E-mail ou senha incorretos.");
        throw new Error(errorMsg);
      }

      router.push("/dashboard");
      router.refresh();

    } catch (err: any) {
      const msg = err?.message || "Erro ao conectar.";
      setError(typeof msg === 'string' ? msg : "Erro ao conectar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] -z-10" />

      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors z-20">
        <ArrowLeft className="w-4 h-4" /> Voltar
      </Link>

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/50 relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-8 relative z-10">
            {isJusticeira && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-widest mb-4"
              >
                <Heart className="w-3 h-3 fill-rose-500" /> Convite Especial Ativo
              </motion.div>
            )}
            <h1 className="text-2xl font-bold text-slate-50 tracking-tight mb-2">
              {isJusticeira ? "Bem-vinda, Justiceira! 🛡️" : "Acesso Restrito"}
            </h1>
            <p className="text-sm text-slate-400">
              {isJusticeira 
                ? "Sua tecnologia de proteção está pronta para ser ativada."
                : "Insira suas credenciais blindadas."}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm text-center font-medium animate-in fade-in zoom-in-95 duration-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-violet-400 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-black/40 border border-white/10 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 px-4 rounded-2xl text-slate-950 bg-violet-500 hover:bg-violet-400 font-bold tracking-wide transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] mt-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isJusticeira ? "Ativar Meu Acesso VIP" : "Autenticar Conexão")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500 relative z-10">
            Esqueceu sua senha? <Link href="#" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Recuperação Segura</Link>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">Carregando portal de acesso...</div>}>
      <LoginContent />
    </Suspense>
  );
}
