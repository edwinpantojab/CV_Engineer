// Animación en scroll para secciones
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // Variables para controlar el scroll
  let lastScroll = 0;
  const navbar = document.getElementById('navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');

  // Función para manejar el scroll
  function handleScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
      navbar.classList.remove('hidden');
      return;
    }

    if (currentScroll > lastScroll && !navbar.classList.contains('hidden')) {
      navbar.classList.add('hidden');
    } else if (currentScroll < lastScroll && navbar.classList.contains('hidden')) {
      navbar.classList.remove('hidden');
    }

    lastScroll = currentScroll;
  }

  // Menú móvil
  function toggleMobileMenu() {
    const menu = document.querySelector('nav div');
    menu.classList.toggle('hidden');
  }

  // Event listeners
  window.addEventListener('scroll', handleScroll, { passive: true });
  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', toggleMobileMenu);
  }

  // Canvas animation
  const canvas = document.getElementById('stars');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Stars
  const stars = Array(150).fill().map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.2 + 0.5,
    alpha: Math.random(),
    speed: Math.random() * 0.015 + 0.005,
  }));

  // Vortex parameters
  let centerX = canvas.width / 2;
  let centerY = canvas.height / 2;
  let rotationAngle = 0;
  let maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
  let particles = Array(600).fill().map(() => {
    const theta = Math.random() * 2 * Math.PI;
    const r = Math.random() * maxRadius;
    return {
      theta: theta,
      r: r,
      speed: Math.random() * 0.03 + 0.01,
      alpha: Math.random() * 0.5 + 0.5,
    };
  });

  function updateVortexParams() {
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
    particles = Array(600).fill().map(() => {
      const theta = Math.random() * 2 * Math.PI;
      const r = Math.random() * maxRadius;
      return {
        theta: theta,
        r: r,
        speed: Math.random() * 0.03 + 0.01,
        alpha: Math.random() * 0.5 + 0.5,
      };
    });
  }

  window.addEventListener('resize', updateVortexParams);

  function drawVortex() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 2);
    gradient.addColorStop(0, '#0a0a23');
    gradient.addColorStop(0.5, '#1a1a3d');
    gradient.addColorStop(1, '#2a2a5a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw vortex
    particles.forEach(p => {
      p.theta += p.speed * 0.02;
      const r = p.r * (1 + Math.sin(p.theta * 0.8) * 0.3);
      const x = centerX + r * Math.cos(p.theta + rotationAngle);
      const y = centerY + r * Math.sin(p.theta + rotationAngle);
      const colorGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
      colorGradient.addColorStop(0, `rgba(135, 206, 250, ${p.alpha})`);
      colorGradient.addColorStop(0.5, `rgba(70, 130, 180, ${p.alpha * 0.8})`);
      colorGradient.addColorStop(1, `rgba(25, 25, 112, ${p.alpha * 0.5})`);
      ctx.beginPath();
      ctx.arc(x, y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = colorGradient;
      ctx.fill();
    });

    // Glowing center
    const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.3);
    glowGradient.addColorStop(0, 'rgba(135, 206, 250, 0.9)');
    glowGradient.addColorStop(1, 'rgba(70, 130, 180, 0)');
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw stars
    stars.forEach(star => {
      star.alpha += star.speed;
      if (star.alpha > 1 || star.alpha < 0.2) star.speed *= -1;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fill();
    });

    // Draw moon-like element
    const moonX = canvas.width * 0.9;
    const moonY = canvas.height * 0.1;
    ctx.beginPath();
    ctx.arc(moonX, moonY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(moonX + 5, moonY, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#0a0a23';
    ctx.fill();

    rotationAngle += 0.003;
    requestAnimationFrame(drawVortex);
  }

  drawVortex();
});

// Mostrar/ocultar el botón de scroll arriba
document.addEventListener('DOMContentLoaded', function() {
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      scrollTopBtn.style.display = 'block';
    } else {
      scrollTopBtn.style.display = 'none';
    }
  });
  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Scroll suave desde la navegación
document.querySelectorAll("nav a").forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 60, // Ajusta para compensar la altura de la barra fija
        behavior: "smooth",
      });
    }
  });
});

const mobileMenuBtn = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
  mobileMenu.classList.remove('hidden');
  document.body.style.overflow = 'hidden'; // Evita scroll del fondo
});

function closeMobileMenu() {
  mobileMenu.classList.add('hidden');
  document.body.style.overflow = ''; // Restaura scroll
}
