/**
 * Shared helpers: scroll reveal, formatting and escaping.
 * This module is imported by main.js and ui.js - it must exist for the
 * application bundle to load at all.
 */

let revealObserver = null;

/**
 * Create the IntersectionObserver used for scroll reveal animations and
 * start observing every element marked with the "reveal" class.
 * @returns {void}
 */
export function initScrollReveal() {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  }
  observeReveals();
}

/**
 * Observe every not-yet-revealed element.
 * @returns {void}
 */
export function observeReveals() {
  if (!revealObserver) return;
  document.querySelectorAll('.reveal:not(.active)').forEach(el => revealObserver.observe(el));
}

/**
 * Re-observe elements that were injected into the DOM after the first pass.
 * @returns {void}
 */
export function reobserveReveals() {
  observeReveals();
}

/**
 * Format a date string as "Mon YYYY".
 * @param {string|Date} dateString
 * @returns {string}
 */
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

/**
 * Escape a value so it can safely be injected into an innerHTML template.
 * @param {*} value
 * @returns {string}
 */
export function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

/**
 * Show or hide a whole section (used for sections that have no content).
 * @param {string} sectionId
 * @param {boolean} visible
 * @returns {void}
 */
export function setSectionVisible(sectionId, visible) {
  const section = document.getElementById(sectionId);
  if (section) section.hidden = !visible;
}
