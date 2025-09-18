# Repository Guidelines

## Project Structure & Module Organization
The Next.js App Router lives in `src/app`, with `layout.tsx` handling metadata and scaffolding and `globals.css` for Tailwind layer imports. Landing sections are exported from `src/components/layout` and imported via the `@/` alias; keep new UI in this folder or group reusable primitives beside their usage. Shared helpers and integrations belong in `src/lib`, including the Contentful client. Static images and fonts go in `public/`; configuration files such as `next.config.ts`, `eslint.config.mjs`, and `postcss.config.mjs` stay at the repository root.

## Build, Test, and Development Commands
Run `npm install` once to sync dependencies. `npm run dev` starts the local server on `http://localhost:3000`. `npm run build` performs a production build and should pass before release. `npm run start` serves the compiled output for smoke-testing. `npm run lint` runs ESLint with the Next.js core-web-vitals rules—use it pre-commit.

## Coding Style & Naming Conventions
Write TypeScript with strict mode and favour small, typed React function components. Use two-space indentation and keep imports sorted by scope (external, alias, relative). Components remain PascalCase, hooks camelCase with a `use` prefix, and utility modules map to `src/lib/<topic>.ts`. Prefer Tailwind classes in JSX instead of custom CSS; reserve `globals.css` for design tokens. Always reference internal modules through the `@/` alias to avoid fragile relative paths.

## Testing Guidelines
An automated test harness is not bundled yet; when adding features, supply targeted unit or integration tests and document how to execute them in the PR. Place future tests under `src/__tests__` or co-locate `*.test.ts(x)` files near the component. At minimum, verify new work by running `npm run build` and exercising the affected routes manually; capture any Contentful schema changes.

## Commit & Pull Request Guidelines
Follow Conventional Commits (`feat:`, `fix:`, `chore:`) as seen in the history. Each pull request needs a clear summary, linked issue or task, screenshots or screen recordings for UI shifts, and notes about schema or configuration updates. Mention manual QA steps and new environment variables so reviewers can reproduce the setup quickly.

## Contentful & Environment
Create a `.env.local` with `CONTENTFUL_SPACE_ID` and `CONTENTFUL_ACCESS_TOKEN`; never commit secrets. If you change required environment keys or Contentful content models, update `src/lib/contentful.ts` and the README, and call it out in the pull request. Use placeholder values (`XXX`) in docs and sample env files.
