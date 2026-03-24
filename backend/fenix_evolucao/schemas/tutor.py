from pydantic import BaseModel
from typing import Optional

class TutorPerguntaRequest(BaseModel):
    pergunta: str
    categoria_tema: Optional[str] = None

class TutorRespostaResponse(BaseModel):
    resposta: str
    tokens_usados: int = 0
    categoria_tema: Optional[str] = None
    feedback_id: Optional[str] = None # ID da interação, caso queira enviar feedback (positivo/negativo) depois
