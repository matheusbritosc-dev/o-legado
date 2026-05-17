"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Plus,
  Trash2,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Radio,
  Loader2,
  AlertTriangle,
  Navigation,
  Eye,
  EyeOff,
} from "lucide-react";

// ============================================================================
// TYPES
// ============================================================================

interface MedidaProtetiva {
  id: string;
  latitude_centro: number;
  longitude_centro: number;
  raio_metros: number;
  descricao_zona: string | null;
  ativa: boolean;
  criado_em: string;
}

interface Violacao {
  medida_id: string;
  descricao: string | null;
  distancia_atual_metros: number;
  raio_limite_metros: number;
}

interface GeofencingStatus {
  segura: boolean;
  violacoes: Violacao[];
  alerta_disparado: boolean;
  timestamp: Date;
}

// ============================================================================
// HELPERS
// ============================================================================

function getApiUrl() {
  return process.env.NEXT_PUBLIC_API_URL || "/api/v1";
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? localStorage.getItem("legado_token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 10) return "agora";
  if (seconds < 60) return `${seconds}s atrás`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min atrás`;
  return `${Math.floor(minutes / 60)}h atrás`;
}

// ============================================================================
// COMPONENT
// ============================================================================

export default function GeofencingPage() {
  // State: medidas protetivas
  const [medidas, setMedidas] = useState<MedidaProtetiva[]>([]);
  const [loadingMedidas, setLoadingMedidas] = useState(true);

  // State: nova medida form
  const [showForm, setShowForm] = useState(false);
  const [formDescricao, setFormDescricao] = useState("");
  const [formLat, setFormLat] = useState("");
  const [formLon, setFormLon] = useState("");
  const [formRaio, setFormRaio] = useState("500");
  const [formSubmitting, setFormSubmitting] = useState(false);

  // State: monitoramento contínuo
  const [monitorando, setMonitorando] = useState(false);
  const [posicaoAtual, setPosicaoAtual] = useState<{ lat: number; lon: number } | null>(null);
  const [ultimoCheck, setUltimoCheck] = useState<GeofencingStatus | null>(null);
  const [checksCount, setChecksCount] = useState(0);
  const watchIdRef = useRef<number | null>(null);
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // State: alertas visuais
  const [alertaAtivo, setAlertaAtivo] = useState(false);

  const API = getApiUrl();

  // ============================================================================
  // FETCH MEDIDAS
  // ============================================================================

  const fetchMedidas = useCallback(async () => {
    try {
      const res = await fetch(`${API}/seguranca/medidas`, { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setMedidas(data);
      }
    } catch (err) {
      console.error("Erro ao buscar medidas:", err);
    } finally {
      setLoadingMedidas(false);
    }
  }, [API]);

  useEffect(() => {
    fetchMedidas();
  }, [fetchMedidas]);

  // ============================================================================
  // CREATE MEDIDA
  // ============================================================================

  const criarMedida = async () => {
    if (!formLat || !formLon) return;
    setFormSubmitting(true);
    try {
      const res = await fetch(`${API}/seguranca/medidas`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          latitude_centro: parseFloat(formLat),
          longitude_centro: parseFloat(formLon),
          raio_metros: parseInt(formRaio) || 500,
          descricao_zona: formDescricao || null,
        }),
      });
      if (res.ok) {
        setFormDescricao("");
        setFormLat("");
        setFormLon("");
        setFormRaio("500");
        setShowForm(false);
        await fetchMedidas();
      }
    } catch (err) {
      console.error("Erro ao criar medida:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  // ============================================================================
  // DELETE MEDIDA
  // ============================================================================

  const deletarMedida = async (id: string) => {
    try {
      await fetch(`${API}/seguranca/medidas/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      await fetchMedidas();
    } catch (err) {
      console.error("Erro ao deletar medida:", err);
    }
  };

  // ============================================================================
  // USE CURRENT LOCATION FOR FORM
  // ============================================================================

  const usarLocalizacaoAtual = () => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormLat(pos.coords.latitude.toFixed(6));
        setFormLon(pos.coords.longitude.toFixed(6));
      },
      () => alert("Não foi possível obter sua localização.")
    );
  };

  // ============================================================================
  // GEOFENCING CHECK
  // ============================================================================

  const checarGeofencing = useCallback(
    async (lat: number, lon: number) => {
      try {
        const res = await fetch(`${API}/seguranca/geofencing`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ latitude: lat, longitude: lon }),
        });
        if (res.ok) {
          const data = await res.json();
          const status: GeofencingStatus = {
            segura: data.segura,
            violacoes: data.violacoes || [],
            alerta_disparado: data.alerta_disparado || false,
            timestamp: new Date(),
          };
          setUltimoCheck(status);
          setChecksCount((c) => c + 1);

          if (!status.segura) {
            setAlertaAtivo(true);
            // Vibrar se possível
            if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]);
          } else {
            setAlertaAtivo(false);
          }
        }
      } catch (err) {
        console.error("Erro no check de geofencing:", err);
      }
    },
    [API]
  );

  // ============================================================================
  // START / STOP MONITORING
  // ============================================================================

  const iniciarMonitoramento = () => {
    if (!("geolocation" in navigator)) {
      alert("Seu navegador não suporta geolocalização.");
      return;
    }

    setMonitorando(true);
    setChecksCount(0);
    setUltimoCheck(null);
    setAlertaAtivo(false);

    // Inicia watchPosition para ter posição sempre atualizada
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPosicaoAtual({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      },
      (err) => console.error("Erro GPS:", err),
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  };

  const pararMonitoramento = () => {
    setMonitorando(false);
    setAlertaAtivo(false);
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (checkIntervalRef.current) {
      clearInterval(checkIntervalRef.current);
      checkIntervalRef.current = null;
    }
  };

  // Intervalo de check a cada 30 segundos enquanto monitora
  useEffect(() => {
    if (monitorando && posicaoAtual) {
      // Check imediato
      checarGeofencing(posicaoAtual.lat, posicaoAtual.lon);

      // Polling a cada 30s
      checkIntervalRef.current = setInterval(() => {
        if (posicaoAtual) {
          checarGeofencing(posicaoAtual.lat, posicaoAtual.lon);
        }
      }, 30000);
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
        checkIntervalRef.current = null;
      }
    };
  }, [monitorando, posicaoAtual, checarGeofencing]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
    };
  }, []);

  // ============================================================================
  // RENDER
  // ============================================================================

  const medidasAtivas = medidas.filter((m) => m.ativa);

  return (
    <main className="min-h-screen relative px-4 py-8 md:px-8 md:py-12">
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-50 flex items-center gap-2">
              <Shield className="w-6 h-6 text-violet-400" />
              Geofencing
            </h1>
            <p className="text-slate-500 text-sm">Zonas de risco e monitoramento contínuo</p>
          </div>
        </div>

        {/* ================================================================ */}
        {/* ALERTA DE VIOLAÇÃO */}
        {/* ================================================================ */}
        <AnimatePresence>
          {alertaAtivo && ultimoCheck && !ultimoCheck.segura && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 p-5 rounded-2xl bg-red-950/60 border border-red-500/40 shadow-lg shadow-red-900/20"
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h3 className="text-red-300 font-bold text-lg">ZONA DE RISCO DETECTADA</h3>
                  <p className="text-red-400/70 text-sm mt-1">
                    Você está dentro de {ultimoCheck.violacoes.length} zona(s) de risco cadastrada(s).
                    {ultimoCheck.alerta_disparado && " Rede de apoio notificada automaticamente."}
                  </p>
                  <div className="mt-3 space-y-2">
                    {ultimoCheck.violacoes.map((v, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-red-300">
                          <strong>{v.descricao || "Zona sem nome"}</strong>
                          {" — "}
                          {formatDistance(v.distancia_atual_metros)} do centro
                          (limite: {formatDistance(v.raio_limite_metros)})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================================================================ */}
        {/* MONITORAMENTO CONTÍNUO */}
        {/* ================================================================ */}
        <div className="mb-8 p-5 rounded-2xl bg-slate-900/50 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Radio className={`w-5 h-5 ${monitorando ? "text-emerald-400 animate-pulse" : "text-slate-500"}`} />
              Monitoramento em Tempo Real
            </h2>
            <button
              onClick={monitorando ? pararMonitoramento : iniciarMonitoramento}
              disabled={medidasAtivas.length === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                monitorando
                  ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30"
                  : medidasAtivas.length === 0
                  ? "bg-slate-800 border border-white/5 text-slate-600 cursor-not-allowed"
                  : "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30"
              }`}
            >
              {monitorando ? (
                <>
                  <EyeOff className="w-4 h-4" /> Parar
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" /> Iniciar
                </>
              )}
            </button>
          </div>

          {medidasAtivas.length === 0 && !monitorando && (
            <p className="text-slate-600 text-sm">
              Cadastre ao menos uma zona de risco abaixo para ativar o monitoramento.
            </p>
          )}

          {monitorando && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-black/30 rounded-xl p-3 text-center">
                <p className="text-slate-600 text-[10px] uppercase tracking-wide mb-1">Status</p>
                {ultimoCheck ? (
                  ultimoCheck.segura ? (
                    <p className="text-emerald-400 font-bold text-sm flex items-center justify-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Segura
                    </p>
                  ) : (
                    <p className="text-red-400 font-bold text-sm flex items-center justify-center gap-1 animate-pulse">
                      <ShieldAlert className="w-4 h-4" /> Risco
                    </p>
                  )
                ) : (
                  <Loader2 className="w-4 h-4 text-slate-500 animate-spin mx-auto" />
                )}
              </div>
              <div className="bg-black/30 rounded-xl p-3 text-center">
                <p className="text-slate-600 text-[10px] uppercase tracking-wide mb-1">Checks</p>
                <p className="text-slate-200 font-bold text-sm">{checksCount}</p>
              </div>
              <div className="bg-black/30 rounded-xl p-3 text-center">
                <p className="text-slate-600 text-[10px] uppercase tracking-wide mb-1">Último</p>
                <p className="text-slate-400 font-mono text-xs">
                  {ultimoCheck ? timeAgo(ultimoCheck.timestamp) : "—"}
                </p>
              </div>
              <div className="bg-black/30 rounded-xl p-3 text-center">
                <p className="text-slate-600 text-[10px] uppercase tracking-wide mb-1">GPS</p>
                {posicaoAtual ? (
                  <p className="text-emerald-400 font-mono text-[10px]">
                    {posicaoAtual.lat.toFixed(4)}, {posicaoAtual.lon.toFixed(4)}
                  </p>
                ) : (
                  <Loader2 className="w-4 h-4 text-slate-500 animate-spin mx-auto" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* ================================================================ */}
        {/* ZONAS DE RISCO (MEDIDAS PROTETIVAS) */}
        {/* ================================================================ */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-rose-400" />
            Zonas de Risco ({medidas.length})
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-500/20 border border-violet-500/30 text-violet-400 text-sm font-semibold hover:bg-violet-500/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Zona
          </button>
        </div>

        {/* Form: Nova medida */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-4"
            >
              <div className="p-5 rounded-2xl bg-slate-900/50 border border-violet-500/20 backdrop-blur-xl space-y-4">
                <div>
                  <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wide">
                    Descrição da zona
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Casa do agressor, Trabalho dele..."
                    value={formDescricao}
                    onChange={(e) => setFormDescricao(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/40"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wide">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="-16.686891"
                      value={formLat}
                      onChange={(e) => setFormLat(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/40"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wide">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="-49.264794"
                      value={formLon}
                      onChange={(e) => setFormLon(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/40"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={usarLocalizacaoAtual}
                  className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  Usar minha localização atual
                </button>

                <div>
                  <label className="block text-slate-400 text-xs mb-1.5 uppercase tracking-wide">
                    Raio de risco (metros)
                  </label>
                  <input
                    type="number"
                    placeholder="500"
                    value={formRaio}
                    onChange={(e) => setFormRaio(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-slate-200 text-sm placeholder-slate-600 focus:outline-none focus:border-violet-500/40"
                  />
                  <p className="text-slate-600 text-[10px] mt-1">
                    Se você entrar nesse raio, a rede de apoio será notificada automaticamente.
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={criarMedida}
                    disabled={formSubmitting || !formLat || !formLon}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {formSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    Cadastrar Zona
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-400 text-sm hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de medidas */}
        {loadingMedidas ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
          </div>
        ) : medidas.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-10 h-10 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-600 text-sm">Nenhuma zona de risco cadastrada ainda.</p>
            <p className="text-slate-700 text-xs mt-1">
              Clique em "Nova Zona" para adicionar o primeiro perímetro de proteção.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {medidas.map((m) => (
              <motion.div
                key={m.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-2xl border backdrop-blur-xl flex items-center justify-between transition-colors ${
                  m.ativa
                    ? "bg-slate-900/50 border-rose-500/20"
                    : "bg-slate-900/30 border-white/5 opacity-50"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      m.ativa ? "bg-rose-500/20" : "bg-slate-800"
                    }`}
                  >
                    <MapPin className={`w-5 h-5 ${m.ativa ? "text-rose-400" : "text-slate-600"}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-slate-200 font-semibold text-sm truncate">
                      {m.descricao_zona || "Zona sem nome"}
                    </h3>
                    <p className="text-slate-600 text-[10px] font-mono mt-0.5">
                      {m.latitude_centro.toFixed(5)}, {m.longitude_centro.toFixed(5)}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-slate-500 text-[10px]">Raio: {formatDistance(m.raio_metros)}</span>
                      <span className={`text-[10px] font-semibold ${m.ativa ? "text-rose-400" : "text-slate-600"}`}>
                        {m.ativa ? "ATIVA" : "INATIVA"}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deletarMedida(m.id)}
                  className="p-2 rounded-lg hover:bg-red-500/20 text-slate-600 hover:text-red-400 transition-colors shrink-0"
                  title="Remover zona"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-900/30 border border-white/5">
          <p className="text-slate-600 text-xs leading-relaxed">
            <strong className="text-slate-500">Como funciona:</strong> O monitoramento verifica sua localização a cada 30
            segundos. Se você entrar no raio de qualquer zona cadastrada, o sistema cria um alerta automático e notifica
            sua rede de apoio via WhatsApp imediatamente.
          </p>
        </div>
      </div>
    </main>
  );
}
