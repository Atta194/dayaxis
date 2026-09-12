# DayAxis — Design Brief

## Design read
For busy people of every age who juggle work, family, health and home: a calm, warm,
human "daily command center" that feels like a helpful kitchen-table co-pilot — soft,
natural, reassuring. Not a cold enterprise scheduler.

## Concept spine
The site is a **daily command center diorama**: a tidy desk where every part of life
finds its slot — a glowing progress ring (today's balance), a calendar, a healthy
plate, a dumbbell, a medicine organizer, a toolbox. Navigation behaves like drawers
of that desk: you open the drawer you need (tasks, kitchen, movement, workforce,
assistant, profile) and it rearranges the whole panel around you (changeable views,
day/night, guest profiles).

## Delivery tier
editorial — user picked **Non-animated** at intake (practical dashboard). Lighter,
motivated micro-motion only: entrance staggers, live progress rings, confetti on
completion, breathing ambient blobs. No camera journey.

## Animation mode: non-animated — "Практичная панель" picked at intake
Tier-1 moment: the live **progress ring + completion confetti** (input-driven: every
checkmark animates), day/night toggle with smooth palette crossfade, animated
counters for stats.

## Locked palette
- `--bg` #F6F3EA warm paper · `--card` #FFFDF6 · `--ink` #24312D deep green-gray
- `--brand` #1E7A6B deep teal · `--brand2` #57BFA9 light teal · `--accent` #E8705F soft coral · `--gold` #E9B44C honey
- dark: bg #131C1A, card #1C2A26, ink #EDEAE2, brand #57BFA9, accent #F08A7B
Defense: natural "forest + cream + clay" family — warm, gender-neutral, healthy-life.
Ban check: not graphite/orange, not near-black/neon, not beige/brass/oxblood, not AI purple.

## Locked type
Inter (UI, system-scale) + Lora (display serif for headlines only — one warm human
accent). Loaded from Google Fonts.

## Section plan
1. Splash / hero card — illustrated diorama scene + brand lockup (SSR-safe, branded).
2. Shell (persistent) — topbar: brand mark, day/night, language, guest switcher; tab rail: Dashboard · Plan · Kitchen · Move · Work · Assist · Me.
3. Dashboard — stat cards (progress ring, done/remaining/postponed/deleted), week strip, today queue with quick-add (text or voice), completion pop-up prompt.
4. Planner — week/month grid, per-day occurrences, edit modal (repeat weekly/custom), postponed & deleted drawers, history report (CSV/PDF/email).
5. Kitchen — dish cards with quantities + computed protein/nutrition/vitamins per servings, diet & speed filters.
6. Move — age-group exercise games with pose graphics + step-by-step detail view.
7. Work — worker marketplace: find/contact, register/manage own profile, reviews, history export.
8. Assist — lightbulb: instant tips & hacks per category, image/voice scan (OCR), emergency quick actions.
9. Me — preferences, data export/backup, feedback & rating.

## Asset plan
Code-drawn brand kit (credits exhausted this month — no external generation):
`/brand/favicon.svg` (ring+check mark), `/brand/logo.svg`, `/brand/og-card.svg` (OG),
`/brand/diorama.svg` (hero scene). Free-stock photo thumbnails (copyright-free,
Unsplash) with inline-SVG fallbacks for recipes/care/wellbeing cards. Full SVG pose
diagrams for exercises (zero external dependency).

## CTA inventory
All controls are app-level (consistent `.btn`/`.chip` affordances) — the ONLY
marketing surface is the splash "Open dashboard" button, which gets its own
distinct identity (coral, rounded-pill, arrow).

## Data
Real backend via D1: homes, members (guests), tasks (repeat weekly/custom days),
completions (done/postponed), workers + reviews, feedback, accounts (email +
passcode, SHA-256) + sessions. Client-only: UI prefs (theme/lang/view), export files.