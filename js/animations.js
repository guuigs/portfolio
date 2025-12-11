// ===================================
// Animations.js - GSAP ScrollTrigger & Advanced Animations
// ===================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
  // Register GSAP ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);

  // ===================================
  // Hero Section Special Entrance
  // ===================================
  gsap.from('#accueil h1', {
    opacity: 0,
    y: -50,
    duration: 1.5,
    ease: 'power4.out',
    delay: 0.3
  });

  gsap.from('#accueil p', {
    opacity: 0,
    y: 30,
    duration: 1.2,
    ease: 'power3.out',
    delay: 0.8
  });

  gsap.from('#accueil .btn-primary', {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: 'power3.out',
    delay: 1.2,
    stagger: 0.2
  });

  // ===================================
  // Section Entrance Animations
  // ===================================
  const sections = document.querySelectorAll('section:not(#accueil)');

  sections.forEach(section => {
    // Get all direct children for stagger effect
    const children = gsap.utils.toArray(section.children);

    gsap.from(children, {
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        // markers: true, // Uncomment for debugging
      },
      y: 50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    });
  });

  // ===================================
  // Experience Cards Stagger Animation
  // ===================================
  const experienceCards = document.querySelectorAll('#experiences .card-interactive');

  gsap.from(experienceCards, {
    scrollTrigger: {
      trigger: '#experiences',
      start: 'top 70%',
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  });

  // ===================================
  // Interest Cards Zoom Animation
  // ===================================
  const interestCards = document.querySelectorAll('#aime .card-interactive');

  gsap.from(interestCards, {
    scrollTrigger: {
      trigger: '#aime',
      start: 'top 70%',
    },
    scale: 0.8,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'back.out(1.7)'
  });

  // ===================================
  // Mentality Section Fade In
  // ===================================
  gsap.from('#mentalite blockquote', {
    scrollTrigger: {
      trigger: '#mentalite',
      start: 'top 70%',
    },
    opacity: 0,
    y: 30,
    duration: 1.2,
    ease: 'power3.out'
  });

  const valueCards = document.querySelectorAll('#mentalite .text-center > div');

  gsap.from(valueCards, {
    scrollTrigger: {
      trigger: '#mentalite',
      start: 'top 60%',
    },
    opacity: 0,
    y: 40,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 0.3
  });

  // ===================================
  // Magnetic Button Effect
  // ===================================
  const magneticButtons = document.querySelectorAll('.btn-magnetic');

  magneticButtons.forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
      gsap.to(btn, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });

  // ===================================
  // Parallax Effect on Scroll (Optional)
  // ===================================
  const parallaxElements = document.querySelectorAll('[data-speed]');

  parallaxElements.forEach(element => {
    const speed = element.getAttribute('data-speed') || 0.5;

    gsap.to(element, {
      y: () => -window.scrollY * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });
  });

  // ===================================
  // Fade In Elements on Scroll
  // ===================================
  const fadeElements = document.querySelectorAll('.fade-in-scroll');

  fadeElements.forEach(element => {
    gsap.from(element, {
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      },
      opacity: 0,
      y: 30,
      duration: 1,
      ease: 'power3.out'
    });
  });

  // ===================================
  // Icon Rotation on Scroll
  // ===================================
  const iconRotate = document.querySelectorAll('.icon-rotate-scroll');

  iconRotate.forEach(icon => {
    gsap.from(icon, {
      scrollTrigger: {
        trigger: icon,
        start: 'top 80%',
      },
      rotation: -180,
      duration: 1,
      ease: 'power3.out'
    });
  });
});

// ===================================
// Refresh ScrollTrigger on Window Resize
// ===================================
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});