# Web-Based Resume

A clean, static, single-page resume website for **Mohit Kumar** — Strategic Railway Operations Professional at Delhi Metro Rail Corporation (DMRC).

No backend, no database, no admin panel, no build step. Open `index.html` and it works.

## Content

All content lives in **`data.js`** (`DEFAULT_RESUME`) and is rendered on page load.

- The content started as a verbatim copy of **`Mohit_Kumar_Resume_Formatted.docx`**.
- The **Professional Profile** paragraph and the three **Technical Innovation** cards have since been rewritten with executive, impact-driven language at the owner's request — the `.docx` still holds the older wording, so update the Word file to match (or say the word and it will be re-synced).
- Nothing else on the page is invented: every other line comes from the Word document.

## Project structure

```
index.html      Page markup (nav, hero, sections, contact, footer)
style.css       Theme tokens, components, responsive + print rules
data.js         The resume content — DEFAULT_RESUME
ui.js           Renderers that turn the data into markup
utils.js        Helpers: theme, scroll reveal, counters, scroll-spy, formatting
main.js         Entry point: renders the content and boots the interactions
robots.txt      Allows search engines to index the site
.github/workflows/deploy.yml   Publishes the site to GitHub Pages on every push to main
```

## Features

- **Light / dark theme** — the toggle sits in the navigation. The choice is stored in `localStorage` and applied before the first paint (inline script in `index.html`), and it follows the OS preference until the visitor picks one.
- **Download / Print Resume** — hero button that opens the print dialog (which also offers *Save as PDF*). The print stylesheet always uses the light palette, forces every scroll-reveal section to be visible and keeps cards from splitting across pages.
- **Animated counters** — the hero statistic (`9+`) counts up when the page loads. `prefers-reduced-motion` is respected.
- **Active scroll-spy** — the navigation link of the section you are reading is highlighted.
- **Responsive navigation** — on small screens the links become a horizontal, scrollable pill bar instead of disappearing.
- **Scroll reveal animations**, timeline, competency grid, KPI pills and tech tags on the innovation cards.

## Sections

The page follows the order of the Word document:

1. Professional Profile
2. Core Competencies
3. Professional Experience
4. Education
5. Technical Innovation (the three projects, each with a link, KPI pills and tags)
6. Training & Certification
7. Contact

## Local development

ES modules require `http://`, so opening the file directly with `file://` will not work.

```bash
# Python
python -m http.server 8000

# or Node
npx serve .
```

Then open <http://localhost:8000>.

`package.json` provides the same thing as a shortcut:

```bash
npm run dev
```

## Editing the content

| Key | Rendered as |
| --- | --- |
| `profile` | Hero, professional profile paragraph, contact details, stats |
| `competencies` | Core competency groups (comma separated, as in the document) |
| `experience` | Professional experience timeline |
| `education` | Education cards |
| `technical_innovation` | Project cards with KPI badges, tags and links |
| `certifications` | Training & certification cards |

`competencies` entries carry a `sort_order` field so the groups stay in the order of the document.

Each innovation entry can also carry:

```js
{
  name: '…',
  description: 'First paragraph\nSecond paragraph',
  icon: 'fa-robot',
  badges: [{ icon: 'fa-bolt', label: '60% Faster Processing', accent: true }],
  tags: ['Process Automation', 'Crew Control'],
  url: 'https://…',
  link_label: 'Open Duty Finder'
}
```

## Styling

Colours are CSS custom properties at the top of `style.css`:

| Token | Purpose |
| --- | --- |
| `--text-heading`, `--text-accent` | Brand coloured text (theme aware, contrast checked) |
| `--brand-strong` | Brand coloured borders |
| `--surface-1`, `--surface-2`, `--surface-3` | Card and chip backgrounds |
| `--border-1`, `--border-2`, `--border-3` | Borders |
| `--grad-brand`, `--grad-brand-3`, `--grad-accent`, … | Gradient definitions |

The `[data-theme="dark"]` block only overrides those tokens, so a new component inherits both themes automatically.

## Deployment

The site is plain static files, so it can be hosted anywhere. The repository is already connected to GitHub Pages (`https://darkmattermetro.github.io/my-resume/`).

Note: **GitHub Pages only serves public repositories on the free plan.** If the repository stays private the Pages URL returns a 404 for visitors — make the repository public, or point the portfolio link in `data.js` to a public URL.

Deployment runs through `.github/workflows/deploy.yml`: every push to `main` publishes the seven site files (`index.html`, `style.css`, `data.js`, `ui.js`, `main.js`, `utils.js`, `robots.txt`) as a Pages artifact. The repository's **Settings → Pages → Source** must be set to **GitHub Actions**. Other files (the `.docx`, `README.md`, `package.json`) are intentionally excluded from the published site.

To publish a change:

```bash
git add -A
git commit -m "Update resume content"
git push origin main
```

## Notes

- The hero photo is an inline SVG placeholder (`MK`). Replace the `src` of `#profile-img` in `index.html` with a real image file to use a photograph.
- The site links to Font Awesome and Google Fonts from a CDN; everything else is served from this repository.
