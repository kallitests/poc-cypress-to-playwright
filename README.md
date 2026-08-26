# 🎭 poc-cypress-to-playwright

> **Runnable Cypress → Playwright migration exercise.**
> The same English Gherkin intent, executed by both the original Cypress suite and the target Playwright suite, then compared in a dual-run CI pipeline.

[![Status](https://img.shields.io/badge/status-WIP-orange?style=flat-square)](https://github.com/kallitests/poc-cypress-to-playwright)
[![Node.js](https://img.shields.io/badge/node-20+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![Cypress](https://img.shields.io/badge/Cypress-baseline-17202C?style=flat-square&logo=cypress)](https://www.cypress.io)
[![Playwright](https://img.shields.io/badge/Playwright-target-2EAD33?style=flat-square&logo=playwright)](https://playwright.dev)
[![Docker](https://img.shields.io/badge/Docker-ready-2496ED?style=flat-square&logo=docker)](https://docker.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Jobs-326CE5?style=flat-square&logo=kubernetes)](https://kubernetes.io)

---

## 🗺️ Table of Contents

- [Why this repo?](#-why-this-repo)
- [What it does](#%EF%B8%8F-what-it-does)
- [Architecture](#-architecture)
- [Stack](#-stack)
- [Project Structure](#-project-structure)
- [Local run](#-local-run)
- [Roadmap](#-roadmap)
- [Author](#-author)

---

## 💡 Why This Repo?

Most "Cypress → Playwright migration" content is theory. Teams facing the actual switch need an answer to one question:

> *"Does the migrated suite behave the same as the one it replaces — provably, not just by feel?"*

This repo answers that by running **both suites against the same target and the same intent**, side by side, in CI — not by describing the migration, but by demonstrating it end to end.

```
Cypress suite ──┐
                 ├──▶ Dual-run CI ──▶ Compare ──▶ Report & Alert
Playwright suite ┘
```

---

## ⚙️ What It Does

| Step | Description |
|------|-------------|
| 🧾 **Shared intent** | Same English Gherkin `.feature` files drive both suites — UI and API, smoke and regression |
| 🧪 **Baseline suite** | Cypress + `@badeball/cypress-cucumber-preprocessor` against [automationexercise.com](https://automationexercise.com) |
| 🎭 **Target suite** | Playwright + `playwright-bdd`, migrated step by step with documented decisions |
| 🐳 **Independent runners** | Dockerized headless images per suite, no shared state |
| ☸️ **Run-to-completion jobs** | Kubernetes Jobs (not Deployments) for each suite, triggered from CI |
| 🔁 **Dual-run pipeline** | GitHub Actions runs both suites in parallel against a `kind` cluster, then compares results |
| 🚨 **Batched alerting** | Slack, Discord, and Gmail notifications — one message per run, not per failing scenario |
| 📊 **Power BI reporting** | Normalized results pushed to a streaming dataset for a live pass-rate dashboard |

---

## 🏗️ Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                         Dual-Run CI Pipeline                          │
│                                                                       │
│   ┌──────────────┐                              ┌──────────────┐    │
│   │   Gherkin    │─────────────┬───────────────▶│   Cypress    │    │
│   │  .feature    │             │                 │    suite     │    │
│   │  (shared)    │             │                 └──────┬───────┘    │
│   └──────────────┘             │                        │            │
│                                 │                        ▼            │
│                                 │                 ┌──────────────┐    │
│                                 └────────────────▶│  Playwright  │    │
│                                                    │    suite     │    │
│                                                    └──────┬───────┘    │
│                                                           │            │
│                        ┌──────────────────────────────────┘           │
│                        ▼                                              │
│               ┌─────────────────┐      ┌──────────────┐              │
│               │ Compare results │─────▶│  Power BI    │              │
│               │ (coverage, time)│      │  reporting   │              │
│               └────────┬────────┘      └──────────────┘              │
│                        │                                              │
│                        ▼                                              │
│               ┌─────────────────┐                                     │
│               │ Slack/Discord/  │                                     │
│               │ Gmail alerting  │                                     │
│               └─────────────────┘                                     │
│                                                                       │
│   ☸️ Kubernetes Jobs (kind, in CI) — 🐳 Dockerized independent runners │
└───────────────────────────────────────────────────────────────────────┘
```

---

## 🧰 Stack

| Layer | Technology |
|-------|-----------|
| **Baseline test execution** | [Cypress](https://www.cypress.io) + `@badeball/cypress-cucumber-preprocessor` |
| **Target test execution** | [Playwright](https://playwright.dev) + `playwright-bdd` |
| **Test intent** | Gherkin (English), shared between both suites |
| **Containerization** | Docker (independent images per suite) |
| **Orchestration** | Kubernetes Jobs (run-to-completion) |
| **CI/CD** | GitHub Actions, `kind` (Kubernetes in Docker) |
| **Alerting** | Slack · Discord · Gmail (batched, one message per run) |
| **Reporting** | Power BI streaming dataset |

---

## 📁 Project Structure

```
poc-cypress-to-playwright/
├── cypress-suite/            # Baseline: Cypress + cucumber-preprocessor
├── playwright-suite/         # Target: Playwright + playwright-bdd
├── migration/                # Migration decisions, operating method, coverage comparison
│   ├── MIGRATION_GUIDE.md
│   ├── MODUS_OPERANDI.md
│   └── COVERAGE_COMPARISON.md
├── docker/                   # Independent headless runner images
├── k8s/                      # Run-to-completion Jobs & environment templates
├── .github/workflows/        # Dual-run kind pipeline
├── alerting/                 # Batched Slack, Discord, and Gmail notifications
├── reporting/                # Report normalization & Power BI streaming schema
├── docker-compose.yml
├── package.json
├── CODE_WALKTHROUGH.md       # 10-minute tour of the repo
└── README.md
```

---

## 🚀 Local Run

Prerequisites: Node.js 20+, Docker for browser dependencies, and credentials only when integrations are enabled.

```bash
npm install
npm --prefix cypress-suite install
npm --prefix playwright-suite install
npm run test:cypress
npm run test:playwright
```

The public site can change, so UI checks use roles, labels, and stable `data-qa` selectors where available, with assertions focused on observable behavior. Set `BASE_URL` to point at a controlled environment when reproducibility matters. API and login scenarios use `TEST_USER_EMAIL` and `TEST_USER_PASSWORD`; login scenarios are skipped when credentials are not supplied.

See [CODE_WALKTHROUGH.md](CODE_WALKTHROUGH.md) for the ten-minute tour and [migration/MODUS_OPERANDI.md](migration/MODUS_OPERANDI.md) for the migration method.

---

## 📌 Roadmap

- [x] Repository structure & shared Gherkin intent
- [x] Cypress baseline suite (UI + API, smoke + regression)
- [x] Playwright target suite, migrated step by step
- [x] Migration documentation (guide, modus operandi, coverage comparison)
- [x] Dockerized independent runners
- [x] Kubernetes Jobs for run-to-completion execution
- [x] Dual-run GitHub Actions pipeline on `kind`
- [x] Batched Slack/Discord/Gmail alerting
- [x] Power BI streaming reporting
- [ ] Live Power BI dashboard screenshots in README
- [ ] Extend coverage comparison with flakiness tracking over time

⭐ Star this repo to follow the progress.

---

## 👤 Author

**Khalid Hafid-Medheb**
Senior SDET — Cypress → Playwright migration & DevSecOps, generative AI as a QA productivity accelerator

[![LinkedIn](https://img.shields.io/badge/LinkedIn-khalid--hafid--medheb-0077B5?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/khalid-hafid-medheb-40451aa8/)
[![GitHub](https://img.shields.io/badge/GitHub-kallitests-181717?style=flat-square&logo=github)](https://github.com/kallitests)
[![Kallitests](https://img.shields.io/badge/Org-Kallitests-6e40c9?style=flat-square)](https://github.com/kallitests)

---

*Built with 🎭 Playwright · 🧪 Cypress · 🐳 Docker · ☸️ Kubernetes*
