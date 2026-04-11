/* ═══════════════════════════════════════════
   SPEKTOR_V — Navigation scroll behavior
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('mainNav');
  if (!nav) return;

  // Auto dark/light based on hero section
  const hero = document.querySelector('.hero, .about-hero');
  if (hero) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          nav.classList.add('nav--dark');
        } else {
          nav.classList.remove('nav--dark');
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(hero);
  }
});
