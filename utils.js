/**
 * Shared helpers: theming, scroll reveal, counters, scroll-spy, formatting
 * and escaping.
 * This module is imported by main.js and ui.js - it must exist for the
 * application bundle to load at all.
 */

let revealObserver = null;
let spyObserver = null;

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

/* ===== Theme (light / dark) ===== */

/**
 * Apply the light or dark theme to the document and remember the choice.
 * @param {'light'|'dark'} theme
 * @returns {void}
 */
export function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try {
        localStorage.setItem('resume-theme', theme);
    } catch (e) { /* storage blocked - the theme still applies for this page view */ }
    updateThemeIcon(theme);
}

/**
 * Swap the icon of the theme toggle button.
 * @param {'light'|'dark'} theme
 * @returns {void}
 */
function updateThemeIcon(theme) {
    const icon = document.getElementById('theme-toggle-icon');
    if (!icon) return;
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    const button = document.getElementById('theme-toggle');
    if (button) {
        button.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
        button.title = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
    }
}

/**
 * Read the saved theme (or the OS preference) and wire the toggle button.
 * @returns {void}
 */
export function initTheme() {
    const root = document.documentElement;
    let saved = null;
    try {
        saved = localStorage.getItem('resume-theme');
    } catch (e) { /* storage blocked */ }

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    root.setAttribute('data-theme', theme);
    updateThemeIcon(theme);

    const toggle = document.getElementById('theme-toggle');
    if (toggle) {
        toggle.addEventListener('click', () => {
            const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            setTheme(next);
        });
    }
}

/* ===== Animated counters ===== */

/**
 * Animate a numeric element from 0 to its target value.
 * The value keeps any non-numeric suffix, so "9+" counts up to 9+ and "60%"
 * counts up to 60%.
 * @param {HTMLElement|null} el
 * @param {string|number} value - e.g. "9+" or 60
 * @param {number} duration - animation length in milliseconds
 * @returns {void}
 */
export function animateCounter(el, value, duration = 1400) {
    if (!el) return;

    const raw = String(value);
    const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
        el.textContent = raw;
        return;
    }

    const target = parseFloat(match[1]);
    const suffix = match[2];
    const decimals = (match[1].split('.')[1] || '').length;

    // Respect the user's motion preference - show the final value instantly.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = target.toFixed(decimals) + suffix;
        return;
    }

    const start = performance.now();
    const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = (target * eased).toFixed(decimals) + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

/**
 * Count up the hero statistics.
 * @param {Object} profile - profile data from data.js
 * @returns {void}
 */
export function initCounters(profile) {
    if (!profile) return;
    animateCounter(document.getElementById('stat-years'), profile.stat_years);
    animateCounter(document.getElementById('stat-efficiency'), profile.stat_efficiency);
}

/* ===== Scroll-spy navigation ===== */

/**
 * Highlight the navigation link of the section that is currently in view.
 * @returns {void}
 */
export function initScrollSpy() {
    const links = Array.from(document.querySelectorAll('.resume-nav-links a[href^="#"]'));
    if (!links.length) return;

    const sections = links
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);
    if (!sections.length) return;

    const ratios = new Map();

    const setActive = (id) => {
        links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
    };

    // Contact is the last block - make sure it can win even though it is short.
    if (spyObserver) spyObserver.disconnect();
    spyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        });

        let bestId = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
            if (ratio > bestRatio) {
                bestRatio = ratio;
                bestId = id;
            }
        });

        if (bestId) setActive(bestId);
    }, { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: '-20% 0px -40% 0px' });

    sections.forEach(section => spyObserver.observe(section));

    // Set a sensible starting point before the user scrolls.
    setActive(sections[0].id);
}

/* ===== Print ===== */

/**
 * Wire the "Download / Print Resume" button to the browser print dialog
 * (which also offers "Save as PDF").
 * @returns {void}
 */
export function initPrintButton() {
    const button = document.getElementById('print-resume');
    if (!button) return;
    button.addEventListener('click', () => window.print());
}

/* ===== Formatting helpers ===== */

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
