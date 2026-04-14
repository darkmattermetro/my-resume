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