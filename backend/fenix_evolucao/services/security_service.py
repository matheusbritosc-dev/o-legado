import math
from typing import List, Optional
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

from services.whatsapp_service import whatsapp_service
import asyncio

async def disparar_notificacoes_emergencia(alerta: AlertaSeguranca, numero_dinamico: Optional[str] = None):
    """
    Dispara notificações reais via WhatsApp Cloud API para a rede de apoio da usuária
    e painéis de controle.
    """
    print(f"🚨 [URGENTE] SOS DISPARADO para Usuária {alerta.usuario_id}")
    print(f"📍 Coordenadas: {alerta.latitude}, {alerta.longitude} (Precisão: {alerta.precisao_metros}m)")
    
    # Monta a mensagem estruturada
    mensagem = (
        f"🚨 *ALERTA MÁXIMO DE SEGURANÇA - O LEGADO* 🚨\n\n"
        f"⚠️ *SITUAÇÃO DE RISCO IMINENTE*\n"
        f"Uma mulher sob a proteção do sistema O Legado acaba de acionar o Botão de Pânico.\n\n"
        f"📍 *LOCALIZAÇÃO EXATA (Alta Precisão):*\n"
        f"https://www.google.com/maps/search/?api=1&query={alerta.latitude},{alerta.longitude}\n"
        f"🎯 *Margem de erro (Raio):* {alerta.precisao_metros} metros\n\n"
        f"⚖️ *PROTOCOLO DE AÇÃO IMEDIATA:*\n"
        f"1. Tente contato imediato com a vítima.\n"
        f"2. Em caso de silêncio ou caixa postal, acione a POLÍCIA MILITAR (190) IMEDIATAMENTE repassando as coordenadas acima.\n\n"
        f"_Este é um alerta automatizado de segurança e proteção à vida. Aja com urgência._"
    )
    
    import os
    # Prioridade: 1. Numero enviado pelo frontend, 2. Variável de ambiente fallback
    numero_destino = numero_dinamico or os.getenv("META_TEST_NUMBER", "")
    
    if numero_destino:
        print(f"📲 Tentando enviar WhatsApp via Meta API para {numero_destino}...")
        sucesso = await whatsapp_service.enviar_mensagem(numero_destino, mensagem)
        if sucesso:
            print(f"✅ WhatsApp entregue com sucesso para {numero_destino}.")
        else:
            print(f"❌ Falha no envio do WhatsApp para {numero_destino} (verifique as chaves e o template da Meta).")
    else:
        print("⚠️ Nenhum número de destino configurado (nem no frontend, nem no .env).")
    
    alerta.notificacoes_enviadas = True
    return True
