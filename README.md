# angelotorella.github.io

Personal site of Angelo Torella. Fully static: no server, no database.

## Stack

- [Astro 7](https://docs.astro.build) (`output: 'static'`) with content collections
- Tailwind CSS 3 (`@astrojs/tailwind`)
- GitHub Pages hosting at https://angelotorella.github.io
- Optional contact form via any Formspree-compatible endpoint

## Editing content

All content lives in `src/content/` and is validated by `src/content.config.ts`:

| File / folder | What it holds |
| --- | --- |
| `src/content/profile.json` | Name, title, bio, email, socials (empty string = hidden), education, languages |
| `src/content/services/*.md` | One service per file. Frontmatter = fields, body = description. The filename is the URL slug (`/services/<slug>/`) |
| `src/content/case-studies/*.md` | Case studies; `service:` must match a service filename |
| `src/content/experience.json` | CV experience entries (`startDate`/`endDate` as `YYYY-MM`) |
| `src/content/tech-stack.json` | Skills shown on the CV, grouped by `category`, referenced from services |

Search for `TODO` to find every placeholder that still needs real data.

Optional files in `public/` (rendered only if they exist):

- `public/cv/angelo-torella-cv.pdf` — enables the download button on `/cv`
- `public/og-image.png` — social preview image
- avatar image — set `avatarUrl` in `profile.json` (e.g. `/images/avatar.jpg`)

## Local development

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm check      # type and content checks
pnpm build      # outputs to dist/
pnpm preview
```

Contact form: copy `.env.example` to `.env` and set `PUBLIC_FORM_ENDPOINT` (e.g. `https://formspree.io/f/<id>`). If it is empty, `/contacto` shows a mailto link instead.

## Workflow

This repository uses **trunk-based development**:

- `main` is the only long-lived branch and is always deployable.
- Commit small, focused changes directly to `main` using [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`).
- Use a short-lived branch only for a large change, and merge it back within a day or two.
- Run `pnpm check && pnpm build` before pushing. CI runs the same checks and blocks the deploy if they fail.
- AI agent instructions (`AGENTS.md`, `CLAUDE.md`, `.claude/`) stay local and are git-ignored. If something is committed by mistake, follow [docs/accidental-commit-runbook.md](docs/accidental-commit-runbook.md).

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: a `check` job (`astro check`) must pass before the `build` (`withastro/action`) and `deploy` (`actions/deploy-pages`) jobs run.

One-time setup in the GitHub repository:

1. Settings → Pages → Source: **GitHub Actions**.
2. Optional: to use a custom domain, add `public/CNAME` with the domain, update `site` in `astro.config.mjs`, and point the domain's DNS to GitHub Pages.
3. Optional: Settings → Secrets and variables → Actions → Variables → `PUBLIC_FORM_ENDPOINT`.
