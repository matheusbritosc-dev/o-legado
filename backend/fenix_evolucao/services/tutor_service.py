import asyncio
from typing import Tuple

# Usaremos um "Mock Inteligente" para a IA, que verifica palavras-chave.
# Em um ambiente real de produção, substituiríamos esta lógica por `httpx.post`
# para uma instância local do Ollama (ex: llama3 ou mistral) ou OpenAI API.

BASE_KNOWLEDGE = {
    "prevencao_violencia": [
        "violência", "agress", "bater", "castigo físico", "gritar", "punição",
        "bater", "palmada"
    ],
    "inteligencia_emocional": [
        "choro", "birra", "triste", "frustra", "raiva", "chateado", "ansiedade",
        "medo", "emoção", "sentimento", "não quer", "teimoso"
    ]
}

RESPOSTAS = {
    "prevencao_violencia": (
        "Compreendo que momentos de tensão são desafiadores. Educar sem violência "
        "é fundamental para o desenvolvimento saudável do cérebro da criança. "
        "Em vez do castigo físico, tente a 'pausa positiva': afaste-se por 2 minutos "
        "se sentir que vai perder o controle, e depois converse com a criança no nível do olhar dela, "
        "explicando a consequência lógica do comportamento."
    ),
    "inteligencia_emocional": (
        "Lidar com emoções intensas é um aprendizado constante. As 'birras' geralmente "
        "são a forma da criança expressar uma frustração que ela ainda não sabe verbalizar. "
        "Valide o sentimento ('Eu vejo que você está muito bravo porque não pode comer o doce agora'), "
        "e ofereça um contorno seguro para essa emoção. Você está indo bem!"
    ),
    "default": (
        "Essa é uma ótima pergunta sobre a jornada parental! A educação baseada no respeito "
        "mútuo cria vínculos profundos. Lembre-se que as crianças aprendem muito mais pelo "
        "seu exemplo do que pelas suas palavras. Como você está se sentindo sobre essa situação hoje?"
    )
}

async def responder_pergunta(pergunta: str, contexto: dict = None) -> Tuple[str, str, int]:
    """
    Retorna: (Resposta da IA, Categoria, Tokens Usados)
    Simula uma chamada a um modelo de linguagem passando para asyncio.sleep
    """
    # Delay simulando tempo de processamento LLM
    await asyncio.sleep(1.5)
    
    pergunta_lower = pergunta.lower()
    
    # Detecção de intenção baseada em keywords (Mock RAG)
    tema_detectado = "geral"
    resposta = RESPOSTAS["default"]
    
    for kw in BASE_KNOWLEDGE["prevencao_violencia"]:
        if kw in pergunta_lower:
            tema_detectado = "Prevenção de Violência"
            resposta = RESPOSTAS["prevencao_violencia"]
            break
            
    if tema_detectado == "geral":
        for kw in BASE_KNOWLEDGE["inteligencia_emocional"]:
            if kw in pergunta_lower:
                tema_detectado = "Inteligência Emocional"
                resposta = RESPOSTAS["inteligencia_emocional"]
                break
                
    # Cálculo fake de tokens baseado em palavras
    tokens_pergunta = len(pergunta.split())
    tokens_resposta = len(resposta.split())
    total_tokens = tokens_pergunta + tokens_resposta + 15  # 15 de prompt base do sistema
    
    return resposta, tema_detectado, total_tokens
