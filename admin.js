const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';
const ADMIN_PASSWORD = 'admin123';

let supabase;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Admin page loading...');
    
    // Initialize Supabase
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        console.log('Supabase initialized');
    } catch(e) {
        console.log('Supabase init error:', e);
    }
    
    // Setup login
    const loginBtn = document.getElementById('login-btn');
    const passInput = document.getElementById('admin-pass');
    const overlay = document.getElementById('login-overlay');
    const content = document.getElementById('admin-content');
    const errorMsg = document.getElementById('login-error');
    
    loginBtn.onclick = function() {
        console.log('Login clicked, password:', passInput.value);
        if (passInput.value === ADMIN_PASSWORD) {
            console.log('Password correct, showing admin');
            overlay.style.display = 'none';
            content.classList.remove('hidden');
            localStorage.setItem('resume_admin', 'true');
            loadProfileData();
            loadDocsData();
        } else {
            console.log('Password wrong');
            errorMsg.classList.remove('hidden');
            passInput.value = '';
        }
    };
    
    // Check if already logged in
    if (localStorage.getItem('resume_admin') === 'true') {
        overlay.style.display = 'none';
        content.classList.remove('hidden');
        loadProfileData();
        loadDocsData();
    }
    
    // Logout
    document.getElementById('logout-btn').onclick = function() {
        localStorage.removeItem('resume_admin');
        location.reload();
    };
    
    // Save button
    document.getElementById('save-profile-btn').onclick = saveProfile;
    
    // Upload buttons
    document.getElementById('banner-upload').addEventListener('change', uploadBanner);
    document.getElementById('photo-upload').addEventListener('change', uploadPhoto);
    document.getElementById('upload-doc-btn').addEventListener('click', uploadDoc);
});

async function loadProfileData() {
    if (!supabase) return;
    const { data } = await supabase.from('profile').select('*').maybeSingle();
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
}

async function saveProfile() {
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
    
    const existing = await supabase.from('profile').select('id').maybeSingle();
    let result;
    if (existing && existing.id) {
        result = await supabase.from('profile').update(data).eq('id', existing.id);
    } else {
        result = await supabase.from('profile').insert([data]);
    }
    
    if (result.error) {
        alert('Error: ' + result.error.message);
    } else {
        alert('Saved! Check your website.');
    }
    
    btn.innerText = 'Save Changes';
    btn.disabled = false;
}

async function uploadBanner(e) {
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
        alert('Error: ' + err.message);
    }
    btn.innerText = 'Upload Banner';
}

async function uploadPhoto(e) {
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
        alert('Error: ' + err.message);
    }
    btn.innerText = 'Upload Photo';
}

async function uploadDoc() {
    const name = document.getElementById('doc-name').value;
    const file = document.getElementById('doc-upload').files[0];
    const btn = document.getElementById('upload-doc-btn');
    
    if (!name || !file) {
        alert('Enter name and select file');
        return;
    }
    
    btn.innerText = 'Uploading...';
    btn.disabled = true;
    
    try {
        const fileName = Date.now() + '.' + file.name.split('.').pop();
        const upload = await supabase.storage.from('resume-assets').upload(fileName, file);
        if (upload.error) throw upload.error;
        
        const url = supabase.storage.from('resume-assets').getPublicUrl(fileName).data.publicUrl;
        await supabase.from('documents').insert([{ name: name, url: url }]);
        
        alert('Document uploaded!');
        document.getElementById('doc-name').value = '';
        document.getElementById('doc-upload').value = '';
        loadDocsData();
    } catch (err) {
        alert('Error: ' + err.message);
    }
    
    btn.innerText = 'Upload Document';
    btn.disabled = false;
}

async function loadDocsData() {
    if (!supabase) return;
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    const list = document.getElementById('docs-list');
    
    if (!data || data.length === 0) {
        list.innerHTML = '<p class="text-slate-500 text-center py-4">No documents</p>';
        return;
    }
    
    list.innerHTML = data.map(doc => 
        '<div class="flex justify-between items-center p-4 bg-slate-50 rounded-xl">' +
        '<span class="text-sm">' + doc.name + '</span>' +
        '<button onclick="deleteDoc(' + doc.id + ', \'' + doc.url + '\')" class="text-red-500 p-2">Delete</button>' +
        '</div>'
    ).join('');
}

window.deleteDoc = async function(id, url) {
    if (!confirm('Delete?')) return;
    await supabase.storage.from('resume-assets').remove([url.split('/').pop()]);
    await supabase.from('documents').delete().eq('id', id);
    loadDocsData();
};