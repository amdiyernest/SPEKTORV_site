/* ═══════════════════════════════════════════
   SPEKTOR_V — Filter chips / tabs toggle
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Generic filter toggle — works for both .filter-chip and .filter-tab
  document.querySelectorAll('.filter-chip, .filter-tab').forEach(chip => {
    chip.addEventListener('click', () => {
      // Deactivate siblings in the same container
      const parent = chip.parentElement;
      parent.querySelectorAll('.filter-chip, .filter-tab').forEach(c => {
        c.classList.remove('active');
      });
      chip.classList.add('active');
    });
  });
});
