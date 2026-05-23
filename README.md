# LumiPDF

LumiPDF is a local-first markdown editor and PDF export workspace built with React, Vite, and Tauri.

## GitHub Pages setup

The project is configured to publish cleanly on GitHub Pages:

- Vite builds with a relative base path so the site works from a repository subpath.
- `privacy.html` is included as a second static page in the build output.
- The favicon and asset paths are Pages-safe.

After you push the repository to GitHub, enable Pages from the `dist` output or connect a GitHub Actions deploy workflow.

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The build output is written to `dist/` and includes:

- `index.html`
- `privacy.html`

## Notes

- The web demo stores preferences and draft content in browser local storage.
- The public demo may request fonts from Google Fonts when the page is loaded.
- If you want a custom GitHub Pages URL or domain, keep the relative base path in `vite.config.ts`.