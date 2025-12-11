// ===================================
// Navigation.js - Smooth Scroll & Active State Management
// ===================================

// Smooth scroll with offset for fixed navigation
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    const targetId = link.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);

    if (targetSection) {
      const navHeight = document.getElementById('main-nav').offsetHeight;
      const targetPosition = targetSection.offsetTop - navHeight;

      // Smooth scroll to target
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update active state
      updateActiveNav(targetId);
    }
  });
});

// Highlight active section on scroll
let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateActiveNavOnScroll();
      ticking = false;
    });
    ticking = true;
  }
});

// Update active navigation based on scroll position
function updateActiveNavOnScroll() {
  const sections = document.querySelectorAll('section[data-section]');
  const navHeight = document.getElementById('main-nav').offsetHeight;
  const scrollPos = window.scrollY;

  sections.forEach(section => {
    const sectionTop = section.offsetTop - navHeight - 100;
    const sectionBottom = sectionTop + section.offsetHeight;

    if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
      updateActiveNav(section.id);
    }
  });
}

// Update active navigation link styling
function updateActiveNav(activeId) {
  document.querySelectorAll('.nav-link').forEach(link => {
    // Remove active classes
    link.classList.remove('text-blue-600', 'font-bold');

    // Add active classes to current section
    if (link.getAttribute('data-target') === activeId) {
      link.classList.add('text-blue-600', 'font-bold');
    }
  });
}

// Initialize first section as active on page load
document.addEventListener('DOMContentLoaded', () => {
  updateActiveNav('accueil');
});

// Optional: Add navbar background on scroll
let lastScroll = 0;
const navbar = document.getElementById('main-nav');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 100) {
    navbar.classList.add('shadow-lg');
  } else {
    navbar.classList.remove('shadow-lg');
  }

  lastScroll = currentScroll;
});