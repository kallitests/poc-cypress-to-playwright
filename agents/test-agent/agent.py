"""
Agent de démonstration construit avec LangGraph.

C'est volontairement un agent SIMPLE (un outil, deux nœuds) : l'objectif de ce
repo n'est pas de montrer un agent complexe, mais de montrer comment on TESTE
un agent — quel que soit l'agent réel que tu brancheras derrière plus tard.

Architecture : un graphe à état avec deux nœuds
  1. "agent"  : le LLM décide s'il doit appeler l'outil de recherche produit
  2. "tools"  : exécute l'outil si demandé, puis retourne au nœud "agent"
Le graphe boucle jusqu'à ce que le LLM réponde sans demander d'outil.
"""

from __future__ import annotations

from typing import Annotated, TypedDict

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import AnyMessage
from langchain_core.tools import tool
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode, tools_condition


# --- Outil exposé à l'agent -------------------------------------------------

# Petit catalogue en dur : suffisant pour un harnais de test, pas besoin
# d'une vraie base de données pour démontrer le pattern de test.
_FAKE_CATALOG = {
    "tshirt": {"name": "T-shirt coton bio", "price": 19.99, "in_stock": True},
    "jean": {"name": "Jean slim", "price": 49.99, "in_stock": False},
    "sneakers": {"name": "Sneakers running", "price": 79.99, "in_stock": True},
}


@tool
def search_product(query: str) -> str:
    """Recherche un produit dans le catalogue par mot-clé et renvoie son prix
    et sa disponibilité. Utilise cet outil dès qu'un utilisateur demande des
    informations sur un produit précis."""
    query_lower = query.lower()
    for key, product in _FAKE_CATALOG.items():
        if key in query_lower:
            status = "en stock" if product["in_stock"] else "rupture de stock"
            return f"{product['name']} — {product['price']}€ — {status}"
    return f"Aucun produit trouvé pour '{query}'."


TOOLS = [search_product]


# --- État du graphe ----------------------------------------------------------

class AgentState(TypedDict):
    # add_messages fusionne les nouveaux messages dans l'historique au lieu
    # de l'écraser — c'est ce qui permet au graphe de "se souvenir" du tour
    # précédent quand il boucle entre les nœuds agent <-> tools.
    messages: Annotated[list[AnyMessage], add_messages]


# --- Construction du graphe ---------------------------------------------------

def build_agent(model_name: str = "claude-sonnet-4-6"):
    """Construit et compile le graphe LangGraph.

    Séparé en fonction (plutôt qu'exécuté au niveau module) pour que les tests
    puissent injecter un modèle différent (ex : un modèle mocké) sans toucher
    au code de production.
    """
    llm = ChatAnthropic(model=model_name, temperature=0)
    llm_with_tools = llm.bind_tools(TOOLS)

    def call_agent(state: AgentState) -> AgentState:
        response = llm_with_tools.invoke(state["messages"])
        return {"messages": [response]}

    graph = StateGraph(AgentState)
    graph.add_node("agent", call_agent)
    graph.add_node("tools", ToolNode(TOOLS))

    graph.set_entry_point("agent")
    # tools_condition inspecte le dernier message : s'il contient un tool_call,
    # on route vers "tools", sinon vers END. C'est le cœur du pattern ReAct.
    graph.add_conditional_edges("agent", tools_condition, {"tools": "tools", END: END})
    graph.add_edge("tools", "agent")

    return graph.compile()
