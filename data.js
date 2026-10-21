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
    professional_title: 'Delhi Metro Rail Operations',
    introduction: 'Spearheaded high-density metro operations for over 9 years at Delhi Metro Rail Corporation (DMRC), leading GoA4 (Unattended Train Operation) and CBTC signalling operations on Line 7. Engineered custom trip-chart, duty-roster and crew-control automation in HTML, Python and JavaScript, optimizing manual processes by over 60% while eliminating human scheduling errors. Standardized digital SOPs, live-testing trackers and fault-recovery protocols that strengthened operational safety and service continuity. Combines frontline railway operations leadership with an MBA in Finance & HR, uniting safety-critical execution with commercial, financial and people-management discipline.',
    about_me: 'Spearheaded high-density metro operations for over 9 years at Delhi Metro Rail Corporation (DMRC), leading GoA4 (Unattended Train Operation) and CBTC signalling operations on Line 7. Engineered custom trip-chart, duty-roster and crew-control automation in HTML, Python and JavaScript, optimizing manual processes by over 60% while eliminating human scheduling errors. Standardized digital SOPs, live-testing trackers and fault-recovery protocols that strengthened operational safety and service continuity. Combines frontline railway operations leadership with an MBA in Finance & HR, uniting safety-critical execution with commercial, financial and people-management discipline.',
    contact: {
      location: 'New Delhi, India',
      phone: '9958440260',
      email: 'mohit.3623@dmrc.org',
      portfolio: 'https://darkmattermetro.github.io/my-resume/'
    },
    contact_info: 'New Delhi, India | 9958440260 | mohit.3623@dmrc.org',
    stat_years: '9+',
    stat_years_label: 'Years Experience',
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
      name: 'Digital Automation of Duty Roster & Crew Control',
      description: 'Engineered automated digital workflows for crew scheduling and duty roster management, reducing manual processing time by 60% and eliminating human scheduling errors.\nA Line 7 duty finder where staff can check their day-to-day trips according to the trip chart, note down the kilometre of their trips and the break, sign-on and sign-off details, with tetra key information and a timetable view also available.',
      icon: 'fa-robot',
      badges: [
        { icon: 'fa-bolt', label: '60% Faster Processing', accent: true },
        { icon: 'fa-user-check', label: 'Eliminated Scheduling Errors' }
      ],
      tags: ['Process Automation', 'Crew Control', 'Ops Analytics'],
      url: 'https://darkmattermetro.github.io/Webbased-Tripchart/',
      link_label: 'Open Duty Finder'
    },
    {
      name: 'Data-Driven Trip Chart & Rake Optimization',
      description: 'Streamlined trip chart preparation and timetable modeling to optimize rolling stock utilization and headway consistency across high-density corridors.\nA trip chart tool specifically designed to create trip charts for Line 7. Staff can automate the manual process of trip chart making - from scratch to a fully usable Excel-based trip chart, covering trip chart creation, time table editing and duty assignment.',
      icon: 'fa-chart-line',
      badges: [
        { icon: 'fa-train', label: 'Rake Utilisation Optimised' },
        { icon: 'fa-clock', label: 'Headway Consistency' }
      ],
      tags: ['Trip Charting', 'Timetable Modelling', 'Fleet Planning'],
      url: 'https://trip-chart-tool.vercel.app/index.html',
      link_label: 'Open Trip Chart Tool'
    },
    {
      name: 'GoA4 (UTO) & CBTC Operational Readiness',
      description: 'Standardized digital SOPs, live-testing trackers, and fault-recovery protocols for Unattended Train Operations (GoA4) and CBTC signalling systems.\nThe digital knowledge layer behind them: dense technical railway PDFs are parsed with Docling and indexed with a hybrid FAISS + BM25 retrieval pipeline, so staff can query MRGRs, safety circulars and instructions and get a verified answer straight from the RAG system.',
      icon: 'fa-satellite-dish',
      badges: [
        { icon: 'fa-shield-halved', label: 'Safety Critical' },
        { icon: 'fa-bolt', label: 'GoA4 / CBTC Ready' }
      ],
      tags: ['GoA4 / UTO', 'CBTC', 'Signalling', 'Ops Analytics'],
      url: 'https://github.com/darkmattermetro/railway-rag',
      link_label: 'View Repository'
    }
  ]
};
