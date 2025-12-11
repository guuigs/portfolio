// ===================================
// Main.js - Global Initialization & Configuration
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // ===================================
  // Initialize AOS (Animate On Scroll)
  // ===================================
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,              // Animation duration in ms
      easing: 'ease-in-out',      // Default easing
      once: false,                // Repeat animations on scroll
      offset: 100,                // Offset from trigger point
      delay: 0,                   // Delay before animation starts
      anchorPlacement: 'top-bottom', // Where animation triggers
      mirror: false,              // Don't animate out when scrolling past
      disable: false              // Conditions to disable AOS
    });

    // Refresh AOS on dynamic content changes (if needed)
    // AOS.refresh();
  } else {
    console.warn('AOS library not loaded');
  }

  // ===================================
  // Page Load Animation
  // ===================================
  gsap.from('body', {
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out'
  });

  // ===================================
  // Smooth Scroll Polyfill Check
  // ===================================
  if (!('scrollBehavior' in document.documentElement.style)) {
    console.warn('Smooth scroll not supported in this browser. Consider adding a polyfill.');
    // Optional: Load smoothscroll-polyfill
    // import smoothscroll from 'smoothscroll-polyfill';
    // smoothscroll.polyfill();
  }

  // ===================================
  // Performance Monitoring (Optional)
  // ===================================
  if (window.performance) {
    window.addEventListener('load', () => {
      const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
      console.log(`Page loaded in ${loadTime}ms`);
    });
  }

  // ===================================
  // Disable Right-Click (Optional - for portfolio protection)
  // ===================================
  // Uncomment if you want to disable right-click
  // document.addEventListener('contextmenu', (e) => {
  //   e.preventDefault();
  // });

  // ===================================
  // Console Welcome Message
  // ===================================
  console.log('%c Portfolio Chargé avec Succès! ', 'background: #3b82f6; color: white; font-size: 16px; padding: 10px; border-radius: 5px;');
  console.log('%c Construit avec: Tailwind CSS, GSAP, AOS ', 'color: #6366f1; font-size: 12px;');

  // ===================================
  // Easter Egg: Konami Code (Optional Fun Feature)
  // ===================================
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateEasterEgg();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateEasterEgg() {
    console.log('%c 🎉 Konami Code Activated! ', 'background: #10b981; color: white; font-size: 20px; padding: 15px;');

    // Fun animation
    gsap.to('body', {
      rotation: 360,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        gsap.set('body', { rotation: 0 });
      }
    });

    // Optional: Confetti effect (requires additional library)
    // confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
  }

  // ===================================
  // Analytics Integration (Optional)
  // ===================================
  // Example: Google Analytics 4
  // window.dataLayer = window.dataLayer || [];
  // function gtag(){dataLayer.push(arguments);}
  // gtag('js', new Date());
  // gtag('config', 'GA_MEASUREMENT_ID');

  // ===================================
  // Service Worker Registration (Optional - for PWA)
  // ===================================
  // if ('serviceWorker' in navigator) {
  //   window.addEventListener('load', () => {
  //     navigator.serviceWorker.register('/service-worker.js')
  //       .then(registration => console.log('Service Worker registered:', registration))
  //       .catch(error => console.log('Service Worker registration failed:', error));
  //   });
  // }

  // ===================================
  // Accessibility: Skip to Content Link
  // ===================================
  const skipLink = document.querySelector('.skip-to-content');
  if (skipLink) {
    skipLink.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(skipLink.getAttribute('href'));
      if (target) {
        target.focus();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // ===================================
  // Dark Mode Toggle (Optional Enhancement)
  // ===================================
  // const darkModeToggle = document.getElementById('dark-mode-toggle');
  // if (darkModeToggle) {
  //   darkModeToggle.addEventListener('click', () => {
  //     document.documentElement.classList.toggle('dark');
  //     localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
  //   });

  //   // Check for saved dark mode preference
  //   if (localStorage.getItem('darkMode') === 'true') {
  //     document.documentElement.classList.add('dark');
  //   }
  // }

  // ===================================
  // Preload Critical Images (Optional)
  // ===================================
  // const criticalImages = ['/path/to/hero-image.jpg'];
  // criticalImages.forEach(src => {
  //   const img = new Image();
  //   img.src = src;
  // });

  // ===================================
  // Handle External Links
  // ===================================
  const externalLinks = document.querySelectorAll('a[href^="http"]');
  externalLinks.forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });

  // ===================================
  // Lazy Loading Images (Native)
  // ===================================
  // Already handled with loading="lazy" in HTML
  // Fallback for older browsers
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ===================================
  // Form Validation (If contact form exists)
  // ===================================
  // const contactForm = document.getElementById('contact-form');
  // if (contactForm) {
  //   contactForm.addEventListener('submit', (e) => {
  //     e.preventDefault();
  //     // Add form validation and submission logic
  //     console.log('Form submitted');
  //   });
  // }

  // ===================================
  // Resize Handler with Debounce
  // ===================================
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      console.log('Window resized');
      // Refresh AOS and ScrollTrigger
      if (typeof AOS !== 'undefined') AOS.refresh();
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 250);
  });

  // ===================================
  // Detect Mobile/Tablet
  // ===================================
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    document.body.classList.add('mobile-device');
    console.log('Mobile device detected');
  }

  // ===================================
  // Print Current Year in Footer
  // ===================================
  const yearElement = document.querySelector('footer .year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
});

// ===================================
// Global Utility Functions
// ===================================

// Debounce function for performance
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll events
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Check if element is in viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}