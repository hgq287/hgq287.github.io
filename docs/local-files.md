# Local-only files (`docs/local/`)

The `docs/local/` directory is **gitignored** and is not deployed to GitHub Pages. Use it for private artifacts and operator notes.

| File | Purpose |
| :--- | :--- |
| `Resume.pdf` | CV PDF (not published on the public site) |
| `resume.mdx` | Full resume markdown source (optional; not wired into the app) |
| `search-indexing-google.md` | Google Search Console indexing checklist |
| `DEPLOYMENT_PLAYBOOK.md` | Extended deployment notes |

After cloning, create `docs/local/` and add your own `Resume.pdf` if needed. The footer resume link is **commented out** in `SiteFooter.tsx` until you copy `Resume.pdf` back to `public/` and uncomment it.
