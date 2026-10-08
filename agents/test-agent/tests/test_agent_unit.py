"""
Tests UNITAIRES — LLM mocké, zéro appel réseau, zéro token consommé.

Ce qu'on teste ici : la LOGIQUE du graphe (routing, état, exécution d'outils)
indépendamment de ce que le LLM "décide". C'est la même philosophie qu'un test
unitaire classique qui mocke un appel API externe : on ne teste pas la
disponibilité du service tiers, on teste NOTRE code autour de lui.
"""

from __future__ import annotations

from langchain_core.messages import AIMessage, HumanMessage

from agent_eval_harness.agent import search_product, build_agent


class TestSearchProductTool:
    """L'outil est une fonction pure : on peut le tester sans passer par
    l'agent du tout. Toujours tester l'outil isolément avant de tester le
    graphe complet qui l'utilise — plus facile à déboguer si ça casse."""

    def test_finds_known_product(self):
        result = search_product.invoke({"query": "je veux un tshirt"})
        assert "T-shirt coton bio" in result
        assert "en stock" in result

    def test_reports_out_of_stock(self):
        result = search_product.invoke({"query": "jean slim"})
        assert "rupture de stock" in result

    def test_handles_unknown_product(self):
        result = search_product.invoke({"query": "chapeau melon"})
        assert "Aucun produit trouvé" in result


class TestAgentRouting:
    """Ici on teste la mécanique du graphe : quand le LLM (mocké) répond avec
    un tool_call, le graphe doit bien router vers le nœud "tools" et boucler.
    C'est un test structurel, pas un test de "l'agent est-il intelligent"."""

    def test_agent_calls_tool_when_llm_requests_it(
        self, mock_llm, fake_tool_call_response
    ):
        # Le mock renvoie d'abord un appel d'outil, puis une réponse finale.
        # C'est exactement le pattern ReAct : décider -> agir -> répondre.
        mock_llm.side_effect = [
            fake_tool_call_response("search_product", {"query": "sneakers"}),
            AIMessage(content="Les sneakers running sont à 79.99€, en stock."),
        ]

        agent = build_agent()
        result = agent.invoke(
            {"messages": [HumanMessage(content="Avez-vous des sneakers ?")]}
        )

        final_message = result["messages"][-1]
        assert "79.99" in final_message.content
        assert mock_llm.call_count == 2  # un appel avant l'outil, un après

    def test_agent_stops_without_tool_call(self, mock_llm):
        # Si le LLM répond directement sans demander d'outil, le graphe doit
        # se terminer après un seul appel — pas boucler indéfiniment.
        mock_llm.return_value = AIMessage(content="Bonjour, comment puis-je aider ?")

        agent = build_agent()
        result = agent.invoke(
            {"messages": [HumanMessage(content="Bonjour")]}
        )

        assert mock_llm.call_count == 1
        assert "Bonjour" in result["messages"][-1].content
