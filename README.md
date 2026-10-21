# Web-Based Resume

A clean, static, single-page resume website for **Mohit Kumar** — Railway Operations Professional at Delhi Metro Rail Corporation (DMRC).

No backend, no database, no admin panel, no build step. Open `index.html` and it works.

## Content source of truth

**`Mohit_Kumar_Resume_Formatted.docx` is the single source of truth for every word on the site.**

- The content in `data.js` (`DEFAULT_RESUME`) is a verbatim copy of that document.
- Nothing that is not in the Word file is rendered on the public page.
- When the Word file changes: update `data.js` to match it and redeploy.

## Project structure

```
index.html      Page markup (nav, hero, sections, contact, footer)
style.css       All styling, including the responsive and print rules
data.js         The resume content — DEFAULT_RESUME
ui.js           Renderers that turn the data into markup
utils.js        Shared helpers (scroll reveal, date format, escaping)
main.js         Entry point: renders the content on page load
```

## Sections

The page follows the order of the Word document:

1. Professional Profile
2. Core Competencies
3. Professional Experience
4. Education
5. Technical Innovation (the three projects, each with a link)
6. Training & Certification
7. Contact

## Local development

Any static file server works — ES modules require `http://`, so opening the file
directly with `file://` will not work.

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

All content lives in `data.js`. Each entry maps to a line of the Word document:

| Key | Rendered as |
| --- | --- |
| `profile` | Hero, professional profile paragraph, contact details, stats |
| `competencies` | Core competency groups (comma separated, as in the document) |
| `experience` | Professional experience timeline |
| `education` | Education cards |
| `technical_innovation` | Project cards with links |
| `certifications` | Training & certification cards |

`competencies` entries carry a `sort_order` field so the groups stay in the
order of the document.

## Deployment

The site is plain static files, so it can be hosted anywhere. The repository is
already connected to GitHub Pages (`https://darkmattermetro.github.io/my-resume/`).

Note: **GitHub Pages only serves public repositories on the free plan.** If the
repository stays private the Pages URL returns a 404 for visitors — make the
repository public, or point the portfolio link in `data.js` to a public URL.

To publish a change:

```bash
git add -A
git commit -m "Update resume content"
git push origin main
```

## Notes

- The hero photo is an inline SVG placeholder (`MK`). Replace the `src` of
  `#profile-img` in `index.html` with a real image file to use a photograph.
- The site links to Font Awesome and Google Fonts from a CDN; everything else is
  served from this repository.
