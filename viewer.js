const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';

let supabaseClient;
try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('Supabase client initialized');
} catch (e) {
    console.error('Supabase init failed:', e);
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Page loaded, fetching data...');
    
    if (supabaseClient) {
        await fetchProfile();
        await fetchDocuments();
    }
});

async function fetchProfile() {
    try {
        console.log('Fetching profile...');
        const { data, error } = await supabaseClient
            .from('profile')
            .select('*')
            .limit(1)
            .maybeSingle();

        console.log('Profile data:', data);
        console.log('Profile error:', error);

        if (data) {
            // Basic Info
            if (data.full_name) document.getElementById('full-name').innerText = data.full_name;
            if (data.professional_title) document.getElementById('professional-title').innerText = data.professional_title;
            if (data.introduction) document.getElementById('introduction').innerText = data.introduction;
            if (data.about_me) document.getElementById('about-me').innerText = data.about_me;
            if (data.contact_info) document.getElementById('contact-info').innerText = data.contact_info;
            
            // Stats
            if (data.stat_years) document.getElementById('stat-years').innerText = data.stat_years;
            if (data.stat_projects) document.getElementById('stat-projects').innerText = data.stat_projects;
            if (data.stat_success) document.getElementById('stat-success').innerText = data.stat_success;
            
            // Feature 1
            if (data.feature1_title) document.getElementById('feature1-title').innerText = data.feature1_title;
            if (data.feature1_desc) document.getElementById('feature1-desc').innerText = data.feature1_desc;
            
            // Feature 2
            if (data.feature2_title) document.getElementById('feature2-title').innerText = data.feature2_title;
            if (data.feature2_desc) document.getElementById('feature2-desc').innerText = data.feature2_desc;
            
            // Feature 3
            if (data.feature3_title) document.getElementById('feature3-title').innerText = data.feature3_title;
            if (data.feature3_desc) document.getElementById('feature3-desc').innerText = data.feature3_desc;
            
            // Images
            if (data.profile_photo_url) {
                document.getElementById('profile-img').src = data.profile_photo_url;
            }
            if (data.banner_url) {
                document.getElementById('banner-img').src = data.banner_url;
            }
            
            console.log('Profile updated successfully');
        } else {
            console.log('No profile data found');
        }
    } catch (e) {
        console.error('Error in fetchProfile:', e);
    }
}

async function fetchDocuments() {
    try {
        console.log('Fetching documents...');
        const { data, error } = await supabaseClient
            .from('documents')
            .select('*')
            .order('created_at', { ascending: false });

        console.log('Documents data:', data);
        console.log('Documents error:', error);

        const grid = document.getElementById('docs-grid');
        
        if (!data || data.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <i class="fas fa-folder-open text-4xl text-slate-300 mb-4"></i>
                    <p class="text-slate-500">No documents uploaded yet.</p>
                </div>`;
            return;
        }

        grid.innerHTML = data.map(doc => `
            <div class="doc-card p-5 rounded-2xl shadow-sm" onclick="openViewer('${doc.url}', '${doc.name}')">
                <div class="flex items-start justify-between mb-3">
                    <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <i class="fas ${doc.url.toLowerCase().includes('.pdf') ? 'fa-file-pdf' : 'fa-file-image'} text-blue-600 text-lg"></i>
                    </div>
                    <span class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                        ${doc.url.split('.').pop().toUpperCase()}
                    </span>
                </div>
                <h3 class="font-bold text-base mb-1 text-slate-800">${doc.name}</h3>
                <p class="text-sm text-slate-500">Click to view</p>
            </div>
        `).join('');
        
        console.log('Documents updated successfully');
    } catch (e) {
        console.error('Error in fetchDocuments:', e);
    }
}

// Viewer Modal Logic
const modal = document.getElementById('viewer-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');

window.openViewer = (url, name) => {
    modalTitle.innerText = name;
    modalContent.innerHTML = '';
    
    if (url.toLowerCase().includes('.pdf')) {
        modalContent.innerHTML = `<iframe src="${url}" class="w-full h-full rounded-lg border-none bg-white" style="min-height: 70vh;"></iframe>`;
    } else {
        modalContent.innerHTML = `<img src="${url}" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-xl mx-auto">`;
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
    if (e.target === modal) {
        document.getElementById('close-modal').onclick();
    }
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        document.getElementById('close-modal').onclick();
    }
});
