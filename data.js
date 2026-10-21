/**
 * Resume content.
 *
 * SOURCE OF TRUTH: Mohit_Kumar_Resume_Formatted.docx (updated 19 Oct 2026).
 * Every string below is taken from that document - the page renders nothing
 * else. If the Word file changes, this file must be updated to match it.
 */

/**
 * The document the content below was taken from.
 * @type {string}
 */
export const RESUME_SOURCE_FILE = 'Mohit_Kumar_Resume_Formatted.docx';

/**
 * The complete resume content.
 * @type {Object}
 */
export const DEFAULT_RESUME = {
  profile: {
    full_name: 'Mohit Kumar',
    professional_title: 'Rail Operations | Metro Operations | Digital Process Improvement',
    introduction: 'Strategic Railway Operations Professional with over 9 years of experience at Delhi Metro Rail Corporation (DMRC). Experienced in high-density metro operations, GoA4 (Unattended Train Operation) and CBTC signalling systems. MBA candidate focusing on Finance and HR, combining technical expertise with corporate leadership studies. Background in trip chart preparation, duty roster management, crew control and operational resource optimisation, with a focus on safety and service efficiency.',
    about_me: 'Strategic Railway Operations Professional with over 9 years of experience at Delhi Metro Rail Corporation (DMRC). Experienced in high-density metro operations, GoA4 (Unattended Train Operation) and CBTC signalling systems. MBA candidate focusing on Finance and HR, combining technical expertise with corporate leadership studies. Background in trip chart preparation, duty roster management, crew control and operational resource optimisation, with a focus on safety and service efficiency.',
    contact: {
      location: 'New Delhi, India',
      phone: '9958440260',
      email: 'mohit.3623@dmrc.org',
      portfolio: 'https://darkmattermetro.github.io/my-resume/'
    },
    contact_info: 'New Delhi, India | 9958440260 | mohit.3623@dmrc.org',
    stat_years: '9+',
    stat_years_label: 'Years Experience',
    stat_efficiency: '60%',
    stat_efficiency_label: 'Processing Time Reduced',
    tags: [
      'MBA (Finance & HR) candidate',
      'B.Tech'
    ]
  },
  competencies: [
    { name: 'GoA4 / UTO', category: 'Operations', sort_order: 1 },
    { name: 'CBTC logic', category: 'Operations', sort_order: 2 },
    { name: 'ATS management', category: 'Operations', sort_order: 3 },
    { name: 'Emergency coordination', category: 'Safety', sort_order: 4 },
    { name: 'degraded mode', category: 'Safety', sort_order: 5 },
    { name: 'Revenue management', category: 'Finance & Public Service', sort_order: 6 },
    { name: 'Station Balance Sheets', category: 'Finance & Public Service', sort_order: 7 },
    { name: 'HTML', category: 'Digital Improvement', sort_order: 8 },
    { name: 'Python', category: 'Digital Improvement', sort_order: 9 },
    { name: 'Trip Chart Management', category: 'Digital Improvement', sort_order: 10 }
  ],
  experience: [
    {
      role: 'Train Operations - Trip Chart Management, Line 7',
      company: 'Delhi Metro Rail Corporation (DMRC)',
      location: 'New Delhi, India',
      start_date: '2018-01-01',
      end_date: '2026-10-01',
      is_current: false,
      date_label: '2018 - October 2026',
      description: 'Coodinated duty roster management for mainline crew, ensuring full coverage and regulatory compliance.\nDeveloped custom digital tools using HTML and JavaScript to automate complex duty assignment mapping.\nOptimised station-matching logic for train-loop verification, reducing manual processing time by over 60%.\nOperated mainline trains in a CBTC environment, maintaining a strong focus on operational safety.\nManaged onboard systems and manual overrides during technical faults to support service continuity.'
    },
    {
      role: 'Station Controller',
      company: 'Delhi Metro Rail Corporation (DMRC), Line 7',
      location: 'New Delhi, India',
      start_date: '2013-01-01',
      end_date: '2018-01-01',
      is_current: false,
      date_label: '2013 - 2018',
      description: 'Directed daily station operations, security coordination and facility maintenance at high-footfall metro stations.\nManaged station revenue accounts and daily balance sheets, supporting accurate cash and digital transaction audits.\nResolved passenger grievances and coordinated crowd control during peak hours.'
    }
  ],
  education: [
    { institution: 'SVSU, Meerut, Uttar Pradesh', degree: 'Master of Business Administration (Finance & HR)', field: '', status: 'Expected December 2027', year: 2027, is_current: true },
    { institution: 'MAIT, Delhi', degree: 'Bachelor of Technology - Electronics and Communications', field: '', status: '2015', year: 2015, is_current: false },
    { institution: 'SVSU / IGNOU', degree: 'Master/Bachelor in Library Science & PGDCA', field: '', status: '2019-2021', year: 2019, is_current: false }
  ],
  certifications: [
    { name: 'OCC Operations Technical Training', issuer: 'DMRC', status: 'Competent', date_earned: null, expiry_date: null, certificate_url: null }
  ],
  technical_innovation: [
    {
      name: 'Digital Roster Tool - Line 7 Duty Finder',
      description: 'Developed a web application integrated with Supabase to manage DMRC duty cycles, including automated Left/Right file processing, station-specific directional logic and an admin panel for monitoring.\nA Line 7 duty finder where staff can check their day-to-day trips according to the trip chart, note down the kilometre of their trips and the break, sign-on and sign-off details, with tetra key information and a timetable view also available.',
      url: 'https://darkmattermetro.github.io/Webbased-Tripchart/',
      link_label: 'Open Duty Finder'
    },
    {
      name: 'Line 7 Trip Chart Tool',
      description: 'A trip chart tool specifically designed to create trip charts for Line 7.\nStaff can automate the manual process of trip chart making - from scratch to a fully usable Excel-based trip chart for Line 7. The suite covers trip chart creation, time table editing and duty assignment.',
      url: 'https://trip-chart-tool.vercel.app/index.html',
      link_label: 'Open Trip Chart Tool'
    },
    {
      name: 'Railway RAG',
      description: 'A railway RAG-based program built with Python and LangChain that can be used to study any railway-based document such as MRGR, safety circulars and any other instructions.\nStaff can query it and get a proper answer from the RAG system. Dense technical railway PDFs are parsed with Docling and indexed with a hybrid FAISS + BM25 retrieval pipeline.',
      url: 'https://github.com/darkmattermetro/railway-rag',
      link_label: 'View Repository'
    }
  ]
};
