document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById('navbar');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMobileMenuButton = document.getElementById('close-mobile-menu-button');
  const mobileNavLinks = mobileMenu ? mobileMenu.querySelectorAll('nav a.mobile-nav-link') : [];
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const sections = document.querySelectorAll("main section.card"); // Solo observar las cards
  const currentYearSpan = document.getElementById('currentYear');

  // Set current year in footer
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const currentYearSpanFooter = document.getElementById('currentYearFooter');
  if (currentYearSpanFooter) {
    currentYearSpanFooter.textContent = new Date().getFullYear();
  }

  // Si tienes otro span para el año en el header:
  const currentYearSpanHeader = document.getElementById('currentYear');
  if (currentYearSpanHeader) {
    currentYearSpanHeader.textContent = new Date().getFullYear();
  }

  // --- Navbar Scroll Behavior ---
  let lastScroll = 0;
  const navbarHeight = navbar ? navbar.offsetHeight : 64;

  function handleNavbarScroll() {
    if (!navbar) return;
    const currentScroll = window.pageYOffset;

    if (currentScroll > navbarHeight) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }

    if (currentScroll > lastScroll && currentScroll > navbarHeight * 2 && !mobileMenu.classList.contains('open')) {
      // Scroll Down
      navbar.classList.add('navbar-hidden');
    } else {
      // Scroll Up or at top or menu open
      navbar.classList.remove('navbar-hidden');
    }
    lastScroll = currentScroll;
  }

  // --- Mobile Menu ---
  function openMobileMenu() {
    if (!mobileMenu || !mobileMenuButton) return;
    mobileMenu.classList.remove('hidden');
    mobileMenu.classList.add('open');
    mobileMenuButton.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    console.log("Mobile menu opened, body scroll disabled.");
  }

  function closeMobileMenu() {
    if (!mobileMenu || !mobileMenuButton) return;
    mobileMenu.classList.remove('open');
    mobileMenuButton.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    console.log("Mobile menu closing, body scroll enabled.");
    setTimeout(() => {
      if (!mobileMenu.classList.contains('open')) {
        mobileMenu.classList.add('hidden');
        console.log("Mobile menu completely hidden (display: none).");
      }
    }, 300);
  }

  if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      if (mobileMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (closeMobileMenuButton) {
    closeMobileMenuButton.addEventListener('click', (event) => {
      event.stopPropagation();
      closeMobileMenu();
    });
  }

  if (mobileNavLinks && mobileNavLinks.length > 0) {
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });
  } else {
    console.warn("No mobile navigation links found with class 'mobile-nav-link' inside #mobile-menu nav.");
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // --- Intersection Observer for section animations ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // Animate only once
        }
      });
    },
    { threshold: 0.1 } // Trigger when 10% of the element is visible
  );

  sections.forEach((section) => {
    observer.observe(section);
  });

  // --- Scroll-to-Top Button ---
  function handleScrollTopButton() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 300) {
      scrollTopBtn.classList.remove('hidden');
      requestAnimationFrame(() => {
        scrollTopBtn.classList.remove('opacity-0', 'translate-y-10');
      });
    } else {
      scrollTopBtn.classList.add('opacity-0', 'translate-y-10');
      setTimeout(() => {
        if (window.scrollY <= 300) {
          scrollTopBtn.classList.add('hidden');
        }
      }, 300);
    }
  }

  window.addEventListener('scroll', handleScrollTopButton);

  if (scrollTopBtn) {
    if (window.scrollY <= 300) {
      scrollTopBtn.classList.add('hidden', 'opacity-0', 'translate-y-10');
    }
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Smooth scrolling for internal links (already handled by html scroll-behavior: smooth) ---
  // If you need custom offsets, you'd add specific logic here.
  // For example, handling fixed navbar offset:
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      // Make sure it's a local anchor and not just "#" or an external link
      if (href.length > 1 && href.startsWith('#')) {
        const targetId = href.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault(); // Prevent default jump
          const navbarActual = document.getElementById('navbar');
          const navbarOffset = (navbarActual && window.getComputedStyle(navbarActual).display !== 'none' && !navbarActual.classList.contains('navbar-hidden')) ? navbarActual.offsetHeight : 0;
          let finalOffset = 0;
          if (this.closest('#mobile-menu')) {
            finalOffset = 15;
          } else {
            finalOffset = navbarOffset + 15;
          }
          const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - finalOffset;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          // If it's not the mobile menu, update URL hash (mobile menu links do this already after closing)
          if (!this.closest('#mobile-menu')) {
            if (window.location.hash !== href) {
              history.pushState(null, null, href);
            }
          }
        }
      }
    });
  });

  if (mobileMenu && !mobileMenu.classList.contains('open') && !mobileMenu.classList.contains('hidden')) {
    mobileMenu.classList.add('hidden');
  }

  // --- Canvas Starfield Animation ---
  const canvas = document.getElementById('stars');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [];
    let particles = [];
    let centerX, centerY, maxRadius, rotationAngle = 0;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateVortexParams(); // Recalculate vortex params on resize
      initStars(); // Reinitialize stars on resize
    }

    function initStars() {
        stars = Array(150).fill(null).map(() => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.2 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.015 + 0.005,
        }));
    }
    
    function updateVortexParams() {
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
      maxRadius = Math.min(canvas.width, canvas.height) * 0.4;
      particles = Array(600).fill(null).map(() => {
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

    function drawVortex() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient (subtle)
      const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(canvas.width, canvas.height));
      bgGradient.addColorStop(0, '#0a0f1a'); // Darker blue/black
      bgGradient.addColorStop(0.5, '#0f172a'); // Slightly lighter (Tailwind slate-900)
      bgGradient.addColorStop(1, '#1e293b');   // (Tailwind slate-800)
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw vortex particles
      particles.forEach(p => {
        p.theta += p.speed * 0.02;
        const r = p.r * (1 + Math.sin(p.theta * 0.8) * 0.25); // Reduced swirl intensity
        const x = centerX + r * Math.cos(p.theta + rotationAngle);
        const y = centerY + r * Math.sin(p.theta + rotationAngle);
        
        // Particle gradient for a softer look
        const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, 2.5);
        particleGradient.addColorStop(0, `rgba(135, 206, 250, ${p.alpha * 0.7})`); // Lighter blue, slightly less alpha
        particleGradient.addColorStop(0.5, `rgba(70, 130, 180, ${p.alpha * 0.5})`);
        particleGradient.addColorStop(1, `rgba(25, 25, 112, ${p.alpha * 0.2})`);

        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2); // Slightly larger particles
        ctx.fillStyle = particleGradient;
        ctx.fill();
      });

      // Glowing center (more subtle)
      const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.2);
      glowGradient.addColorStop(0, 'rgba(100, 180, 250, 0.5)'); // Less intense glow
      glowGradient.addColorStop(1, 'rgba(70, 130, 180, 0)');
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = glowGradient;
      ctx.fill();

      // Draw stars
      stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.1) star.speed *= -1; // Adjusted min alpha
        
        // Star glow
        const starGlow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.radius * 3);
        starGlow.addColorStop(0, `rgba(255, 255, 255, ${star.alpha * 0.8})`);
        starGlow.addColorStop(0.5, `rgba(255, 255, 255, ${star.alpha * 0.3})`);
        starGlow.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius * 1.5, 0, Math.PI * 2); // Make the glow area slightly larger
        ctx.fillStyle = starGlow;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });

      // Moon-like element (more subtle)
      const moonX = canvas.width * 0.85;
      const moonY = canvas.height * 0.15;
      const moonRadius = 12;
      
      const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonRadius * 4);
      moonGlow.addColorStop(0, 'rgba(220, 220, 255, 0.3)');
      moonGlow.addColorStop(0.7, 'rgba(200, 200, 240, 0.05)');
      moonGlow.addColorStop(1, 'rgba(200, 200, 240, 0)');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius * 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(230, 230, 245, 0.8)'; // Slightly off-white, semi-transparent
      ctx.fill();
      
      // Crescent shadow
      ctx.beginPath();
      ctx.arc(moonX + moonRadius * 0.3, moonY - moonRadius * 0.1, moonRadius * 0.9, 0, Math.PI * 2);
      ctx.fillStyle = ctx.fillStyle = bgGradient; // Use background color for shadow
      ctx.fill();


      rotationAngle += 0.002; // Slower rotation
      requestAnimationFrame(drawVortex);
    }

    resizeCanvas(); // Initial setup
    window.addEventListener('resize', resizeCanvas);
    drawVortex(); // Start animation
  }

  // --- Event Listeners ---
  window.addEventListener('scroll', () => {
    handleNavbarScroll();
    handleScrollTopButton();
  }, { passive: true });

  // Initial calls on load
  handleNavbarScroll();
  handleScrollTopButton();
});