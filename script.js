/* ───────────────────────────────────────────────────────────
   Derek On Capital — Minimal client script
   Keeps the page lightweight; no framework, no dependencies.
   ─────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // Auto-update footer year so the copyright never goes stale.
  var yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
