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

## Contentful Data Import Playbook
- **Prereqs**: Ensure the Contentful CLI is logged in (`contentful login`) and `.env.local` exposes `CONTENTFUL_SPACE_ID`/`CONTENTFUL_ACCESS_TOKEN`. Export a management token as `CONTENTFUL_MANAGEMENT_TOKEN` (e.g., from `~/.contentfulrc.json`) before running the publish script. The space must already contain the published content types listed below (notably `aboutMe` must include the `avatarUrl` symbol field).
- **Source of truth**: `contentful-import-data.json` stores the full import bundle (content model + entries for local dev). Keep IDs stable—updates are idempotent and safe to re-run.
- **Import command**: Run `contentful space import --space-id z79er4rv39my --content-file contentful-import-data.json`. No extra flags are needed when the content model is unchanged. The CLI reports only updates because entries already exist.
- **After import**: Entries arrive unpublished. Publish them in bulk with the snippet below (adjust the IDs list if it changes) or via the Contentful UI. If the data file changes, rerun the import and republish.

  ```bash
  node - <<'NODE'
  const fetch = globalThis.fetch;
  const token = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const environmentId = 'master';
  const ids = [
    'author-primary',
    'about-me-primary',
    'contact-primary',
    'workhistory-zema',
    'workhistory-dataart',
    'workhistory-epam',
    'workhistory-noorlogic',
    'workhistory-sunnyschool',
    'workhistory-polymorphic',
    'education-rau-masters',
    'education-rau-bachelors',
    'education-aca',
    'skill-javascript-es6',
    'skill-typescript',
    'skill-react',
    'skill-angular',
    'skill-html-css',
    'skill-nodejs',
    'skill-sql',
    'skill-nosql',
    'skill-rest-graphql',
    'skill-git',
    'skill-aws',
    'skill-firebase',
    'skill-jira',
  ];

  const base = `https://api.contentful.com/spaces/${spaceId}/environments/${environmentId}`;

  async function publishEntry(id) {
    const res = await fetch(`${base}/entries/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch ${id}: ${res.status}`);
    }
    const { sys } = await res.json();
    const publishRes = await fetch(`${base}/entries/${id}/published`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Contentful-Version': sys.version,
        'Content-Type': 'application/vnd.contentful.management.v1+json',
      },
    });
    if (!publishRes.ok) {
      throw new Error(`Failed to publish ${id}: ${publishRes.status}`);
    }
    console.log(`Published ${id}`);
  }

  (async () => {
    for (const id of ids) {
      await publishEntry(id);
    }
  })().catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
  NODE
  ```
- **Failure recovery**: Validation errors often point to schema mismatches (e.g., missing fields). Fix the content type, publish it, and re-run the import. The `--skip-content-model` flag is handy when the bundle only contains entries.

## Contentful Schema Reference
- **Author (`author`)**: `name` (Symbol, required; displayed in the site header).
- **About Me (`aboutMe`)**: `text` (Text, optional), `avatar` (Asset link, optional), `avatarUrl` (Symbol, optional; used when no asset is provided). Frontend prefers the asset URL, then `avatarUrl`, else `/default-avatar.svg`.
- **Contact (`contact`)**: `email` (Symbol), `phone` (Symbol), `socialLinks` (Object, optional key/value map).
- **Work History (`workHistory`)**: `title`, `company`, `location`, `period` (all Symbols), `description` (Text), `startDate` (Date, leveraged for ordering and experience calculation).
- **Education (`education`)**: `institution`, `degree`, `period` (Symbols), `startDate` (Date for sorting).
- **Professional Skill (`professionalSkill`)**: `name` (Symbol), `category` (Symbol; displayed as column headers), `strength` (Integer 1‑5; drives rating pills).
- **Project (`project`)**: Existing space contains this type (title/description/projectUrl/image). Current bundle does not seed project entries—update the import file if these are needed.

Keep this table current whenever a field is added, removed, or requirements change. Any schema adjustments require: (1) content model updates in Contentful, (2) refreshed sample data in `contentful-import-data.json`, (3) frontend component updates, and (4) a note here describing the change.
