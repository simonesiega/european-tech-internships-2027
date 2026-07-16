# Website foundation

[← README](../README.md)

The repository includes a minimal Next.js foundation for `https://internship2027.simonesiega.com`. It intentionally contains no visual design, filtering, pagination, analytics, or application features yet.

## Structure

The website is isolated under `site/` so the existing Python `src/internships/` package does not need to move:

```text
site/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       └── internships.ts
├── .env.example
├── .prettierignore
├── .prettierrc.json
├── bun.lock
├── eslint.config.mjs
├── next.config.ts
├── package.json
└── tsconfig.json
```

The structure and tool versions follow [`simonesiega/portfolio`](https://github.com/simonesiega/portfolio): Next.js App Router, strict TypeScript, ESLint core web vitals, Bun, standalone output, security headers, and the same Prettier configuration.

## Database contract

`site/src/lib/internships.ts` opens the canonical SQLite database in read-only mode and selects the same open jobs published by the README:

```sql
SELECT linkedin_job_id, company, title, location, link
FROM jobs
WHERE status = 'open'
ORDER BY lower(company), lower(title), location;
```

A short-lived connection is used per server request, allowing later requests to observe newly committed collection data. The website never runs migrations and never writes to SQLite. The pipeline remains the only writer and canonical owner of schema and lifecycle state.

Configure the database file with:

```dotenv
INTERNSHIPS_DATABASE_PATH=../data/internships.db
```

Use an absolute path when starting standalone output outside the `site/` working directory. The production container always uses `/app/data/internships.db`.

## Local development

Requirements: Bun `1.3.14`, Node.js compatible with Next.js 16, and an initialized pipeline database.

```bash
uv run internships db-upgrade
cd site
bun install --frozen-lockfile
cp .env.example .env.local
bun run dev
```

Open `http://localhost:3000`. The base page is intentionally unstyled and only proves that server rendering can read the open internship count.

Run all website checks with:

```bash
cd site
bun run ci
```

This verifies Prettier, ESLint, strict TypeScript, and a production Next.js build.

## Production container

The root [`Dockerfile`](../Dockerfile) has two named targets:

| Target | Purpose |
|---|---|
| `internships` | Python collection, migration, validation, and README commands. |
| `site` | Next.js standalone server running as the unprivileged `nextjs` user. |

The website dependency layer uses Bun. Next.js is built and served with Node 26 so the build and production server use the same `node:sqlite` implementation.

Compose mounts the pipeline database read-only and exposes the server only to the Compose network:

```yaml
site:
  volumes:
    - internships-data:/app/data:ro
  expose:
    - "3000"
```

Start it with:

```bash
docker compose up --detach --build site
```

In Dokploy, add `internship2027.simonesiega.com` to the `site` service and select container port `3000`. Dokploy’s reverse proxy reaches the service through Docker networking, so no host port should be published. For another containerized proxy, route to `http://site:3000` on the shared network.

The deployment origin in the root `.env` is:

```dotenv
SITE_URL=https://internship2027.simonesiega.com
```

Compose creates the `internships-data` named volume on first deployment. The pipeline mounts it read/write, while the website mounts the same volume read-only. The `internships` service runs `db-upgrade` during deployment, and the site waits for that migration to complete successfully.

Run an authorized collection from the Compose project with:

```bash
INTERNSHIPS_LINKEDIN_CRAWL_AUTHORIZED=true \
  docker compose run --rm internships scrape --no-render
```

The site observes committed changes on the next request; it does not need to be rebuilt or restarted. Use `--no-render` on a VPS when only the website projection is needed and no Git working tree update should be produced.

## Continuous integration

The dedicated [`site-ci.yml`](../.github/workflows/site-ci.yml) workflow installs the frozen Bun lockfile and runs `bun run ci`. The separate Docker workflow additionally:

1. builds both named image targets;
2. creates a fresh database with the pipeline image;
3. starts the site image with that database mounted read-only;
4. requires a successful HTTP response from the base page.

CI validation does not contact LinkedIn. The separately controlled collection workflow can optionally deploy its validated database to the `internships-data` volume over SSH. When that mode is enabled, GitHub Actions is the canonical writer and VPS scrape commands must not be used. See [Automation](automation.md#optional-vps-database-deployment).
