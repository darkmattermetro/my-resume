import { DEFAULT_RESUME } from './data.js';
import { escapeHtml, reobserveReveals, setSectionVisible, formatDate } from './utils.js';

/**
 * Apply the profile data to the static markup of the page.
 * @param {Object|null} d - Profile data
 * @returns {void}
 */
export function applyProfileToDOM(d) {
  if (!d) {
    d = DEFAULT_RESUME.profile;
  }

  const contact = d.contact || {};

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.innerText = value || '';
  };

  // Optional fields keep the value from the markup when the data has none.
  const setTextIfPresent = (id, value) => {
    if (!value) return;
    const el = document.getElementById(id);
    if (el) el.innerText = value;
  };

  setText('full-name', d.full_name);
  setText('header-name', d.full_name);
  setText('footer-name', (d.full_name || 'My') + ' | Resume');
  setText('professional-title', d.professional_title);
  setText('introduction', d.introduction);
  setText('about-me', d.about_me || d.introduction);
  setText('contact-info', d.contact_info || [contact.location, contact.phone, contact.email].filter(Boolean).join(' | '));

  // Hero contact details
  setText('contact-location', contact.location);
  setText('contact-phone', contact.phone);
  setText('contact-email', contact.email);

  const portfolioEl = document.getElementById('contact-portfolio');
  if (portfolioEl) {
    if (contact.portfolio) {
      portfolioEl.href = contact.portfolio;
      portfolioEl.hidden = false;
      setText('contact-portfolio-text', contact.portfolio.replace(/^https?:\/\//, ''));
    } else {
      portfolioEl.hidden = true;
    }
  }

  // Clickable phone / e-mail in the hero
  const phoneLink = document.getElementById('contact-phone-link');
  if (phoneLink && contact.phone) {
    phoneLink.href = 'tel:+91' + contact.phone.replace(/\D/g, '');
  }

  const emailLink = document.getElementById('contact-email-link');
  if (emailLink && contact.email) {
    emailLink.href = 'mailto:' + contact.email;
  }

  // Portfolio line of the contact block
  const portfolioLine = document.getElementById('contact-portfolio-line');
  if (portfolioLine) {
    const link = portfolioLine.querySelector('a');
    if (contact.portfolio && link) {
      link.href = contact.portfolio;
      link.textContent = contact.portfolio.replace(/^https?:\/\//, '');
    } else if (!contact.portfolio) {
      portfolioLine.hidden = true;
    }
  }

  // Hero stats
  setText('stat-years', d.stat_years);
  setTextIfPresent('stat-years-label', d.stat_years_label);
  setText('stat-efficiency', d.stat_efficiency);
  setTextIfPresent('stat-efficiency-label', d.stat_efficiency_label);

  // Profile tags
  const tagsEl = document.getElementById('profile-tags');
  if (tagsEl) {
    const tags = d.tags || [];
    if (tags.length) {
      tagsEl.innerHTML = tags.map(tag => `<span class="profile-tag">${escapeHtml(tag)}</span>`).join('');
    }
  }
}

/**
 * Render the professional experience timeline.
 * @param {Array} data
 * @returns {void}
 */
export function renderExperience(data) {
  const container = document.getElementById('experience-timeline');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">No work experience added yet.</p>';
    return;
  }

  container.innerHTML = `
    <div class="timeline-line"></div>
    ${data.map((exp, i) => {
      const start = exp.start_date ? formatDate(exp.start_date) : '';
      const end = exp.is_current ? 'Present' : (exp.end_date ? formatDate(exp.end_date) : '');
      const dateLabel = exp.date_label || [start, end].filter(Boolean).join(' - ');
      const bullets = (exp.description || '').split('\n').filter(Boolean);
      const company = exp.location ? `${exp.company} | ${exp.location}` : exp.company;

      return `
          <div class="timeline-item reveal reveal-delay-${Math.min(i, 4)}">
              <div class="timeline-dot ${exp.is_current ? 'current' : ''}"></div>
              <div class="timeline-card">
                  <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:8px;">
                      <h3>${escapeHtml(exp.role)}</h3>
                      ${exp.is_current ? '<span class="current-badge">Current</span>' : ''}
                  </div>
                  <p class="timeline-company">${escapeHtml(company)}</p>
                  <p class="timeline-date">${escapeHtml(dateLabel)}</p>
                  ${bullets.length ? bullets.map(b => `<p class="timeline-bullet"><i class="fas fa-circle"></i>${escapeHtml(b)}</p>`).join('') : ''}
              </div>
          </div>
      `;
    }).join('')}
  `;

  reobserveReveals();
}

/**
 * Render the certifications grid. The section is hidden when there is nothing to show.
 * @param {Array} data
 * @returns {void}
 */
export function renderCertifications(data) {
  const container = document.getElementById('certifications-grid');
  if (!container) {
    setSectionVisible('certifications', false);
    return;
  }

  const certs = data || [];
  setSectionVisible('certifications', certs.length > 0);

  if (certs.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">No certifications added yet.</p>';
    return;
  }

  container.innerHTML = certs.map((cert, i) => {
    const isExpired = cert.expiry_date && new Date(cert.expiry_date) < new Date();
    const expiryText = cert.expiry_date ? `Expires: ${formatDate(cert.expiry_date)}` : '';
    const dateLine = cert.date_earned
      ? `<p class="cert-date"><i class="fas fa-calendar-alt"></i> ${escapeHtml(formatDate(cert.date_earned))}</p>`
      : '';
    const statusLine = cert.status
      ? `<span class="cert-status valid">${escapeHtml(cert.status)}</span>`
      : (cert.expiry_date
        ? `<span class="cert-status ${isExpired ? 'expired' : 'valid'}">${isExpired ? '<i class="fas fa-exclamation-circle"></i> Expired' : '<i class="fas fa-check-circle"></i> Active'} — ${escapeHtml(expiryText)}</span>`
        : '');

    return `
        <div class="cert-card reveal reveal-delay-${Math.min(i, 4)}">
            <h3>${escapeHtml(cert.name)}</h3>
            <p class="cert-issuer">${escapeHtml(cert.issuer)}</p>
            ${dateLine}
            ${cert.certificate_url ? `<p style="margin-bottom:8px;"><a href="${escapeHtml(cert.certificate_url)}" target="_blank" rel="noopener" style="color:#1a5276;font-size:13px;"><i class="fas fa-external-link-alt"></i> View Certificate</a></p>` : ''}
            ${statusLine}
        </div>
    `;
  }).join('');

  reobserveReveals();
}

/**
 * Render the education grid.
 * @param {Array} data
 * @returns {void}
 */
export function renderEducation(data) {
  const container = document.getElementById('education-grid');
  if (!container) return;

  if (!data || data.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">No education entries added yet.</p>';
    return;
  }

  container.innerHTML = data.map((edu, i) => `
      <div class="edu-card reveal reveal-delay-${Math.min(i, 4)}">
          <div class="edu-icon">
              <i class="fas fa-graduation-cap"></i>
          </div>
          <h3>${escapeHtml(edu.degree)}${edu.field ? ' (' + escapeHtml(edu.field) + ')' : ''}</h3>
          <p class="edu-institution">${escapeHtml(edu.status || edu.year)} | ${escapeHtml(edu.institution)}</p>
      </div>
  `).join('');

  reobserveReveals();
}

/**
 * Render the core competency groups.
 * @param {Array} data
 * @returns {void}
 */
export function renderCompetencies(data) {
  const container = document.getElementById('competencies-grid');
  if (!container) return;

  // sort_order keeps the groups (and their items) in the order of the document
  const competencies = [...(data || [])].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const categories = [...new Set(competencies.map(c => c.category))];

  if (competencies.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">No competencies added yet.</p>';
    return;
  }

  // The document lists each competency group as one line of comma separated
  // items, so the items of a group are rendered as a single entry.
  container.innerHTML = categories.map((cat, i) => {
    const items = competencies.filter(c => c.category === cat).map(c => c.name);

    return `
      <div class="competency-group reveal reveal-delay-${Math.min(i, 4)}">
          <h3 class="competency-category">${escapeHtml(cat)}</h3>
          <div class="competency-items">
              <div class="competency-chip">
                  <i class="fas fa-check-circle"></i>
                  ${escapeHtml(items.join(', '))}
              </div>
          </div>
      </div>
  `;
  }).join('');

  reobserveReveals();
}

/**
 * Render the technical projects / innovation cards.
 * @param {Array} data
 * @returns {void}
 */
export function renderTechnicalInnovation(data) {
  const container = document.getElementById('innovation-container');
  if (!container) return;

  const projects = data || [];

  if (projects.length === 0) {
    container.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">No projects listed yet.</p>';
    return;
  }

  container.innerHTML = projects.map((inn, i) => {
    const paragraphs = (inn.description || '').split('\n').map(p => p.trim()).filter(Boolean);

    return `
      <div class="innovation-card reveal reveal-delay-${Math.min(i + 1, 4)}">
          <div class="innovation-icon">
              <i class="fas fa-code"></i>
          </div>
          <div>
              <h3>${escapeHtml(inn.name)}</h3>
              ${paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('')}
              ${inn.url ? `<a class="innovation-link" href="${escapeHtml(inn.url)}" target="_blank" rel="noopener"><i class="fas fa-external-link-alt"></i> ${escapeHtml(inn.link_label || 'View Project')}</a>` : ''}
          </div>
      </div>
  `;
  }).join('');

  reobserveReveals();
}
