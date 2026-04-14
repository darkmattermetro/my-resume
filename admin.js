const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';
const ADMIN_PASSWORD = 'admin123'; // USER: Change this password!

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

    if (data) {
        document.getElementById('input-full-name').value = data.full_name || '';
        document.getElementById('input-title').value = data.professional_title || '';
        document.getElementById('input-intro').value = data.introduction || '';
        document.getElementById('input-about').value = data.about_me || '';
        document.getElementById('input-contact').value = data.contact_info || '';
        document.getElementById('current-photo').src = data.profile_photo_url || 'https://via.placeholder.com/100';
    }
}

document.getElementById('save-profile-btn').onclick = async () => {
    const btn = document.getElementById('save-profile-btn');
    btn.innerText = 'Saving...';
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
    } else {
        alert('Profile updated successfully!');
    }
    btn.innerText = 'Save Changes';
    btn.disabled = false;
};

// Photo Upload
document.getElementById('photo-upload').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `profile_photo_${Date.now()}.jpg`;
    const { data, error } = await supabaseClient.storage
        .from('resume-assets')
        .upload(fileName, file);

    if (error) {
        alert('Upload failed: ' + error.message);
        return;
    }

    const { data: publicUrlData } = supabaseClient.storage
        .from('resume-assets')
        .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    await supabaseClient
        .from('profile')
        .update({ profile_photo_url: publicUrl })
        .eq('id', (await supabaseClient.from('profile').select('id').single()).data.id);

    document.getElementById('current-photo').src = publicUrl;
    alert('Photo updated!');
};

// Document Upload
document.getElementById('upload-doc-btn').onclick = async () => {
    const nameInput = document.getElementById('doc-name');
    const fileInput = document.getElementById('doc-upload');
    const file = fileInput.files[0];

    if (!nameInput.value || !file) {
        alert('Please provide both a name and a file.');
        return;
    }

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    
    const { error: uploadError } = await supabaseClient.storage
        .from('resume-assets')
        .upload(fileName, file);

    if (uploadError) {
        alert('Upload failed: ' + uploadError.message);
        return;
    }

    const { data: publicUrlData } = supabaseClient.storage
        .from('resume-assets')
        .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    // We need a 'documents' table for this to work
    const { error: dbError } = await supabaseClient
        .from('documents')
        .insert([{ name: nameInput.value, url: publicUrl }]);

    if (dbError) {
        alert('Database update failed: ' + dbError.message);
    } else {
        alert('Document uploaded successfully!');
        nameInput.value = '';
        fileInput.value = '';
        loadDocuments();
    }
};

async function loadDocuments() {
    const { data, error } = await supabaseClient
        .from('documents')
        .select('*');

    const list = document.getElementById('docs-list');
    if (error || !data) return;

    list.innerHTML = data.map(doc => `
        <div class="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-xl">
            <span class="text-sm truncate">${doc.name}</span>
            <button onclick="deleteDoc('${doc.id}', '${doc.url}')" class="text-red-400 hover:text-red-300 p-2">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

window.deleteDoc = async (id, url) => {
    if (!confirm('Delete this document?')) return;

    // Remove from storage
    const fileName = url.split('/').pop();
    await supabaseClient.storage.from('resume-assets').remove([fileName]);

    // Remove from DB
    await supabaseClient.from('documents').delete().eq('id', id);
    
    loadDocuments();
};
