# Formations complémentaires — CPF & Udemy pour ton objectif IA/SDET Cypress→Playwright/DevOps

> Objectif : combler les compétences nécessaires pour remplir le tableau IA/agents du document précédent (migration Cypress→Playwright, IA appliquée au testing, DevOps).

⚠️ **Rappel important** : le marché des formations CPF évolue vite et une partie du contenu en ligne est du SEO marketing. Vérifie systématiquement l'éligibilité réelle, le prix à jour et le reste à charge sur **[moncompteformation.gouv.fr](https://www.moncompteformation.gouv.fr)** avant de t'engager. Une info à noter : la loi de finances 2026 prévoit une réduction du financement CPF et une hausse du reste à charge — les conditions peuvent changer en cours d'année, donc vérifie au moment où tu es prêt à t'inscrire.

---

## 1. Formations certifiantes éligibles CPF

| Formation / Certification | Niveau | Pourquoi elle sert ton objectif | Prérequis | Remarque |
|---|---|---|---|---|
| **ISTQB Foundation (CTFL)** | Base | Certification internationalement reconnue en test logiciel — légitime ton profil SDET face aux recruteurs qui ne connaissent pas tes 6 ans Cypress en détail | Aucun | ~35-50h de préparation ; examen 200-250€ TTC, formation éligible CPF via organismes agréés CFTL (ex : Skills4All, Elitek) |
| **ISTQB Advanced — Test Automation Engineer (CT-TAE)** | Avancé | Spécifiquement dédiée à l'automatisation de tests (Selenium/Cypress/Playwright), pipelines CI/CD — colle exactement à ta transition | CTFL Foundation obligatoire + 1-3 ans XP automation recommandés | Formation ~2 800€ HT chez certains organismes, vérifier prise en charge CPF/OPCO |
| **ISTQB CT-GenAI (Generative AI Tester)** | Spécialisation | **La plus alignée avec ta démarche IA+testing** — traite explicitement de l'usage de l'IA générative dans le test logiciel | CTFL Foundation recommandé | Certification émergente en 2026, rôles "Test Engineer IA" décrits comme parmi les mieux rémunérés du secteur — à vérifier sur le registre CFTL si déjà disponible en CPF |
| **Expert en ingénierie de l'IA (RNCP38587)** | 7 (bac+5) | Structure une montée en compétence IA généraliste si tu veux aller au-delà du testing (ex : construire de vrais agents comme ceux qu'on a listés) | Bac+3 informatique | Formation lourde, à réserver si tu vises un vrai virage AI Engineer au-delà du testing augmenté par l'IA |
| **TOSA Python (RS6962)** | Certification courte | Valide tes compétences Python si tu développes des scripts d'agents/migration en Python plutôt qu'en JS/TS | Aucun (test adaptatif) | Éligible CPF, formule test de positionnement gratuit sur tosa.org avant d'engager une formation payante |

### Ma recommandation pour ton cas précis

Dans l'ordre de pertinence pour ton objectif (Cypress→Playwright + IA + DevOps) :
1. **ISTQB CTFL** si tu n'as pas de certification de test formelle — ça comble un trou de légitimité classique chez les recruteurs, vite fait
2. **ISTQB CT-TAE (Test Automation Engineer)** — le plus proche de ta réalité quotidienne, mentionne explicitement Selenium/Cypress/Playwright et CI/CD dans son syllabus
3. **CT-GenAI** dès qu'elle sera largement disponible — c'est la carte différenciante par excellence pour ton positionnement "IA + testing"

Ne te précipite pas sur le RNCP38587 (bac+5 généraliste IA) si ton objectif reste le testing augmenté par l'IA — c'est un investissement CPF disproportionné par rapport à ton besoin réel.

---

## 2. Tutos Udemy pour compléter concrètement

### 2.1 Playwright + IA (cœur de ta migration)

| Cours | Ce qu'il couvre | Pourquoi il correspond à ton objectif |
|---|---|---|
| **"Playwright + Claude AI & MCP Server: AI QA Automation"** | Setup du serveur Playwright MCP connecté à Claude AI, construction d'un framework d'automatisation piloté par agents IA | Le plus proche de ce qu'on a construit ensemble (SentinelQA) — apprend à commander des agents IA qui écrivent/debug/maintiennent tes tests |
| **"Playwright JS/TS Automation Testing from Scratch & Framework"** (mis à jour août 2026, Playwright Agents & MCP) | Framework complet de zéro, y compris démo Agents & MCP | Bon complément si tu pars de zéro sur la structuration de framework Playwright (Page Object Model, etc.) |
| **"AI-Driven Test Automation: Playwright, Selenium, LLMs & More"** | Self-healing locators avec LLMs locaux ou cloud, migration de locators Selenium/Playwright, tests visuels intelligents | Directement utile pour construire ton agent "FlakeHunter" ou "MigratorAI" du document précédent |
| **"Playwright Automation Testing 2026: TypeScript, AI & MCP"** (Rahul Shetty, 14 000+ étudiants) | JS/TS, API testing, AI Agents, MCP, Cucumber BDD, CI/CD end-to-end | Cours très complet et parmi les plus recommandés, bon choix si tu veux UN SEUL cours généraliste solide |

### 2.2 Spécifiquement pour la migration Cypress → Playwright

| Cours | Ce qu'il couvre | Pourquoi il correspond à ton objectif |
|---|---|---|
| **"Playwright Automation Practice Exams 500 Questions"** | Questions scénario-based incluant décisions d'architecture, CI/CD, et **explicitement pensé pour les profils en migration Selenium/Cypress** | Bon pour valider que tu maîtrises les différences de raisonnement, pas juste la syntaxe |
| **"Playwright for Test Automation: The Ultimate Guide"** | Locators, POM, gestion d'éléments dynamiques — inclut des comparaisons pratiques avec la syntaxe Cypress | Utile pour la phase de traduction mentale Cypress→Playwright pendant l'apprentissage |

### 2.3 Fondamentaux à ne pas sauter si besoin

| Cours | Usage |
|---|---|
| Cours pytest/Playwright Python déjà identifiés dans les échanges précédents | Si tu choisis de coder tes agents de migration en Python plutôt qu'en Node.js/TS |
| "100 Days of Code" (Angela Yu) | Si tu veux consolider les fondamentaux Python génériques avant de coder des agents IA maison |

---

## 3. Comment séquencer tout ça

| Ordre | Action | Durée indicative |
|---|---|---|
| 1 | Cours Udemy Playwright + Claude AI & MCP (le plus aligné avec SentinelQA) | 2-3 semaines |
| 2 | Construire le projet 1 du document précédent (MigratorAI) en parallèle du cours | 3-4 semaines |
| 3 | Passer ISTQB CTFL si tu n'as pas de certif de test formelle | 1 mois (prépa + examen) |
| 4 | Passer ISTQB CT-TAE une fois le CTFL en poche | 1-2 mois |
| 5 | Vérifier disponibilité CT-GenAI sur le registre CFTL et l'ajouter si dispo | Selon disponibilité |
| 6 | Cours Udemy "AI-Driven Test Automation" pour enrichir tes agents (self-healing) | 2 semaines |

**Point d'attention financier** : les cours Udemy sont peu coûteux (15-20€ avec les promos fréquentes) et n'engagent pas ton CPF — fais-les en autonomie rapidement. Réserve ton CPF pour les certifications ISTQB qui ont une vraie valeur de reconnaissance externe et un coût réel (examens + formations officielles).
