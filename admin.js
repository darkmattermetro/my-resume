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
    const { data, error } = await supabaseClient
        .from('profile')
        .select('*')
        .single();

    if (data && !error) {
        document.getElementById('input-full-name').value = data.full_name || '';
        document.getElementById('input-title').value = data.professional_title || '';
        document.getElementById('input-intro').value = data.introduction || '';
        document.getElementById('input-about').value = data.about_me || '';
        document.getElementById('input-contact').value = data.contact_info || '';
        if (data.profile_photo_url) {
            document.getElementById('current-photo').src = data.profile_photo_url;
        }
    }
}

document.getElementById('save-profile-btn').onclick = async () => {
    const btn = document.getElementById('save-profile-btn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    btn.disabled = true;

    const profileData = {
        full_name: document.getElementById('input-full-name').value,
        professional_title: document.getElementById('input-title').value,
        introduction: document.getElementById('input-intro').value,
        about_me: document.getElementById('input-about').value,
        contact_info: document.getElementById('input-contact').value
    };

    const { error } = await supabaseClient
        .from('profile')
        .upsert(profileData);

    if (error) {
        alert('Error updating profile: ' + error.message);
        btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
        btn.disabled = false;
    } else {
        alert('Profile updated successfully!');
        btn.innerHTML = '<i class="fas fa-check"></i> Saved!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
            btn.disabled = false;
        }, 2000);
    }
};

document.getElementById('photo-upload').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const btn = e.target.nextElementSibling;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';

    const fileName = `profile_photo_${Date.now()}.${file.name.split('.').pop()}`;
    const { data, error } = await supabaseClient.storage
        .from('resume-assets')
        .upload(fileName, file);

    if (error) {
        alert('Upload failed: ' + error.message);
        btn.innerHTML = '<i class="fas fa-upload mr-2"></i> Upload New';
        return;
    }

    const { data: publicUrlData } = supabaseClient.storage
        .from('resume-assets')
        .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    const { data: existingProfile } = await supabaseClient
        .from('profile')
        .select('id')
        .single();

    if (existingProfile) {
        await supabaseClient
            .from('profile')
            .update({ profile_photo_url: publicUrl })
            .eq('id', existingProfile.id);
    } else {
        await supabaseClient
            .from('profile')
            .insert([{ profile_photo_url: publicUrl }]);
    }

    document.getElementById('current-photo').src = publicUrl;
    alert('Photo updated!');
    btn.innerHTML = '<i class="fas fa-upload mr-2"></i> Upload New';
};

document.getElementById('upload-doc-btn').onclick = async () => {
    const nameInput = document.getElementById('doc-name');
    const fileInput = document.getElementById('doc-upload');
    const file = fileInput.files[0];
    const btn = document.getElementById('upload-doc-btn');

    if (!nameInput.value || !file) {
        alert('Please provide both a name and a file.');
        return;
    }

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
    btn.disabled = true;

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    
    const { error: uploadError } = await supabaseClient.storage
        .from('resume-assets')
        .upload(fileName, file);

    if (uploadError) {
        alert('Upload failed: ' + uploadError.message);
        btn.innerHTML = '<i class="fas fa-cloud-upload-alt mr-2"></i> Upload Document';
        btn.disabled = false;
        return;
    }

    const { data: publicUrlData } = supabaseClient.storage
        .from('resume-assets')
        .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    const { error: dbError } = await supabaseClient
        .from('documents')
        .insert([{ name: nameInput.value, url: publicUrl }]);

    if (dbError) {
        alert('Database update failed: ' + dbError.message);
        btn.innerHTML = '<i class="fas fa-cloud-upload-alt mr-2"></i> Upload Document';
        btn.disabled = false;
    } else {
        alert('Document uploaded successfully!');
        nameInput.value = '';
        fileInput.value = '';
        loadDocuments();
        btn.innerHTML = '<i class="fas fa-check"></i> Uploaded!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-cloud-upload-alt mr-2"></i> Upload Document';
            btn.disabled = false;
        }, 2000);
    }
};

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
        <div class="flex justify-between items-center p-4 bg-white/[0.02] border border-white/10 rounded-xl">
            <div class="flex items-center gap-3">
                <i class="fas ${doc.url.toLowerCase().includes('.pdf') ? 'fa-file-pdf' : 'fa-file-image'} text-red-500"></i>
                <span class="text-sm font-medium">${doc.name}</span>
            </div>
            <button onclick="deleteDoc('${doc.id}', '${doc.url}')" class="text-red-400 hover:text-red-300 p-2 hover:bg-red-600/20 rounded-lg transition-all">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

window.deleteDoc = async (id, url) => {
    if (!confirm('Delete this document?')) return;

    const fileName = url.split('/').pop();
    await supabaseClient.storage.from('resume-assets').remove([fileName]);
    await supabaseClient.from('documents').delete().eq('id', id);
    
    loadDocuments();
};
