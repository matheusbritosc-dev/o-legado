"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase, ShieldCheck, MapPin, Clock, Building2, ExternalLink,
  Search, Filter, ArrowLeft, Star, CheckCircle, Heart, Lock
} from "lucide-react";
import Link from "next/link";

// ====================================================
// VAGAS — Adicione vagas reais aqui conforme as parcerias
// ====================================================
const VAGAS = [
  {
    id: 1,
    cargo: "Auxiliar Administrativo",
    empresa: "Instituto Mãos que Protegem",
    local: "Goiânia, GO",
    tipo: "CLT",
    jornada: "Seg-Sex · 8h-17h",
    salario: "R$ 1.800 - R$ 2.200",
    verificada: true,
    destaque: true,
    descricao: "Vaga exclusiva para mulheres em situação de recomeço. Ambiente acolhedor, sem exigência de experiência prévia. Treinamento completo oferecido.",
    requisitos: ["Ensino Médio completo", "Conhecimento básico em informática", "Vontade de aprender"],
    beneficios: ["Vale transporte", "Vale alimentação", "Plano de saúde", "Apoio psicológico"],
    tags: ["Primeiro emprego", "Acolhimento"],
    link: "#", // Link real de candidatura
  },
  {
    id: 2,
    cargo: "Atendente de Loja",
    empresa: "Rede Solidária do Comércio",
    local: "Aparecida de Goiânia, GO",
    tipo: "CLT",
    jornada: "Escala 6x1 · 6h",
    salario: "R$ 1.500 - R$ 1.800",
    verificada: true,
    destaque: false,
    descricao: "Rede de lojas comprometida com a empregabilidade feminina. Oferece horário flexível para mães e programa de crescimento interno.",
    requisitos: ["Ensino Médio completo", "Boa comunicação"],
    beneficios: ["Vale transporte", "Desconto em produtos", "Horário flexível para mães"],
    tags: ["Flexível", "Mães"],
    link: "#",
  },
  {
    id: 3,
    cargo: "Operadora de Telemarketing",
    empresa: "Central de Atendimento Fênix",
    local: "Remoto (Home Office)",
    tipo: "CLT",
    jornada: "Seg-Sex · 6h",
    salario: "R$ 1.412 + Comissão",
    verificada: true,
    destaque: false,
    descricao: "Trabalhe de casa com segurança. Empresa parceira do Legado que prioriza contratação de mulheres em situação de vulnerabilidade.",
    requisitos: ["Ensino Médio completo", "Internet estável", "Computador ou notebook"],
    beneficios: ["Home office", "Equipamento fornecido", "Vale alimentação"],
    tags: ["Home Office", "Seguro"],
    link: "#",
  },
  {
    id: 4,
    cargo: "Auxiliar de Cozinha",
    empresa: "Restaurante Recomeço",
    local: "Goiânia, GO",
    tipo: "CLT",
    jornada: "Seg-Sáb · 8h",
    salario: "R$ 1.500 - R$ 1.700",
    verificada: true,
    destaque: false,
    descricao: "Restaurante social que treina e emprega mulheres. Curso de gastronomia básica incluso nos primeiros 3 meses.",
    requisitos: ["Não é necessário experiência", "Disposição para aprender"],
    beneficios: ["Alimentação no local", "Curso de gastronomia gratuito", "Vale transporte"],
    tags: ["Sem experiência", "Capacitação"],
    link: "#",
  },
  {
    id: 5,
    cargo: "Desenvolvedora Web Júnior",
    empresa: "Tech4Her — Aceleradora",
    local: "Remoto",
    tipo: "Estágio → CLT",
    jornada: "Seg-Sex · 6h",
    salario: "R$ 2.000 - R$ 3.500",
    verificada: true,
    destaque: true,
    descricao: "Programa de aceleração para mulheres que querem entrar na área de tecnologia. 3 meses de mentoria + contratação CLT para as aprovadas.",
    requisitos: ["Curso em andamento (qualquer área)", "Interesse em programação", "Computador com internet"],
    beneficios: ["Mentoria individual", "Notebook fornecido", "Flexibilidade total", "Plano de carreira"],
    tags: ["Tecnologia", "Mentoria", "Carreira"],
    link: "#",
  },
];

const FILTROS = ["Todas", "Home Office", "Sem experiência", "Mães", "Tecnologia", "Capacitação"];

export default function VagasPage() {
  const [filtro, setFiltro] = useState("Todas");
  const [busca, setBusca] = useState("");
  const [vagaAberta, setVagaAberta] = useState<number | null>(null);

  const vagasFiltradas = VAGAS.filter((v) => {
    const matchBusca =
      v.cargo.toLowerCase().includes(busca.toLowerCase()) ||
      v.empresa.toLowerCase().includes(busca.toLowerCase()) ||
      v.local.toLowerCase().includes(busca.toLowerCase());
    const matchFiltro = filtro === "Todas" || v.tags.some((t) => t.toLowerCase().includes(filtro.toLowerCase()));
    return matchBusca && matchFiltro;
  });

  return (
    <main className="min-h-screen relative py-20 px-4 md:px-6">
      <div className="max-w-5xl mx-auto relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 mb-8 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-400 text-sm font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5" /> Empresas Verificadas pelo Legado
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-50 mb-4">
            Vagas{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-200">
              Seguras
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Oportunidades de emprego em empresas parceiras e verificadas. Sua identidade e segurança são nossa prioridade.
          </p>
        </div>

        {/* Garantias */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {[
            { icon: ShieldCheck, label: "Empresas verificadas", desc: "Toda empresa passa por validação" },
            { icon: Lock, label: "Dados protegidos", desc: "Sua candidatura é confidencial" },
            { icon: Heart, label: "Ambiente seguro", desc: "Zero tolerância a assédio" },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-4 h-4 text-violet-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Busca + Filtros */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por cargo, empresa ou cidade..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-white/10 hover:border-white/20 focus:border-violet-500 rounded-xl text-slate-100 placeholder-slate-500 outline-none transition-all text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {FILTROS.map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  filtro === f
                    ? "bg-violet-500 text-slate-950"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Contador */}
        <p className="text-sm text-slate-500 mb-6">
          <span className="text-violet-400 font-bold">{vagasFiltradas.length}</span> vaga{vagasFiltradas.length !== 1 ? "s" : ""} encontrada{vagasFiltradas.length !== 1 ? "s" : ""}
        </p>

        {/* Lista de Vagas */}
        <div className="space-y-4">
          <AnimatePresence>
            {vagasFiltradas.map((vaga, i) => (
              <motion.div
                key={vaga.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-slate-900/50 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${
                  vaga.destaque ? "border-violet-500/30" : "border-white/10"
                }`}
              >
                {/* Card Header */}
                <button
                  onClick={() => setVagaAberta(vagaAberta === vaga.id ? null : vaga.id)}
                  className="w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    vaga.destaque ? "bg-violet-500/10 border border-violet-500/20" : "bg-slate-800 border border-white/10"
                  }`}>
                    <Briefcase className={`w-5 h-5 ${vaga.destaque ? "text-violet-400" : "text-slate-400"}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-100 truncate">{vaga.cargo}</h3>
                      {vaga.destaque && (
                        <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 text-[10px] font-bold flex-shrink-0">
                          DESTAQUE
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {vaga.empresa}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {vaga.local}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {vaga.tipo}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-violet-400">{vaga.salario}</span>
                      {vaga.verificada && (
                        <span className="flex items-center gap-1 text-[10px] text-blue-400">
                          <CheckCircle className="w-3 h-3" /> Verificada
                        </span>
                      )}
                    </div>
                  </div>
                </button>

                {/* Detalhes Expandidos */}
                <AnimatePresence>
                  {vagaAberta === vaga.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 overflow-hidden"
                    >
                      <div className="px-6 py-5 space-y-4">
                        <p className="text-sm text-slate-300 leading-relaxed">{vaga.descricao}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Requisitos</p>
                            <ul className="space-y-1.5">
                              {vaga.requisitos.map((r) => (
                                <li key={r} className="flex items-start gap-2 text-xs text-slate-300">
                                  <span className="text-violet-400 mt-0.5">•</span> {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Benefícios</p>
                            <ul className="space-y-1.5">
                              {vaga.beneficios.map((b) => (
                                <li key={b} className="flex items-start gap-2 text-xs text-slate-300">
                                  <Star className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" /> {b}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {vaga.tags.map((tag) => (
                            <span key={tag} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 text-[10px] font-medium">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex gap-3 pt-2">
                          <a
                            href={vaga.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-sm transition-all"
                          >
                            Candidatar-se <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-all border border-white/10">
                            Salvar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {vagasFiltradas.length === 0 && (
          <div className="text-center py-16">
            <Briefcase className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Nenhuma vaga encontrada com esses filtros.</p>
          </div>
        )}

        {/* CTA para empresas */}
        <div className="mt-16 text-center bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
          <Building2 className="w-10 h-10 text-violet-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-100 mb-2">É uma empresa e quer fazer parte?</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Cadastre sua empresa como parceira verificada do Legado e ajude mulheres a recomeçar com dignidade.
          </p>
          <a
            href="mailto:admin@legado.com?subject=Parceria%20Empresarial%20-%20Vagas%20Legado"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-sm transition-all"
          >
            Quero ser empresa parceira
          </a>
        </div>
      </div>
    </main>
  );
}
