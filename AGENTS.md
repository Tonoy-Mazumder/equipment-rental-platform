# AGENTS.md — RentPro client

Next.js 16 App Router + React 19 frontend for the RentPro equipment-rental
platform. This checkout is the client only; the sibling `server/` (outside this
repo) exists but is empty, so there is no backend yet.

## Commands

- Use **npm** (`package-lock.json`); ignore the yarn/pnpm/bun alternatives in the
  generated README.
- `npm run dev` · `npm run build` · `npm run start` · `npm run lint`
  (`npm run lint -- --fix` to autofix).
- Typecheck has no script: `npx tsc --noEmit`. Next's `next-env.d.ts` and route
  types are generated and gitignored, so run `npm run dev` or `npm run build`
  once first on a fresh clone.
- No tests, formatter, or CI are configured. Do not add them unless asked.

## Toolchain quirks

- **Tailwind v4, CSS-first**: there is no `tailwind.config.*`. Theme tokens and
  `@theme inline` live in `src/app/globals.css`. Turbopack loads Tailwind through
  the `@tailwindcss/turbopack` rule in `next.config.ts` (there is no PostCSS
  config).
- **shadcn style `base-nova` uses Base UI, not Radix**: primitives in
  `src/components/ui/` import from `@base-ui/react` (e.g. `ButtonPrimitive`).
  Radix-based snippets from shadcn docs will not drop in.
- `cn()` is the npm `cn` package, re-exported by `src/lib/utils.ts`; import it
  from `@/lib/utils`. Do not add `clsx`/`tailwind-merge`.
- Fonts load once in `src/app/layout.tsx` via `next/font/google`: Manrope →
  `font-heading` (also applied to h1–h6 in `globals.css`), DM Sans → `font-sans`
  (default on `<html>`), Geist Mono → `font-mono` for code. Never add fonts or
  font `<link>`s.
- `LayoutProps<"/">` and similar route types are Next 16 globals generated into
  `.next`; they need no import.

## Design system

- Style with existing tokens (`bg-background`, `text-muted-foreground`,
  `border-border`, …), not raw palette colors, so dark mode (`.dark`) keeps
  working.
- Responsive heading tokens: `text-hero`, `text-page`, `text-section`,
  `text-card-title` (clamp-based; no breakpoint classes needed).
- Orange accent: `bg-brand` / `text-brand`, and the `brand` Button variant.
- `src/app/page.tsx` still uses starter markup (`bg-zinc-50`); convert it to
  tokens when you touch it.

## Structure and conventions

- Routes live in `src/app/<route>/page.tsx`; only `/` exists today. `Navbar`
  links to `/equipment`, `/how-it-works`, `/list-equipment`, `/dashboard`,
  `/login`, `/signup` — these are the intended routes; keep them in sync with
  `src/components/navbar.tsx`.
- The root layout renders the shared `Navbar`; pages must not add another one.
- Follow `navbar.tsx` for layout: `mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8`,
  mobile menu below `lg`.
- Server Components by default; add `"use client"` only for state, effects, or
  browser APIs.
- Pages/layouts use default exports; shared components use named exports in
  kebab-case files (e.g. `equipment-card.tsx` exporting `EquipmentCard`).
- Import shared code through the `@/*` alias (→ `src/*`).
