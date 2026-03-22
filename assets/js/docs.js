document.getElementById('navbar-mount').innerHTML = renderNavbar('docs');
document.getElementById('footer-mount').innerHTML = renderFooter();

const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const tabId = btn.dataset.tab;

    
    document.querySelectorAll('.tab-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const content = document.getElementById(`tab-${tabId}`);
    if (content) content.classList.add('active');
  });
});

document.querySelectorAll('.accordion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.accordion-item');
    const isOpen = item.classList.contains('open');

    
    document.querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.accordion-btn').setAttribute('aria-expanded', 'false');
    });

    
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

function filterTable(input, tableId) {
  const query = input.value.toLowerCase().trim();
  const table = document.getElementById(tableId) ||
    input.closest('.doc-section').querySelector('.filterable-table');

  if (!table) {
    
    input.closest('.doc-section').querySelectorAll('.filterable-table').forEach(t => {
      filterRows(t, query);
    });
    return;
  }
  filterRows(table, query);
}

function filterRows(table, query) {
  const rows = table.querySelectorAll('tbody tr');
  let visibleCount = 0;
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const matches = !query || text.includes(query);
    row.style.display = matches ? '' : 'none';
    if (matches) visibleCount++;
  });
}

const searchDict = document.getElementById('search-dict');
if (searchDict) {
  searchDict.addEventListener('input', (e) => {
    
    const section = e.target.closest('.doc-section');
    section.querySelectorAll('.filterable-table').forEach(t => {
      filterRows(t, e.target.value.toLowerCase().trim());
    });
  });
}

const searchModules = document.getElementById('search-modules');
if (searchModules) {
  searchModules.addEventListener('input', (e) => {
    filterRows(document.getElementById('table-modules'), e.target.value.toLowerCase().trim());
  });
}

const sidebarSearch = document.getElementById('sidebar-search');
if (sidebarSearch) {
  sidebarSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase().trim();
    document.querySelectorAll('.nav-link').forEach(link => {
      const matches = !q || link.textContent.toLowerCase().includes(q);
      link.style.display = matches ? '' : 'none';
    });
  });
}

const sections = document.querySelectorAll('.doc-section[id]');
const navLinks = document.querySelectorAll('.nav-link');

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.2, rootMargin: '-64px 0px -40% 0px' });

  sections.forEach(s => observer.observe(s));
}

(function() {
  if (window.innerWidth <= 900) {
    const sidebar = document.getElementById('docs-sidebar');
    const toggle = document.createElement('button');
    toggle.className = 'docs-sidebar-toggle';
    toggle.innerHTML = '☰ Menu';
    toggle.setAttribute('aria-label', 'Ouvrir la navigation de documentation');
    document.body.appendChild(toggle);

    
    const style = document.createElement('style');
    style.textContent = `
      .docs-sidebar-toggle {
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 600;
        padding: 10px 18px;
        background: var(--accent);
        color: white;
        border: none;
        border-radius: 100px;
        font-size: 0.875rem;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      }
      .docs-sidebar-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.5);
        z-index: 499;
      }
    `;
    document.head.appendChild(style);

    toggle.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      toggle.innerHTML = isOpen ? '✕ Fermer' : '☰ Menu';
      toggle.setAttribute('aria-expanded', isOpen);

      
      if (isOpen) {
        const overlay = document.createElement('div');
        overlay.className = 'docs-sidebar-overlay';
        document.body.appendChild(overlay);
        overlay.addEventListener('click', () => {
          sidebar.classList.remove('open');
          overlay.remove();
          toggle.innerHTML = '☰ Menu';
        });
      } else {
        document.querySelector('.docs-sidebar-overlay')?.remove();
      }
    });

    
    sidebar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        sidebar.classList.remove('open');
        document.querySelector('.docs-sidebar-overlay')?.remove();
        toggle.innerHTML = '☰ Menu';
      });
    });
  }
})();
