# 🐍 Cheat Sheet Python — Automatisation & IA

> Aide-mémoire complet pour développer des scripts d'automatisation et des applications IA (LLM, agents) en Python.

---

## 📑 Sommaire
1. [Bases essentielles](#1-bases-essentielles)
2. [Environnement & packages](#2-environnement--packages)
3. [Manipulation de fichiers](#3-manipulation-de-fichiers)
4. [Automatisation système](#4-automatisation-système)
5. [Web scraping & requêtes HTTP](#5-web-scraping--requêtes-http)
6. [Automatisation navigateur](#6-automatisation-navigateur)
7. [Manipulation de données](#7-manipulation-de-données)
8. [Programmation asynchrone](#8-programmation-asynchrone)
9. [Planification de tâches](#9-planification-de-tâches)
10. [Gestion des erreurs & logs](#10-gestion-des-erreurs--logs)
11. [IA générative — LLM (bases)](#11-ia-générative--llm-bases)
12. [LangChain](#12-langchain)
13. [LangGraph — agents](#13-langgraph--agents)
14. [RAG (Retrieval-Augmented Generation)](#14-rag-retrieval-augmented-generation)
15. [Bonnes pratiques & sécurité](#15-bonnes-pratiques--sécurité)
16. [Rappel de cours : le scripting Python](#16-rappel-de-cours--le-scripting-python)
17. [Scripts Python prêts à l'emploi](#17-scripts-python-prêts-à-lemploi)
18. [Algorithmes de base](#18-algorithmes-de-base)
19. [Pseudocode : comment bien l'écrire](#19-pseudocode--comment-bien-lécrire)
20. [Pitchs de projets — Tests automatisés Cypress (portfolio GitHub)](#20-pitchs-de-projets--tests-automatisés-cypress-portfolio-github)
21. [Pitchs de projets — LangChain/LangGraph + IA pour Cypress](#21-pitchs-de-projets--langchainlanggraph--ia-pour-cypress)
22. [Ressources d'apprentissage recommandées](#22-ressources-dapprentissage-recommandées)
23. [Booster les tests Cypress avec l'AI Engineering](#23-booster-les-tests-cypress-avec-lai-engineering)
24. [Ressources utiles](#24-ressources-utiles)

---

## 1. Bases essentielles

```python
# Variables et types
x = 10                  # int
y = 3.14                # float
s = "texte"             # str
b = True                # bool
lst = [1, 2, 3]         # list
tup = (1, 2, 3)         # tuple (immuable)
dct = {"a": 1, "b": 2}  # dict
st = {1, 2, 3}          # set

# f-strings (formatage)
nom = "Alice"
print(f"Bonjour {nom}, il est {2024}")

# Conditions
if x > 5:
    print("grand")
elif x == 5:
    print("égal")
else:
    print("petit")

# Boucles
for item in lst:
    print(item)

for i, item in enumerate(lst):        # avec index
    print(i, item)

while x > 0:
    x -= 1

# List comprehension
carres = [i**2 for i in range(10)]
pairs = [i for i in range(20) if i % 2 == 0]

# Fonctions
def addition(a, b=0):
    """Docstring : additionne deux nombres."""
    return a + b

# Fonctions lambda
double = lambda x: x * 2

# *args et **kwargs
def flexible(*args, **kwargs):
    print(args, kwargs)

# Classes
class Personne:
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age

    def __repr__(self):
        return f"Personne({self.nom}, {self.age})"

# Décorateurs
def chrono(fonction):
    import time
    def wrapper(*args, **kwargs):
        debut = time.time()
        resultat = fonction(*args, **kwargs)
        print(f"Durée : {time.time() - debut:.2f}s")
        return resultat
    return wrapper

@chrono
def tache_longue():
    ...
```

---

## 2. Environnement & packages

```bash
# Créer un environnement virtuel
python -m venv venv

# Activer (Linux/Mac)
source venv/bin/activate
# Activer (Windows)
venv\Scripts\activate

# Installer des packages
pip install requests pandas openai

# Exporter les dépendances
pip freeze > requirements.txt

# Installer depuis un fichier
pip install -r requirements.txt

# Alternative moderne : uv (plus rapide)
uv venv
uv pip install requests
```

**Gestionnaires alternatifs** : `poetry`, `pipenv`, `conda` — utiles pour des projets plus complexes avec gestion fine des dépendances.

---

## 3. Manipulation de fichiers

```python
# Lecture / écriture simple
with open("fichier.txt", "r", encoding="utf-8") as f:
    contenu = f.read()

with open("sortie.txt", "w", encoding="utf-8") as f:
    f.write("Bonjour\n")

# Ligne par ligne (mémoire efficace)
with open("gros_fichier.txt") as f:
    for ligne in f:
        print(ligne.strip())

# JSON
import json
with open("data.json") as f:
    data = json.load(f)

with open("out.json", "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# CSV
import csv
with open("data.csv", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row["colonne"])

# Chemins (multiplateforme)
from pathlib import Path
p = Path("dossier") / "sous_dossier" / "fichier.txt"
p.parent.mkdir(parents=True, exist_ok=True)
print(p.exists(), p.suffix, p.stem)

# Parcourir un dossier
for fichier in Path("dossier").glob("*.pdf"):
    print(fichier.name)

for fichier in Path("dossier").rglob("*.py"):  # récursif
    print(fichier)
```

---

## 4. Automatisation système

```python
import os
import shutil
import subprocess

# Variables d'environnement
cle_api = os.environ.get("MA_CLE_API")

# Copier / déplacer / supprimer
shutil.copy("source.txt", "dest.txt")
shutil.move("ancien.txt", "dossier/nouveau.txt")
shutil.rmtree("dossier_a_supprimer")

# Exécuter une commande shell
resultat = subprocess.run(
    ["ls", "-la"],
    capture_output=True,
    text=True
)
print(resultat.stdout)

# Automatiser des fichiers Excel/Word (bibliothèques dédiées)
# pip install openpyxl python-docx
```

**Cas d'usage courants** : renommage en masse de fichiers, tri automatique de dossiers, génération de rapports, envoi d'emails automatisés (`smtplib` ou `yagmail`).

---

## 5. Web scraping & requêtes HTTP

```python
import requests
from bs4 import BeautifulSoup

# Requête GET simple
r = requests.get("https://api.exemple.com/data", timeout=10)
r.raise_for_status()
data = r.json()

# Requête POST avec headers et payload
r = requests.post(
    "https://api.exemple.com/action",
    headers={"Authorization": f"Bearer {token}"},
    json={"cle": "valeur"}
)

# Scraping HTML
r = requests.get("https://exemple.com")
soup = BeautifulSoup(r.text, "html.parser")
titres = soup.select("h2.titre")
for t in titres:
    print(t.get_text(strip=True))

# Gestion de la pagination
page = 1
while True:
    r = requests.get(f"https://api.exemple.com/items?page={page}")
    items = r.json()
    if not items:
        break
    page += 1
```

⚠️ Vérifiez toujours le `robots.txt` et les CGU du site avant de scraper.

---

## 6. Automatisation navigateur

```python
# Playwright (recommandé en 2026, plus rapide que Selenium)
# pip install playwright && playwright install

from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("https://exemple.com")
    page.click("button#connexion")
    page.fill("input#email", "test@exemple.com")
    texte = page.text_content("h1")
    browser.close()

# Selenium (alternative largement utilisée)
from selenium import webdriver
from selenium.webdriver.common.by import By

driver = webdriver.Chrome()
driver.get("https://exemple.com")
elem = driver.find_element(By.ID, "mon-bouton")
elem.click()
driver.quit()
```

---

## 7. Manipulation de données

```python
import pandas as pd

# Charger des données
df = pd.read_csv("data.csv")
df = pd.read_excel("data.xlsx")

# Explorer
df.head()
df.info()
df.describe()

# Filtrer / sélectionner
df[df["colonne"] > 100]
df[["col1", "col2"]]
df.loc[df["categorie"] == "A", "valeur"]

# Transformer
df["nouvelle_col"] = df["col1"] * 2
df.groupby("categorie")["valeur"].sum()
df.sort_values("valeur", ascending=False)
df.dropna()
df.fillna(0)

# Exporter
df.to_csv("resultat.csv", index=False)
df.to_excel("resultat.xlsx", index=False)

# NumPy pour le calcul numérique
import numpy as np
arr = np.array([1, 2, 3])
moyenne = np.mean(arr)
```

---

## 8. Programmation asynchrone

```python
import asyncio
import httpx

async def recuperer(url, client):
    r = await client.get(url)
    return r.json()

async def main():
    urls = ["https://api.exemple.com/1", "https://api.exemple.com/2"]
    async with httpx.AsyncClient() as client:
        resultats = await asyncio.gather(*[recuperer(u, client) for u in urls])
    return resultats

asyncio.run(main())
```

**Utile pour** : appeler plusieurs API en parallèle, agents IA qui font des appels d'outils concurrents, scraping massif.

---

## 9. Planification de tâches

```python
# Bibliothèque schedule (simple)
import schedule
import time

def tache():
    print("Exécution de la tâche")

schedule.every(10).minutes.do(tache)
schedule.every().day.at("09:00").do(tache)

while True:
    schedule.run_pending()
    time.sleep(1)

# Alternative production : cron (Linux/Mac) ou Planificateur de tâches (Windows)
# Exemple crontab : exécuter tous les jours à 9h
# 0 9 * * * /usr/bin/python3 /chemin/script.py
```

---

## 10. Gestion des erreurs & logs

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    filename="app.log"
)
logger = logging.getLogger(__name__)

try:
    resultat = 10 / 0
except ZeroDivisionError as e:
    logger.error(f"Erreur de division : {e}")
except Exception as e:
    logger.exception("Erreur inattendue")
else:
    print("Aucune erreur")
finally:
    print("Toujours exécuté")

# Retry automatique (utile pour les appels API)
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=1, max=10))
def appel_api_fragile():
    ...
```

---

## 11. IA générative — LLM (bases)

```python
# Appel direct à l'API Anthropic
# pip install anthropic
import anthropic

client = anthropic.Anthropic(api_key="VOTRE_CLE")
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Explique-moi les listes en Python"}]
)
print(message.content[0].text)

# Appel direct à l'API OpenAI
# pip install openai
from openai import OpenAI
client = OpenAI(api_key="VOTRE_CLE")
response = client.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Bonjour"}]
)
print(response.choices[0].message.content)

# Sortie structurée (JSON)
prompt = """Réponds UNIQUEMENT en JSON valide, sans texte autour, format :
{"nom": "...", "age": ...}"""
```

**Concepts clés IA agentique** :
- **Prompt engineering** : structurer les instructions (rôle, contexte, format de sortie attendu)
- **Tool calling / function calling** : permettre au LLM d'appeler des fonctions Python définies par vous
- **Contexte / mémoire** : gérer l'historique de conversation dans le prompt
- **Streaming** : recevoir la réponse token par token pour l'UX

---

## 12. LangChain

```python
# pip install langchain langchain-anthropic
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

llm = ChatAnthropic(model="claude-sonnet-4-6")

# Chaîne simple avec LCEL (LangChain Expression Language)
prompt = ChatPromptTemplate.from_messages([
    ("system", "Tu es un assistant expert en Python."),
    ("human", "{question}")
])
chaine = prompt | llm | StrOutputParser()
reponse = chaine.invoke({"question": "Comment lire un CSV ?"})

# Définir un outil (tool)
from langchain_core.tools import tool

@tool
def calculer_moyenne(nombres: list[float]) -> float:
    """Calcule la moyenne d'une liste de nombres."""
    return sum(nombres) / len(nombres)

llm_avec_outils = llm.bind_tools([calculer_moyenne])
```

---

## 13. LangGraph — agents

```python
# pip install langgraph
from langgraph.graph import StateGraph, END
from typing import TypedDict

class EtatAgent(TypedDict):
    question: str
    reponse: str

def noeud_recherche(state: EtatAgent) -> EtatAgent:
    state["reponse"] = f"Résultat pour : {state['question']}"
    return state

def noeud_verification(state: EtatAgent) -> EtatAgent:
    # logique de validation
    return state

# Construction du graphe
graphe = StateGraph(EtatAgent)
graphe.add_node("recherche", noeud_recherche)
graphe.add_node("verification", noeud_verification)
graphe.set_entry_point("recherche")
graphe.add_edge("recherche", "verification")
graphe.add_edge("verification", END)

app = graphe.compile()
resultat = app.invoke({"question": "Quelle heure est-il ?", "reponse": ""})

# Édges conditionnels (routing)
def router(state: EtatAgent) -> str:
    return "verification" if state["reponse"] else "recherche"

graphe.add_conditional_edges("recherche", router, {
    "verification": "verification",
    "recherche": "recherche"
})
```

**Concepts clés LangGraph** :
- **State** : objet partagé qui circule entre les nœuds
- **Nodes** : fonctions Python (souvent des appels LLM ou outils)
- **Edges** : transitions, y compris conditionnelles
- **Human-in-the-loop** : point de pause pour validation humaine avant de continuer
- **Checkpointing** : sauvegarde de l'état pour reprendre une exécution interrompue

---

## 14. RAG (Retrieval-Augmented Generation)

```python
# pip install langchain-community chromadb sentence-transformers
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter

# 1. Découper les documents
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_text(document_texte)

# 2. Créer les embeddings et stocker dans une base vectorielle
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
vectorstore = Chroma.from_texts(chunks, embeddings)

# 3. Recherche par similarité
resultats = vectorstore.similarity_search("ma question", k=3)

# 4. Construire le prompt enrichi
contexte = "\n\n".join([r.page_content for r in resultats])
prompt_final = f"Contexte :\n{contexte}\n\nQuestion : {question}"
```

**Pipeline RAG type** : Documents → Découpage (chunking) → Embeddings → Base vectorielle → Recherche → Prompt enrichi → LLM

---

## 15. Bonnes pratiques & sécurité

- **Jamais de clé API en dur dans le code** → utiliser `.env` + `python-dotenv`
  ```python
  from dotenv import load_dotenv
  import os
  load_dotenv()
  cle = os.getenv("API_KEY")
  ```
- **Toujours limiter les tentatives** (`timeout`, `retry`) sur les appels réseau
- **Valider les entrées utilisateur** avant de les envoyer à un LLM ou d'exécuter du code
- **Logger** plutôt que `print()` en production
- **Tests unitaires** avec `pytest`
  ```python
  def test_addition():
      assert addition(2, 3) == 5
  ```
- **Typage** avec les type hints pour la lisibilité et les outils comme `mypy`
- **Formatage/linting** : `black`, `ruff`, `flake8`
- **Ne jamais committer** `.env`, clés API, ou données sensibles (ajouter à `.gitignore`)
- **Rate limiting** : respecter les limites d'appels des API (LLM, scraping)

---

## 16. Rappel de cours : le scripting Python

### Script vs module vs package

| Notion | Définition |
|---|---|
| **Script** | Fichier `.py` exécuté directement (`python mon_script.py`), généralement pour une tâche autonome |
| **Module** | Fichier `.py` destiné à être **importé** ailleurs (`import mon_module`) |
| **Package** | Dossier contenant plusieurs modules + un fichier `__init__.py` |

Un même fichier peut être les deux à la fois : importable **et** exécutable directement, grâce à `if __name__ == "__main__"`.

### Structure standard d'un script

```python
#!/usr/bin/env python3
"""
Description du script : que fait-il, comment l'utiliser.
"""

import sys
import argparse


def traiter(donnee):
    """Logique métier principale."""
    return donnee.upper()


def main():
    parser = argparse.ArgumentParser(description="Mon script")
    parser.add_argument("valeur", help="Valeur à traiter")
    args = parser.parse_args()

    resultat = traiter(args.valeur)
    print(resultat)


if __name__ == "__main__":
    main()
```

**Pourquoi `if __name__ == "__main__"` ?**
Quand Python exécute un fichier, la variable spéciale `__name__` vaut `"__main__"`. Si le fichier est **importé** depuis un autre script, `__name__` prend le nom du module. Ce garde-fou permet donc d'avoir du code qui ne s'exécute **que** si le fichier est lancé directement, pas quand il est importé ailleurs.

### `sys.argv` vs `argparse` vs `click`

```python
# 1. sys.argv — bas niveau, pas de validation
import sys
print(sys.argv)  # ['script.py', 'arg1', 'arg2']
nom_fichier = sys.argv[1] if len(sys.argv) > 1 else None

# 2. argparse — standard, robuste, dans la bibliothèque standard
import argparse
parser = argparse.ArgumentParser()
parser.add_argument("--verbose", action="store_true")
parser.add_argument("--nombre", type=int, default=1)
args = parser.parse_args()

# 3. click — plus ergonomique, mais nécessite une dépendance externe
# pip install click
import click

@click.command()
@click.option("--nombre", default=1, help="Nombre de répétitions")
def cli(nombre):
    for _ in range(nombre):
        click.echo("Bonjour")

if __name__ == "__main__":
    cli()
```

**Quand choisir quoi ?**
- `sys.argv` : scripts ultra-simples, un seul argument, jetable
- `argparse` : le standard pour un script sérieux (aide auto-générée, validation de types, sans dépendance)
- `click` : pour des CLI plus riches avec sous-commandes, utilisé par de nombreux projets open source

### Codes de sortie et gestion des erreurs d'un script

```python
import sys

def main():
    try:
        resultat = 10 / 0
    except ZeroDivisionError:
        print("Erreur : division par zéro", file=sys.stderr)
        sys.exit(1)  # code ≠ 0 = échec, lisible par un autre script ou un pipeline CI

    print(resultat)
    sys.exit(0)  # succès explicite (optionnel, 0 par défaut si on ne l'appelle pas)

if __name__ == "__main__":
    main()
```

**Convention Unix** : `0` = succès, tout code `1-255` = erreur (souvent `1` pour une erreur générique, codes spécifiques pour des erreurs distinctes que d'autres scripts pourront tester avec `$?` en shell).

### Rendre un script exécutable directement (Linux/Mac)

```bash
# 1. Ajouter le shebang en première ligne du fichier
#!/usr/bin/env python3

# 2. Rendre le fichier exécutable
chmod +x mon_script.py

# 3. Lancer directement, sans taper "python"
./mon_script.py
```

### Récupérer des entrées utilisateur / configuration

```python
# Entrée interactive simple
nom = input("Quel est votre nom ? ")

# Variables d'environnement (souvent utilisé pour la config/secrets)
import os
mode_debug = os.environ.get("DEBUG", "false") == "true"

# Fichier de configuration (JSON, YAML, TOML, .env)
import json
with open("config.json") as f:
    config = json.load(f)

# .env avec python-dotenv (voir aussi section Bonnes pratiques)
from dotenv import load_dotenv
load_dotenv()
cle_api = os.getenv("API_KEY")
```

### Bonnes pratiques générales de scripting

- Toujours documenter l'usage en haut du script (docstring) : ce qu'il fait, comment l'appeler
- Séparer la **logique métier** (fonctions testables) de l'**orchestration** (`main()`)
- Utiliser `logging` plutôt que `print()` dès que le script devient un minimum sérieux
- Prévoir un mode `--dry-run` pour les scripts qui modifient/suppriment des données
- Un script qui échoue doit **échouer bruyamment** (message clair + code de sortie ≠ 0), jamais silencieusement

---

## 17. Scripts Python prêts à l'emploi

Des scripts complets, directement réutilisables, pour des cas d'usage fréquents en automatisation.

### Renommer en masse des fichiers

```python
from pathlib import Path

dossier = Path("mes_photos")
for i, fichier in enumerate(sorted(dossier.glob("*.jpg")), start=1):
    nouveau_nom = dossier / f"photo_{i:03d}.jpg"
    fichier.rename(nouveau_nom)
    print(f"{fichier.name} → {nouveau_nom.name}")
```

### Trier des fichiers par type dans des sous-dossiers

```python
from pathlib import Path
import shutil

source = Path("téléchargements")
categories = {
    ".pdf": "documents", ".jpg": "images", ".png": "images",
    ".mp4": "videos", ".zip": "archives"
}

for fichier in source.iterdir():
    if fichier.is_file():
        dossier_cible = source / categories.get(fichier.suffix.lower(), "autres")
        dossier_cible.mkdir(exist_ok=True)
        shutil.move(str(fichier), str(dossier_cible / fichier.name))
```

### Envoyer un email automatique avec pièce jointe

```python
import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg["Subject"] = "Rapport automatique"
msg["From"] = "moi@exemple.com"
msg["To"] = "destinataire@exemple.com"
msg.set_content("Voici le rapport en pièce jointe.")

with open("rapport.pdf", "rb") as f:
    msg.add_attachment(f.read(), maintype="application", subtype="pdf", filename="rapport.pdf")

with smtplib.SMTP_SSL("smtp.exemple.com", 465) as smtp:
    smtp.login("moi@exemple.com", "mot_de_passe")
    smtp.send_message(msg)
```

### Surveiller un dossier et réagir à un nouveau fichier

```python
import time
from pathlib import Path

dossier = Path("watch_folder")
fichiers_connus = set(dossier.iterdir())

while True:
    fichiers_actuels = set(dossier.iterdir())
    nouveaux = fichiers_actuels - fichiers_connus
    for f in nouveaux:
        print(f"Nouveau fichier détecté : {f.name}")
        # → déclencher un traitement (upload, parsing, notification...)
    fichiers_connus = fichiers_actuels
    time.sleep(5)
```

### Générer un rapport Excel à partir d'un CSV

```python
import pandas as pd

df = pd.read_csv("ventes.csv")
resume = df.groupby("produit")["montant"].agg(["sum", "mean", "count"])
resume.columns = ["Total", "Moyenne", "Nb ventes"]

with pd.ExcelWriter("rapport_ventes.xlsx", engine="openpyxl") as writer:
    df.to_excel(writer, sheet_name="Détail", index=False)
    resume.to_excel(writer, sheet_name="Résumé")
```

### Mini script CLI avec argparse

```python
import argparse

parser = argparse.ArgumentParser(description="Renomme des fichiers en masse")
parser.add_argument("dossier", help="Chemin du dossier cible")
parser.add_argument("--extension", default=".txt", help="Extension à traiter")
parser.add_argument("--dry-run", action="store_true", help="Simule sans modifier")

args = parser.parse_args()
print(f"Traitement de {args.dossier} (extension {args.extension}), dry_run={args.dry_run}")
# python script.py mon_dossier --extension .jpg --dry-run
```

---

## 18. Algorithmes de base

Les grands classiques à connaître et savoir coder « à la main » — souvent demandés en entretien technique.

### Recherche linéaire

```python
def recherche_lineaire(liste, cible):
    for i, valeur in enumerate(liste):
        if valeur == cible:
            return i
    return -1

# Complexité : O(n)
```

### Recherche dichotomique (binary search)

```python
def recherche_dichotomique(liste_triee, cible):
    gauche, droite = 0, len(liste_triee) - 1
    while gauche <= droite:
        milieu = (gauche + droite) // 2
        if liste_triee[milieu] == cible:
            return milieu
        elif liste_triee[milieu] < cible:
            gauche = milieu + 1
        else:
            droite = milieu - 1
    return -1

# Complexité : O(log n) — nécessite une liste triée
```

### Tri à bulles (bubble sort)

```python
def tri_a_bulles(liste):
    n = len(liste)
    for i in range(n):
        for j in range(n - i - 1):
            if liste[j] > liste[j + 1]:
                liste[j], liste[j + 1] = liste[j + 1], liste[j]
    return liste

# Complexité : O(n²) — pédagogique, jamais utilisé en prod (préférer sorted())
```

### Tri rapide (quicksort)

```python
def quicksort(liste):
    if len(liste) <= 1:
        return liste
    pivot = liste[len(liste) // 2]
    gauche = [x for x in liste if x < pivot]
    milieu = [x for x in liste if x == pivot]
    droite = [x for x in liste if x > pivot]
    return quicksort(gauche) + milieu + quicksort(droite)

# Complexité moyenne : O(n log n)
```

### Fibonacci (récursif vs mémoïsation)

```python
# Version naïve — O(2^n), très lente
def fibonacci_naif(n):
    if n <= 1:
        return n
    return fibonacci_naif(n - 1) + fibonacci_naif(n - 2)

# Version avec mémoïsation — O(n)
from functools import lru_cache

@lru_cache(maxsize=None)
def fibonacci_rapide(n):
    if n <= 1:
        return n
    return fibonacci_rapide(n - 1) + fibonacci_rapide(n - 2)
```

### Palindrome

```python
def est_palindrome(mot):
    mot = mot.lower().replace(" ", "")
    return mot == mot[::-1]

print(est_palindrome("Kayak"))  # True
```

### FizzBuzz (grand classique d'entretien)

```python
for i in range(1, 21):
    if i % 15 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)
```

### Suppression des doublons en conservant l'ordre

```python
def supprimer_doublons(liste):
    vu = set()
    resultat = []
    for x in liste:
        if x not in vu:
            vu.add(x)
            resultat.append(x)
    return resultat
```

### Parcours d'arbre / graphe (BFS & DFS)

```python
# BFS (largeur) — utile pour le plus court chemin
from collections import deque

def bfs(graphe, depart):
    visites = {depart}
    file = deque([depart])
    ordre = []
    while file:
        noeud = file.popleft()
        ordre.append(noeud)
        for voisin in graphe[noeud]:
            if voisin not in visites:
                visites.add(voisin)
                file.append(voisin)
    return ordre

# DFS (profondeur) — récursif
def dfs(graphe, noeud, visites=None):
    if visites is None:
        visites = set()
    visites.add(noeud)
    for voisin in graphe[noeud]:
        if voisin not in visites:
            dfs(graphe, voisin, visites)
    return visites
```

---

## 19. Pseudocode : comment bien l'écrire

Le pseudocode sert à **penser la logique d'un algorithme avant de coder**, indépendamment du langage. Il est très utilisé en entretien technique et pour concevoir un script complexe.

### Règles d'un bon pseudocode

1. **Rester indépendant du langage** : pas de syntaxe Python/Java spécifique (pas de `:`, `self`, `import`...)
2. **Utiliser des mots-clés clairs et cohérents** : `DÉBUT`, `FIN`, `SI...ALORS...SINON`, `TANT QUE`, `POUR CHAQUE`, `RETOURNER`
3. **Une ligne = une action** : éviter de mélanger plusieurs opérations dans une seule ligne
4. **Nommer les variables de façon explicite** (`total_ventes` plutôt que `x`)
5. **Indenter** pour montrer la structure (blocs conditionnels, boucles)
6. **Rester au bon niveau d'abstraction** : décrire le *quoi*, pas forcément le *comment* bas niveau (ex : "TRIER la liste" plutôt que détailler l'algo de tri, sauf si c'est justement l'objet de l'exercice)
7. **Anticiper les cas limites** (liste vide, valeur nulle, division par zéro)

### Exemple : trouver le maximum d'une liste

```
DÉBUT
  FONCTION trouver_maximum(liste)
    SI liste est vide ALORS
      RETOURNER erreur "liste vide"
    FIN SI

    maximum ← premier élément de liste

    POUR CHAQUE élément DANS liste
      SI élément > maximum ALORS
        maximum ← élément
      FIN SI
    FIN POUR

    RETOURNER maximum
  FIN FONCTION
FIN
```

### Exemple : recherche dichotomique en pseudocode

```
DÉBUT
  FONCTION recherche_dichotomique(liste_triee, cible)
    gauche ← 0
    droite ← longueur(liste_triee) - 1

    TANT QUE gauche <= droite
      milieu ← (gauche + droite) / 2

      SI liste_triee[milieu] = cible ALORS
        RETOURNER milieu
      SINON SI liste_triee[milieu] < cible ALORS
        gauche ← milieu + 1
      SINON
        droite ← milieu - 1
      FIN SI
    FIN TANT QUE

    RETOURNER -1  (non trouvé)
  FIN FONCTION
FIN
```

### Méthode pour passer du pseudocode au code

1. Écrire le pseudocode en listant les entrées, sorties et étapes principales
2. Identifier les structures de contrôle nécessaires (boucles, conditions)
3. Traduire chaque bloc pseudocode en une fonction ou un bloc Python
4. Tester avec des cas simples, puis des cas limites
5. Refactoriser une fois que la logique fonctionne (nommage, découpage en fonctions)

---

## 20. Pitchs de projets — Tests automatisés Cypress (portfolio GitHub)

Des idées de projets à mettre sur un repo GitHub, avec un pitch percutant pour capter l'attention d'un recruteur en quelques secondes.

### Projet 1 — Suite de tests E2E sur un site e-commerce fictif

> **Pitch** : *"Suite de tests end-to-end Cypress couvrant le parcours d'achat complet d'un site e-commerce (recherche produit → panier → checkout → paiement mocké), avec gestion des fixtures, interceptions réseau et rapports de couverture."*

**Ce que ça démontre** : maîtrise du cycle de test complet, gestion des données de test (fixtures), interception d'API (`cy.intercept()`), lecture de code produit réel.

**README à inclure** : badge CI (GitHub Actions), capture d'écran du dashboard Cypress, temps d'exécution, % de couverture des parcours critiques.

---

### Projet 2 — Tests de non-régression visuelle

> **Pitch** : *"Pipeline de tests de non-régression visuelle avec Cypress + cypress-image-snapshot, détectant automatiquement les régressions UI sur chaque pull request via GitHub Actions."*

**Ce que ça démontre** : compréhension des enjeux de qualité produit au-delà du fonctionnel, intégration CI/CD, sensibilité UX/design.

---

### Projet 3 — Framework de tests API + UI hybride

> **Pitch** : *"Framework de tests hybride combinant validation d'API REST (cy.request()) et tests UI Cypress, avec Page Object Model, données de test générées dynamiquement (Faker.js), et exécution parallélisée sur Cypress Cloud."*

**Ce que ça démontre** : architecture de test avancée (Page Object Model), compétences full-stack testing, optimisation des temps d'exécution (parallélisation) — très valorisé pour un poste QA Automation senior.

---

### Projet 4 — Tests d'accessibilité automatisés

> **Pitch** : *"Intégration de cypress-axe pour auditer automatiquement l'accessibilité (WCAG 2.1) d'une application web à chaque déploiement, avec rapport détaillé des violations par niveau de sévérité."*

**Ce que ça démontre** : sensibilité aux sujets d'inclusion/accessibilité (différenciant), veille technique, capacité à intégrer des outils spécialisés.

---

### Projet 5 — Dashboard de reporting de tests

> **Pitch** : *"Dashboard personnalisé (Cypress + Mochawesome + GitHub Pages) affichant l'historique des exécutions de tests, taux de réussite, temps d'exécution et flakiness des tests, déployé automatiquement après chaque run CI."*

**Ce que ça démontre** : vision produit sur la qualité des tests eux-mêmes (flakiness, métriques), compétences reporting/dataviz, autonomie sur un projet outillage complet.

### Conseils pour rendre ces projets percutants sur GitHub

- **README soigné** : contexte, stack technique, comment lancer les tests en local, capture d'écran/GIF du run
- **CI visible** : badge de statut GitHub Actions en haut du README (donne une preuve immédiate de fonctionnement)
- **Historique de commits propre** : messages clairs, progression logique (pas un seul gros commit)
- **Un cas d'usage réaliste**, pas un simple "todo-list" — cibler un scénario métier (e-commerce, banque, SaaS) donne plus de crédibilité
- **Chiffrer les résultats** dans le README : "réduction du temps de test de X%", "40 scénarios couverts", "détection de X régressions" — même sur un projet perso, formuler comme un impact

---

---

## 21. Pitchs de projets — LangChain/LangGraph + IA pour Cypress

Cypress a introduit **`cy.prompt()`**, une commande qui traduit des instructions en langage naturel en code Cypress exécutable, avec auto-réparation des sélecteurs (self-healing) quand l'UI change. Voici des idées de projets qui combinent **LangChain/LangGraph** et l'écosystème IA de Cypress — un positionnement rare et très différenciant sur un CV/repo GitHub en 2026.

> ℹ️ `cy.prompt()` nécessite d'être connecté à Cypress Cloud (ou une clé d'enregistrement valide) car les prompts sont traités via un LLM côté Cypress Cloud.

### Projet 1 — Générateur d'agent LangGraph qui pilote `cy.prompt()`

> **Pitch** : *"Agent LangGraph qui lit une spec fonctionnelle (issue GitHub, ticket Jira) en langage naturel, la découpe en scénarios de test atomiques, puis génère automatiquement les instructions `cy.prompt()` correspondantes — de la user story au test exécutable, sans intervention humaine sur l'étape de rédaction."*

**Architecture typique** :
```
Issue GitHub (texte brut)
   → Nœud LangGraph "extraction de scénarios" (LLM)
   → Nœud "génération de steps cy.prompt()" (LLM + few-shot)
   → Nœud "écriture du fichier de test .cy.js"
   → Nœud "exécution + rapport" (subprocess Cypress)
```

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class EtatPipeline(TypedDict):
    issue_texte: str
    scenarios: list[str]
    steps_cyprompt: list[str]
    fichier_test: str

def extraire_scenarios(state: EtatPipeline) -> EtatPipeline:
    # Appel LLM : découpe l'issue en scénarios de test distincts
    state["scenarios"] = llm_decouper(state["issue_texte"])
    return state

def generer_steps(state: EtatPipeline) -> EtatPipeline:
    # Appel LLM : transforme chaque scénario en étapes cy.prompt()
    state["steps_cyprompt"] = [llm_generer_steps(s) for s in state["scenarios"]]
    return state

def ecrire_fichier_test(state: EtatPipeline) -> EtatPipeline:
    contenu = "\n\n".join(
        f"it('{s}', () => {{ cy.prompt({steps}) }});"
        for s, steps in zip(state["scenarios"], state["steps_cyprompt"])
    )
    with open("cypress/e2e/generated.cy.js", "w") as f:
        f.write(contenu)
    state["fichier_test"] = "cypress/e2e/generated.cy.js"
    return state

graphe = StateGraph(EtatPipeline)
graphe.add_node("extraction", extraire_scenarios)
graphe.add_node("generation", generer_steps)
graphe.add_node("ecriture", ecrire_fichier_test)
graphe.set_entry_point("extraction")
graphe.add_edge("extraction", "generation")
graphe.add_edge("generation", "ecriture")
graphe.add_edge("ecriture", END)
```

**Ce que ça démontre** : maîtrise simultanée de LangGraph (orchestration d'agent) ET de l'écosystème Cypress AI — un profil "test automation + IA agentique" quasi inexistant sur le marché, donc très visible pour un recruteur.

---

### Projet 2 — Agent de triage des échecs de tests avec LangChain + Error Summaries Cypress

> **Pitch** : *"Agent LangChain qui consomme les 'Error Summaries' et logs de Cypress Cloud après chaque run CI, classe automatiquement chaque échec (vraie régression / test flaky / selector cassé / environnement), et poste un résumé priorisé en commentaire de pull request GitHub."*

```python
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatAnthropic(model="claude-sonnet-4-6")

prompt = ChatPromptTemplate.from_messages([
    ("system", """Tu es un expert QA. Classe cet échec de test Cypress dans une
    des catégories : REGRESSION, FLAKY, SELECTOR_CASSE, ENVIRONNEMENT.
    Réponds en JSON : {{"categorie": "...", "confiance": 0-1, "explication": "..."}}"""),
    ("human", "Résumé d'erreur Cypress : {error_summary}\nStack trace : {stack_trace}")
])

chaine = prompt | llm | JsonOutputParser()
classification = chaine.invoke({
    "error_summary": "...",
    "stack_trace": "..."
})
```

**Ce que ça démontre** : compréhension du vrai problème douloureux en QA (le triage manuel des échecs), intégration API Cypress Cloud, capacité à automatiser une tâche à forte valeur ajoutée plutôt qu'un simple générateur de code.

---

### Projet 3 — Assistant conversationnel RAG sur la documentation de tests

> **Pitch** : *"Chatbot RAG (LangChain + base vectorielle) indexant l'ensemble de la suite de tests Cypress d'un projet (fichiers .cy.js, README, historique de flakiness), permettant à n'importe quel développeur de demander en langage naturel : 'quels tests couvrent le tunnel de paiement ?' ou 'pourquoi ce test échoue parfois ?'"*

**Ce que ça démontre** : capacité à appliquer le RAG à un cas d'usage interne/outillage (pas seulement du chatbot client), sensibilité à la documentation et à l'onboarding d'équipe.

---

### Projet 4 — Agent LangGraph avec validation humaine (human-in-the-loop) avant merge

> **Pitch** : *"Pipeline LangGraph avec étape de validation humaine obligatoire : l'agent génère les tests via `cy.prompt()`, les exécute dans un environnement isolé, puis attend une approbation humaine avant d'exporter le code final en Cypress standard et de créer la pull request — illustrant une approche responsable de l'IA en test automation (pas d'auto-merge de code généré par IA)."*

```python
def noeud_attente_validation(state):
    # Point de pause : LangGraph peut interrompre l'exécution ici (checkpointing)
    # et reprendre une fois qu'un humain a approuvé/rejeté via une interface externe
    if not state.get("valide_par_humain"):
        raise Exception("En attente de validation humaine")
    return state

graphe.add_node("validation_humaine", noeud_attente_validation)
```

**Ce que ça démontre** : maturité professionnelle sur les enjeux de confiance et de gouvernance de l'IA en production (sujet précisément soulevé par la communauté Cypress en 2026) — un point qui rassure fortement un recruteur sur votre capacité à ne pas déployer de l'IA "en aveugle".

### Conseils spécifiques pour ces projets hybrides IA + Cypress

- **Expliquer explicitement le "pourquoi hybride"** dans le README : pourquoi LangGraph plutôt qu'un simple script, pourquoi Cypress AI plutôt que du Cypress classique
- **Montrer le garde-fou humain** : ces projets sont d'autant plus crédibles si vous démontrez que vous ne laissez pas l'IA agir sans supervision (cf. Projet 4)
- **Séparer clairement** dans le repo : le code généré par IA (dossier dédié) vs le code revu/committé manuellement — reproduit une vraie pratique d'équipe
- **Mentionner les limites connues** de `cy.prompt()` (dépendance à Cypress Cloud, coût des appels LLM, nécessité de revue humaine) — la lucidité technique est très valorisée par les recruteurs seniors

---

---

## 22. Ressources d'apprentissage recommandées

### 📖 Le livre de référence : *AI Engineering* — Chip Huyen (O'Reilly, 2025)

Considéré comme la référence quasi unanime pour comprendre l'ingénierie IA moderne (au-delà du simple prompt) :

- Couvre l'ensemble du cycle : pré/post-entraînement, RAG, agents, tool-use, évaluation (dont l'approche "AI-as-a-judge"), fine-tuning (LoRA), optimisation de l'inférence
- Privilégie les **principes durables** plutôt que des détails d'implémentation vite obsolètes (peu de code, volontairement)
- Écrit par une autrice au parcours solide (ex-Snorkel AI, NVIDIA, enseignante ML Systems Design à Stanford)
- Complète bien son précédent ouvrage *Designing Machine Learning Systems* (ML classique) : celui-ci est 100% dédié aux LLM et foundation models

📌 En anglais, dense (500+ pages) — un investissement de plusieurs semaines, mais une référence qu'on garde comme livre de chevet technique.

### 🎓 Le cours Udemy de référence : *LLM Engineering: Master AI, Large Language Models & Agents* (Ed Donner)

- Parcours structuré sur 8 semaines, 35h+ de contenu
- Couvre tout le pipeline : fondamentaux LLM, LangChain, LlamaIndex, RAG, bases vectorielles, prompt engineering, agents, jusqu'au déploiement en production
- Très bien noté et régulièrement mis à jour avec l'actualité du secteur
- Projets concrets (pas de simples exemples jouets) : assistant client multimodal, "AI knowledge worker" interrogeant les données d'une entreprise, etc.

**Variante plus orientée projets** : *Master LLM Engineering & AI Agents* (même auteur) — 14 projets pratiques (chatbots, agents d'analyse de données, automatisation) avec une stack incluant LangChain, LangGraph, CrewAI, AutoGen, n8n et MCP — pertinent si vous voulez enchaîner directement sur des projets à mettre sur GitHub.

### 🐍 Prérequis : le cours Python fondamentaux (si vous débutez)

Si vous n'avez pas encore de bases solides en Python, **ne sautez pas cette étape** : LangChain/LangGraph s'appuient constamment sur la POO, les fonctions, les dictionnaires et les environnements virtuels.

**Cours recommandé** : *"Développeur Python | Formation Complète"* (formateur Jonathan)
- Le mieux noté parmi les cours francophones : *"Ce cours est de loin le meilleur parmi les nombreux achetés sur Udemy. Je suis impressionné par la qualité du cours tant par la pédagogie du formateur que par le contenu"*
- 75 sections, 69h de contenu, avec un module dédié à "savoir coder comme en entreprise" (Git, tests unitaires)

**Modules à cibler en priorité** (pas besoin de tout suivre) :
1. Bases du langage (variables, types, boucles, fonctions)
2. Programmation orientée objet (classes, objets — indispensable pour comprendre les objets LangChain)
3. Environnements virtuels et Git
4. Tests unitaires et bonnes pratiques

Vous pouvez **passer** les modules web (Django), hacking éthique, applications desktop/mobile — hors sujet pour l'objectif IA. Comptez environ 20-25h en ciblant uniquement ces 4 modules, plutôt que les 69h totales.

**Alternative équivalente** : *"Python : La Formation Complète 2026"* — 76h, également très complet sur la POO, les environnements virtuels et les bonnes pratiques.

### 🔗 Le cours de référence LangChain + LangGraph + LangSmith

Une fois les fondamentaux Python acquis : *"The Complete LangChain, LangGraph, & LangSmith Course (2026)"*

- Seul cours couvrant explicitement les **trois piliers** ensemble : conçu pour vous emmener de débutant à AI Engineer professionnel
- **LangChain** : LCEL (LangChain Expression Language), construction de "Runnable Chains" efficaces et prêtes pour la production
- **LangGraph** : passage des chaînes linéaires à des machines à états cycliques, avec des Checkpointers pour que les agents ne "perdent jamais le fil"
- **LangSmith** : traçage de chaque étape d'exécution, débogage, évaluation des performances (latence, coût, qualité des sorties) en conditions réelles

⚠️ Ce cours suppose déjà les bases Python (variables, fonctions, boucles, POO) — d'où l'importance de l'étape précédente si vous démarrez de zéro.

### 🗺️ Parcours complet recommandé

```
Étape 1 (≈20-25h)  : Python fondamentaux ciblés (Jonathan)
                     → variables, fonctions, POO, venv, Git, tests
                     ↓
Étape 2 (≈35h+)    : LangChain + LangGraph + LangSmith (cours complet 2026)
                     → LCEL, agents, state machines, observabilité
                     ↓
Étape 3            : Appliquer sur vos propres projets
                     → cf. sections 20 et 21 (pitchs Cypress + IA)
                     ↓
Étape 4 (optionnel) : Lire "AI Engineering" de Chip Huyen en parallèle
                     → ancrer le vocabulaire et les concepts pour l'entretien technique
```

### Méthode conseillée
1. Consolider les fondamentaux Python ciblés (étape 1) avant toute chose
2. Suivre le cours LangChain/LangGraph/LangSmith (étape 2), en pratiquant chaque notion immédiatement
3. Lire le **livre de Chip Huyen** en parallèle pour ancrer le vocabulaire et les concepts théoriques attendus en entretien technique (évaluation, RAG, agents, fine-tuning)
4. Appliquer immédiatement le tout à vos propres projets (cf. sections 20 et 21 de ce cheat sheet)

---

## 23. Booster les tests Cypress avec l'AI Engineering

Devenir un **SDET "Cypress AI Engineer"**, c'est transposer les concepts fondamentaux de l'AI Engineering (vus dans le livre de Chip Huyen et le cours Ed Donner) directement dans votre pratique du test automatisé. Voici comment chaque concept clé se traduit concrètement dans l'écosystème Cypress.

### 1. Prompt Engineering → Rédaction des instructions `cy.prompt()`

En AI Engineering, la qualité du prompt détermine la qualité de la sortie. En test Cypress, c'est exactement la qualité de vos instructions en langage naturel qui détermine la fiabilité du test généré.

```python
# Mauvais prompt (ambigu, comme un mauvais prompt LLM classique)
cy.prompt("teste le login")

# Bon prompt (spécifique, structuré, avec critères explicites)
cy.prompt([
    "Visite la page /login",
    "Saisis 'admin@test.com' dans le champ email",
    "Saisis le mot de passe dans le champ password",
    "Clique sur le bouton 'Se connecter'",
    "Vérifie que l'URL contient '/dashboard'",
    "Vérifie que le message de bienvenue est visible"
])
```

**Transposition directe des techniques de prompt engineering** :
- **Few-shot** → fournir des exemples de scénarios similaires déjà réussis pour calibrer le style attendu
- **Chain-of-thought** → découper un scénario complexe en étapes atomiques plutôt qu'une seule instruction vague
- **Instructions négatives** (`not.exist`) → préciser explicitement ce qui ne doit PAS apparaître, comme on le ferait dans un prompt LLM classique

### 2. Évaluation (LLM-as-a-judge) → Triage automatique des échecs de tests

Le concept d'évaluation en AI Engineering (mesurer la qualité d'une sortie de LLM) se transpose au triage des résultats de test :

```python
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser

llm = ChatAnthropic(model="claude-sonnet-4-6")

# "Juge" qui évalue un échec de test, exactement comme on évaluerait
# la qualité d'une réponse de LLM avec la méthode AI-as-a-judge
prompt_juge = ChatPromptTemplate.from_messages([
    ("system", """Tu es un juge expert QA. Évalue cet échec de test Cypress
    selon les critères : cause probable, sévérité (1-5), action recommandée.
    Réponds en JSON strict."""),
    ("human", "Error Summary : {error_summary}\nHistorique de flakiness : {historique}")
])

chaine_evaluation = prompt_juge | llm | JsonOutputParser()
verdict = chaine_evaluation.invoke({
    "error_summary": "...",
    "historique": "3 échecs sur 20 runs, toujours sur le même sélecteur"
})
```

**Métriques à définir**, comme on définirait des métriques d'évaluation LLM :
- Taux de "self-healing" réussi vs échoué
- Taux de faux positifs (test qui échoue sans vraie régression)
- Score de confiance du juge IA sur chaque verdict

### 3. RAG → Base de connaissance de la suite de tests

Le RAG permet à un LLM de s'appuyer sur des documents externes. Appliqué à Cypress, il permet à un agent de connaître **tout l'historique et le contexte de votre suite de tests** :

```python
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings

# Indexer : fichiers .cy.js, README de tests, historique de flakiness,
# tickets Jira liés aux bugs découverts par les tests
embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
base_connaissance_tests = Chroma.from_texts(
    documents_suite_de_tests,
    embeddings
)

# Un agent peut alors répondre : "quels tests couvrent le tunnel de paiement ?"
# ou "ce sélecteur a-t-il déjà posé problème par le passé ?"
resultats = base_connaissance_tests.similarity_search(
    "tests liés au processus de paiement", k=5
)
```

### 4. Agents & orchestration (LangGraph) → Pipeline de test autonome

Le concept d'agent (percevoir → décider → agir) se transpose directement à un pipeline de test intelligent :

```
Perception  : lire l'issue/spec fonctionnelle
Décision    : découper en scénarios, choisir les sélecteurs prioritaires
Action      : générer les cy.prompt(), exécuter, analyser le résultat
Réflexion   : si échec, décider (retry / self-heal / escalade humaine)
```

C'est exactement l'architecture vue dans la section 21 (Projet 1 et Projet 4) de ce cheat sheet — l'agent LangGraph qui pilote `cy.prompt()` avec point de validation humaine.

### 5. Fine-tuning / Few-shot calibration → Bibliothèque de prompts de référence validés

En AI Engineering, on choisit entre prompt engineering, RAG ou fine-tuning selon le besoin. En Cypress AI, l'équivalent est de **constituer une bibliothèque de prompts `cy.prompt()` de référence, validés et versionnés**, que les nouveaux tests réutilisent comme few-shot examples :

```
cypress/
  ai-prompts-library/
    auth.reference.json       # prompts validés pour l'authentification
    checkout.reference.json   # prompts validés pour le tunnel d'achat
    README.md                 # convention de nommage et de style des prompts
```

Cela réduit la variance des prompts générés par différents membres de l'équipe — l'équivalent testing du "prompt template versionné" en AI Engineering.

### 6. Coût et latence → Optimisation des appels IA en CI

En AI Engineering, on surveille coût et latence des appels LLM. En Cypress AI, la même discipline s'applique :
- Limiter `cy.prompt()` aux tests qui en tirent vraiment parti (UI instable, prototypage rapide) — pas systématiquement, pour maîtriser le coût des appels LLM en CI
- Exporter en code Cypress standard (`eject`) une fois le test stabilisé, pour ne plus dépendre d'un appel IA à chaque run
- Mesurer le delta de temps d'exécution entre un test `cy.prompt()` et son équivalent en code Cypress classique

### Positionnement CV / LinkedIn pour un profil "SDET Cypress AI Engineer"

> *"SDET spécialisé dans l'automatisation de tests augmentée par l'IA : conception de pipelines de test combinant Cypress (cy.prompt, self-healing) et des agents LangGraph pour la génération de scénarios, le triage automatique des échecs et la maintenance prédictive de suites de tests E2E."*

**Compétences à mettre en avant** :
- Maîtrise de Cypress classique **ET** de sa couche IA (cy.prompt, Studio AI, self-healing)
- Compréhension des concepts d'AI Engineering (prompt engineering, RAG, évaluation, agents) — pas juste leur usage en surface
- Capacité à juger **quand** utiliser l'IA en test (prototypage, UI instable) et quand s'en passer (tests stables, sensibles au coût/latence)
- Sensibilité à la gouvernance : garde-fous humains, pas d'auto-merge de tests générés par IA sans revue

---

## 24. Ressources utiles

| Sujet | Ressource |
|---|---|
| Doc officielle Python | https://docs.python.org/fr/3/ |
| LangChain | https://python.langchain.com/ |
| LangGraph | https://langchain-ai.github.io/langgraph/ |
| Requests | https://requests.readthedocs.io/ |
| Pandas | https://pandas.pydata.org/docs/ |
| Playwright Python | https://playwright.dev/python/ |
| Anthropic API | https://docs.claude.com/ |
| Cypress AI (cy.prompt, self-healing) | https://docs.cypress.io/cloud/features/cypress-ai-features |
| Livre "AI Engineering" (Chip Huyen) | https://www.oreilly.com/library/view/ai-engineering/9781098166298/ |
| Cours Udemy "LLM Engineering" (Ed Donner) | https://www.udemy.com/course/llm-engineering-master-ai-and-large-language-models/ |
| Cours Udemy "Développeur Python | Formation Complète" | https://www.udemy.com/course/developpeur-python-formation-complete/ |
| Cours Udemy "The Complete LangChain, LangGraph, & LangSmith Course" | https://www.udemy.com/course/the-complete-langchain-langgraph-langsmith-course/ |

---

*Cheat sheet évolutif — à compléter selon vos besoins spécifiques (data science, cybersécurité, DevOps, etc.)*
