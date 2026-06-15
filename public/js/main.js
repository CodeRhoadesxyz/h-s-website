/* ============================================================================
   Heart & Soul Parrot Rescue - Main JavaScript
   ============================================================================ */

document.addEventListener('DOMContentLoaded', function() {
  initializeTheme();
  initializeNavigation();
  initializeScrollEffects();
  initializeMobileMenu();
  initializeParrotAnimation();
});

/* ============================================================================
   THEME TOGGLE
   ============================================================================ */

function initializeTheme() {
  // Get saved theme from localStorage or default to 'dark'
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  initializeThemeToggleButtons();
}

function setTheme(theme) {
  const html = document.documentElement;
  if (theme === 'light') {
    html.setAttribute('data-theme', 'light');
  } else {
    html.removeAttribute('data-theme');
  }
}

function initializeThemeToggleButtons() {
  // Desktop theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
  
  // Mobile theme toggle
  const mobileThemeToggle = document.querySelector('.mobile-theme-toggle');
  if (mobileThemeToggle) {
    mobileThemeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  localStorage.setItem('theme', newTheme);
}

/* ============================================================================
   NAVIGATION
   ============================================================================ */

function initializeNavigation() {
  const navLinks = document.querySelectorAll('nav a');
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    // Check if link matches current page
    if (href === currentFile || 
        (currentFile === '' && href === 'index.html') ||
        (currentFile === '/' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ============================================================================
   SCROLL EFFECTS
   ============================================================================ */

function initializeScrollEffects() {
  const header = document.querySelector('header');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ============================================================================
   MOBILE MENU
   ============================================================================ */

function initializeMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav a');
  
  if (!mobileMenuToggle) return;
  
  // Toggle menu
  mobileMenuToggle.addEventListener('click', function() {
    mobileMenu.classList.add('open');
  });

  // Close menu button
  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
    });
  }
  
  // Close menu when overlay is clicked
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
    });
  }
  
  // Close menu when a link is clicked
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('open');
      // Update active state
      mobileNavLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  
  // Set active mobile nav link
  const currentPath = window.location.pathname;
  const currentFile = currentPath.split('/').pop() || 'index.html';
  
  mobileNavLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || 
        (currentFile === '' && href === 'index.html') ||
        (currentFile === '/' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ============================================================================
   SMOOTH SCROLL
   ============================================================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ============================================================================
   PARROT ANIMATION
   ============================================================================ */

function initializeParrotAnimation() {
  const container = document.querySelector('.parrot-animation-container');
  if (!container) return;

  const parrots = [
    { name: 'blue_gold_macaw', src: 'images/parrots/blue_gold_macaw.jpg' },
    { name: 'scarlet_macaw', src: 'images/parrots/scarlet_macaw.webp' },
    { name: 'military_macaw', src: 'images/parrots/military_macaw.jpg' },
    { name: 'cockatoo', src: 'images/parrots/cockatoo.webp' }
  ];

  function createParrot() {
    const parrot = parrots[Math.floor(Math.random() * parrots.length)];
    const img = document.createElement('img');
    img.src = parrot.src;
    img.className = 'flying-parrot';
    
    // Randomize starting vertical position
    const top = Math.random() * 80 + 10;
    img.style.top = `${top}%`;
    
    // Randomize size
    const size = Math.random() * 100 + 100;
    img.style.width = `${size}px`;
    
    // Randomize speed
    const duration = Math.random() * 10 + 15;
    img.style.animationDuration = `${duration}s`;
    
    // Randomize direction
    const direction = Math.random() > 0.5 ? 'flyAcross' : 'flyBack';
    img.style.animationName = direction;
    img.style.animationTimingFunction = 'linear';
    img.style.animationIterationCount = '1';

    container.appendChild(img);

    setTimeout(() => {
      img.remove();
    }, duration * 1000);
  }

  // Create initial parrots
  for (let i = 0; i < 3; i++) {
    setTimeout(createParrot, Math.random() * 5000);
  }

  // Continuously create parrots
  setInterval(createParrot, 8000);
}

/* ============================================================================
   UTILITY FUNCTIONS
   ============================================================================ */

// Intersection Observer for fade-in animations
function setupIntersectionObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  document.querySelectorAll('.card, section').forEach(el => {
    observer.observe(el);
  });
}

// Initialize on page load
window.addEventListener('load', function() {
  setupIntersectionObserver();
});
