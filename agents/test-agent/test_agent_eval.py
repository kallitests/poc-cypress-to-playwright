"""
Tests D'ÉVALUATION — LangSmith + LLM-as-judge.

C'est le niveau que pytest seul ne sait pas bien faire : juger si une réponse
est "bonne" quand il n'y a pas de valeur exacte à comparer (pas de
`assert x == y` possible sur du langage naturel).

Principe du LLM-as-judge : un second appel LLM reçoit la question, la réponse
de l'agent, et un critère d'évaluation précis, puis renvoie un verdict
structuré (score + justification). C'est non déterministe par nature, donc on
accepte un SEUIL plutôt qu'un résultat binaire strict.

Ces tests sont marqués `@pytest.mark.eval` — encore plus lents/coûteux que les
tests d'intégration (deux appels LLM par cas : l'agent + le juge), à ne lancer
qu'en CI planifiée (nightly), pas sur chaque pull request.
"""

from __future__ import annotations

import pytest
from langchain_anthropic import ChatAnthropic
from langchain_core.messages import HumanMessage
from langsmith import Client
from langsmith.evaluation import evaluate

from agent_eval_harness.agent import build_agent

pytestmark = pytest.mark.eval

# Le juge est un modèle SÉPARÉ de celui de l'agent testé — même si c'est la
# même famille de modèle, on l'invoque avec un rôle et un prompt différents,
# jamais avec le contexte de conversation de l'agent testé (biais de confirmation).
JUDGE_PROMPT = """Tu es un évaluateur QA strict. On te donne une question
utilisateur et la réponse d'un agent de vente. Évalue UNIQUEMENT si la réponse
mentionne un prix cohérent avec le produit demandé, sans détail superflu ni
invention. Réponds uniquement par "PASS" ou "FAIL" suivi d'une justification
courte.

Question : {question}
Réponse de l'agent : {answer}
Verdict :"""


def _llm_judge(question: str, answer: str) -> tuple[bool, str]:
    judge = ChatAnthropic(model="claude-sonnet-4-6", temperature=0)
    verdict = judge.invoke(
        [HumanMessage(content=JUDGE_PROMPT.format(question=question, answer=answer))]
    ).content
    passed = verdict.strip().upper().startswith("PASS")
    return passed, verdict


class TestAgentQualityWithLLMJudge:
    """Suite de non-régression sémantique : on ne compare pas le texte, on
    compare le VERDICT d'un juge sur un jeu de questions fixes."""

    @pytest.mark.parametrize(
        "question",
        [
            "Combien coûtent les sneakers ?",
            "Le jean slim est-il disponible ?",
            "Qu'avez-vous comme t-shirts ?",
        ],
    )
    def test_product_answers_pass_judge(self, real_agent, question):
        result = real_agent.invoke({"messages": [HumanMessage(content=question)]})
        answer = result["messages"][-1].content

        passed, justification = _llm_judge(question, answer)
        assert passed, f"Le juge a rejeté la réponse : {justification}"


class TestLangSmithDatasetEvaluation:
    """Version "à l'échelle" du même principe : au lieu d'un test pytest par
    question, on pousse un jeu de données versionné dans LangSmith et on lance
    l'évaluation dessus. Utile quand le jeu de test dépasse une poignée de cas
    et doit être partagé/maintenu par toute l'équipe QA, pas juste dans le code."""

    def test_dataset_evaluation_runs_and_meets_threshold(self, langsmith_client):
        dataset_name = "agent-eval-harness-smoke"

        # Crée le dataset s'il n'existe pas encore — idempotent, pour que ce
        # test soit exécutable dès le premier run sans setup manuel préalable.
        if not langsmith_client.has_dataset(dataset_name=dataset_name):
            dataset = langsmith_client.create_dataset(dataset_name=dataset_name)
            langsmith_client.create_examples(
                inputs=[
                    {"question": "Combien coûtent les sneakers ?"},
                    {"question": "Avez-vous des jeans en stock ?"},
                ],
                outputs=[
                    {"expected_topic": "prix sneakers"},
                    {"expected_topic": "disponibilité jean"},
                ],
                dataset_id=dataset.id,
            )

        def target(inputs: dict) -> dict:
            agent = build_agent()
            result = agent.invoke(
                {"messages": [HumanMessage(content=inputs["question"])]}
            )
            return {"answer": result["messages"][-1].content}

        def correctness_evaluator(run, example) -> dict:
            passed, justification = _llm_judge(
                example.inputs["question"], run.outputs["answer"]
            )
            return {"key": "correctness", "score": 1.0 if passed else 0.0, "comment": justification}

        results = evaluate(
            target,
            data=dataset_name,
            evaluators=[correctness_evaluator],
            client=langsmith_client,
        )

        scores = [r["evaluation_results"]["results"][0].score for r in results]
        pass_rate = sum(scores) / len(scores)

        # Seuil, pas égalité stricte : c'est la nature même de l'évaluation
        # d'un système non déterministe. 80% est un point de départ à ajuster
        # selon la criticité réelle de l'agent testé.
        assert pass_rate >= 0.8, f"Taux de réussite trop bas : {pass_rate:.0%}"
