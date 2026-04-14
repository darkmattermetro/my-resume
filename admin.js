const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';
const ADMIN_PASSWORD = 'admin123';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadCurrentProfile();
    loadDocuments();
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
            localStorage.setItem('resume_admin_auth', 'true');
        } else {
            errorMsg.classList.remove('hidden');
            passInput.value = '';
        }
    };

    if (localStorage.getItem('resume_admin_auth') === 'true') {
        overlay.classList.add('hidden');
        content.classList.remove('hidden');
    }

    document.getElementById('logout-btn').onclick = () => {
        localStorage.removeItem('resume_admin_auth');
        location.reload();
    };
}

async function loadCurrentProfile() {
    try {
        const { data, error } = await supabaseClient
            .from('profile')
            .select('*')
            .single();

        if (data) {
            // Basic Info
            document.getElementById('input-full-name').value = data.full_name || '';
            document.getElementById('input-title').value = data.professional_title || '';
            document.getElementById('input-intro').value = data.introduction || '';
            document.getElementById('input-about').value = data.about_me || '';
            document.getElementById('input-contact').value = data.contact_info || '';
            
            // Stats
            document.getElementById('input-stat-years').value = data.stat_years || '';
            document.getElementById('input-stat-projects').value = data.stat_projects || '';
            document.getElementById('input-stat-success').value = data.stat_success || '';
            
            // Features
            document.getElementById('input-feature1-title').value = data.feature1_title || '';
            document.getElementById('input-feature1-desc').value = data.feature1_desc || '';
            document.getElementById('input-feature2-title').value = data.feature2_title || '';
            document.getElementById('input-feature2-desc').value = data.feature2_desc || '';
            document.getElementById('input-feature3-title').value = data.feature3_title || '';
            document.getElementById('input-feature3-desc').value = data.feature3_desc || '';
            
            // Images
            if (data.profile_photo_url) {
                document.getElementById('current-photo').src = data.profile_photo_url;
            }
            if (data.banner_url) {
                document.getElementById('current-banner').src = data.banner_url;
            }
        }
    } catch (e) {
        console.log('No profile data yet');
    }
}

document.getElementById('save-profile-btn').onclick = async () => {
    const btn = document.getElementById('save-profile-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    try {
        const profileData = {
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

        // First check if profile exists
        const { data: existing } = await supabaseClient
            .from('profile')
            .select('id')
            .single();

        let error;
        if (existing && existing.id) {
            const result = await supabaseClient
                .from('profile')
                .update(profileData)
                .eq('id', existing.id);
            error = result.error;
        } else {
            const result = await supabaseClient
                .from('profile')
                .insert([profileData]);
            error = result.error;
        }

        if (error) {
            alert('Error: ' + error.message);
        } else {
            alert('Profile saved successfully!');
        }
    } catch (e) {
        alert('Error: ' + e.message);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
};

// Banner Upload
document.getElementById('banner-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const btn = e.target.nextElementSibling;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    try {
        const fileName = `banner_${Date.now()}.${file.name.split('.').pop()}`;
        const { data, error } = await supabaseClient.storage
            .from('resume-assets')
            .upload(fileName, file);

        if (error) throw error;

        const { data: publicUrlData } = supabaseClient.storage
            .from('resume-assets')
            .getPublicUrl(fileName);

        const publicUrl = publicUrlData.publicUrl;

        // Update profile with banner URL
        const { data: existing } = await supabaseClient
            .from('profile')
            .select('id')
            .single();

        if (existing) {
            await supabaseClient
                .from('profile')
                .update({ banner_url: publicUrl })
                .eq('id', existing.id);
        } else {
            await supabaseClient
                .from('profile')
                .insert([{ banner_url: publicUrl }]);
        }

        document.getElementById('current-banner').src = publicUrl;
        alert('Banner updated!');
    } catch (err) {
        alert('Upload failed: ' + err.message);
    }

    btn.innerHTML = '<i class="fas fa-upload mr-2"></i> Upload Banner';
});

// Photo Upload
document.getElementById('photo-upload').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const btn = e.target.nextElementSibling;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    try {
        const fileName = `profile_${Date.now()}.${file.name.split('.').pop()}`;
        const { data, error } = await supabaseClient.storage
            .from('resume-assets')
            .upload(fileName, file);

        if (error) throw error;

        const { data: publicUrlData } = supabaseClient.storage
            .from('resume-assets')
            .getPublicUrl(fileName);

        const publicUrl = publicUrlData.publicUrl;

        // Update profile with photo URL
        const { data: existing } = await supabaseClient
            .from('profile')
            .select('id')
            .single();

        if (existing) {
            await supabaseClient
                .from('profile')
                .update({ profile_photo_url: publicUrl })
                .eq('id', existing.id);
        } else {
            await supabaseClient
                .from('profile')
                .insert([{ profile_photo_url: publicUrl }]);
        }

        document.getElementById('current-photo').src = publicUrl;
        alert('Photo updated!');
    } catch (err) {
        alert('Upload failed: ' + err.message);
    }

    btn.innerHTML = '<i class="fas fa-upload mr-2"></i> Upload Photo';
});

// Document Upload
document.getElementById('upload-doc-btn').addEventListener('click', async () => {
    const nameInput = document.getElementById('doc-name');
    const fileInput = document.getElementById('doc-upload');
    const file = fileInput.files[0];
    const btn = document.getElementById('upload-doc-btn');

    if (!nameInput.value || !file) {
        alert('Please provide both a name and a file.');
        return;
    }

    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    btn.disabled = true;

    try {
        const ext = file.name.split('.').pop();
        const fileName = `${Date.now()}.${ext}`;
        
        const { error: uploadError } = await supabaseClient.storage
            .from('resume-assets')
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabaseClient.storage
            .from('resume-assets')
            .getPublicUrl(fileName);

        const publicUrl = publicUrlData.publicUrl;

        const { error: dbError } = await supabaseClient
            .from('documents')
            .insert([{ name: nameInput.value, url: publicUrl }]);

        if (dbError) throw dbError;

        alert('Document uploaded successfully!');
        nameInput.value = '';
        fileInput.value = '';
        loadDocuments();
    } catch (err) {
        alert('Error: ' + err.message);
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
});

async function loadDocuments() {
    const { data, error } = await supabaseClient
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

    const list = document.getElementById('docs-list');
    if (error || !data || data.length === 0) {
        list.innerHTML = '<p class="col-span-full text-center text-slate-500 py-4">No documents uploaded yet.</p>';
        return;
    }

    list.innerHTML = data.map(doc => `
        <div class="flex justify-between items-center p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div class="flex items-center gap-3">
                <i class="fas ${doc.url.toLowerCase().includes('.pdf') ? 'fa-file-pdf' : 'fa-file-image'} text-blue-500"></i>
                <span class="text-sm font-medium text-slate-700">${doc.name}</span>
            </div>
            <button onclick="deleteDoc('${doc.id}', '${doc.url}')" class="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-all">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

window.deleteDoc = async (id, url) => {
    if (!confirm('Delete this document?')) return;

    try {
        const fileName = url.split('/').pop();
        await supabaseClient.storage.from('resume-assets').remove([fileName]);
        await supabaseClient.from('documents').delete().eq('id', id);
        loadDocuments();
    } catch (err) {
        alert('Error deleting: ' + err.message);
    }
};
