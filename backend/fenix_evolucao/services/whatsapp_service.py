import os
import httpx
import logging
from typing import Optional

logger = logging.getLogger(__name__)

class WhatsAppService:
    def __init__(self):
        self.access_token = os.getenv("META_ACCESS_TOKEN", "")
        self.phone_number_id = os.getenv("META_PHONE_NUMBER_ID", "")
        self.api_version = "v19.0"
        self.base_url = f"https://graph.facebook.com/{self.api_version}/{self.phone_number_id}/messages"

    async def enviar_mensagem(self, numero_destino: str, mensagem: str) -> bool:
        """
        Envia uma mensagem de texto simples usando a API Oficial do WhatsApp Cloud.
        numero_destino precisa incluir o código do país (ex: 5511999999999).
        """
        if not self.access_token or not self.phone_number_id:
            logger.warning("[WhatsApp] Chaves META_ACCESS_TOKEN ou META_PHONE_NUMBER_ID ausentes. Ignorando envio.")
            return False

        # Formata o numero de destino: remove não numéricos
        numero_limpo = ''.join(filter(str.isdigit, numero_destino))
        if not numero_limpo.startswith("55"):
            numero_limpo = "55" + numero_limpo

        headers = {
            "Authorization": f"Bearer {self.access_token}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": numero_limpo,
            "type": "text",
            "text": {
                "body": mensagem
            }
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    self.base_url, 
                    json=payload, 
                    headers=headers,
                    timeout=10.0
                )
                
                if response.status_code in (200, 201):
                    logger.info(f"[WhatsApp] Mensagem enviada com sucesso para {numero_limpo}.")
                    return True
                else:
                    logger.error(f"[WhatsApp] Falha ao enviar: {response.status_code} - {response.text}")
                    return False
        except Exception as e:
            logger.error(f"[WhatsApp] Exceção crítica ao comunicar com Meta: {str(e)}")
            return False

whatsapp_service = WhatsAppService()
