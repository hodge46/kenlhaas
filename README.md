# Kenny Haas — Portfolio 2026

A single-page portfolio site. Static HTML/CSS/JS — no build step, no dependencies.
Host the folder anywhere (GitHub Pages, Netlify, Cloudflare Pages, any static host).

## Previewing locally

Opening `index.html` directly with `file://` works, but browsers block some relative
paths that way. For an accurate preview, serve the folder over HTTP:

- **Windows (no tools needed):** right-click `serve.ps1` → *Run with PowerShell*, then open <http://localhost:8123/>
- **VS Code:** the "Live Server" extension
- **Node:** `npx serve` &nbsp; | &nbsp; **Python:** `python -m http.server`

## Structure

```
Portfolio_2026/
├── index.html                     # all page content
├── serve.ps1                      # optional local preview server (Windows)
├── css/style.css                  # all styling (design "Option 1" — blue; palette = --brand* vars in :root)
├── js/script.js                   # nav, mobile menu, scroll-spy, reveal animations
└── assets/
    ├── img/
    │   └── kenny-haas.jpg         # <-- ADD: your headshot (square works best, ~600×600)
    ├── screenshots/               # project thumbnails (placeholder SVGs included)
    │   ├── learning-portal.svg
    │   ├── learning-game.svg
    │   ├── elearning.svg
    │   ├── digital-tool.svg
    │   ├── ai-assisted-coding.svg
    │   └── xapi.svg
    ├── case-studies/              # <-- ADD one PDF per project
    │   ├── learning-portal.pdf
    │   ├── learning-game.pdf
    │   ├── elearning.pdf
    │   ├── digital-tool.pdf
    │   ├── ai-assisted-coding.pdf
    │   └── xapi.pdf
    └── kenny-haas-resume.pdf      # <-- ADD: your resume
```

## What to add

Everything works right now with placeholders. To finish it:

1. **Headshot** — drop a photo at `assets/img/kenny-haas.jpg`. If the file is missing the site shows a "Your photo here" placeholder automatically.
2. **Project screenshots** — replace the SVGs in `assets/screenshots/` with real captures. To use PNG/JPG instead of SVG, add the file (e.g. `learning-portal.png`) and update the matching `<img src="...">` in `index.html`. If an image fails to load, the card falls back to a "Screenshot" placeholder.
3. **Case study PDFs** — add the six files listed above under `assets/case-studies/`. The "View Case Study PDF" links already point at these paths.
4. **Resume** — add `assets/kenny-haas-resume.pdf`.

## Editing content

- Text, skills, project blurbs, and contact details are all in `index.html`.
- Colors and spacing are CSS variables at the top of `css/style.css` (`:root`). The
  site accent is `--brand` / `--brand-dark` / `--brand-light` / `--brand-50` / `--brand-100` —
  change those five to re-theme the whole site.
- The header, mobile menu, active-link highlighting, and fade-in animations are in `js/script.js`.

## Contact details currently in the site

- Email: hodge46@yahoo.com
- Phone: 309-331-3499
- LinkedIn: https://www.linkedin.com/in/kenny-haas
