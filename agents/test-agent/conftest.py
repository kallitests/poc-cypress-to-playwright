"""
Fixtures partagées pour tester un agent LangGraph.

Trois niveaux de test, trois fixtures différentes — c'est la pyramide de test
adaptée aux agents IA :

  1. test_agent_unit.py        -> utilise `mock_llm`      (rapide, gratuit, déterministe)
  2. test_agent_integration.py -> utilise `real_agent`     (lent, coûte des tokens, réaliste)
  3. test_agent_eval.py        -> utilise `langsmith_client` (évaluation qualitative via LLM-judge)

Le principe SDET classique ("la majorité des tests doivent être rapides et
déterministes, peu de tests doivent toucher le vrai système") s'applique aux
agents IA exactement comme à n'importe quel système externe.
"""

from __future__ import annotations

import os
from unittest.mock import MagicMock

import pytest
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage

from agent_eval_harness.agent import build_agent


@pytest.fixture
def mock_llm(monkeypatch):
    """Remplace l'appel réel à Claude par un mock contrôlable.

    Pourquoi : les tests unitaires ne doivent JAMAIS dépendre du réseau ni
    consommer de tokens. On mocke au niveau de `ChatAnthropic.invoke` pour que
    tout le reste du graphe (routing, état, outils) soit testé pour de vrai —
    seul l'appel LLM est simulé.
    """
    mock = MagicMock()
    monkeypatch.setattr(
        "agent_eval_harness.agent.ChatAnthropic.invoke", mock
    )
    return mock


@pytest.fixture
def real_agent():
    """Construit le vrai agent, avec un vrai appel LLM.

    Utilisé uniquement dans test_agent_integration.py — ces tests sont marqués
    `@pytest.mark.integration` pour pouvoir être exclus en local avec
    `pytest -m "not integration"` et ne tourner qu'en CI, où la clé API est
    disponible en secret.
    """
    if not os.environ.get("ANTHROPIC_API_KEY"):
        pytest.skip("ANTHROPIC_API_KEY non défini — test d'intégration ignoré")
    return build_agent()


@pytest.fixture
def fake_tool_call_response():
    """Fabrique un message assistant simulant une décision d'appel d'outil.

    Utilitaire pour construire rapidement des scénarios de test unitaire sans
    répéter la structure verbeuse des messages LangChain à chaque fois.
    """

    def _make(tool_name: str, tool_args: dict, call_id: str = "call_1") -> AIMessage:
        return AIMessage(
            content="",
            tool_calls=[{"name": tool_name, "args": tool_args, "id": call_id}],
        )

    return _make


@pytest.fixture
def langsmith_client():
    """Client LangSmith pour les tests d'évaluation.

    Ignoré automatiquement si LANGSMITH_API_KEY n'est pas configuré, pour que
    le reste de la suite reste exécutable sans compte LangSmith.
    """
    if not os.environ.get("LANGSMITH_API_KEY"):
        pytest.skip("LANGSMITH_API_KEY non défini — évaluation LangSmith ignorée")
    from langsmith import Client

    return Client()
