import httpx
import uuid
from typing import Dict, Any

# Simulador de Variável de Ambiente (colocaria no config.py)
MP_ACCESS_TOKEN = "TEST-DUMMY-ACCESS-TOKEN-SANDBOX"

async def gerar_pix_pagamento(valor_centavos: int, email_usuario: str, transacao_id: str) -> Dict[str, Any]:
    """
    Gera um pagamento via PIX no Sandbox do Mercado Pago.
    Retorna o QR Code e o Copy-Paste em um dicionário.
    """
    url = "https://api.mercadopago.com/v1/payments"
    
    headers = {
        "Authorization": f"Bearer {MP_ACCESS_TOKEN}",
        "Content-Type": "application/json",
        "X-Idempotency-Key": transacao_id
    }
    
    payload = {
        "transaction_amount": valor_centavos / 100.0,
        "description": "Legado: Membro Fundador",
        "payment_method_id": "pix",
        "payer": {
            "email": email_usuario
        }
    }
    
    async with httpx.AsyncClient() as client:
        # Mock de segurança para o teste imediato se a chave real não estiver no .env
        if MP_ACCESS_TOKEN.startswith("TEST-DUMMY"):
            print("⚠️ Usando MOCK de Pagamento PIX (Sandbox)...")
            return {
                "id": f"mock_mp_{uuid.uuid4().hex[:8]}",
                "status": "pending",
                "point_of_interaction": {
                    "transaction_data": {
                        "qr_code_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
                        "qr_code": "00020101021243650016COM.MERCADOLIBRE0114https://mp.br/022512345678901234..."
                    }
                }
            }

        response = await client.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
