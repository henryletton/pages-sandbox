# Working on Pages Lab

- Keep the existing React + TypeScript + Vite stack and plain CSS unless the user requests a change.
- This is a static GitHub Pages site deployed beneath `/pages-sandbox/`. Preserve relative asset paths and the Vite base setting.
- Start with `src/App.tsx` for content, components, and interactions; `src/styles.css` for styling; and `public/` for static assets. Extract components when it makes a change clearer.
- Keep interactions keyboard accessible, layouts responsive, and reduced-motion preferences respected.
- Run `npm run build` after changes. This includes TypeScript checking. Add tests when behavior warrants them rather than tests of static copy or styling.
- Use Node.js 24 and npm. Commit `package-lock.json` alongside dependency changes. Do not commit `node_modules`, `dist`, `.tools`, credentials, or environment files.
- GitHub Actions builds pull requests and deploys pushes to `master`. If the default branch changes, update `.github/workflows/deploy.yml` and the README together.
- Never put secrets in browser code or Vite environment variables. GitHub Pages cannot run a backend. Discuss external services when a feature needs shared data or authentication.
- There is no client-side router yet. Use in-page links for now; discuss URL handling before adding routes because GitHub Pages does not provide SPA fallback routing.
