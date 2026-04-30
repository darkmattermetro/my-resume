const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';

document.addEventListener('DOMContentLoaded', async function() {
    try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch(e) {
        console.log('Supabase init error:', e);
    }
    
    await loadProfileData();
    await loadDocsData();
    await loadExperience();
    await loadSkills();
    await loadCertifications();
    await loadAchievements();
    await loadEducation();
});

async function loadProfileData() {
    if (!window.supabaseClient) {
        console.log('Supabase not connected');
        return;
    }
    
    try {
        const { data, error } = await window.supabaseClient.from('profile').select('*').order('id', { ascending: false }).limit(5);
        console.log('Profile response:', data, error);
        
        if (error) {
            console.log('Error fetching profile:', error);
            return;
        }
        
        if (!data || data.length === 0) {
            console.log('No profile - showing defaults');
            return;
        }
        
        var profileData = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].full_name || data[i].professional_title || data[i].introduction || data[i].about_me) {
                profileData = data[i];
                break;
            }
        }
        
        if (!profileData) profileData = data[0];
        
        console.log('Using profile ID:', profileData.id, 'name:', profileData.full_name);
        
        document.getElementById('full-name').innerText = profileData.full_name || 'Your Name';
        document.getElementById('header-name').innerText = profileData.full_name || 'My Portfolio';
        document.getElementById('footer-name').innerText = (profileData.full_name || 'My') + "'s Portfolio";
        document.getElementById('professional-title').innerText = profileData.professional_title || 'Your Title';
        document.getElementById('introduction').innerText = profileData.introduction || 'Your introduction goes here...';
        document.getElementById('about-me').innerText = profileData.about_me || 'Your bio goes here...';
        document.getElementById('contact-info').innerText = profileData.contact_info || 'Your contact info goes here...';
        
        document.getElementById('stat-years').innerText = profileData.stat_years || '10+';
        document.getElementById('stat-projects').innerText = profileData.stat_projects || '50+';
        document.getElementById('stat-success').innerText = profileData.stat_success || '100%';
        
        document.getElementById('feature1-title').innerText = profileData.feature1_title || 'Professional Growth';
        document.getElementById('feature1-desc').innerText = profileData.feature1_desc || 'Your description here...';
        document.getElementById('feature2-title').innerText = profileData.feature2_title || 'Team Collaboration';
        document.getElementById('feature2-desc').innerText = profileData.feature2_desc || 'Your description here...';
        document.getElementById('feature3-title').innerText = profileData.feature3_title || 'Innovation';
        document.getElementById('feature3-desc').innerText = profileData.feature3_desc || 'Your description here...';
        
        if (profileData.profile_photo_url) document.getElementById('profile-img').src = profileData.profile_photo_url;
        if (profileData.banner_url) document.getElementById('banner-img').src = profileData.banner_url;
    } catch (err) {
        console.log('Profile load error:', err);
    }
}

async function loadDocsData() {
    if (!window.supabaseClient) return;
    
    const { data } = await window.supabaseClient.from('documents').select('*').order('created_at', { ascending: false });
    const grid = document.getElementById('docs-grid');
    
    if (!data || data.length === 0) {
        grid.innerHTML = '<p class="text-center text-slate-500 py-8">No documents uploaded yet.</p>';
        return;
    }
    
    grid.innerHTML = data.map(function(doc) {
        var icon = doc.url.toLowerCase().includes('.pdf') ? 'fa-file-pdf' : 'fa-file-image';
        return '<div class="p-5 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition" onclick="openViewer(\'' + doc.url + '\', \'' + doc.name + '\')">' +
            '<div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">' +
            '<i class="fas ' + icon + ' text-blue-600"></i></div>' +
            '<h3 class="font-bold text-slate-800">' + doc.name + '</h3>' +
            '<p class="text-sm text-slate-500">Click to view</p></div>';
    }).join('');
}

const modal = document.getElementById('viewer-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');

window.openViewer = function(url, name) {
    modalTitle.innerText = name;
    if (url.toLowerCase().includes('.pdf')) {
        modalContent.innerHTML = '<iframe src="' + url + '" class="w-full h-full rounded-lg" style="min-height:70vh"></iframe>';
    } else {
        modalContent.innerHTML = '<img src="' + url + '" class="max-w-full max-h-[70vh] rounded-lg">';
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

document.getElementById('close-modal').onclick = function() {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    modalContent.innerHTML = '';
};

modal.onclick = function(e) {
    if (e.target === modal) document.getElementById('close-modal').onclick();
};

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') document.getElementById('close-modal').onclick();
});

// Skill filter function for tabs
window.filterSkills = function(category) {
    // Update active tab
    document.querySelectorAll('.skill-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.category === category) tab.classList.add('active');
    });
    
    // Show/hide skills
    document.querySelectorAll('.skill-item').forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
};

// Load Work Experience
async function loadExperience() {
    if (!window.supabaseClient) return;
    const container = document.getElementById('experience-timeline');
    
    try {
        const { data, error } = await window.supabaseClient
            .from('work_experience')
            .select('*')
            .order('start_date', { ascending: false });
        
        if (error) {
            console.log('Experience load error:', error);
            return;
        }
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="text-center text-slate-500 py-8">No work experience added yet.</p>';
            return;
        }
        
        container.innerHTML = `
            <div class="timeline-line"></div>
            ${data.map(exp => `
                <div class="timeline-item">
                    <div class="timeline-dot ${exp.is_current ? 'current' : ''}"></div>
                    <div class="timeline-card">
                        <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                            <h3 class="font-bold text-lg text-metro-navy">${exp.role}</h3>
                            ${exp.is_current ? '<span class="current-badge">Current</span>' : ''}
                        </div>
                        <p class="text-metro-amber font-medium mb-1">${exp.company}</p>
                        <p class="text-sm text-slate-500 mb-3">
                            ${new Date(exp.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} - 
                            ${exp.is_current ? 'Present' : new Date(exp.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </p>
                        ${exp.description ? `<p class="text-slate-600">${exp.description}</p>` : ''}
                    </div>
                </div>
            `).join('')}
        `;
    } catch (err) {
        console.log('Experience load error:', err);
    }
}

// Load Skills
async function loadSkills() {
    if (!window.supabaseClient) return;
    const container = document.getElementById('skills-container');
    
    try {
        const { data, error } = await window.supabaseClient
            .from('skills')
            .select('*')
            .order('category', { ascending: true });
        
        if (error) {
            console.log('Skills load error:', error);
            return;
        }
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="text-center text-slate-500 py-8">No skills added yet.</p>';
            return;
        }
        
        container.innerHTML = data.map(skill => `
            <div class="skill-item" data-category="${skill.category}">
                <div class="skill-header">
                    <span class="skill-name">${skill.name}</span>
                    <span class="skill-level">${skill.level}/5</span>
                </div>
                <div class="skill-bar-bg">
                    <div class="skill-bar-fill" style="width: ${(skill.level / 5) * 100}%"></div>
                </div>
            </div>
        `).join('');
        
        // Trigger animation after load
        setTimeout(() => {
            document.querySelectorAll('.skill-bar-fill').forEach(bar => {
                bar.style.width = bar.style.width;
            });
        }, 100);
    } catch (err) {
        console.log('Skills load error:', err);
    }
}

// Load Certifications
async function loadCertifications() {
    if (!window.supabaseClient) return;
    const container = document.getElementById('certifications-grid');
    
    try {
        const { data, error } = await window.supabaseClient
            .from('certifications')
            .select('*')
            .order('date_earned', { ascending: false });
        
        if (error) {
            console.log('Certifications load error:', error);
            return;
        }
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="text-center text-slate-500 py-8 col-span-full">No certifications added yet.</p>';
            return;
        }
        
        container.innerHTML = data.map(cert => {
            const isExpired = cert.expiry_date && new Date(cert.expiry_date) < new Date();
            const expiryText = cert.expiry_date ? 
                `Expires: ${new Date(cert.expiry_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : 
                'No Expiry';
            
            return `
                <div class="cert-badge">
                    <h3 class="font-bold text-metro-navy mb-1">${cert.name}</h3>
                    <p class="text-metro-amber text-sm font-medium mb-2">${cert.issuer}</p>
                    <p class="text-sm text-slate-500 mb-2">
                        Earned: ${new Date(cert.date_earned).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </p>
                    ${cert.certificate_url ? `
                        <a href="${cert.certificate_url}" target="_blank" class="text-sm text-metro-amber hover:underline">
                            <i class="fas fa-external-link-alt mr-1"></i> View Certificate
                        </a>
                    ` : ''}
                    <div class="cert-expiry ${isExpired ? 'expired' : 'valid'}">
                        ${isExpired ? '<i class="fas fa-exclamation-circle mr-1"></i> Expired' : '<i class="fas fa-check-circle mr-1"></i>'} ${expiryText}
                    </div>
                </div>
            `;
        }).join('');
    } catch (err) {
        console.log('Certifications load error:', err);
    }
}

// Load Achievements
async function loadAchievements() {
    if (!window.supabaseClient) return;
    const container = document.getElementById('achievements-grid');
    
    try {
        const { data, error } = await window.supabaseClient
            .from('achievements')
            .select('*')
            .order('date', { ascending: false });
        
        if (error) {
            console.log('Achievements load error:', error);
            return;
        }
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="text-center text-slate-500 py-8 col-span-full">No achievements added yet.</p>';
            return;
        }
        
        container.innerHTML = data.map(ach => `
            <div class="achievement-card achievement-gold">
                <div class="achievement-icon">
                    <i class="fas ${ach.icon || 'fa-trophy'}"></i>
                </div>
                <h3 class="font-bold text-metro-navy mb-2">${ach.title}</h3>
                ${ach.description ? `<p class="text-slate-600 text-sm mb-3">${ach.description}</p>` : ''}
                <p class="text-sm text-slate-500">
                    <i class="fas fa-calendar-alt mr-1"></i> ${new Date(ach.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </p>
            </div>
        `).join('');
    } catch (err) {
        console.log('Achievements load error:', err);
    }
}

// Load Education
async function loadEducation() {
    if (!window.supabaseClient) return;
    const container = document.getElementById('education-grid');
    
    try {
        const { data, error } = await window.supabaseClient
            .from('education')
            .select('*')
            .order('year', { ascending: false });
        
        if (error) {
            console.log('Education load error:', error);
            return;
        }
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="text-center text-slate-500 py-8 col-span-full">No education entries added yet.</p>';
            return;
        }
        
        container.innerHTML = data.map(edu => `
            <div class="education-card">
                <h3 class="font-bold text-metro-navy mb-1">${edu.degree}</h3>
                ${edu.field ? `<p class="text-metro-amber text-sm font-medium mb-2">${edu.field}</p>` : ''}
                <p class="text-slate-600 mb-2">${edu.institution}</p>
                <p class="text-sm text-slate-500">
                    <i class="fas fa-calendar mr-1"></i> ${edu.year}
                </p>
            </div>
        `).join('');
    } catch (err) {
        console.log('Education load error:', err);
    }
}