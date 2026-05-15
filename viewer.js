const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';

const DEFAULT_RESUME = {
    profile: {
        full_name: 'Mohit Kumar',
        professional_title: 'Senior Traffic Controller | Railway Operations Professional',
        introduction: 'Strategic Railway Operations Professional with over 8 years of experience at Delhi Metro Rail Corporation (DMRC). Expert in high-density metro operations, specializing in GoA4 (Unattended Train Operation) and CBTC signaling systems. Currently transitioning into the Senior Traffic Controller role at the Operations Control Centre (OCC) for Line 7 (Pink Circular Line). MBA candidate focusing on Finance and HR to bridge technical expertise with corporate leadership.',
        about_me: 'Dedicated railway operations professional with a proven track record in duty roster management, crew control, and operational resource optimization. Committed to maintaining the highest safety and efficiency standards for the global rail industry. MBA candidate bridging technical railway expertise with corporate leadership and financial acumen.',
        contact_info: 'New Delhi, India | 8010787840 | mohit2210kumar@gmail.com',
        stat_years: '8+',
        stat_projects: '3 Lines',
        stat_success: '100%',
        feature1_title: 'GoA4 & CBTC Expert',
        feature1_desc: 'Specialist in Unattended Train Operation and Communications-Based Train Control signaling systems for high-density metro lines.',
        feature2_title: 'Safety & Compliance',
        feature2_desc: '100% safety record with expertise in emergency coordination, degraded mode operations, and system fault recovery protocols.',
        feature3_title: 'Digital Innovation',
        feature3_desc: 'Built custom full-stack tools using Google Apps Script and JS to automate crew scheduling, reducing manual processing time by over 60%.'
    },
    competencies: [
        { name: 'GoA4 / UTO Operations', category: 'Operations' },
        { name: 'CBTC Signaling Logic', category: 'Operations' },
        { name: 'ATS / ATR Management', category: 'Operations' },
        { name: 'Emergency Coordination', category: 'Safety' },
        { name: 'Degraded Mode Protocols', category: 'Safety' },
        { name: 'Safety Audits & Compliance', category: 'Safety' },
        { name: 'Revenue Management', category: 'Finance' },
        { name: 'Balance Sheet Auditing', category: 'Finance' },
        { name: 'Duty Roster Optimization', category: 'Management' },
        { name: 'Crew Control & Dispatch', category: 'Management' }
    ],
    experience: [
        {
            role: 'Senior Traffic Controller (OCC - In Training)',
            company: 'Delhi Metro Rail Corporation (DMRC) - Line 7',
            start_date: '2026-05-01',
            end_date: null,
            is_current: true,
            description: 'Managing real-time train movements on the highly automated GoA4 Pink Circular Line.\nMonitoring Automatic Train Supervision (ATS) and ATR systems to ensure headway adherence.\nCoordinating recovery protocols for system faults, including remote resets and degraded mode transitions.\nLiaising with maintenance and station departments for safe track access and system isolation.'
        },
        {
            role: 'Operations Management Specialist (Roster & Crew Control)',
            company: 'Delhi Metro Rail Corporation (DMRC)',
            start_date: '2018-01-01',
            end_date: '2026-05-01',
            is_current: false,
            description: 'Spearheaded duty roster management for mainline crew, ensuring 100% coverage and regulatory compliance.\nDeveloped custom digital tools using Google Apps Script and JS to automate complex duty assignment mapping.\nOptimized station matching logic for train loop verification, reducing manual processing time by over 60%.\nCommanded mainline train operations in a CBTC environment with a 100% safety record.\nManaged onboard systems and manual overrides during technical faults to maintain service continuity.'
        },
        {
            role: 'Station Controller',
            company: 'Delhi Metro Rail Corporation (DMRC) - Line 7',
            start_date: '2013-01-01',
            end_date: '2018-01-01',
            is_current: false,
            description: 'Directed daily station operations, security coordination, and facility maintenance for high-footfall metro stations.\nManaged station revenue accounts and daily balance sheets, ensuring 100% accuracy in cash and digital transaction audits.\nLed public-facing operations, resolving passenger grievances and managing crowd control during peak hours.'
        }
    ],
    education: [
        { institution: 'SVSU, Meerut, UP', degree: 'Master of Business Administration', field: 'Finance & HR', year: 2027, is_current: true },
        { institution: 'MAIT, Delhi', degree: 'Bachelor of Technology', field: 'Electronics and Communications', year: 2015, is_current: false },
        { institution: 'SVSU / IGNOU', degree: 'Master/Bachelor in Library Science & PGDCA', field: 'Library Science & Computer Applications', year: 2021, is_current: false }
    ],
    certifications: [
        { name: 'CIRO Affiliate Membership', issuer: 'Chartered Institution of Railway Operators (CIRO), UK', date_earned: '2024-01-01', expiry_date: null, certificate_url: null },
        { name: 'OCC Operations Technical Training', issuer: 'Delhi Metro Rail Corporation (DMRC)', date_earned: '2026-05-01', expiry_date: null, certificate_url: null }
    ],
    achievements: [
        { title: 'Digital Transformation in Crew Scheduling', description: 'Developed custom digital tools that automated duty assignment mapping, reducing manual processing time by over 60%', date: '2024-06-01', icon: 'fa-trophy' },
        { title: '100% Safety Record', description: 'Commanded mainline train operations with a flawless safety record over 8+ years', date: '2026-01-01', icon: 'fa-shield-alt' }
    ],
    technical_innovation: [
        { name: 'Digital Roster Tool', description: 'Developed a full-stack web application integrated with Supabase to manage DMRC duty cycles. Features include automated Left/Right file processing, station-specific directional logic, and an admin panel for real-time monitoring.', url: 'https://darkmattermetro.github.io/Webbased-Tripchart/' }
    ],
    memberships: [
        { name: 'Affiliate Member', organization: 'Chartered Institution of Railway Operators (CIRO), UK', description: 'Professional membership recognizing expertise in railway operations and commitment to industry standards.' },
        { name: 'OCC Operations Technical Training', organization: 'Delhi Metro Rail Corporation (DMRC)', description: 'Technical training certification for Operations Control Centre procedures (In Progress).' }
    ],
    documents: []
};

let resumeData = JSON.parse(JSON.stringify(DEFAULT_RESUME));

document.addEventListener('DOMContentLoaded', async function () {
    try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch (e) {
        console.log('Supabase init error:', e);
    }
    await Promise.all([
        loadProfileData(),
        loadDocsData(),
        loadExperience(),
        loadSkills(),
        loadCertifications(),
        loadAchievements(),
        loadEducation(),
        loadCompetencies(),
        loadTechnicalInnovation(),
        loadMemberships()
    ]);
    // Add reveal to sections for scroll animation
    document.querySelectorAll('.resume-section').forEach((section, i) => {
        section.classList.add('reveal');
        if (i > 0) section.style.transitionDelay = (i * 0.05) + 's';
    });
    initScrollReveal();
    initSkillBarObserver();
});

function applyProfileToDOM(d) {
    const setText = (id, fallback) => { const el = document.getElementById(id); if (el) el.innerText = d[id] || fallback; };
    setText('full-name', d.full_name || 'Your Name');
    setText('header-name', d.full_name || 'My Portfolio');
    setText('footer-name', (d.full_name || 'My') + "'s Portfolio");
    setText('professional-title', d.professional_title || 'Your Title');
    setText('introduction', d.introduction || '');
    setText('about-me', d.about_me || '');
    setText('contact-info', d.contact_info || '');
    setText('stat-years', d.stat_years || '8+');
    setText('stat-projects', d.stat_projects || '3');
    setText('stat-success', d.stat_success || '100%');
    setText('feature1-title', d.feature1_title || 'GoA4 & CBTC Expert');
    setText('feature1-desc', d.feature1_desc || '');
    setText('feature2-title', d.feature2_title || 'Safety & Compliance');
    setText('feature2-desc', d.feature2_desc || '');
    setText('feature3-title', d.feature3_title || 'Digital Innovation');
    setText('feature3-desc', d.feature3_desc || '');
    if (d.profile_photo_url) document.getElementById('profile-img').src = d.profile_photo_url;
}

async function loadProfileData() {
    if (!window.supabaseClient) { applyProfileToDOM(DEFAULT_RESUME.profile); return; }
    try {
        const { data } = await window.supabaseClient.from('profile').select('*').order('id', { ascending: false }).limit(5);
        if (!data || data.length === 0) { applyProfileToDOM(DEFAULT_RESUME.profile); return; }
        let p = data.find(d => d.full_name || d.professional_title) || data[0];
        applyProfileToDOM(p);
    } catch (err) {
        applyProfileToDOM(DEFAULT_RESUME.profile);
    }
}

async function loadDocsData() {
    if (!window.supabaseClient) { renderDocs(DEFAULT_RESUME.documents); return; }
    try {
        const { data } = await window.supabaseClient.from('documents').select('*').order('created_at', { ascending: false });
        renderDocs(data || []);
    } catch (e) { renderDocs([]); }
}

function renderDocs(data) {
    const grid = document.getElementById('docs-grid');
    if (!data || data.length === 0) {
        grid.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">No documents uploaded yet.</p>';
        return;
    }
    grid.innerHTML = data.map(function (doc, i) {
        var icon = (doc.url || '').toLowerCase().includes('.pdf') ? 'fa-file-pdf' : 'fa-file-image';
        return '<div class="doc-card reveal reveal-delay-' + Math.min(i, 4) + '" onclick="openViewer(\'' + doc.url + '\', \'' + doc.name + '\')">' +
            '<div class="doc-icon"><i class="fas ' + icon + '"></i></div>' +
            '<h3>' + doc.name + '</h3>' +
            '<p>Click to view</p></div>';
    }).join('');
}

const modal = document.getElementById('viewer-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');

window.openViewer = function (url, name) {
    modalTitle.innerText = name;
    if (url.toLowerCase().includes('.pdf')) {
        modalContent.innerHTML = '<iframe src="' + url + '" class="w-full h-full rounded-lg" style="min-height:70vh"></iframe>';
    } else {
        modalContent.innerHTML = '<img src="' + url + '" class="max-w-full max-h-[70vh] rounded-lg">';
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

document.getElementById('close-modal').onclick = function () {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    modalContent.innerHTML = '';
};

modal.onclick = function (e) {
    if (e.target === modal) document.getElementById('close-modal').onclick();
};

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') document.getElementById('close-modal').onclick();
});

window.filterSkills = function (category) {
    document.querySelectorAll('.skill-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) tab.classList.add('active');
    });
    document.querySelectorAll('.skill-item').forEach(item => {
        item.style.display = (category === 'all' || item.dataset.category === category) ? 'block' : 'none';
    });
};

async function loadExperience() {
    const container = document.getElementById('experience-timeline');
    if (!container) return;
    if (!window.supabaseClient) { renderExperience(DEFAULT_RESUME.experience); return; }
    try {
        const { data } = await window.supabaseClient.from('work_experience').select('*').order('start_date', { ascending: false });
        renderExperience(data && data.length ? data : DEFAULT_RESUME.experience);
    } catch (e) { renderExperience(DEFAULT_RESUME.experience); }
}

function renderExperience(data) {
    const container = document.getElementById('experience-timeline');
    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">No work experience added yet.</p>';
        return;
    }
    container.innerHTML = `
        <div class="timeline-line"></div>
        ${data.map((exp, i) => {
            const start = new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const end = exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            const bullets = (exp.description || '').split('\n').filter(Boolean);
            return `
                <div class="timeline-item reveal reveal-delay-${Math.min(i, 4)}">
                    <div class="timeline-dot ${exp.is_current ? 'current' : ''}"></div>
                    <div class="timeline-card">
                        <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;margin-bottom:8px;">
                            <h3>${exp.role}</h3>
                            ${exp.is_current ? '<span class="current-badge">Current</span>' : ''}
                        </div>
                        <p class="timeline-company">${exp.company}</p>
                        <p class="timeline-date">${start} — ${end}</p>
                        ${bullets.length ? bullets.map(b => `<p class="timeline-bullet"><i class="fas fa-circle"></i>${b}</p>`).join('') : ''}
                    </div>
                </div>
            `;
        }).join('')}
    `;
    reobserveReveals();
}

async function loadSkills() {
    const container = document.getElementById('skills-container');
    if (!container) return;
    if (!window.supabaseClient) { renderSkills(DEFAULT_RESUME.competencies); return; }
    try {
        const { data } = await window.supabaseClient.from('skills').select('*').order('category', { ascending: true });
        renderSkills(data && data.length ? data : DEFAULT_RESUME.competencies);
    } catch (e) { renderSkills(DEFAULT_RESUME.competencies); }
}

function renderSkills(data) {
    const container = document.getElementById('skills-container');
    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-center text-slate-500 py-8">No skills added yet.</p>';
        return;
    }
    container.innerHTML = data.map(skill => {
        const lvl = skill.level || 4;
        return `
            <div class="skill-item" data-category="${skill.category}">
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-category-badge">${skill.category}</span>
                </div>
                <div class="skill-bar-bg">
                    <div class="skill-bar-fill" style="width: ${(lvl / 5) * 100}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

async function loadCertifications() {
    const container = document.getElementById('certifications-grid');
    if (!container) return;
    if (!window.supabaseClient) { renderCertifications(DEFAULT_RESUME.certifications); return; }
    try {
        const { data } = await window.supabaseClient.from('certifications').select('*').order('date_earned', { ascending: false });
        renderCertifications(data && data.length ? data : DEFAULT_RESUME.certifications);
    } catch (e) { renderCertifications(DEFAULT_RESUME.certifications); }
}

function renderCertifications(data) {
    const container = document.getElementById('certifications-grid');
    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">No certifications added yet.</p>';
        return;
    }
    container.innerHTML = data.map((cert, i) => {
        const isExpired = cert.expiry_date && new Date(cert.expiry_date) < new Date();
        const expiryText = cert.expiry_date ? `Expires: ${new Date(cert.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 'No Expiry';
        return `
            <div class="cert-card reveal reveal-delay-${Math.min(i, 4)}">
                <h3>${cert.name}</h3>
                <p class="cert-issuer">${cert.issuer}</p>
                <p class="cert-date"><i class="fas fa-calendar-alt"></i> ${new Date(cert.date_earned).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
                ${cert.certificate_url ? `<p style="margin-bottom:8px;"><a href="${cert.certificate_url}" target="_blank" style="color:#1a5276;font-size:13px;"><i class="fas fa-external-link-alt"></i> View Certificate</a></p>` : ''}
                <span class="cert-status ${isExpired ? 'expired' : 'valid'}">
                    ${isExpired ? '<i class="fas fa-exclamation-circle"></i> Expired' : '<i class="fas fa-check-circle"></i> Active'} — ${expiryText}
                </span>
            </div>
        `;
    }).join('');
}

async function loadAchievements() {
    const container = document.getElementById('achievements-grid');
    if (!container) return;
    if (!window.supabaseClient) { renderAchievements(DEFAULT_RESUME.achievements); return; }
    try {
        const { data } = await window.supabaseClient.from('achievements').select('*').order('date', { ascending: false });
        renderAchievements(data && data.length ? data : DEFAULT_RESUME.achievements);
    } catch (e) { renderAchievements(DEFAULT_RESUME.achievements); }
}

function renderAchievements(data) {
    const container = document.getElementById('achievements-grid');
    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">No achievements added yet.</p>';
        return;
    }
    container.innerHTML = data.map((ach, i) => `
        <div class="achievement-card reveal reveal-delay-${Math.min(i, 4)}">
            <div class="achievement-icon">
                <i class="fas ${ach.icon || 'fa-trophy'}"></i>
            </div>
            <h3>${ach.title}</h3>
            ${ach.description ? `<p>${ach.description}</p>` : ''}
            <p class="achievement-date"><i class="fas fa-calendar-alt"></i> ${new Date(ach.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
        </div>
    `).join('');
}

async function loadEducation() {
    const container = document.getElementById('education-grid');
    if (!container) return;
    if (!window.supabaseClient) { renderEducation(DEFAULT_RESUME.education); return; }
    try {
        const { data } = await window.supabaseClient.from('education').select('*').order('year', { ascending: false });
        renderEducation(data && data.length ? data : DEFAULT_RESUME.education);
    } catch (e) { renderEducation(DEFAULT_RESUME.education); }
}

function renderEducation(data) {
    const container = document.getElementById('education-grid');
    if (!data || data.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:#888;padding:32px 0;">No education entries added yet.</p>';
        return;
    }
    container.innerHTML = data.map((edu, i) => `
        <div class="edu-card reveal reveal-delay-${Math.min(i, 4)}">
            <div class="edu-icon">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <h3>${edu.degree}</h3>
            ${edu.field ? `<p class="edu-field">${edu.field}</p>` : ''}
            <p class="edu-institution">${edu.institution}</p>
            <p class="edu-year"><i class="fas fa-calendar"></i> ${edu.year}${edu.is_current ? ' (Expected)' : ''}</p>
        </div>
    `).join('');
}

async function loadCompetencies() {
    const container = document.getElementById('competencies-grid');
    if (!container) return;
    const data = DEFAULT_RESUME.competencies;
    const categories = [...new Set(data.map(c => c.category))];
    container.innerHTML = categories.map((cat, i) => `
        <div class="competency-group reveal reveal-delay-${Math.min(i, 4)}">
            <h3 class="competency-category">${cat}</h3>
            <div class="competency-items">
                ${data.filter(c => c.category === cat).map(c => `
                    <div class="competency-chip">
                        <i class="fas fa-check-circle"></i>
                        ${c.name}
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

async function loadTechnicalInnovation() {
    const container = document.getElementById('innovation-container');
    if (!container) return;
    const data = DEFAULT_RESUME.technical_innovation;
    if (!data || data.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = data.map((inn, i) => `
        <div class="innovation-card reveal reveal-delay-1">
            <div class="innovation-icon">
                <i class="fas fa-code"></i>
            </div>
            <div>
                <h3>${inn.name}</h3>
                <p>${inn.description}</p>
                ${inn.url ? `<a href="${inn.url}" target="_blank" style="display:inline-block;margin-top:10px;color:#1a5276;font-weight:500;"><i class="fas fa-external-link-alt"></i> View Project</a>` : ''}
            </div>
        </div>
    `).join('');
}

async function loadMemberships() {
    const container = document.getElementById('memberships-container');
    if (!container) return;
    const data = DEFAULT_RESUME.memberships;
    if (!data || data.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = data.map((m, i) => `
        <div class="membership-card reveal reveal-delay-${Math.min(i + 1, 5)}">
            <div class="membership-icon">
                <i class="fas fa-id-card"></i>
            </div>
            <div>
                <h3>${m.name}</h3>
                <p class="membership-org">${m.organization}</p>
                <p class="membership-desc">${m.description}</p>
            </div>
        </div>
    `).join('');
}

// ==================== SCROLL ANIMATIONS ====================
let revealObserver = null;

function initScrollReveal() {
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

function observeReveals() {
    if (!revealObserver) return;
    document.querySelectorAll('.reveal:not(.active)').forEach(el => revealObserver.observe(el));
}

function reobserveReveals() {
    if (!revealObserver) return;
    document.querySelectorAll('.reveal:not(.active)').forEach(el => revealObserver.observe(el));
}

function initSkillBarObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.dataset.width || bar.style.width;
                bar.style.width = '0';
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        bar.style.width = width;
                    });
                });
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    document.querySelectorAll('.skill-bar-fill').forEach(bar => {
        if (!bar.dataset.width) bar.dataset.width = bar.style.width;
        bar.style.width = '0';
        observer.observe(bar);
    });
    
    document.querySelectorAll('.skill-item').forEach(item => {
        observer.observe(item);
    });
}
