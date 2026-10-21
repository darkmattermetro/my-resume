import { DEFAULT_RESUME } from './data.js';
import * as ui from './ui.js';
import * as utils from './utils.js';

/**
 * The content of Mohit_Kumar_Resume_Formatted.docx is the source of truth for
 * this site. It lives in data.js and is rendered on page load - there is no
 * backend, no admin panel and no database.
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Theme (light / dark) - applied before paint by the inline script in
    // index.html, this wires up the toggle button.
    utils.initTheme();

    ui.applyProfileToDOM(DEFAULT_RESUME.profile);
    ui.renderCompetencies(DEFAULT_RESUME.competencies);
    ui.renderExperience(DEFAULT_RESUME.experience);
    ui.renderEducation(DEFAULT_RESUME.education);
    ui.renderTechnicalInnovation(DEFAULT_RESUME.technical_innovation);
    ui.renderCertifications(DEFAULT_RESUME.certifications);

    // Scroll reveal animations
    utils.initScrollReveal();

    // Hero statistics count up when the page loads
    utils.initCounters(DEFAULT_RESUME.profile);

    // Active section highlight in the navigation
    utils.initScrollSpy();

    // Download / print action
    utils.initPrintButton();

    console.log('Resume rendered successfully');
  } catch (error) {
    console.error('Failed to render the resume:', error);
  }
});
