from .base import Base, metadata
from .usuario_pai import UsuarioPai
from .trilha_aprendizado import TrilhaAprendizado
from .interacao_ia import InteracaoIA
from .transacao import Transacao
from .seguranca import AlertaSeguranca, MedidaProtetiva
from .lead import Lead

# Isso garante que todos os modelos sejam registrados no metadata do Base 
# para que o Alembic consiga gerar as migrations corretamente.
__all__ = ["Base", "metadata", "UsuarioPai", "TrilhaAprendizado", "InteracaoIA", "Transacao", "AlertaSeguranca", "MedidaProtetiva", "Lead"]
