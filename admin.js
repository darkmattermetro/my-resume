const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';
const ADMIN_PASSWORD = 'admin123';

let supabase;

// Initialize
window.onload = function() {
    try {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch(e) {
        console.log('Supabase init error:', e);
    }
    
    // Check if already logged in
    if (localStorage.getItem('admin_logged_in') === 'true') {
        showAdminPage();
    }
};

// Login function
function checkLogin() {
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('admin_logged_in', 'true');
        showAdminPage();
    } else {
        errorMsg.style.display = 'block';
    }
}

// Show admin page
function showAdminPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('admin-page').style.display = 'block';
    loadProfile();
    loadDocs();
}

// Logout
function doLogout() {
    localStorage.removeItem('admin_logged_in');
    location.reload();
}

// Load profile data
async function loadProfile() {
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

// Save profile
async function saveProfile() {
    const btn = document.querySelector('.save-btn');
    btn.innerText = 'Saving...';
    
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
        alert('Saved successfully!');
    }
    
    btn.innerText = '💾 Save Changes';
}

// Upload banner
async function uploadBanner() {
    const file = document.getElementById('banner-upload').files[0];
    if (!file) return alert('Select a file');
    
    const btn = event.target;
    btn.innerText = 'Uploading...';
    
    try {
        const fileName = 'banner_' + Date.now();
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
        btn.innerText = 'Upload';
        alert('Banner uploaded!');
    } catch (err) {
        alert('Error: ' + err.message);
        btn.innerText = 'Upload';
    }
}

// Upload photo
async function uploadPhoto() {
    const file = document.getElementById('photo-upload').files[0];
    if (!file) return alert('Select a file');
    
    const btn = event.target;
    btn.innerText = 'Uploading...';
    
    try {
        const fileName = 'photo_' + Date.now();
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
        btn.innerText = 'Upload';
        alert('Photo uploaded!');
    } catch (err) {
        alert('Error: ' + err.message);
        btn.innerText = 'Upload';
    }
}

// Upload document
async function uploadDoc() {
    const name = document.getElementById('doc-name').value;
    const file = document.getElementById('doc-upload').files[0];
    
    if (!name || !file) return alert('Enter name and select file');
    
    const btn = event.target;
    btn.innerText = 'Uploading...';
    
    try {
        const fileName = Date.now() + '_' + file.name;
        const upload = await supabase.storage.from('resume-assets').upload(fileName, file);
        if (upload.error) throw upload.error;
        
        const url = supabase.storage.from('resume-assets').getPublicUrl(fileName).data.publicUrl;
        
        await supabase.from('documents').insert([{ name: name, url: url }]);
        
        document.getElementById('doc-name').value = '';
        document.getElementById('doc-upload').value = '';
        loadDocs();
        
        btn.innerText = 'Upload';
        alert('Document uploaded!');
    } catch (err) {
        alert('Error: ' + err.message);
        btn.innerText = 'Upload';
    }
}

// Load documents
async function loadDocs() {
    if (!supabase) return;
    
    const { data } = await supabase.from('documents').select('*').order('created_at', { ascending: false });
    const list = document.getElementById('docs-list');
    
    if (!data || data.length === 0) {
        list.innerHTML = '<p style="color:#999;">No documents uploaded</p>';
        return;
    }
    
    list.innerHTML = data.map(doc => 
        '<div class="doc-item"><span>' + doc.name + '</span><button class="delete-btn" onclick="deleteDoc(' + doc.id + ', \'' + doc.url + '\')">Delete</button></div>'
    ).join('');
}

// Delete document
async function deleteDoc(id, url) {
    if (!confirm('Delete this document?')) return;
    
    await supabase.storage.from('resume-assets').remove([url.split('/').pop()]);
    await supabase.from('documents').delete().eq('id', id);
    loadDocs();
}