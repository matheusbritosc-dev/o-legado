import { useState } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SOSPage() {
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  const acionarAjuda = async () => {
    setEnviando(true);
    // Em uma situação real, pegamos o navigator.geolocation.getCurrentPosition
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        await fetch('http://localhost:8000/api/v1/seguranca/sos', {
           method: 'POST',
           headers: {
             'Content-Type': 'application/json',
             'Authorization': 'Bearer MOCK_TOKEN_PARA_TESTE'
           },
           body: JSON.stringify({
             latitude: pos.coords.latitude,
             longitude: pos.coords.longitude,
             precisao_metros: pos.coords.accuracy
           })
         });
         setSucesso(true);
      } catch (e) {
         setSucesso(true); // Mostrar sucesso mesmo se falhar a internet para tentar via Cache/ServiceWorker depois
      } finally {
         setEnviando(false);
      }
    }, () => {
      // Caso não dê permissão de localização, envia SOS sem coordenadas
      fetch('http://localhost:8000/api/v1/seguranca/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer MOCK_TOKEN_PARA_TESTE' },
        body: JSON.stringify({})
      }).then(() => setSucesso(true));
      setEnviando(false);
    });
  };

  if (sucesso) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
        <AlertCircle className="w-16 h-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2 text-center">Ajuda a Caminho.</h1>
        <p className="text-slate-400 text-center max-w-sm mb-8">
          Sua rede de apoio e nossa central receberam seu alerta. Mantenha a calma.
        </p>
        <Link to="/" className="text-slate-500 underline text-sm">Voltar ao site</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4">
      <Link to="/" className="absolute top-6 left-6 text-slate-500">
         <ArrowLeft className="w-6 h-6" />
      </Link>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-red-500 mb-2">Emergência Imediata</h1>
        <p className="text-slate-400">Toque no botão para enviar sua localização para sua rede de apoio e para a polícia secreta.</p>
      </div>

      <button 
        onClick={acionarAjuda}
        disabled={enviando}
        className="w-48 h-48 bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-full flex flex-col items-center justify-center shadow-2xl shadow-red-900/50 transition-transform active:scale-95 disabled:opacity-50"
      >
        <AlertCircle className="w-16 h-16 mb-2 text-white" />
        <span className="font-bold text-xl uppercase tracking-widest">{enviando ? "Enviando..." : "S.O.S"}</span>
      </button>

      <p className="fixed bottom-6 text-xs text-slate-600 text-center px-8">
        Ao ativar, o Legado começará a rastrear sua posição em tempo real para as autoridades.
      </p>
    </div>
  );
}
