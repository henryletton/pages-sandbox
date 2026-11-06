# Working on Pages Lab

- Keep the existing React + TypeScript + Vite stack and plain CSS unless the user requests a change.
- This is a static GitHub Pages site deployed beneath `/pages-sandbox/`. Preserve relative asset paths and the Vite base setting.
- Start with `src/App.tsx` for the index and shared navigation, `src/styles.css` for shared styling, and `src/experiments/` for independent experiment content and interactions. Use `public/` for static assets.
- Keep interactions keyboard accessible, layouts responsive, and reduced-motion preferences respected.
- Run `npm run build` after changes. This includes TypeScript checking. Add tests when behavior warrants them rather than tests of static copy or styling.
- Use Node.js 24 and npm. Commit `package-lock.json` alongside dependency changes. Do not commit `node_modules`, `dist`, `.tools`, credentials, or environment files.
- GitHub Actions builds pull requests and deploys pushes to `master`. If the default branch changes, update `.github/workflows/deploy.yml` and the README together.
- Never put secrets in browser code or Vite environment variables. GitHub Pages cannot run a backend. Discuss external services when a feature needs shared data or authentication.
- Navigation uses hash routes (`#/cookie-monster`, `#/confusing-ux`, `#/cant-stop`) in `src/App.tsx` so deep links work on GitHub Pages. Keep each experiment in its own folder under `src/experiments/`, including scoped CSS. Shared navigation must remain outside experiment transformations or event handlers.
- The Can’t Stop engine is pure TypeScript, separate from its UI. Run `npm test` when changing game logic, as well as `npm run build`. Node 24 runs its TypeScript imports natively.
- Cookie Monster must read a detail only after explicit acceptance. Keep its versioned localStorage data separate from saved game state. Decline must collect nothing, and forget must remove the saved cookie data.
