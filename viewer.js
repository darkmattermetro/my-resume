const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';

document.addEventListener('DOMContentLoaded', async function() {
    try {
        window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    } catch(e) {
        console.log('Supabase init error:', e);
    }
    
    await loadProfileData();
    await loadDocsData();
});

async function loadProfileData() {
    if (!window.supabaseClient) {
        console.log('Supabase not connected');
        return;
    }
    
    try {
        const { data, error } = await window.supabaseClient.from('profile').select('*').order('id', { ascending: false }).limit(5);
        console.log('Profile response:', data, error);
        
        if (error) {
            console.log('Error fetching profile:', error);
            return;
        }
        
        if (!data || data.length === 0) {
            console.log('No profile - showing defaults');
            return;
        }
        
        var profileData = null;
        for (var i = 0;
