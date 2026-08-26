# Agent Eval Harness

Harnais pytest pour tester des agents LangGraph, à trois niveaux de rigueur
croissante. Pensé pour un profil SDET qui monte en compétence sur le test
d'agents IA/LLM : les principes (pyramide de tests, mocking, seuils plutôt
qu'égalité stricte) sont les mêmes qu'en test logiciel classique — seule
l'implémentation change.

## Pourquoi trois niveaux de test

| Niveau | Fichier | Vitesse | Coût | Ce qu'il prouve |
|---|---|---|---|---|
| Unitaire | `test_agent_unit.py` | ~0.03s pour 5 tests | Gratuit | La logique du graphe (routing, état) fonctionne, indépendamment du LLM |
| Intégration | `test_agent_integration.py` | Quelques secondes | Tokens réels | Le vrai LLM utilise l'outil au bon moment, sur des propriétés (pas du texte exact) |
| Évaluation | `test_agent_eval.py` | Plus lent (2 appels LLM/cas) | Tokens réels x2 | La qualité sémantique des réponses reste stable dans le temps (LLM-as-judge) |

C'est la même pyramide de test qu'en développement classique (beaucoup de
tests unitaires rapides à la base, peu de tests lents et coûteux au sommet) —
appliquée à un système non déterministe.

## Installation

```bash
python3 -m venv .venv
source .venv/bin/activate      # ou .venv\Scripts\activate sous Windows
pip install -e ".[dev]"
```

## Lancer les tests

```bash
# Par défaut : uniquement les tests unitaires (rapide, gratuit)
pytest

# Tests d'intégration (nécessite ANTHROPIC_API_KEY)
export ANTHROPIC_API_KEY=sk-ant-...
pytest -m integration

# Tests d'évaluation LangSmith (nécessite en plus LANGSMITH_API_KEY)
export LANGSMITH_API_KEY=lsv2_...
pytest -m eval
```

Chaque niveau ignoré (`SKIPPED`) plutôt qu'en échec si la clé API correspondante
n'est pas définie — voir `conftest.py`, fixtures `real_agent` et `langsmith_client`.

## Ce que ce repo démontre concrètement

1. **Mocker un LLM proprement** (`conftest.py`, fixture `mock_llm`) : on mocke
   au niveau de l'appel `.invoke()`, pas au niveau du framework entier — le
   routing du graphe, la gestion d'état et l'exécution d'outils sont testés
   pour de vrai.
2. **Tester des propriétés, pas des égalités**, dès qu'un vrai LLM est
   impliqué (`test_agent_integration.py`) : on vérifie qu'un outil a été
   appelé et qu'une information clé apparaît, jamais un texte exact.
3. **LLM-as-judge** (`test_agent_eval.py`) : un second appel LLM, avec un
   prompt d'évaluation strict et séparé du contexte de l'agent testé, rend un
   verdict structuré. C'est la technique standard pour évaluer du langage
   naturel sans référence exacte à comparer.
4. **Seuils plutôt qu'assertions strictes** à l'échelle (`pass_rate >= 0.8`) :
   accepter qu'un système non déterministe ne visera jamais 100% sur un test
   sémantique, et définir un seuil de tolérance explicite et documenté.
5. **Jeux de données versionnés dans LangSmith** plutôt que dans le code, pour
   les cas où l'équipe QA doit maintenir et faire évoluer les scénarios de
   test sans redéployer le code de test.

## Étendre ce harnais à un vrai agent

Remplace `src/agent_eval_harness/agent.py` par ton propre agent LangGraph.
Les trois fichiers de test n'ont pas besoin d'être réécrits en profondeur —
seuls les cas de test métier changent, la structure (mock/intégration/eval)
reste identique.

## Prochaine étape suggérée

Brancher ce harnais sur un vrai coding agent (Claude Code, ou un agent MCP
comme SentinelQA) pour évaluer sa fiabilité — hallucinations, respect du
scope, cohérence multi-tours — plutôt qu'un simple agent de démo comme ici.
