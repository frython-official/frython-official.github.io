document.getElementById('navbar-mount').innerHTML = renderNavbar('examples');
document.getElementById('footer-mount').innerHTML = renderFooter();

const EXAMPLES = {
  'Fibonacci': {
    filename: 'fibonacci',
    fr: `# Suite de Fibonacci en Frython 🐓
déf fibonacci(n):
    si n <= 1:
        retourner n
    retourner fibonacci(n-1) + fibonacci(n-2)

# Afficher les 15 premiers termes
pour i dans intervalle(15):
    afficher(f"F({i}) = {fibonacci(i)}")

# Version avec mémoïsation
importer functools

@functools.lru_cache(maxsize=Rien)
déf fib_rapide(n):
    si n <= 1:
        retourner n
    retourner fib_rapide(n-1) + fib_rapide(n-2)

afficher(fib_rapide(100))`,
    py: `# Suite de Fibonacci en Python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Afficher les 15 premiers termes
for i in range(15):
    print(f"F({i}) = {fibonacci(i)}")

# Version avec mémoïsation
import functools

@functools.lru_cache(maxsize=None)
def fib_rapide(n):
    if n <= 1:
        return n
    return fib_rapide(n-1) + fib_rapide(n-2)

print(fib_rapide(100))`
  },
  'Calculatrice': {
    filename: 'calculatrice',
    fr: `# Calculatrice interactive en Frython 🐓
tantque Vrai:
    essayer:
        entree = saisir(">>> ")
        si entree dans ("quitter", "q", "exit"):
            afficher("Au revoir ! 👋")
            casser
        si non entree.supprimer_espaces():
            continuer
        resultat = evaluer(entree)
        afficher(f"= {resultat}")
    sauf ZeroDivisionError:
        afficher("Erreur: Division par zéro !")
    sauf ErreurSyntaxe:
        afficher("Erreur: Syntaxe invalide.")
    sauf Exception comme e:
        afficher(f"Erreur: {e}")`,
    py: `# Calculatrice interactive en Python
while True:
    try:
        entree = input(">>> ")
        if entree in ("quitter", "q", "exit"):
            print("Au revoir ! 👋")
            break
        if not entree.strip():
            continue
        resultat = eval(entree)
        print(f"= {resultat}")
    except ZeroDivisionError:
        print("Erreur: Division par zéro !")
    except SyntaxError:
        print("Erreur: Syntaxe invalide.")
    except Exception as e:
        print(f"Erreur: {e}")`
  },
  'Tri à bulles': {
    filename: 'tri_bulles',
    fr: `# Tri à bulles en Frython 🐓
déf tri_bulles(lst):
    arr = liste(lst)
    n = longueur(arr)
    
    pour i dans intervalle(n):
        échanges = 0
        pour j dans intervalle(0, n - i - 1):
            si arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                échanges += 1
        # Optimisation: arrêter si déjà trié
        si échanges == 0:
            casser
    
    retourner arr

# Test
nombres = [64, 34, 25, 12, 22, 11, 90]
afficher(f"Avant: {nombres}")
résultat = tri_bulles(nombres)
afficher(f"Après: {résultat}")`,
    py: `# Tri à bulles en Python
def tri_bulles(lst):
    arr = list(lst)
    n = len(arr)
    
    for i in range(n):
        échanges = 0
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
                échanges += 1
        # Optimisation: arrêter si déjà trié
        if échanges == 0:
            break
    
    return arr

# Test
nombres = [64, 34, 25, 12, 22, 11, 90]
print(f"Avant: {nombres}")
résultat = tri_bulles(nombres)
print(f"Après: {résultat}")`
  },
  'Classes & Héritage': {
    filename: 'animaux',
    fr: `# Classes et héritage en Frython 🐓
classe Animal:
    """Classe de base pour les animaux."""
    
    def __init__(soi, nom, age):
        soi.nom = nom
        soi.age = age
    
    déf parler(soi):
        retourner "..."
    
    déf présenter(soi):
        son = soi.parler()
        afficher(f"{soi.nom} ({soi.age} ans) dit: {son}")
    
    déf __str__(soi):
        retourner f"Animal({soi.nom})"

classe Chien(Animal):
    """Un chien fidèle."""
    
    def __init__(soi, nom, age, race):
        super().__init__(nom, age)
        soi.race = race
    
    déf parler(soi):
        retourner "Ouaf ! 🐕"
    
    déf __str__(soi):
        retourner f"Chien({soi.nom}, {soi.race})"

classe Chat(Animal):
    """Un chat indépendant."""
    
    déf parler(soi):
        retourner "Miaou 🐱"

# Utilisation
animaux = [
    Chien("Rex", 3, "Berger"),
    Chat("Whiskers", 5),
    Chien("Buddy", 2, "Labrador"),
]

pour animal dans animaux:
    animal.présenter()`,
    py: `# Classes et héritage en Python
class Animal:
    """Classe de base pour les animaux."""
    
    def __init__(self, nom, age):
        self.nom = nom
        self.age = age
    
    def parler(self):
        return "..."
    
    def présenter(self):
        son = self.parler()
        print(f"{self.nom} ({self.age} ans) dit: {son}")
    
    def __str__(self):
        return f"Animal({self.nom})"

class Chien(Animal):
    """Un chien fidèle."""
    
    def __init__(self, nom, age, race):
        super().__init__(nom, age)
        self.race = race
    
    def parler(self):
        return "Ouaf ! 🐕"
    
    def __str__(self):
        return f"Chien({self.nom}, {self.race})"

class Chat(Animal):
    """Un chat indépendant."""
    
    def parler(self):
        return "Miaou 🐱"

# Utilisation
animaux = [
    Chien("Rex", 3, "Berger"),
    Chat("Whiskers", 5),
    Chien("Buddy", 2, "Labrador"),
]

for animal in animaux:
    animal.présenter()`
  },
  'Gestion de fichiers': {
    filename: 'fichiers',
    fr: `# Gestion de fichiers en Frython 🐓
déf lire_fichier(chemin):
    essayer:
        avec ouvrir(chemin, "r", encoding="utf-8") comme f:
            contenu = f.lire()
        afficher(f"Lu {longueur(contenu)} caractères")
        retourner contenu
    sauf ErreurFichier:
        afficher(f"Fichier '{chemin}' introuvable!")
        retourner Rien
    sauf ErreurPermission:
        afficher(f"Permission refusée pour '{chemin}'!")
        retourner Rien
    sauf Exception comme e:
        lever ErreurRuntime(f"Erreur inattendue: {e}")
    enfin:
        afficher("Tentative de lecture terminée.")

déf ecrire_fichier(chemin, contenu):
    avec ouvrir(chemin, "w", encoding="utf-8") comme f:
        f.ecrire(contenu)
    afficher(f"Fichier '{chemin}' écrit avec succès!")

# Utilisation
ecrire_fichier("bonjour.txt", "Sacré bleu ! 🐓\\n")
texte = lire_fichier("bonjour.txt")
si texte:
    afficher(f"Contenu: {texte.supprimer_espaces()}")`,
    py: `# Gestion de fichiers en Python
def lire_fichier(chemin):
    try:
        with open(chemin, "r", encoding="utf-8") as f:
            contenu = f.read()
        print(f"Lu {len(contenu)} caractères")
        return contenu
    except FileNotFoundError:
        print(f"Fichier '{chemin}' introuvable!")
        return None
    except PermissionError:
        print(f"Permission refusée pour '{chemin}'!")
        return None
    except Exception as e:
        raise RuntimeError(f"Erreur inattendue: {e}")
    finally:
        print("Tentative de lecture terminée.")

def ecrire_fichier(chemin, contenu):
    with open(chemin, "w", encoding="utf-8") as f:
        f.write(contenu)
    print(f"Fichier '{chemin}' écrit avec succès!")

# Utilisation
ecrire_fichier("bonjour.txt", "Sacré bleu ! 🐓\\n")
texte = lire_fichier("bonjour.txt")
if texte:
    print(f"Contenu: {texte.strip()}")`
  },
  'Générateurs': {
    filename: 'generateurs',
    fr: `# Générateurs en Frython 🐓
déf compter(debut, fin, pas=1):
    """Générateur de séquences."""
    i = debut
    tantque i < fin:
        rendement i
        i += pas

déf fibonacci_infini():
    """Suite de Fibonacci infinie."""
    a, b = 0, 1
    tantque Vrai:
        rendement a
        a, b = b, a + b

déf prendre(generateur, n):
    """Prendre les n premiers éléments."""
    pour i, valeur dans enumerer(generateur):
        si i >= n:
            casser
        rendement valeur

# Utilisation
afficher("Compteur:")
pour n dans compter(0, 10, 2):
    afficher(n, fin=" ")

afficher("\\n\\nFibonacci (10 premiers):")
pour f dans prendre(fibonacci_infini(), 10):
    afficher(f, fin=" ")`,
    py: `# Générateurs en Python
def compter(debut, fin, pas=1):
    """Générateur de séquences."""
    i = debut
    while i < fin:
        yield i
        i += pas

def fibonacci_infini():
    """Suite de Fibonacci infinie."""
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

def prendre(generateur, n):
    """Prendre les n premiers éléments."""
    for i, valeur in enumerate(generateur):
        if i >= n:
            break
        yield valeur

# Utilisation
print("Compteur:")
for n in compter(0, 10, 2):
    print(n, end=" ")

print("\\n\\nFibonacci (10 premiers):")
for f in prendre(fibonacci_infini(), 10):
    print(f, end=" ")`
  }
};

const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.example-card').forEach(card => {
      if (filter === 'all') {
        card.style.display = '';
      } else {
        const level = card.dataset.level;
        card.style.display = level === filter ? '' : 'none';
      }
    });
  });
});

const modal = document.getElementById('comparison-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalTitle = document.getElementById('modal-title');
const modalFr = document.getElementById('modal-code-fr');
const modalPy = document.getElementById('modal-code-py');
const modalFilenameFr = document.getElementById('modal-filename-fr');
const modalFilenamePy = document.getElementById('modal-filename-py');

function openModal(exampleName) {
  const ex = EXAMPLES[exampleName];
  if (!ex) return;

  modalTitle.textContent = exampleName;
  modalFilenameFr.textContent = `${ex.filename}.fy`;
  modalFilenamePy.textContent = `${ex.filename}.py`;
  modalFr.textContent = ex.fr;
  modalPy.textContent = ex.py;

  modal.hidden = false;
  document.body.style.overflow = 'hidden';

  
  document.getElementById('copy-fr').onclick = () => copyText(ex.fr, document.getElementById('copy-fr'));
  document.getElementById('copy-py').onclick = () => copyText(ex.py, document.getElementById('copy-py'));
}

function closeModal() {
  modal.hidden = true;
  document.body.style.overflow = '';
}

async function copyText(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const orig = btn.textContent;
    btn.textContent = '✓ Copié!';
    btn.style.color = '#a6e3a1';
    setTimeout(() => { btn.textContent = orig; btn.style.color = ''; }, 2000);
  } catch (e) {}
}

modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

document.querySelectorAll('.example-expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const card = btn.closest('.example-card');
    const title = card.querySelector('.example-title').textContent;
    openModal(title);
  });
});

document.querySelectorAll('.example-card').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    if (e.target.closest('.example-expand-btn')) return;
    const title = card.querySelector('.example-title').textContent;
    openModal(title);
  });
});
