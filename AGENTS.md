# Sarom blog source

Read `README.md`, then `.site-foundry/changes/astro-blog/proposal.md` and `tasks.md` before changes. Human-facing docs are Chinese; agent instructions are English.

- This is the source project. The GitHub remote is `SaromChars/SaromChars.github.io`; the older checkout at `/Users/sc/proj/SaromChars.github.io` retains the pre-migration snapshot. Site Foundry at `/Users/sc/workspace/site-foundry` keeps only an index.
- Preserve the old article URL and recovered text/diagram sources. Add future permalink migrations in `src/site/legacy-routes.ts`.
- Keep site-specific content, branding and account configuration separate from reusable layouts and helpers. Preserve the upstream LICENSE.
- `npm ci`, `npm run build`, `npm test`; preview with `npm run preview`. Draft preview is local-only via `npm run preview:drafts`.
- Production analytics requires `PUBLIC_DEPLOY_ENV=production`, `PUBLIC_ENABLE_ANALYTICS=true`, and a valid public GA4 measurement ID. Never put credentials or personal data in events or repository files.
- Do not commit `dist`, `.astro`, `.local`, node_modules, local environment files, browser screenshots or raw reports.
- User authorized migrating the existing blog to this source project and publishing at its existing domain. The `pages.yml` workflow deploys master pushes to production; treat future master pushes as publishing. PR checks do not deploy. Do not change DNS, custom domain, repository visibility or credentials without applicable authorization. Preserve CNAME and the pre-migration commit for rollback.
- Keep evidence and remaining work in this repository. Do not delegate without applicable workspace authorization.
