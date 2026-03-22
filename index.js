document.getElementById('navbar-mount').innerHTML = renderNavbar('home');
document.getElementById('footer-mount').innerHTML = renderFooter();

document.getElementById('install-copy-btn').addEventListener('click', async () => {
  const btn = document.getElementById('install-copy-btn');
  try {
    await navigator.clipboard.writeText('pip install frython');
    btn.textContent = '✓';
    btn.style.color = '#a6e3a1';
    setTimeout(() => { btn.textContent = '📋'; btn.style.color = ''; }, 2000);
  } catch (e) {
    btn.textContent = '✗';
  }
});

(function() {
  const canvas = document.getElementById('hero-3d');
  if (!canvas) return;

  
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
  script.onload = initThreeScene;
  document.head.appendChild(script);

  function initThreeScene() {
    const W = 300, H = 300;
    canvas.width = W;
    canvas.height = H;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 5);

    
    const hemi = new THREE.HemisphereLight(0x73B2D9, 0xA64521, 0.6);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(3, 5, 3);
    scene.add(dir);

    
    const group = new THREE.Group();

    
    const bodyGeo = new THREE.SphereGeometry(0.8, 12, 12);
    bodyGeo.scale(0.9, 1.2, 0.8);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x73B2D9, shininess: 60 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    group.add(body);

    
    const headGeo = new THREE.SphereGeometry(0.45, 10, 10);
    const headMat = new THREE.MeshPhongMaterial({ color: 0xA0D3F2, shininess: 40 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.set(0, 1.4, 0.1);
    group.add(head);

    
    const crestMat = new THREE.MeshPhongMaterial({ color: 0xA64521, shininess: 80 });
    for (let i = 0; i < 3; i++) {
      const cGeo = new THREE.TetrahedronGeometry(0.18 - i * 0.02, 0);
      const c = new THREE.Mesh(cGeo, crestMat);
      c.position.set(-0.18 + i * 0.18, 1.85, 0.1);
      c.rotation.z = Math.PI * 0.1;
      group.add(c);
    }

    
    const beakGeo = new THREE.ConeGeometry(0.1, 0.25, 6);
    const beakMat = new THREE.MeshPhongMaterial({ color: 0xF2CD13, shininess: 60 });
    const beak = new THREE.Mesh(beakGeo, beakMat);
    beak.position.set(0.4, 1.38, 0.1);
    beak.rotation.z = -Math.PI / 2;
    group.add(beak);

    
    const tailMat = new THREE.MeshPhongMaterial({ color: 0xBF7C63, shininess: 40 });
    for (let i = 0; i < 3; i++) {
      const tGeo = new THREE.ConeGeometry(0.1, 0.5, 5);
      const t = new THREE.Mesh(tGeo, tailMat);
      t.position.set(-0.6 - i * 0.1, -0.1 + (i - 1) * 0.3, -0.3);
      t.rotation.z = Math.PI / 2 + (i - 1) * 0.3;
      group.add(t);
    }

    
    const particles = [];
    const particleMat = new THREE.MeshBasicMaterial({ color: 0xA0D3F2, transparent: true, opacity: 0.6 });
    for (let i = 0; i < 12; i++) {
      const pGeo = new THREE.SphereGeometry(0.04 + Math.random() * 0.04, 6, 6);
      const p = new THREE.Mesh(pGeo, particleMat.clone());
      p.position.set(
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 2 - 0.5
      );
      p.userData.speed = 0.003 + Math.random() * 0.005;
      p.userData.offset = Math.random() * Math.PI * 2;
      scene.add(p);
      particles.push(p);
    }

    scene.add(group);
    group.position.set(0, -0.3, 0);

    
    let targetRotX = 0, targetRotY = 0;
    let currentRotX = 0, currentRotY = 0;

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      targetRotY = ((e.clientX - centerX) / window.innerWidth) * 0.8;
      targetRotX = ((e.clientY - centerY) / window.innerHeight) * 0.5;
    }, { passive: true });

    
    let spinning = false;
    canvas.addEventListener('click', () => {
      if (spinning) return;
      spinning = true;
      let angle = 0;
      const spinInterval = setInterval(() => {
        angle += 0.08;
        group.rotation.y += 0.08;
        if (angle >= Math.PI * 2) {
          spinning = false;
          clearInterval(spinInterval);
        }
      }, 16);
    });

    
    let t = 0;
    function animate() {
      requestAnimationFrame(animate);
      t += 0.015;

      
      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.05;

      if (!spinning) {
        group.rotation.y = currentRotY;
        group.rotation.x = currentRotX;
      }

      
      group.position.y = -0.3 + Math.sin(t) * 0.08;

      
      particles.forEach((p, i) => {
        p.position.y += Math.sin(t + p.userData.offset) * p.userData.speed;
        p.position.x += Math.cos(t * 0.7 + p.userData.offset) * p.userData.speed * 0.5;
        p.material.opacity = 0.3 + 0.3 * Math.sin(t + p.userData.offset);

        
        if (p.position.y > 2.5) p.position.y = -2.5;
        if (Math.abs(p.position.x) > 2.5) p.position.x *= -1;
      });

      renderer.render(scene, camera);
    }

    animate();
  }
})();

(function() {
  const frEl = document.getElementById('typing-fr');
  const pyEl = document.getElementById('typing-py');
  if (!frEl || !pyEl) return;

  const examples = [
    {
      fr: `déf fibonacci(n):
    si n <= 1:
        retourner n
    retourner fibonacci(n-1) + fibonacci(n-2)

pour i dans intervalle(8):
    afficher(f"F({i}) = {fibonacci(i)}")`,
      py: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(8):
    print(f"F({i}) = {fibonacci(i)}")`
    },
    {
      fr: `classe Coq:
    déf __init__(soi, nom):
        soi.nom = nom
    
    déf chanter(soi):
        afficher("Cocorico ! 🐓")

coq = Coq("Gustave")
coq.chanter()`,
      py: `class Coq:
    def __init__(self, nom):
        self.nom = nom
    
    def chanter(self):
        print("Cocorico ! 🐓")

coq = Coq("Gustave")
coq.chanter()`
    },
    {
      fr: `essayer:
    nombre = entier(saisir("Nombre: "))
    si nombre < 0:
        lever ErreurValeur("Positif!")
    afficher(f"Racine: {nombre ** 0.5:.2f}")
sauf ErreurValeur comme e:
    afficher(f"Erreur: {e}")`,
      py: `try:
    nombre = int(input("Nombre: "))
    if nombre < 0:
        raise ValueError("Positif!")
    print(f"Racine: {nombre ** 0.5:.2f}")
except ValueError as e:
    print(f"Erreur: {e}")`
    }
  ];

  let exIdx = 0;
  let charIdx = 0;
  let phase = 'typing'; 
  let waitCount = 0;

  const DELAY_TYPE = 30;
  const DELAY_ERASE = 12;
  const WAIT_FRAMES = 100;

  function tick() {
    const ex = examples[exIdx];

    if (phase === 'typing') {
      if (charIdx <= ex.fr.length) {
        frEl.textContent = ex.fr.slice(0, charIdx);
        pyEl.textContent = ex.py.slice(0, charIdx);
        charIdx++;
        setTimeout(tick, DELAY_TYPE);
      } else {
        phase = 'waiting';
        setTimeout(tick, 50);
      }
    } else if (phase === 'waiting') {
      waitCount++;
      if (waitCount >= WAIT_FRAMES) {
        waitCount = 0;
        phase = 'erasing';
      }
      setTimeout(tick, 30);
    } else if (phase === 'erasing') {
      if (charIdx > 0) {
        charIdx = Math.max(0, charIdx - 3);
        frEl.textContent = ex.fr.slice(0, charIdx);
        pyEl.textContent = ex.py.slice(0, charIdx);
        setTimeout(tick, DELAY_ERASE);
      } else {
        exIdx = (exIdx + 1) % examples.length;
        phase = 'typing';
        setTimeout(tick, 500);
      }
    }
  }

  setTimeout(tick, 1000);
})();
