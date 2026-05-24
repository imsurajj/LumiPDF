# LumiPDF

LumiPDF is a local-first markdown editor and PDF export workspace built with React, Vite, and Tauri.

## Vercel hosting

Use Vercel to serve the landing page and the installer file directly over `https://` without buying a domain.

### Project layout

Keep the page files unchanged and place the installer here:

```text
public/
└── downloads/
	└── v1.0.0/
		└── LumiPDF.msi
```

### What to deploy

1. Keep the existing `index.html` and `privacy.html` content as-is.
2. Copy the MSI into `public/downloads/v1.0.0/LumiPDF.msi` before deploying.
3. Deploy the repo to Vercel.
4. Vercel will serve the static file directly from the `public` folder.

### Expected URLs

- Homepage: `https://lumipdf.vercel.app`
- Privacy policy: `https://lumipdf.vercel.app/privacy`
- Installer: `https://lumipdf.vercel.app/downloads/v1.0.0/LumiPDF.msi`

### Why this works for Partner Center

- The installer URL starts with `https://`
- It points directly to the MSI file
- The path is versioned
- There is no redirect chain through GitHub Releases or a landing page

### Before submitting to the Store

1. Open the installer URL in a private browser window.
2. Confirm it downloads the MSI directly.
3. Paste that exact URL into Partner Center.
4. Keep the `v1.0.0` folder pattern for future releases.

### Deployment note

The repo is ready for a static Vercel deploy with a rewrite so `/privacy` maps to `privacy.html`.

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

The MSIX output is written to `store-package/LumiPDF_0.1.0_x64.msix` and can be uploaded to Azure Blob Storage.

## Notes

- The web demo stores preferences and draft content in browser local storage.
- The public demo may request fonts from Google Fonts when the page is loaded.
- If you host the web preview somewhere else, keep the relative base path in `vite.config.ts`.