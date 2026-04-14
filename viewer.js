// viewer.js - Simple working version
const SUPABASE_URL = 'https://jrkuaysvvhjyxyrxmhul.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impya3VheXN2dmhqeXh5cnhtaHVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxNDE0OTAsImV4cCI6MjA5MTcxNzQ5MH0.atCCNpZxriK2Xruo-kigPJCPrE-b2TeeB_E2C1IYxDI';

document.addEventListener('DOMContentLoaded', function() {
    window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    loadProfile();
    loadDocs();
});

async function loadProfile() {
    var result = await window.supabase.from('profile').select('*').order('id', {ascending:false}).limit(5);
    if (!result.data || result.data.length === 0) return;
    
    var d = result.data[0];
    if (d.full_name) document.getElementById('full-name').innerText = d.full_name;
    if (d.professional_title) document.getElementById('professional-title').innerText = d.professional_title;
    if (d.introduction) document.getElementById('introduction').innerText = d.introduction;
    if (d.about_me) document.getElementById('about-me').innerText = d.about_me;
    if (d.contact_info) document.getElementById('contact-info').innerText = d.contact_info;
    if (d.stat_years) document.getElementById('stat-years').innerText = d.stat_years;
    if (d.stat_projects) document.getElementById('stat-projects').innerText = d.stat_projects;
    if (d.stat_success) document.getElementById('stat-success').innerText = d.stat_success;
    if (d.feature1_title) document.getElementById('feature1-title').innerText = d.feature1_title;
    if (d.feature1_desc) document.getElementById('feature1-desc').innerText = d.feature1_desc;
    if (d.feature2_title) document.getElementById('feature2-title').innerText = d.feature2_title;
    if (d.feature2_desc) document.getElementById('feature2-desc').innerText = d.feature2_desc;
    if (d.feature3_title) document.getElementById('feature3-title').innerText = d.feature3_title;
    if (d.feature3_desc) document.getElementById('feature3-desc').innerText = d.feature3_desc;
    if (d.profile_photo_url) document.getElementById('profile-img').src = d.profile_photo_url;
    if (d.banner_url) document.getElementById('banner-img').src = d.banner_url;
}

async function loadDocs() {
    var result = await window.supabase.from('documents').select('*').order('created_at', {ascending:false});
    var grid = document.getElementById('docs-grid');
    if (!result.data || result.data.length === 0) {
        grid.innerHTML
