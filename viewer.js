const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    await loadProfile();
    await loadDocs();
});

async function loadProfile() {
    const { data, error } = await supabase.from('profile').select('*').maybeSingle();
    console.log('Profile:', data, error);

    if (!data) {
        console.log('No profile data - showing defaults');
        return;
    }

    if (data.full_name) document.getElementById('full-name').innerText = data.full_name;
    if (data.professional_title) document.getElementById('professional-title').innerText = data.professional_title;
    if (data.introduction) document.getElementById('introduction').innerText = data.introduction;
    if (data.about_me) document.getElementById('about-me').innerText = data.about_me;
    if (data.contact_info) document.getElementById('contact-info').innerText = data.contact_info;
    
    if (data.stat_years) document.getElementById('stat-years').innerText = data.stat_years;
    if (data.stat_projects) document.getElementById('stat-projects').innerText = data.stat_projects;
    if (data.stat_success) document.getElementById('stat-success').innerText = data.stat_success;
    
    if (data.feature1_title) document.getElementById('feature1-title').innerText = data.feature1_title;
    if (data.feature1_desc) document.getElementById('feature1-desc').innerText = data.feature1_desc;
    if (data.feature2_title) document.getElementById('feature2-title').innerText = data.feature2_title;
    if (data.feature2_desc) document.getElementById('feature2-desc').innerText = data.feature2_desc;
    if (data.feature3_title) document.getElementById('feature3-title').innerText = data.feature3_title;
    if (data.feature3_desc) document.getElementById('feature3-desc').innerText = data.feature3_desc;
    
    if (data.profile_photo_url) document.getElementById('profile-img').src = data.profile_photo_url;
    if (data.banner_url) document.getElementById('banner-img').src = data.banner_url;
}

async function loadDocs() {
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    const grid = document.getElementById('docs-grid');
    
    if (!data || data.length === 0) {
        grid.innerHTML = '<p class="text-center text-slate-500 py-8">No documents uploaded yet.</p>';
        return;
    }

    grid.innerHTML = data.map(doc => `
        <div class="p-5 bg-white rounded-xl shadow-sm cursor-pointer hover:shadow-md transition" onclick="openViewer('${doc.url}', '${doc.name}')">
            <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <i class="fas ${doc.url.toLowerCase().includes('.pdf') ? 'fa-file-pdf' : 'fa-file-image'} text-blue-600"></i>
            </div>
            <h3 class="font-bold text-slate-800">${doc.name}</h3>
            <p class="text-sm text-slate-500">Click to view</p>
        </div>
    `).join('');
}

// Modal
const modal = document.getElementById('viewer-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');

window.openViewer = (url, name) => {
    modalTitle.innerText = name;
    if (url.toLowerCase().includes('.pdf')) {
        modalContent.innerHTML = '<iframe src="' + url + '" class="w-full h-full rounded-lg" style="min-height:70vh"></iframe>';
    } else {
        modalContent.innerHTML = '<img src="' + url + '" class="max-w-full max-h-[70vh] rounded-lg">';
    }
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
};

document.getElementById('close-modal').onclick = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    modalContent.innerHTML = '';
};

modal.onclick = (e) => {
    if (e.target === modal) document.getElementById('close-modal').onclick();
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.getElementById('close-modal').onclick();
});