const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';

let supabaseClient;
try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error('Supabase initialization failed:', e);
}

document.addEventListener('DOMContentLoaded', async () => {
    initAnimations();
    
    if (supabaseClient) {
        try {
            await fetchProfile();
            await fetchDocuments();
        } catch (e) {
            console.error('Data fetching failed:', e);
            setFallbackContent();
        }
    } else {
        setFallbackContent();
    }
});

function setFallbackContent() {
    document.getElementById('full-name').innerHTML = 'Metro Professional';
    document.getElementById('professional-title').innerText = 'Rail Systems Specialist';
    document.getElementById('introduction').innerText = 'Experienced professional in metro rail operations and systems engineering.';
    document.getElementById('about-me').innerText = 'Dedicated to improving urban transit systems with over 10 years of experience in rail operations, signaling systems, and team leadership.';
    document.getElementById('contact-info').innerText = 'Email: metro@example.com | Phone: +1 234 567 890';
}

async function fetchProfile() {
    const { data, error } = await supabaseClient
        .from('profile')
        .select('*')
        .single();

    if (error || !data) {
        console.warn('Profile not found or error:', error);
        setFallbackContent();
        return;
    }

    document.getElementById('full-name').innerHTML = data.full_name ? 
        `<span class="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-slate-400">${data.full_name}</span>` : 
        'Metro Professional';
    document.getElementById('professional-title').innerText = data.professional_title || 'Rail Systems Specialist';
    document.getElementById('introduction').innerText = data.introduction || 'Experienced professional in metro rail operations and systems engineering.';
    document.getElementById('about-me').innerText = data.about_me || 'Dedicated to improving urban transit systems with over 10 years of experience in rail operations, signaling systems, and team leadership.';
    document.getElementById('contact-info').innerText = data.contact_info || 'Email: metro@example.com | Phone: +1 234 567 890';
    
    if (data.profile_photo_url) {
        document.getElementById('profile-img').src = data.profile_photo_url;
    }
}

async function fetchDocuments() {
    const { data, error } = await supabaseClient
        .from('documents')
        .select('*')
        .order('created_at', { ascending: false });

    const grid = document.getElementById('docs-grid');
    
    if (error || !data || data.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-16 glass-panel rounded-2xl border border-white/10">
                <i class="fas fa-folder-open text-4xl text-slate-600 mb-4"></i>
                <p class="text-slate-500">No documents uploaded yet. Visit the admin panel to add some!</p>
            </div>`;
        return;
    }

    grid.innerHTML = data.map(doc => `
        <div class="doc-card glass-panel p-6 rounded-2xl border border-white/10" onclick="openViewer('${doc.url}', '${doc.name}')">
            <div class="flex items-start justify-between mb-4">
                <div class="w-14 h-14 bg-red-600/20 rounded-xl flex items-center justify-center">
                    <i class="fas ${doc.url.toLowerCase().includes('.pdf') ? 'fa-file-pdf' : 'fa-file-image'} text-red-500 text-xl"></i>
                </div>
                <span class="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">
                    ${doc.url.split('.').pop().toUpperCase()}
                </span>
            </div>
            <h3 class="font-bold text-lg mb-2">${doc.name}</h3>
            <p class="text-sm text-slate-400">Click to view document</p>
        </div>
    `).join('');
}

function initAnimations() {
    gsap.from('#home', {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.to('#home', {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out'
    });

    gsap.registerPlugin(ScrollTrigger);
    
    document.querySelectorAll('.reveal').forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        });
    });
}

const modal = document.getElementById('viewer-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');

window.openViewer = (url, name) => {
    modalTitle.innerText = name;
    modalContent.innerHTML = '';
    
    if (url.toLowerCase().includes('.pdf')) {
        modalContent.innerHTML = `<iframe src="${url}" class="w-full h-full rounded-lg border-none" style="min-height: 70vh;"></iframe>`;
    } else {
        modalContent.innerHTML = `<img src="${url}" class="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl mx-auto">`;
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
