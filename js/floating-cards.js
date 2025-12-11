// ===================================
// Floating Cards.js - Card Float & Parallax Effects
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // ===================================
  // GSAP Floating Animation for Cards
  // ===================================
  const floatingCards = document.querySelectorAll('.floating-card');

  floatingCards.forEach((card, index) => {
    // Randomize animation for natural effect
    const duration = 4 + Math.random() * 4; // 4-8 seconds
    const delay = index * 0.5; // Stagger start times
    const yOffset = 15 + Math.random() * 15; // 15-30px float range

    // Vertical floating animation
    gsap.to(card, {
      y: `-=${yOffset}`,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: delay
    });

    // Add subtle rotation for more natural movement
    gsap.to(card, {
      rotation: 2,
      duration: duration * 1.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: delay
    });
  });

  // ===================================
  // Mouse Parallax Effect (Optional)
  // ===================================
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
  });

  // Apply parallax to floating cards based on mouse position
  function animateParallax() {
    floatingCards.forEach((card, index) => {
      const speed = (index + 1) * 15; // Different speeds for depth effect

      gsap.to(card, {
        x: mouseX * speed,
        y: mouseY * speed,
        duration: 1,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    });

    requestAnimationFrame(animateParallax);
  }

  // Start parallax animation (only on desktop)
  if (window.innerWidth > 768) {
    animateParallax();
  }

  // ===================================
  // Tilt Card Effect (3D Perspective)
  // ===================================
  const tiltCards = document.querySelectorAll('.tilt-card');

  // Check if VanillaTilt is loaded
  if (typeof VanillaTilt !== 'undefined') {
    VanillaTilt.init(tiltCards, {
      max: 15,                    // Max tilt rotation (degrees)
      speed: 400,                 // Speed of tilt animation
      glare: true,                // Enable glare effect
      'max-glare': 0.3,           // Max glare opacity
      perspective: 1000,          // Transform perspective
      scale: 1.05,                // Scale on hover
      transition: true,           // Enable transition
      easing: 'cubic-bezier(.03,.98,.52,.99)'
    });
  }

  // ===================================
  // Card Hover Intensity Effect
  // ===================================
  const interactiveCards = document.querySelectorAll('.card-interactive');

  interactiveCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  // ===================================
  // Disable Parallax on Mobile for Performance
  // ===================================
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      // Reset positions on mobile
      floatingCards.forEach(card => {
        gsap.set(card, { x: 0, y: 0 });
      });
    }
  });
});

// ===================================
// Alternative: Pure CSS Float (Lightweight)
// ===================================
// If you prefer CSS-only approach, add this class to cards in HTML:
// class="animate-float"
// The float animation is already defined in Tailwind config