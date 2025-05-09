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

// Configuración del lienzo para estrellas
const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Generar estrellas
const stars = Array(150)
  .fill()
  .map(() => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.2 + 0.5,
    alpha: Math.random(),
    speed: Math.random() * 0.015 + 0.005,
  }));

// Dibujar estrellas
function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach((star) => {
    star.alpha += star.speed;
    if (star.alpha > 1 || star.alpha < 0.2) star.speed *= -1;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

drawStars();

const navbar = document.getElementById('navbar');
let lastScrollY = window.scrollY;

// Detectar el scroll y ocultar/mostrar el menú
window.addEventListener('scroll', () => {
  if (window.scrollY > lastScrollY) {
    // Ocultar el menú cuando el usuario hace scroll hacia abajo
    navbar.style.transform = 'translateY(-100%)';
  } else {
    // Mostrar el menú cuando el usuario hace scroll hacia arriba
    navbar.style.transform = 'translateY(0)';
  }
  lastScrollY = window.scrollY;
});

// Función para alternar el menú en dispositivos móviles
function toggleMenu() {
  const menu = document.querySelector('#navbar .container');
  menu.classList.toggle('hidden');
}
