import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';

export default function SilentButton() {
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activated, setActivated] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const START_HOLD_DURATION = 3000; // 3 seconds

  const dispararAlerta = async () => {
    setActivated(true);
    setHolding(false);
    setProgress(100);
    
    // Simula capturar localização e chamar a API do FastAPI
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
           const res = await fetch('http://localhost:8000/api/v1/seguranca/sos', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
               'Authorization': 'Bearer MOCK_TOKEN_PARA_TESTE' // Na vida real pegamos do LocalStorage
             },
             body: JSON.stringify({
               latitude: position.coords.latitude,
               longitude: position.coords.longitude,
               precisao_metros: position.coords.accuracy
             })
           });
           console.log("Alerta Disparado!", await res.json());
        } catch (e) {
          console.error("Erro disparando alerta", e);
        }
      });
    }
  };

  useEffect(() => {
    if (holding && progress < 100 && !activated) {
      timerRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timerRef.current!);
            dispararAlerta();
            return 100;
          }
          return prev + (100 / (START_HOLD_DURATION / 50));
        });
      }, 50);
    } else {
      clearInterval(timerRef.current!);
      if (!activated) setProgress(0);
    }
    return () => clearInterval(timerRef.current!);
  }, [holding, progress, activated]);

  const handleStart = () => { if (!activated) setHolding(true); };
  const handleEnd = () => { if (!activated) setHolding(false); };

  // Componente discreto: Parece apenas um detalhe de design no canto da tela (um hexágono ou logo)
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div 
        className="relative w-14 h-14 rounded-full flex items-center justify-center select-none cursor-pointer"
        onMouseDown={handleStart}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
        onTouchStart={handleStart}
        onTouchEnd={handleEnd}
      >
        <Hexagon className={`w-8 h-8 transition-colors duration-1000 ${activated ? 'text-red-500' : 'text-slate-300 hover:text-slate-400'}`} />
        
        {/* Anel de progresso discreto */}
        {holding && !activated && (
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle cx="28" cy="28" r="26" fill="transparent" stroke="#E2E8F0" strokeWidth="2" />
            <motion.circle 
               cx="28" cy="28" r="26" fill="transparent" stroke="#F43F5E" strokeWidth="3"
               strokeDasharray="163"
               strokeDashoffset={163 - (163 * progress) / 100}
               strokeLinecap="round"
            />
          </svg>
        )}

        {/* Feedback visual efêmero quando ativado - pisca e some e o botão volta ao normal mas vermelho leve */}
        {activated && (
           <motion.div 
             initial={{ scale: 1, opacity: 1 }}
             animate={{ scale: 2, opacity: 0 }}
             transition={{ duration: 0.8 }}
             className="absolute inset-0 bg-red-500 rounded-full"
           />
        )}
      </div>
    </div>
  );
}
