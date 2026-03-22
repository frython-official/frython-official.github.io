document.addEventListener('DOMContentLoaded', () => {

  
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  
  const savedTheme = localStorage.getItem('frython-theme') || 'light';
  root.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem('frython-theme', next);
      updateThemeIcon(next);
    });
  }

  function updateThemeIcon(theme) {
    if (!themeToggle) return;
    themeToggle.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre');
  }

  
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelector('.navbar-links');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('open'));
    });

    
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('open'));
    });
  }

  
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  
  document.querySelectorAll('.code-block').forEach(block => {
    const copyBtn = block.querySelector('.code-copy-btn');
    if (!copyBtn) return;

    copyBtn.addEventListener('click', async () => {
      const codeEl = block.querySelector('code, .code-block-body');
      if (!codeEl) return;

      const text = codeEl.innerText || codeEl.textContent;
      try {
        await navigator.clipboard.writeText(text.trim());
        copyBtn.innerHTML = '✓ Copié!';
        copyBtn.style.color = '#a6e3a1';
        setTimeout(() => {
          copyBtn.innerHTML = '📋 Copier';
          copyBtn.style.color = '';
        }, 2000);
      } catch (e) {
        copyBtn.innerHTML = '✗ Erreur';
      }
    });
  });

  
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.style.boxShadow = '0 4px 20px var(--shadow)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }, { passive: true });
  }

});

function renderNavbar(activePage) {
  return `
    <nav class="navbar" role="navigation" aria-label="Navigation principale">
      <div class="container navbar-inner">
        <a href="index.html" class="navbar-logo" aria-label="Frython - Accueil">
          <span class="logo-coq" aria-hidden="true">🐓</span>
          <span>Frython</span>
        </a>

        <ul class="navbar-links" role="list">
          <li><a href="index.html" ${activePage === 'home' ? 'class="active"' : ''}>Accueil</a></li>
          <li><a href="docs.html" ${activePage === 'docs' ? 'class="active"' : ''}>Documentation</a></li>
          <li><a href="examples.html" ${activePage === 'examples' ? 'class="active"' : ''}>Exemples</a></li>
          <li><a href="repl.html" ${activePage === 'repl' ? 'class="active"' : ''}>REPL</a></li>
          <li><a href="https://github.com/Artleboss2/frython" target="_blank" rel="noopener">GitHub ↗</a></li>
        </ul>

        <div class="navbar-actions">
          <a href="https://pypi.org/project/frython/" target="_blank" rel="noopener" class="btn btn-primary" style="padding:8px 16px;font-size:0.85rem;">
            Installer v1.0.0
          </a>
          <button class="theme-toggle" id="theme-toggle" aria-label="Changer le thème">🌙</button>
          <button class="menu-toggle" id="menu-toggle" aria-label="Ouvrir le menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </nav>
  `;
}

function renderFooter() {
  return `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">🐓 Frython</div>
            <p>Python en français. Un projet humoristique mais entièrement fonctionnel. Parce que pourquoi pas&nbsp;?</p>
          </div>
          <div class="footer-col">
            <h4>Documentation</h4>
            <ul>
              <li><a href="docs.html#installation">Installation</a></li>
              <li><a href="docs.html#syntaxe">Syntaxe</a></li>
              <li><a href="docs.html#dictionnaires">Dictionnaires</a></li>
              <li><a href="docs.html#exemples">Exemples</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Ressources</h4>
            <ul>
              <li><a href="repl.html">REPL en ligne</a></li>
              <li><a href="examples.html">Exemples interactifs</a></li>
              <li><a href="https://github.com/Artleboss2/frython" target="_blank" rel="noopener">GitHub</a></li>
              <li><a href="https://pypi.org/project/frython/" target="_blank" rel="noopener">PyPI</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Projet</h4>
            <ul>
              <li><a href="docs.html#architecture">Architecture</a></li>
              <li><a href="docs.html#contribuer">Contribuer</a></li>
              <li><a href="docs.html#faq">FAQ</a></li>
              <li><a href="docs.html#vscode">Extension VS Code</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2025 Frython — Open Source MIT</span>
          <span class="footer-sacrebleu">Sacré bleu ! 🥐</span>
          <span>Fait avec 🐓 et du Python</span>
        </div>
      </div>
    </footer>
  `;
}
