# LumiPDF

LumiPDF is a local-first markdown editor and PDF export workspace built with React, Vite, and Tauri.

## GitHub Pages setup

The project is configured to publish cleanly on GitHub Pages:

- Vite builds with a relative base path so the site works from a repository subpath.
- `privacy.html` is included as a second static page in the build output.
- The favicon and asset paths are Pages-safe.
- The MSIX installer is copied into `dist/downloads/` during `npm run build`.

After you push the repository to GitHub, enable Pages from the `dist` output or connect a GitHub Actions deploy workflow.

Use the direct package URL from Pages in Partner Center:

`https://<your-github-pages-domain>/downloads/LumiPDF_0.1.0_x64.msix`

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

## MSIX packaging

The Tauri CLI in this repo builds MSI and NSIS, but this project also includes a separate MSIX packaging workflow.

```powershell
$env:LUMIPDF_PFX_PASSWORD = "your-pfx-password"
npm run package:msix
```

The script stages only the built app, the frontend `dist` output, and the app assets, then packages and signs a clean MSIX.

The MSIX output is written to `store-package/LumiPDF_0.1.0_x64.msix`.

## Notes

- The web demo stores preferences and draft content in browser local storage.
- The public demo may request fonts from Google Fonts when the page is loaded.
- If you want a custom GitHub Pages URL or domain, keep the relative base path in `vite.config.ts`.