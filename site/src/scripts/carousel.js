/* ═══════════════════════════════════════════
   SPEKTOR_V — Carousel scroll
   ═══════════════════════════════════════════ */

function scrollCarousel(id, amount) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollBy({ left: amount, behavior: 'smooth' });
  }
}
window.scrollCarousel = scrollCarousel;
