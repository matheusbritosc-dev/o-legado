"use client";
import Link from "next/link";
import { ShieldAlert, Activity, Users, Settings, LogOut, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Visão Geral", icon: Activity, href: "/admin" },
    { label: "Central SOS", icon: ShieldAlert, href: "/admin/sos" },
    { label: "Membros", icon: Users, href: "/admin/membros" },
    { label: "Configurações", icon: Settings, href: "/admin/config" },
  ];

  return (
    <div className="min-h-screen relative flex bg-slate-950 text-slate-50">
      {/* Fallback de background puro escuro caso o InteractiveBackground não cubra, mas a ideia é ser transparente para a layer principal */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-3xl -z-10" />

      {/* Sidebar Admin */}
      <aside className="w-72 bg-slate-900/50 backdrop-blur-2xl border-r border-white/10 p-6 flex flex-col relative z-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-700 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <ShieldAlert className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-200">
              O LEGADO
            </h1>
            <p className="text-[10px] text-violet-500/70 font-mono tracking-widest uppercase">Command Center</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/20 shadow-inner"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Site
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent transition-all text-sm font-medium">
            <LogOut className="w-4 h-4" />
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
