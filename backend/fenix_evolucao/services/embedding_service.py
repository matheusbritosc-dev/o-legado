"""
Serviço de Embeddings + RAG — O Legado
Usa OpenAI text-embedding-3-small (o mais barato) para busca semântica.
Os embeddings dos documentos são calculados UMA VEZ no boot e cacheados em memória.
Custo estimado: < $0.001 por inicialização do servidor.
"""
import os
import json
import math
import logging
import httpx
from typing import List, Optional, Tuple
from pathlib import Path

from services.knowledge_base import DOCUMENTOS

logger = logging.getLogger(__name__)

EMBEDDING_MODEL = "text-embedding-3-small"  # $0.02 / 1M tokens — o mais barato
CACHE_FILE = Path("/tmp/legado_embeddings_cache.json")


def cosine_similarity(a: List[float], b: List[float]) -> float:
    """Similaridade de cosseno sem dependência de numpy."""
    dot = sum(x * y for x, y in zip(a, b))
    norm_a = math.sqrt(sum(x * x for x in a))
    norm_b = math.sqrt(sum(x * x for x in b))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot / (norm_a * norm_b)


class EmbeddingService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY", "")
        self.doc_embeddings: List[dict] = []  # [{id, titulo, conteudo, embedding}]
        self._initialized = False

    async def _call_openai_embed(self, textos: List[str]) -> List[List[float]]:
        """Chama a API de embeddings da OpenAI. Faz batch de todos os textos de uma vez."""
        if not self.api_key:
            logger.warning("[Embeddings] OPENAI_API_KEY ausente. RAG desativado.")
            return []

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.openai.com/v1/embeddings",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json",
                },
                json={"model": EMBEDDING_MODEL, "input": textos},
                timeout=30.0,
            )

            if response.status_code != 200:
                logger.error(f"[Embeddings] Erro OpenAI: {response.status_code} - {response.text}")
                return []

            data = response.json()
            return [item["embedding"] for item in data["data"]]

    async def inicializar(self):
        """
        Pré-calcula embeddings de todos os documentos da base de conhecimento.
        Cacheia em disco para não gastar API em cada reinício do container.
        """
        if self._initialized:
            return

        # Tenta carregar do cache
        if CACHE_FILE.exists():
            try:
                cached = json.loads(CACHE_FILE.read_text())
                # Verifica se o cache tem o mesmo número de docs
                if len(cached) == len(DOCUMENTOS):
                    self.doc_embeddings = cached
                    self._initialized = True
                    logger.info(f"[Embeddings] Cache carregado: {len(cached)} documentos.")
                    return
            except Exception:
                pass

        if not self.api_key:
            logger.warning("[Embeddings] Sem chave OpenAI. RAG não disponível.")
            self._initialized = True
            return

        # Calcula embeddings (1 chamada batch para todos os docs)
        textos = [f"{doc['titulo']}: {doc['conteudo']}" for doc in DOCUMENTOS]
        logger.info(f"[Embeddings] Calculando embeddings para {len(textos)} documentos...")

        embeddings = await self._call_openai_embed(textos)

        if not embeddings:
            logger.error("[Embeddings] Falha ao calcular embeddings. RAG offline.")
            self._initialized = True
            return

        self.doc_embeddings = []
        for doc, emb in zip(DOCUMENTOS, embeddings):
            self.doc_embeddings.append({
                "id": doc["id"],
                "titulo": doc["titulo"],
                "conteudo": doc["conteudo"],
                "embedding": emb,
            })

        # Salva cache em disco
        try:
            CACHE_FILE.write_text(json.dumps(self.doc_embeddings))
            logger.info(f"[Embeddings] Cache salvo em {CACHE_FILE}")
        except Exception as e:
            logger.warning(f"[Embeddings] Não conseguiu salvar cache: {e}")

        self._initialized = True
        logger.info(f"[Embeddings] {len(self.doc_embeddings)} documentos indexados com sucesso.")

    async def buscar_contexto(self, pergunta: str, top_k: int = 3) -> str:
        """
        Busca semântica: vetoriza a pergunta e retorna os top_k documentos mais relevantes.
        Custo: 1 chamada de embedding por pergunta (~$0.00001).
        """
        if not self.doc_embeddings or not self.api_key:
            # Fallback: retorna todos os títulos como contexto genérico
            return "\n".join(f"- {doc['titulo']}" for doc in DOCUMENTOS[:3])

        # Vetoriza a pergunta
        query_embeddings = await self._call_openai_embed([pergunta])
        if not query_embeddings:
            return "Nenhum documento encontrado."

        query_emb = query_embeddings[0]

        # Calcula similaridade com cada documento
        scores: List[Tuple[float, dict]] = []
        for doc in self.doc_embeddings:
            sim = cosine_similarity(query_emb, doc["embedding"])
            scores.append((sim, doc))

        # Ordena por similaridade decrescente
        scores.sort(key=lambda x: x[0], reverse=True)

        # Monta contexto com os top_k mais relevantes
        contexto_parts = []
        for score, doc in scores[:top_k]:
            if score < 0.3:  # Threshold mínimo de relevância
                continue
            contexto_parts.append(
                f"[{doc['id']}] {doc['titulo']}\n{doc['conteudo']}\n(Relevância: {score:.2f})"
            )

        if not contexto_parts:
            return "Nenhum documento altamente relevante encontrado na base de conhecimento."

        return "\n\n---\n\n".join(contexto_parts)


# Singleton global
embedding_service = EmbeddingService()
