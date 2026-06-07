# MailSniffer UI

A Mailpit-style email viewer built with React + Vite + TypeScript, MUI, TanStack Table, TanStack Query, organized using the FSD architecture.

## Stack

- **React 18 + Vite + TypeScript**
- **MUI v6** — components & theming
- **TanStack Table v8** — email list with sorting
- **TanStack Query v5** — data fetching with polling
- **DOMPurify** — sanitizing HTML email bodies
- **Vitest + React Testing Library** — unit/integration tests, coverage > 80%
- **Express + tsx** — local mock server for `/emails`

## Architecture (FSD)

```
src/
├── app/                # providers (Theme, QueryClient) and App root
├── pages/
│   └── mailbox/        # MailboxPage
├── widgets/
│   ├── email-list/     # TanStack Table widget
│   └── email-detail/   # Email reader pane
├── features/
│   ├── email-search/   # SearchInput + filter logic
│   └── email-select/   # selected email state
├── entities/
│   └── email/          # type, API call, useEmailsQuery (polling)
└── shared/
    ├── api/            # fetch wrapper, HttpError
    ├── config/         # constants (POLLING_INTERVAL_MS, QUERY_KEYS)
    └── lib/            # formatDate, sanitizeHtml, textSearch
```

Higher layers depend on lower ones only. Each slice exposes a public API via `index.ts`.

## API contract

`GET /emails` returns:

```ts
{
  id: string;
  from: string;
  to: string;
  cc: null | string;
  bcc: null | string;
  subject: string;
  body: string;          // either plain text or HTML
  contentType: string;   // e.g. "text/plain" or "text/html"
  hasAttachements: boolean;
  receivedAt: string;    // ISO; converted via Intl.DateTimeFormat
}[]
```

Polling is configured via `POLLING_INTERVAL_MS` (default `5000`) in `useEmailsQuery`.

## Running locally

```bash
npm install

# Start mock server + Vite dev server together (recommended)
npm run dev:all

# Or separately
npm run server   # Express on http://localhost:3001
npm run dev      # Vite on  http://localhost:5173 (proxies /emails -> :3001)
```

The mock server (`server/index.ts`) seeds a few emails and pushes a new one every 15s so polling shows live arrivals.

## Tests

```bash
npm test              # one-shot run
npm run test:watch    # watch mode
npm run test:coverage # coverage report (thresholds: 80% all metrics)
```

Coverage is configured in `vitest.config.ts` with thresholds set to **80%** for lines, functions, branches, and statements.

## Type-check & build

```bash
npm run typecheck
npm run build
```
