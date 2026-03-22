# 🐓 Frython — Site Officiel

Site vitrine du projet **Frython**, un transpileur Python dont tous les mots-clés sont en français. Entièrement en HTML/CSS/JS vanilla, sans framework ni dépendances.

---

## Structure du projet

```
frython-site/
├── index.html          ← Page d'accueil
├── docs.html           ← Documentation complète
├── examples.html       ← Exemples de code
├── repl.html           ← Terminal interactif
└── assets/
    ├── css/
    │   ├── global.css  ← Variables CSS, thèmes, navbar, footer
    │   ├── index.css   ← Styles page d'accueil
    │   ├── docs.css    ← Styles documentation
    │   ├── examples.css← Styles exemples
    │   └── repl.css    ← Styles terminal REPL
    └── js/
        ├── global.js   ← Navbar, footer, dark mode, scroll
        ├── index.js    ← Three.js, animations, typing effect
        ├── docs.js     ← Sidebar, filtres, accordéon FAQ
        ├── examples.js ← Filtres, modal comparaison
        └── repl.js     ← Transpileur + simulateur d'exécution
```

---

## Pages

### `index.html` — Accueil
- Hero avec scène Three.js (coq 3D animé, suivi de souris, clic pour pirouette)
- Démo de typing qui alterne des exemples Frython ↔ Python
- Grille de fonctionnalités, guide d'installation, aperçu des mots-clés

### `docs.html` — Documentation
- Sidebar sticky avec navigation par section
- Onglets de syntaxe : Variables, Conditions, Boucles, Fonctions, Classes, Exceptions
- Tables filtrables des mots-clés, modules et exceptions
- Accordéon FAQ, arborescence de l'architecture, snippets VS Code

### `examples.html` — Exemples
- 6 exemples (Fibonacci, Calculatrice, Tri à bulles, Classes, Fichiers, Générateurs)
- Filtre par niveau : Débutant / Intermédiaire / Avancé
- Modal de comparaison côte à côte Frython ↔ Python avec copie en un clic

### `repl.html` — Terminal interactif
- Éditeur avec numéros de ligne et raccourci `Ctrl+Entrée` pour exécuter
- Terminal de sortie avec historique (↑↓) et autocomplétion (Tab)
- 12 exemples prêts à l'emploi dans la sidebar
- Panneau de transpilation temps réel : Python généré, AST simplifié, liste des tokens
- Séparateur éditeur/terminal redimensionnable par drag
- Téléchargement du code en `.fy` et partage via URL encodée

---

## Thèmes

Deux thèmes définis via `data-theme` sur `<html>`, persistés dans `localStorage`.

| Thème | Palette |
|-------|---------|
| Light — *Coq au Vin & Ciel Bleu* | Primaire `#73B2D9`, Accent `#A64521` |
| Dark — *Nuit Étoilée & Or* | BG `#020E26`, Accent `#F2CD13` |

---

## Technologies

- **HTML/CSS/JS vanilla** — aucun framework, aucun bundler
- **Three.js r128** — scène 3D de la page d'accueil (chargé via CDN)
- **Google Fonts** — Inter, Plus Jakarta Sans, Fira Code
- **IntersectionObserver** — scroll reveal et navigation active dans la sidebar

---

## Lancer le site en local

Ouvrir `index.html` dans un navigateur suffit pour la plupart des pages. Pour le REPL et Three.js, un serveur local est recommandé pour éviter les restrictions CORS :

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```

Puis ouvrir `http://localhost:8000`.

---

## Mots-clés Frython principaux

| Frython | Python |
|---------|--------|
| `déf` | `def` |
| `afficher` | `print` |
| `si` / `sinon` / `sinonsi` | `if` / `else` / `elif` |
| `pour` / `tantque` | `for` / `while` |
| `retourner` | `return` |
| `classe` / `soi` | `class` / `self` |
| `Vrai` / `Faux` / `Rien` | `True` / `False` / `None` |
| `essayer` / `sauf` / `enfin` | `try` / `except` / `finally` |
| `importer` / `depuis` | `import` / `from` |
| `intervalle` / `longueur` | `range` / `len` |

---

*Cocorico ! 🐓*
