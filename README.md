# DayAxis — Daily Life Toolkit

A calm, warm daily command center PWA for busy people who juggle work, family, health and home.
Tasks, planning, kitchen, movement, work and assistance — one tidy desk for every part of life.

**Live app:** https://dayaxis.higgsfield.app/ — Cloudflare Workers + D1 backend, 24 languages.

## Features

- **Dashboard** — today's queue, live progress ring, quick add (text or voice), week strip, completion confetti
- **Planner** — week/month grid, repeat tasks (weekly / custom days), postponed & deleted drawers, history export (CSV / PDF / email)
- **Kitchen** — dish cards with per-serving nutrition (protein / vitamins), diet & speed filters
- **Move** — age-group exercise games with pose diagrams and step-by-step detail views
- **Work** — worker marketplace: find & contact, register/manage your own profile, reviews, history export
- **Assist** — instant tips & hacks per category, image / voice scan (OCR), emergency quick actions
- **Me** — preferences, data export / backup, feedback & rating
- Guest profiles, day/night mode, 24 languages, accounts with email + passcode

## Tech stack

- React 19 + TypeScript, TanStack Start (SSR on one Cloudflare Worker)
- Vite 7, Tailwind CSS 4, Radix UI primitives (shadcn-style components)
- Cloudflare D1 (SQL) with versioned migrations
- Higgsfield `fnf`, `fnf-react` and `quanta` workspace packages
- CI via GitHub Actions (`.github/workflows/ci.yml`)

## Project layout

```
.
├── app/                      # Full application source root
│   ├── migrations/           # D1 SQL migrations (0001_init … 0007_tips_content)
│   ├── packages/             # @higgsfield/fnf, @higgsfield/fnf-react, @higgsfield/quanta
│   ├── public/               # Brand kit, icons, manifest, service worker
│   ├── scripts/              # e.g. icon generation
│   └── src/                  # routes, components (incl. da-* app components), layouts, lib
└── .github/workflows/        # CI pipeline
```

## Development

```bash
cd app
bun install
bun run dev        # local dev server
bun run build      # typecheck + production build
bun run lint       # eslint
bun run typecheck  # tsc --noEmit
```

## Design

Warm "forest + cream + clay" identity — deep teal `#1E7A6B` on warm paper `#F6F3EA` with soft coral `#E8705F` accents, Inter + Lora type, day/night mode. Full rationale in [`app/design-brief.md`](app/design-brief.md).

## License

All rights reserved. © DayAxis