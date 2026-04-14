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
        
        // Find first record with ANY data
        var profileData = null;
        for (var i = 0; i < data.length; i++) {
            if (data[i].full_name || data[i].professional_title || data[i].introduction || data[i].about_me) {
                profileData = data[i];
                break;
            }
        }
        
        // If none have data, use the most recent
        if (!profileData) profileData = data[0];
        
        console.log('Using profile ID:', profileData.id, 'name:', profileData.full_name);
        
        // Update ALL fields (even empty)
        var fullNameEl = document.getElementById('full-name');
        var titleEl = document.getElementById('professional-title');
        var introEl = document.getElementById('introduction');
        var aboutEl = document.getElementById('about-me');
        var contactEl = document.getElementById('contact-info');
        
        if (fullNameEl) fullNameEl.innerText = profileData.full_name || 'Your Name';
        if (titleEl) titleEl.innerText = profileData.professional_title || 'Your Title';
        if (introEl) introEl.innerText = profileData.introduction || 'Your introduction goes here...';
        if (aboutEl) aboutEl.innerText = profileData.about_me || 'Your bio goes here...';
        if (contactEl) contactEl.innerText = profileData.contact_info || 'Your contact info goes here...';
        
        var statYears = document.getElementById('stat-years');
        var statProjects = document.getElementById('stat-projects');
        var statSuccess = document.getElementById('stat-success');
        
        if (statYears) statYears.innerText = profileData.stat_years || '10+';
        if (statProjects) statProjects.innerText = profileData.stat_projects || '50+';
        if (statSuccess) statSuccess.innerText = profileData.stat_success || '100%';
        
        var f1Title = document.getElementById('feature1-title');
        var f1Desc = document.getElementById('feature1-desc');
        var f2Title = document.getElementById('feature2-title');
        var f2Desc = document.getElementById('feature2-desc');
        var f3Title = document.getElementById('feature3-title');
        var f3Desc = document.getElementById('feature3-desc');
        
        if (f1Title) f1Title.innerText = profileData.feature1_title || 'Professional Growth';
        if (f1Desc) f1Desc.innerText = profileData.feature1_desc || 'Your description here...';
        if (f2Title) f2Title.innerText = profileData.feature2_title || 'Team Collaboration';
        if (f2Desc) f2Desc.innerText = profileData.feature2_desc || 'Your description here...';
        if (f3Title) f3Title.innerText = profileData.feature3_title || 'Innovation';
        if (f3Desc) f3Desc.innerText = profileData.feature3_desc || 'Your description here...';
        
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