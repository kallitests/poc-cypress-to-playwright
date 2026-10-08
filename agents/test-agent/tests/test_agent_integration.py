"""
Tests D'INTÉGRATION — vrai appel à Claude, coûte des tokens, non déterministe.

Différence fondamentale avec les tests unitaires : on n'affirme jamais un
texte exact (le LLM ne répondra jamais deux fois mot pour mot pareil). On
teste des PROPRIÉTÉS du comportement : le bon outil a-t-il été appelé, la
réponse contient-elle l'information attendue, dans un format cohérent.

Marqués `@pytest.mark.integration` pour pouvoir les exclure en local :
    pytest -m "not integration"          # rapide, pas de coût
    pytest -m integration                # suite complète, typiquement en CI
"""

from __future__ import annotations

import pytest
from langchain_core.messages import HumanMessage, ToolMessage

pytestmark = pytest.mark.integration


class TestRealAgentBehavior:
    def test_agent_uses_tool_for_product_question(self, real_agent):
        result = real_agent.invoke(
            {"messages": [HumanMessage(content="Avez-vous des t-shirts en stock ?")]}
        )

        # On ne teste PAS le texte exact de la réponse finale (non déterministe).
        # On teste qu'un ToolMessage existe dans l'historique : preuve que
        # l'agent a bien utilisé l'outil plutôt que d'halluciner une réponse.
        tool_messages = [m for m in result["messages"] if isinstance(m, ToolMessage)]
        assert len(tool_messages) >= 1, "L'agent aurait dû appeler search_product"

        final_content = result["messages"][-1].content.lower()
        # Propriété attendue : le prix doit apparaître quelque part dans la
        # réponse finale, peu importe comment l'agent formule la phrase.
        assert "19.99" in final_content or "19,99" in final_content

    def test_agent_does_not_call_tool_for_smalltalk(self, real_agent):
        result = real_agent.invoke(
            {"messages": [HumanMessage(content="Bonjour, comment ça va ?")]}
        )

        tool_messages = [m for m in result["messages"] if isinstance(m, ToolMessage)]
        # Propriété de non-régression : un agent trop "gâchette facile" qui
        # appelle un outil pour du small talk est un bug de comportement
        # qu'on veut détecter, pas juste un détail cosmétique.
        assert len(tool_messages) == 0, "L'agent n'aurait pas dû appeler un outil ici"
