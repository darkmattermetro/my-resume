const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';
const ADMIN_PASSWORD = 'admin123';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadProfile();
    loadDocs();
});

function initAuth() {
    const loginBtn = document.getElementById('login-btn');
    const passInput = document.getElementById('admin-pass');
    const overlay = document.getElementById('login-overlay');
    const content = document.getElementById('admin-content');
    const errorMsg = document.getElementById('login-error');

    loginBtn.onclick = () => {
        if (passInput.value === ADMIN_PASSWORD) {
            overlay.classList.add('hidden');
            content.classList.remove('hidden');
            localStorage.setItem('resume_admin', 'true');
        } else {
            errorMsg.classList.remove('hidden');
            passInput.value = '';
        }
    };

    if (localStorage.getItem('resume_admin') === 'true') {
        overlay.classList.add('hidden');
        content.classList.remove('hidden');
    }

    document.getElementById('logout-btn').onclick = () => {
        localStorage.removeItem('resume_admin');
        location.reload();
    };
}

async function loadProfile() {
    const { data, error } = await supabase.from('profile').select('*').maybeSingle();
    
    if (data) {
        document.getElementById('input-full-name').value = data.full_name || '';
        document.getElementById('input-title').value = data.professional_title || '';
        document.getElementById('input-intro').value = data.introduction || '';
        document.getElementById('input-about').value = data.about_me || '';
        document.getElementById('input-contact').value = data.contact_info || '';
        document.getElementById('input-stat-years').value = data.stat_years || '';
        document.getElementById('input-stat-projects').value = data.stat_projects || '';
        document.getElementById('input-stat-success').value = data.stat_success || '';
        document.getElementById('input-feature1-title').value = data.feature1_title || '';
        document.getElementById('input-feature1-desc').value = data.feature1_desc || '';
        document.getElementById('input-feature2-title').value = data.feature2_title || '';
        document.getElementById('input-feature2-desc').value = data.feature2_desc || '';
        document.getElementById('input-feature3-title').value = data.feature3_title || '';
        document.getElementById('input-feature3-desc').value = data.feature3_desc || '';
        
        if (data.profile_photo_url) document.getElementById('current-photo').src = data.profile_photo_url;
        if (data.banner_url) document.getElementById('current-banner').src = data.banner_url;
    }
    console.log('Loaded profile:', data);
}

document.getElementById('save-profile-btn').onclick = async () => {
    const btn = document.getElementById('save-profile-btn');
    btn.innerText = 'Saving...';
    btn.disabled = true;

    const data = {
        full_name: document.getElementById('input-full-name').value,
        professional_title: document.getElementById('input-title').value,
        introduction: document.getElementById('input-intro').value,
        about_me: document.getElementById('input-about').value,
        contact_info: document.getElementById('input-contact').value,
        stat_years: document.getElementById('input-stat-years').value,
        stat_projects: document.getElementById('input-stat-projects').value,
        stat_success: document.getElementById('input-stat-success').value,
        feature1_title: document.getElementById('input-feature1-title').value,
        feature1_desc: document.getElementById('input-feature1-desc').value,
        feature2_title: document.getElementById('input-feature2-title').value,
        feature2_desc: document.getElementById('input-feature2-desc').value,
        feature3_title: document.getElementById('input-feature3-title').value,
        feature3_desc: document.getElementById('input-feature3-desc').value
    };

    // Check if profile exists
    const existing = await supabase.from('profile').select('id').maybeSingle();
    
    let result;
    if (existing && existing.id) {
        result = await supabase.from('profile').update(data).eq('id', existing.id);
    } else {
        result = await supabase.from('profile').insert([data]);
    }

    if (result.error) {
        alert('ERROR: ' + result.error.message);
    } else {
        alert('SUCCESS: Profile saved! Check your website now.');
    }

    btn.innerText = 'Save Changes';
    btn.disabled = false;
};

// Banner Upload
document.getElementById('banner-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const btn = e.target.nextElementSibling;
    btn.innerText = 'Uploading...';

    try {
        const fileName = 'banner_' + Date.now() + '.' + file.name.split('.').pop();
        const upload = await supabase.storage.from('resume-assets').upload(fileName, file);
        
        if (upload.error) throw upload.error;

        const url = supabase.storage.from('resume-assets').getPublicUrl(fileName).data.publicUrl;
        
        const existing = await supabase.from('profile').select('id').maybeSingle();
        if (existing && existing.id) {
            await supabase.from('profile').update({ banner_url: url }).eq('id', existing.id);
        } else {
            await supabase.from('profile').insert([{ banner_url: url }]);
        }

        document.getElementById('current-banner').src = url;
        alert('Banner uploaded!');
    } catch (err) {
        alert('Upload failed: ' + err.message);
    }

    btn.innerText = 'Upload Banner';
});

// Photo Upload  
document.getElementById('photo-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const btn = e.target.nextElementSibling;
    btn.innerText = 'Uploading...';

    try {
        const fileName = 'photo_' + Date.now() + '.' + file.name.split('.').pop();
        const upload = await supabase.storage.from('resume-assets').upload(fileName, file);
        
        if (upload.error) throw upload.error;

        const url = supabase.storage.from('resume-assets').getPublicUrl(fileName).data.publicUrl;
        
        const existing = await supabase.from('profile').select('id').maybeSingle();
        if (existing && existing.id) {
            await supabase.from('profile').update({ profile_photo_url: url }).eq('id', existing.id);
        } else {
            await supabase.from('profile').insert([{ profile_photo_url: url }]);
        }

        document.getElementById('current-photo').src = url;
        alert('Photo uploaded!');
    } catch (err) {
        alert('Upload failed: ' + err.message);
    }

    btn.innerText = 'Upload Photo';
});

// Document Upload
document.getElementById('upload-doc-btn').addEventListener('click', async () => {
    const name = document.getElementById('doc-name').value;
    const file = document.getElementById('doc-upload').files[0];
    const btn = document.getElementById('upload-doc-btn');

    if (!name || !file) {
        alert('Please enter name and select file');
        return;
    }

    btn.innerText = 'Uploading...';
    btn.disabled = true;

    try {
        const fileName = Date.now() + '.' + file.name.split('.').pop();
        const upload = await supabase.storage.from('resume-assets').upload(fileName, file);
        
        if (upload.error) throw upload.error;

        const url = supabase.storage.from('resume-assets').getPublicUrl(fileName).data.publicUrl;

        const insert = await supabase.from('documents').insert([{ name: name, url: url }]);
        
        if (insert.error) throw insert.error;

        alert('Document uploaded!');
        document.getElementById('doc-name').value = '';
        document.getElementById('doc-upload').value = '';
        loadDocs();
    } catch (err) {
        alert('Error: ' + err.message);
    }

    btn.innerText = 'Upload Document';
    btn.disabled = false;
});

async function loadDocs() {
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    const list = document.getElementById('docs-list');
    
    if (!data || data.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-center py-4">No documents</p>';
        return;
    }

    list.innerHTML = data.map(doc => `
        <div class="flex justify-between items-center p-4 bg-slate-50 rounded-xl">
            <span class="text-sm">${doc.name}</span>
            <button onclick="deleteDoc(${doc.id}, '${doc.url}')" class="text-red-500 p-2">Delete</button>
        </div>
    `).join('');
}

window.deleteDoc = async (id, url) => {
    if (!confirm('Delete?')) return;
    
    await supabase.storage.from('resume-assets').remove([url.split('/').pop()]);
    await supabase.from('documents').delete().eq('id', id);
    loadDocs();
};