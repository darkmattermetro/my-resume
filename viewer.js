const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';

// Robust Client Initialization
let supabaseClient;
try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.error('Supabase initialization failed:', e);
}

document.addEventListener('DOMContentLoaded', async () => {
    // Always run animations first so the user doesn't see a blank page
    initAnimations();
    
    if (supabaseClient) {
        try {
            await fetchProfile();
            await fetchDocuments();
        } catch (e) {
            console.error('Data fetching failed:', e);
        }
    } else {
        console.error('Supabase client not initialized');
        document.getElementById('full-name').innerText = 'Portfolio';
        document.getElementById('professional-title').innerText = 'Welcome to my site';
    }
});

async function fetchProfile() {
    const { data, error } = await supabaseClient
        .from('profile')
        .select('*')
        .single();

    if (error) {
        console.warn('Error fetching profile:', error);
        return;
    }

    if (data) {
        document.getElementById('full-name').innerText = data.full_name || 'Professional Name';
        document.getElementById('professional-title').innerText = data.professional_title || 'Professional Title';
        document.getElementById('introduction').innerText = data.introduction || 'Welcome to my professional portfolio.';
        document.getElementById('about-me').innerText = data.about_me || 'Details about my experience...';
        document.getElementById('contact-info').innerText = data.contact_info || 'Contact details...';
        
        if (data.profile_photo_url) {
            document.getElementById('profile-img').src = data.profile_photo_url;
        }
    }
}

async function fetchDocuments() {
    const { data, error } = await supabaseClient
        .from('documents')
        .select('*');

    const grid = document.getElementById('docs-grid');
    
    if (error || !data || data.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center text-slate-500">No documents uploaded yet.</p>`;
        return;
    }

    grid.innerHTML = data.map(doc => `
        <div class="doc-card glass-panel p-6 rounded-3xl border border-white/10 reveal" onclick="openViewer('${doc.url}', '${doc.name}')">
            <div class="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-4 text-blue-500">
                <i class="fas ${doc.url.toLowerCase().includes('.pdf') ? 'fa-file-pdf' : 'fa-file-image'} text-xl"></i>
            </div>
            <h3 class="font-bold text-lg mb-2">${doc.name}</h3>
            <p class="text-sm text-slate-400">Click to view document</p>
        </div>
    `).join('');
}

function initAnimations() {
    // Immediate Hero animation
    gsap.to('#hero-content', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power4.out',
        delay: 0.2
    });

    // Scroll reveal
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
            duration: 1,
            ease: 'power3.out'
        });
    });
}

// Viewer Modal Logic
const modal = document.getElementById('viewer-modal');
const modalContent = document.getElementById('modal-content');
const modalTitle = document.getElementById('modal-title');

window.openViewer = (url, name) => {
    modalTitle.innerText = name;
    modalContent.innerHTML = '';
    
    if (url.toLowerCase().includes('.pdf')) {
        modalContent.innerHTML = `<iframe src="${url}" class="w-full h-full rounded-xl border-none"></iframe>`;
    } else {
        modalContent.innerHTML = `<img src="${url}" class="max-w-full max-h-full object-contain rounded-xl shadow-2xl">`;
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
