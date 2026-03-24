import math
from typing import List
from models.seguranca import MedidaProtetiva, AlertaSeguranca

def calcular_distancia_haversine(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calcula a distância em metros entre dois pontos geográficos"""
    R = 6371000 # Raio da terra em metros
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi/2.0)**2 + \
        math.cos(phi1) * math.cos(phi2) * \
        math.sin(delta_lambda/2.0)**2
    
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

async def verificar_geofencing(lat_atual: float, lon_atual: float, medidas: List[MedidaProtetiva]) -> List[dict]:
    """Verifica se a localização atual violou alguma medida protetiva (entrou no raio de risco)"""
    violacoes = []
    for medida in medidas:
        if not medida.ativa:
            continue
            
        distancia = calcular_distancia_haversine(
            lat_atual, lon_atual,
            medida.latitude_centro, medida.longitude_centro
        )
        
        # Se a distância atual para o centro do agressor/área de risco for MENOR que o raio
        if distancia < medida.raio_metros:
            violacoes.append({
                "medida_id": str(medida.id),
                "descricao": medida.descricao_zona,
                "distancia_atual_metros": round(distancia, 2),
                "raio_limite_metros": medida.raio_metros
            })
            
    return violacoes

async def disparar_notificacoes_emergencia(alerta: AlertaSeguranca):
    """
    Simula o disparo de Webhooks, SMS e Emails para a rede de apoio da usuária.
    Na vida real, integraria com Twilio ou AWS SNS.
    """
    print(f"🚨 [URGENTE] SOS DISPARADO para Usuária {alerta.usuario_id}")
    print(f"📍 Coordenadas: {alerta.latitude}, {alerta.longitude} (Precisão: {alerta.precisao_metros}m)")
    print(f"📲 SMS enviado para Rede de Apoio. Webhook enviado para Central de Polícia Parceira.")
    
    alerta.notificacoes_enviadas = True
    return True
