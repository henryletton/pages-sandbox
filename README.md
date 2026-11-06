# Pages Lab

A small GitHub Pages sandbox built with **React, TypeScript, Vite, and plain CSS**. The first page includes a live demo with three layouts and three colour palettes. Demo data is illustrative; choices reset on reload.

## Local development

Install [Node.js 24 LTS](https://nodejs.org/en/download) with npm, then reopen your terminal. From this directory:

```powershell
npm.cmd install
npm.cmd run dev
```

Open the local URL printed by Vite (usually `http://127.0.0.1:5173`). Changes update automatically. On Windows, `npm.cmd` also avoids PowerShell script execution-policy issues; `npm` works in other shells.

```powershell
npm.cmd run check    # TypeScript checks
npm.cmd run build    # TypeScript checks + production files in dist/
npm.cmd run preview  # Serve the production build locally
```

After the first install, use `npm.cmd ci` for a clean install matching the committed lockfile.

If a portable Node runtime has been prepared under the ignored `.tools` folder, use it in a PowerShell session without a system installation:

```powershell
$nodeDir = Get-ChildItem -LiteralPath .tools -Directory -Filter 'node-v24.*-win-x64' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$env:Path = "$($nodeDir.FullName);$env:Path"
npm.cmd run dev
```

## Publish on GitHub Pages

1. Commit these files and push them to `master` in `henryletton/pages-sandbox`. GitHub Desktop: enter a summary, click **Commit to master**, then **Push origin** (or **Publish branch**).
2. Open [repository Pages settings](https://github.com/henryletton/pages-sandbox/settings/pages).
3. Under **Build and deployment → Source**, choose **GitHub Actions**. The workflow is already included; you do not need to generate another one.
4. Open the [Actions tab](https://github.com/henryletton/pages-sandbox/actions) and select **Deploy to GitHub Pages**. If the initial run failed because Pages was not enabled, rerun it. You can also choose **Run workflow** on `master`.
5. Wait for both `build` and `deploy` to succeed. Follow the URL shown by the deployment. The expected address is **https://henryletton.github.io/pages-sandbox/**.
6. Make a small edit to the page, commit, and push again to see automatic publishing.

If Pages is unavailable, check repository visibility and your GitHub plan: public repositories can use Pages on GitHub Free; private repositories require a supported paid plan. A Pages site may be publicly accessible even when its source repository is private. Publish only content intended for visitors.

This workflow checks pull requests without publishing them. Pushes to `master` build and deploy `dist/` using the lockfile. Keep `dist/` out of Git. If you rename the branch, update both branch triggers and the deploy condition in `.github/workflows/deploy.yml`.

Reference: [Vite's GitHub Pages guide](https://vite.dev/guide/static-deploy#github-pages), [GitHub's publishing settings](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Where to make changes

| File | Purpose |
| --- | --- |
| `src/App.tsx` | Page content and interactive demo |
| `src/styles.css` | Colours, typography, layout, responsive styles |
| `src/main.tsx` | React entry point |
| `index.html` | Browser title, description, document shell |
| `public/` | Files copied unchanged into the site |
| `vite.config.ts` | Build configuration and relative asset paths |
| `.github/workflows/deploy.yml` | Build checks and Pages publishing |
| `AGENTS.md` | Guidance for future AI agents |

Google Fonts supplies DM Sans and Manrope; system fallbacks work without that external request. No analytics, accounts, backend, or database are configured. React handles interaction in the visitor's browser. GitHub Actions runs the Node.js build; visitors need only a browser.

## Growing the site

Add reusable components and new content within this stack. For multiple URLs, choose a routing approach that works with GitHub Pages before adding a router. `base: './'` supports the current single-page site at the repository URL or a custom domain. Shared data, secret API calls, logins, and server tasks require an external service; do not put secrets in frontend code.
