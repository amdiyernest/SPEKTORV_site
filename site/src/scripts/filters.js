/* ═══════════════════════════════════════════
   SPEKTOR_V — Filter chips / tabs toggle
   Groups are determined by data-filter-group attribute.
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.filter-chip, .filter-tab').forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.dataset.filterGroup;
      if (group) {
        // Deactivate only chips in the same named group
        document.querySelectorAll(`[data-filter-group="${group}"]`).forEach(c => {
          c.classList.remove('active');
        });
      } else {
        // Fallback: deactivate siblings in same parent (old behaviour)
        chip.parentElement.querySelectorAll('.filter-chip, .filter-tab').forEach(c => {
          c.classList.remove('active');
        });
      }
      chip.classList.add('active');
    });
  });
});
