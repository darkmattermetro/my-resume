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
        const { data, error } = await window.supabaseClient.from('profile').select('*').limit(1);
        console.log('Profile response:', data, error);
        
        if (error) {
            console.log('Error fetching profile:', error);
            return;
        }
        
        if (!data || data.length === 0) {
            console.log('No profile - showing defaults');
            return;
        }
        
        var profileData = data[0];
        
        if (profileData.full_name) document.getElementById('full-name').innerText = profileData.full_name;
        if (profileData.professional_title) document.getElementById('professional-title').innerText = profileData.professional_title;
        if (profileData.introduction) document.getElementById('introduction').innerText = profileData.introduction;
        if (profileData.about_me) document.getElementById('about-me').innerText = profileData.about_me;
        if (profileData.contact_info) document.getElementById('contact-info').innerText = profileData.contact_info;
        
        if (profileData.stat_years) document.getElementById('stat-years').innerText = profileData.stat_years;
        if (profileData.stat_projects) document.getElementById('stat-projects').innerText = profileData.stat_projects;
        if (profileData.stat_success) document.getElementById('stat-success').innerText = profileData.stat_success;
        
        if (profileData.feature1_title) document.getElementById('feature1-title').innerText = profileData.feature1_title;
        if (profileData.feature1_desc) document.getElementById('feature1-desc').innerText = profileData.feature1_desc;
        if (profileData.feature2_title) document.getElementById('feature2-title').innerText = profileData.feature2_title;
        if (profileData.feature2_desc) document.getElementById('feature2-desc').innerText = profileData.feature2_desc;
        if (profileData.feature3_title) document.getElementById('feature3-title').innerText = profileData.feature3_title;
        if (profileData.feature3_desc) document.getElementById('feature3-desc').innerText = profileData.feature3_desc;
        
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