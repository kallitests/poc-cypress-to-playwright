# Fiche de poste — SDET Cypress AI Engineer

**Localisation :** Bordeaux (ou remote/hybride selon contexte)
**Durée :** Mission long terme
**Contexte :** Équipe R&D innovante, environnement SaaS / Agile

---

## 1. Résumé du poste

Le SDET (Software Development Engineer in Test) Cypress AI Engineer est en charge de la stratégie, de la conception et de l'exécution des tests automatisés (UI, API, données) sur une plateforme SaaS. Il/elle intervient sur l'ensemble du cycle de qualité logicielle : définition de la stratégie de test, écriture des scénarios (Gherkin), automatisation (Cypress, Selenium, Karate, Postman), intégration CI/CD, analyse des anomalies et rédaction de la documentation technique. Le poste inclut également une dimension "AI-assisted QA" (génération de tests, support à l'automatisation, analyse de défauts assistée par l'IA).

---

## 2. Missions principales

### Stratégie & organisation qualité
- Participer à la définition de la stratégie d'automatisation des tests.
- Développer, faire évoluer et maintenir les frameworks d'automatisation de tests (UI et API).
- Accompagner l'équipe sur les process qualité et contribuer à la vie de l'équipe (méthodologie Agile).
- Analyser les métriques qualité et arbitrer entre automatisation et tests manuels.

### Conception et écriture des tests
- Prendre en compte les besoins fonctionnels et rédiger les scénarios de test.
- Rédiger les scénarios de tests en Gherkin (BDD).
- Concevoir des scénarios incluant cas limites et cas particuliers ("edge cases").
- Couvrir des workflows métier complexes de bout en bout (UI, back-end, données).

### Automatisation & exécution
- Développer et exécuter les scripts d'automatisation (Cypress, Selenium, Karate, Cucumber, TestCafe, Playwright).
- Mettre en œuvre des jeux de données et effectuer des manipulations en base si nécessaire.
- Mettre en place et exécuter des campagnes de tests de non-régression (TNR) et de régression.
- Intégrer et déployer en continu les tests automatisés dans les pipelines CI/CD.
- Réaliser des tests fonctionnels, d'intégration, de régression, exploratoires et de performance.
- Valider les API REST, flux microservices, et l'intégrité des bases de données.

### Analyse & documentation
- Assurer l'analyse et la résolution des problèmes détectés lors de l'exécution des tests automatiques.
- Mettre en place des outils de détection et de gestion des bugs (Jira, etc.), participer au triage des défauts.
- Rédiger les rapports de tests et toute documentation technique afférente (cas de test, checklists de release, suites de régression, logs de défauts).
- Participer aux revues de code et proposer des retours constructifs.

### Support & communication
- Assister les utilisateurs.
- Collaborer étroitement avec développeurs, product managers et parties prenantes pour clarifier les besoins et communiquer les risques qualité.
- Champion de la communication écrite et orale pour garantir l'alignement et la transparence tout au long du processus QA.

---

## 3. Profil recherché

- **Expérience :** 3 à 5+ ans en tant que QA / QA Engineer, idéalement sur des applications SaaS ou enterprise à forte volumétrie.
- Bonne maîtrise des méthodologies Agile et du cycle de vie complet des tests.
- Expérience de bout en bout sur des user stories complexes, sans se limiter à des tests isolés.
- Expérience en environnement microservices / systèmes distribués.
- Anglais bilingue (contexte international).

---

## 4. Hard skills

| Domaine | Compétences attendues |
|---|---|
| **Automatisation** | Cypress (maîtrise excellente), Selenium, Karate, TestCafe, Playwright, Cucumber |
| **BDD** | Gherkin (rédaction de scénarios) |
| **API Testing** | Postman, Swagger, validation d'authentification/autorisation, gestion des erreurs, payloads |
| **Bases de données** | SQL avancé (SQL Server, PostgreSQL, MySQL) — interrogation, validation et réconciliation de données |
| **CI/CD & Cloud** | Intégration continue, environnements Cloud (GCP de préférence), conteneurisation (Kubernetes) |
| **Gestion de version** | Git |
| **Outils de support** | Jira ou équivalent (gestion des tickets/bugs) |
| **Architecture** | Compréhension des architectures SaaS multi-tenant, SSO/authentification, architectures événementielles, fondamentaux de sécurité |
| **IA appliquée à la QA** | Pratiques de QA assistées par l'IA : génération de tests, support à l'automatisation, analyse de défauts (atout fort) |

---

## 5. Soft skills

- Pragmatisme
- Curiosité
- Pertinence
- Implication
- Proactivité
- Qualités rédactionnelles et de communication
- Autonomie
- Sens du service et esprit d'équipe
- Approche orientée solutions (identification d'opportunités, résolution de problèmes, capacité de planification)

---

## 6. Résumé synthétique (checklist)

- ✅ Excellente maîtrise de Cypress
- ✅ Solide expérience en tests End-to-End
- ✅ Expérience Selenium, Karate, Postman, Playwright ou équivalents
- ✅ Maîtrise du SQL pour la validation de données
- ✅ Rédaction de scénarios en Gherkin
- ✅ Expérience en environnement Agile et CI/CD
- ✅ Connaissance Cloud (GCP idéalement) et Kubernetes
- ✅ Anglais bilingue
- ✅ Sensibilité/expérience sur les pratiques QA assistées par IA

---

## 7. Setup environnement de travail (SDET Cypress AI Engineer)

### IDE & extensions
- **VS Code** comme IDE principal, avec plugins :
  - *Cypress Snippets* / *Cypress Helper* — autocomplétion des commandes Cypress
  - *ESLint* + *Prettier* — qualité et homogénéité du code de test
  - *GitLens* — historique et blame Git inline
  - *Gherkin / Cucumber (full support)* — coloration syntaxique et autocomplétion des fichiers `.feature`
  - *REST Client* ou *Thunder Client* — tests API rapides directement dans l'IDE (complément à Postman)
  - *Docker* (extension officielle) — gestion des conteneurs depuis l'IDE
  - *YAML* — édition des pipelines CI/CD (GitHub Actions, GitLab CI)
  - *Error Lens* — visualisation inline des erreurs/warnings
  - *Copilot / Codeium / Continue.dev* — assistance IA à l'écriture de tests et de scripts

### Gestion de projet, tests & suivi qualité
- **Jira** — gestion des tickets, sprints, backlog
- **Xray (plugin Jira)** — gestion des cas de test, exécutions, couverture, liens tests ↔ user stories/défauts
- **Squash TM / Squash TF** — gestion et exécution des campagnes de test (alternative/complément à Xray selon contexte client)
- **Notion** — documentation vivante : stratégie de test, conventions d'écriture, onboarding, retro d'incidents
- **Confluence** (le cas échéant) — documentation qualité côté entreprise si Notion non utilisé

### Versioning & CI/CD
- **Git** + **Git Bash** (ou terminal intégré VS Code) — gestion de version en ligne de commande
- **GitHub Actions** et/ou **GitLab CI/CD** — intégration et exécution continue des suites de tests automatisés
- **Docker / Docker Compose** — environnements de test isolés et reproductibles
- **Kubernetes (K8s)** — exécution des tests dans des environnements conteneurisés à plus grande échelle

### Outils de test
- **Cypress** (E2E, composant) — cœur de l'automatisation UI
- **Karate** — tests API/BDD orientés backend
- **Postman** / **Swagger** — exploration et validation des API REST
- **SQL clients** (DBeaver, DataGrip, ou équivalent) — validation et réconciliation de données
- **Allure Report** ou **Mochawesome** — reporting visuel des exécutions Cypress
- **BrowserStack / Sauce Labs** (si tests cross-browser/cross-device requis)

---

## 8. Brique IA : Python, LangChain, LangGraph, LangSmith

En tant qu'**AI Engineer** en plus du socle SDET, l'ajout d'une brique Python autour de l'écosystème LangChain est un vrai différenciateur. Concrètement :

- **Python** : langage pivot pour scripter la génération de données de test, l'analyse de logs, ou l'orchestration d'agents IA en périphérie de la stack Cypress/Node.
- **LangChain** : framework pour construire des chaînes de traitement autour des LLM — utile pour générer automatiquement des scénarios de test à partir de user stories, résumer des specs fonctionnelles en cas de test Gherkin, ou transformer des tickets Jira en squelettes de tests Cypress.
- **LangGraph** : permet de construire des agents IA avec des flux de décision (graphes d'états) — utile pour un agent QA capable de : lire un rapport d'échec de test → analyser la stack trace → proposer une correction ou un ticket de bug enrichi, avec logique de boucle/retry.
- **LangSmith** : plateforme d'observabilité et d'évaluation des chaînes/agents LLM — utile pour tracer, debugger et mesurer la fiabilité des agents IA utilisés dans le pipeline QA (ex : taux de pertinence des tests générés automatiquement, détection de dérive).

### Pourquoi c'est un vrai atout pour se vendre auprès des recruteurs

1. **Différenciation immédiate** : la majorité des profils SDET Cypress sont interchangeables sur le socle technique classique (Cypress, Selenium, Postman, SQL). Maîtriser LangChain/LangGraph/LangSmith positionne le profil comme "SDET augmenté par l'IA", une compétence encore rare sur le marché.
2. **Réponse à une tendance de fond** : les entreprises cherchent activement à automatiser la génération de tests et le triage des anomalies avec de l'IA générative — savoir construire ces agents en interne évite de dépendre d'outils tiers propriétaires.
3. **Argument de productivité chiffrable** : pouvoir dire "j'ai construit un agent qui génère X% des scénarios de non-régression automatiquement" ou "qui réduit de X% le temps de triage des bugs" est un argument concret et mesurable en entretien.
4. **Pont entre QA et Data/AI Engineering** : ce profil hybride permet de dialoguer aussi bien avec les équipes de dev backend qu'avec les équipes data/IA, ce qui élargit le champ des missions possibles (SaaS classique, plateformes IA, produits avec features LLM à tester).
5. **Cohérence avec le titre du poste** : le poste s'intitule "SDET Cypress **AI Engineer**" — démontrer une maîtrise réelle de la brique IA (et pas seulement "sensibilité IA") aligne totalement le profil avec l'intitulé recherché, ce qui rassure le recruteur sur l'adéquation profil/poste dès le CV.

---

## 9. Cycle de vie complet d'un test logiciel (specs → reporting)

### Étape 1 — Specs technico-fonctionnelles & Shift-Left Testing

- **Analyse des specs fonctionnelles et techniques** en amont du développement : user stories, critères d'acceptation, maquettes, contrats d'API (Swagger/OpenAPI).
- **Shift-left testing** : impliquer la QA le plus tôt possible dans le cycle, dès la conception, plutôt qu'en fin de sprint.
  - Participation aux *refinements*/*grooming* pour challenger les critères d'acceptation avant qu'ils ne soient figés.
  - Rédaction des critères d'acceptation en **Gherkin** dès la spec (Given/When/Then), en collaboration avec devs et PO (approche BDD/"3 Amigos").
  - Revue de la testabilité du besoin : identifier les cas limites, dépendances techniques et risques dès la conception.
  - Bénéfice direct : détection des anomalies de conception avant l'écriture du code, réduction du coût de correction (un bug détecté en spec coûte largement moins cher qu'un bug détecté en production).

### Étape 2 — Conception des scénarios de test

- Traduction des critères d'acceptation en scénarios de test détaillés (fonctionnels, non fonctionnels, edge cases).
- Priorisation des scénarios selon la criticité métier (matrice de risques).
- Rédaction en Gherkin pour alimenter à la fois la documentation et les tests automatisés (Cucumber/Cypress-Cucumber preprocessor).

### Étape 3 — Automatisation des tests

- Développement des scripts d'automatisation **Cypress** (E2E, tests de composants), complétés par **Selenium** ou **Karate** selon la couche testée (UI vs API).
- Organisation du code de test : Page Object Model (POM) ou approche par commandes custom Cypress, fixtures pour les jeux de données, gestion des environnements (dev/staging/prod).
- Intégration des tests dans le **repository Git**, revue de code des scripts de test au même titre que le code applicatif.

### Étape 4 — Exécution & intégration continue (CI/CD)

- Déclenchement automatique des suites de tests via **GitHub Actions** ou **GitLab CI/CD** à chaque pull request / merge / déploiement.
- Exécution en parallèle (sharding) pour réduire les temps de run sur les suites volumineuses.
- Exécution planifiée (nightly runs) pour les campagnes de non-régression (TNR) complètes.
- Conteneurisation des environnements de test (**Docker**) pour garantir la reproductibilité entre CI et environnement local.

### Étape 5 — Alerting & notification des résultats

Objectif : informer l'équipe en temps réel en cas d'échec, sans attendre la consultation manuelle du pipeline.

- **Slack** : notification automatique dans un channel dédié QA (webhook Slack + intégration GitHub Actions/GitLab CI) avec résumé des tests échoués et lien vers le rapport complet.
- **Microsoft Teams** : webhook Teams pour les organisations utilisant l'écosystème Microsoft, mêmes principes que Slack (résumé + lien pipeline).
- **Discord** : webhook Discord pour les équipes plus "dev-friendly"/startups, notifications sur un salon dédié CI/QA.
- **Gmail (ou email SMTP)** : envoi automatique d'un rapport de synthèse par email aux parties prenantes (PO, lead dev, management) après chaque campagne de non-régression, notamment pour les audits ou les stakeholders non techniques.
- Bonnes pratiques : ne notifier que les échecs (éviter le bruit sur succès systématiques), enrichir la notification avec captures d'écran/vidéos Cypress et lien direct vers le run concerné.

### Étape 6 — Reporting des tests Cypress

Outils de reporting à mettre en place selon le niveau de granularité recherché :

- **Mochawesome** : rapport HTML détaillé par run, avec captures d'écran et statuts par test — idéal pour un debug rapide.
- **Allure Report** : reporting plus riche et historisé (tendances sur plusieurs runs, catégorisation des échecs, intégration CI native) — utile pour un suivi qualité dans la durée.
- **Cypress Dashboard / Cypress Cloud** : reporting natif Cypress avec parallélisation, analytics de flakiness, replay vidéo des échecs.
- **Xray (Jira)** : remontée des résultats d'exécution directement dans les tickets Jira/user stories pour assurer la traçabilité exigences ↔ tests ↔ résultats (utile en environnement réglementé/audit).

### Étape 7 — Visualisation & pilotage qualité (PowerBI)

- Centralisation des résultats de test (exports JSON/CSV des rapports Cypress, Allure, Xray) dans une base de données ou un data store intermédiaire.
- Construction de **dashboards PowerBI** pour piloter la qualité au niveau management/produit :
  - Taux de réussite des campagnes de tests dans le temps (tendance sprint par sprint).
  - Taux de flakiness (tests instables) pour prioriser la dette technique de test.
  - Couverture fonctionnelle (nombre de user stories couvertes par des tests automatisés vs manuels).
  - Temps d'exécution des pipelines (identifier les goulots d'étranglement CI/CD).
  - Répartition des défauts par module/criticité, pour orienter les efforts de test.
- Intérêt : transformer des données techniques (logs Cypress, rapports Allure) en indicateurs business lisibles par le management et le PO, renforçant la valeur perçue de la fonction QA.

### Vue d'ensemble du cycle

```
Specs technico-fonctionnelles (Shift-Left)
        │
        ▼
Conception des scénarios (Gherkin, priorisation par risque)
        │
        ▼
Automatisation (Cypress / Selenium / Karate)
        │
        ▼
Exécution CI/CD (GitHub Actions / GitLab CI, Docker)
        │
        ├──► Alerting (Slack / Teams / Discord / Gmail)
        │
        ▼
Reporting (Mochawesome / Allure / Cypress Cloud / Xray)
        │
        ▼
Pilotage qualité (PowerBI — dashboards & indicateurs)
```

---

*Document consolidé à partir de la fiche de poste source (fusion des versions FR/EN et des différentes formulations de missions et compétences en un référentiel unique), enrichi du setup environnement, de la brique IA (Python/LangChain/LangGraph/LangSmith), et du cycle de vie complet du test logiciel (specs, shift-left, automatisation, alerting, reporting, PowerBI).*


## Ajout:

Définir la stratégie de tests

Analyser les spécifications techniques et fonctionnelles des projets,
Identifier les cas de tests prioritaires à automatiser en fonction des besoins du projet et des contraintes de temps,
Sélectionner les outils et technologies adaptés pour la mise en place des tests automatisés (Selenium, JUnit, TestNG, Cypress, karaté, etc.).
Concevoir et exécuter des tests

Créer et exécuter des tests (tests fonctionnels, tests de régression, tests d’intégration, tests de performance, etc.),
Développer et maintenir des scripts de tests automatisés pour les différentes couches de l’application (UI, API, tests de performance, etc.),
Assurer la couverture fonctionnelle et la robustesse des tests automatisés,
Participer à la préparation et à l’exécution des tests d’acceptation utilisateur (UAT),
Assurer les tests, la validation et le suivi qualité des équipements IoT (centrales, capteurs, caméras et périphériques connectés) afin de garantir leur bon fonctionnement, leur stabilité et leur intégration avec les plateformes backend et applications associées.
Gérer un référentiel de tests

Créer et organiser un référentiel de tests complet et structuré qui couvre tous les cas de tests fonctionnels, non-fonctionnels, de régression et de performance.
De Formation Ingénieur en Informatique.

Compétences Techniques :

- Définition et exécution des plans et campagnes de test (la connaissance de Xray serait un plus),
- Ecriture et exécution de tests d’APIs avec Postman,
- (Optionnel) Exécution de tests de charge.

Aptitudes relationnelles et comportementales :

- Rigueur, autonomie et proactivité,
- Esprit d’équipe.
