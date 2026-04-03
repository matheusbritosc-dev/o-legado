"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AlertCircle, ArrowLeft, PhoneCall } from "lucide-react";

export default function SOSPage() {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // Monitor network status
  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Shake detection (DeviceMotionEvent) - Precisão Blindada
  useEffect(() => {
    let lastTime = 0;
    let lastX = 0, lastY = 0, lastZ = 0;
    let shakeCount = 0;
    let lastShakeDetection = 0;
    const shakeThreshold = 25; // Sensibilidade
    const requiredShakes = Number(localStorage.getItem("legado_shake_count") || "3");

    const handleMotion = (event: DeviceMotionEvent) => {
      const current = event.accelerationIncludingGravity;
      if (!current || !current.x || !current.y || !current.z) return;

      const currentTime = new Date().getTime();
      if (currentTime - lastTime > 100) {
        const diffTime = currentTime - lastTime;
        lastTime = currentTime;

        const speed = Math.abs(current.x + current.y + current.z - lastX - lastY - lastZ) / diffTime * 10000;

        if (speed > shakeThreshold && !sending && !sent) {
          // Detectou um movimento brusco
          const now = Date.now();
          
          // Se o último chacoalhão foi há mais de 2.5 segundos, reseta o contador
          if (now - lastShakeDetection > 2500) {
            shakeCount = 1;
          } else {
            shakeCount++;
          }
          
          lastShakeDetection = now;
          console.log(`Shake ${shakeCount}/${requiredShakes} detectado!`);

          // Feedback visual/tátil (opcional)
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(100);
          }

          if (shakeCount >= requiredShakes) {
            console.log("Limite de precisão atingido! Disparando SOS...");
            sendAlert();
            shakeCount = 0; // Reseta após disparar
          }
        }

        lastX = current.x;
        lastY = current.y;
        lastZ = current.z;
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [sending, sent]);

  const fallbackToSMS = (lat?: number, lon?: number) => {
    const locStr = (lat && lon) ? `Mapa: https://maps.google.com/?q=${lat},${lon}` : "Localizacao indisponivel.";
    const message = encodeURIComponent(`ALERTA LEGADO: Mulher em risco! ${locStr}`);
    
    // Prioriza o número de monitoramento manual (Matheus) configurado
    const emergencyNumber = localStorage.getItem("legado_emergency_number") || "62996768860";
    
    window.location.href = `sms:${emergencyNumber}?body=${message}`;
    setSending(false);
    setSent(true);
  };

  const sendAlert = () => {
    setSending(true);
    const doSend = (lat?: number, lon?: number) => {
      if (!navigator.onLine) {
        fallbackToSMS(lat, lon);
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
      fetch(`${apiUrl}/seguranca/sos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude: lat ?? null, longitude: lon ?? null }),
      })
      .then((res) => {
        if (!res.ok) throw new Error("API falhou");
        setSent(true);
      })
      .catch((err) => {
        console.error("Falha no servidor, caindo pro SMS manual", err);
        fallbackToSMS(lat, lon);
      })
      .finally(() => { setSending(false); });
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (p) => doSend(p.coords.latitude, p.coords.longitude),
        () => doSend()
      );
    } else {
      doSend();
    }
  };

  if (sent) {
    return (
      <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="w-24 h-24 rounded-full border-2 border-green-400 flex items-center justify-center mx-auto mb-6">
            <PhoneCall className="w-10 h-10 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Ajuda a Caminho</h1>
          <p className="text-slate-400 max-w-sm mx-auto mb-8">Sua rede de apoio foi acionada. Você não está sozinha.</p>
          <p className="text-slate-600 text-sm mb-8">Central de Atendimento: <strong className="text-white">180</strong></p>
          <Link href="/" className="text-slate-500 underline text-sm">Voltar ao site</Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center px-6">
      <Link href="/" className="absolute top-6 left-6 text-slate-400 hover:text-slate-200">
        <ArrowLeft className="w-5 h-5" />
      </Link>

      <motion.div
        className="text-center relative z-10 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-rose-400 mb-2">Emergência</h1>
        
        {isOffline ? (
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3 mb-10 max-w-xs mx-auto text-rose-300 text-sm">
            <p><strong>Conexão Interrompida</strong></p>
            <p className="text-xs mt-1">O SOS será enviado via SMS diretamente para a polícia.</p>
          </div>
        ) : (
          <p className="text-slate-500 text-sm mb-14 max-w-xs mx-auto">
            Toque no botão central ou <strong>chacoalhe o celular com força</strong> para acionar a rede.
          </p>
        )}

        <motion.button
          onClick={sendAlert}
          disabled={sending}
          whileTap={{ scale: 0.95 }}
          className="w-48 h-48 rounded-full bg-rose-600 hover:bg-rose-500 active:bg-rose-700 flex flex-col items-center justify-center mx-auto shadow-2xl shadow-rose-900/60 disabled:opacity-60 transition-colors"
        >
          <AlertCircle className="w-14 h-14 text-white mb-2" />
          <span className="text-white font-black text-2xl tracking-widest">
            {sending ? "..." : "S.O.S"}
          </span>
        </motion.button>

        <p className="text-slate-700 text-xs mt-12">
          Também ligue para <strong className="text-slate-400">180</strong> — Central de Atendimento à Mulher
        </p>
      </motion.div>
    </main>
  );
}
