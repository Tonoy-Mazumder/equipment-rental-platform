# AGENTS.md — RentPro (Client)

Guidelines for everyone contributing to the RentPro equipment rental platform **client**.
Follow these rules for every change, no matter how small.

> **Golden rule:** Always prioritize **readability, simplicity, maintainability, and responsive design** over clever or unnecessarily complex code.

---

## Project Overview

RentPro is an equipment rental platform. This repository contains the **frontend** (Next.js). A sibling `server/` folder is reserved for the future backend — it is currently empty.

### Tech Stack

| Tool | Version / Notes |
| --- | --- |
| Next.js | 16.4.6 — **App Router** |
| React | 19.3.0 |
| TypeScript | 5.x — `strict: true` |
| Tailwind CSS | **4.3.3 — CSS-first config** (no `tailwind.config` file) |
| UI components | shadcn style **`base-nova`** on `@base-ui/react` primitives |
| Variants | `class-variance-authority` (cva) |
| Icons | `lucide-react` only |
| Fonts | **Manrope** (headings), **DM Sans** (body), Geist Mono (code) — loaded via `next/font/google` |
| Class merging | `cn()` (from `cn` package, re-exported by `src/lib/utils.ts`) |
| Linting | ESLint 9 + `eslint-config-next` (core-web-vitals + typescript) |

### Commands

```bash
npm run dev     # start dev server (http://localhost:3000)
npm run build   # production build
npm run start   # serve production build
npm run lint    # run ESLint — run this before finishing any task
```

There is no test runner or formatter configured yet. Do not add one without a clear reason.

---

## Project Structure

```
client/
├── components.json          # shadcn config (aliases, style: base-nova, lucide icons)
├── next.config.ts           # Next.js config (Turbopack + Tailwind CSS loader)
├── tsconfig.json            # path alias: @/* → ./src/*
├── public/                  # static assets (images, svgs)
└── src/
    ├── app/
    │   ├── globals.css      # Tailwind v4 theme + design tokens (CSS variables)
    │   ├── layout.tsx       # root layout (fonts, <html>, metadata)
    │   ├── page.tsx         # home page
    │   └── favicon.ico
    ├── components/
    │   └── ui/              # reusable shadcn primitives (button.tsx, ...)
    └── lib/
        └── utils.ts         # shared helpers (re-exports cn)
```

**Conventions:**

- Page and layout files are named `page.tsx` / `layout.tsx` (App Router requirement).
- Component files are lowercase (`button.tsx`); use kebab-case for multi-word names (`user-card.tsx`).
- React components are named in PascalCase (`Button`, `UserCard`).
- Pages/layouts use **default exports**; shared components use **named exports** (see `src/components/ui/button.tsx`).
- Import shared code with the `@/` alias: `import { cn } from "@/lib/utils"`.

---

## 1. Code Readability

- Write simple, clean, and easy-to-understand code. Prefer straightforward solutions over clever ones.
- Keep functions and components **small and focused** — one responsibility each.
- Use meaningful, descriptive names: `equipmentItems`, not `data1`; `formatRentalPrice()`, not `fmt()`.
- Avoid deeply nested conditions. Use **early returns** instead:

  ```tsx
  // Good — early return
  if (!equipment) {
    return <EmptyState message="No equipment found" />;
  }
  // ...continue with the happy path
  ```

- One operation per line. Do not pack multiple unrelated operations into one line.
- Add a short comment **only** when the code is not self-explanatory (e.g. a tricky date calculation).
- Keep formatting and indentation consistent with the file you are editing.
- Write code that a beginner developer can read and understand without prior context.

## 2. Beginner-Friendly Development

- Prefer readable code over advanced techniques. Avoid unnecessary design patterns, abstract base classes, generics gymnastics, and premature optimization.
- **Do not introduce a new library** unless the requirement genuinely cannot be met with what is already installed. Check `package.json` first.
- Explain complex logic (pricing rules, availability checks, date ranges) with a short comment.
- Keep the structure predictable: pages in `src/app`, shared UI in `src/components`, helpers in `src/lib`.
- Use the same patterns everywhere (see "Existing Patterns" below). Consistency beats variety.
- Never sacrifice maintainability just to write fewer lines of code.

## 3. Component Architecture

- Build a reusable component **only when it genuinely reduces duplication** (used 2+ times or clearly will be).
- Keep each component focused on one responsibility. Split components that render large unrelated blocks.
- Separate concerns:
  - **UI components** → `src/components/` (reusable across pages) or colocated in `src/app/<route>/` if only used there.
  - **shadcn primitives** → `src/components/ui/` (generated/edited via shadcn).
  - **Utility functions** → `src/lib/utils.ts` (or a new file in `src/lib/` if it grows).
  - **API calls** → see section 9.
- Do not create a component for every tiny element (a single `<span>` or icon wrapper does not need its own file).
- Avoid oversized components: if a file grows past roughly 150–200 lines of JSX, consider splitting it.
- Use consistent naming: a component named `EquipmentCard` lives in `equipment-card.tsx`.

### Existing Patterns (copy these)

Button component (cva variants + `cn`):

```tsx
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-lg border border-border bg-card p-4", {
  variants: {
    variant: {
      default: "",
      featured: "border-primary",
    },
  },
  defaultVariants: { variant: "default" },
});
```

Usage in JSX:

```tsx
<div className={cn(cardVariants({ variant }), className)}>
```

## 4. TypeScript Standards

- Use TypeScript properly — the project has `strict: true`.
- Define explicit types and interfaces for props, API responses, and shared data shapes.
  Put shared types in `src/types/` or next to the code that owns them; reuse instead of duplicating.
- **Never use `any`** unless absolutely unavoidable (e.g. third-party types that force it). Prefer `unknown` + narrowing.
- Avoid unnecessary type assertions (`as`). If you need one, question whether the type is wrong.
- Handle nullable/optional values safely — check before use:

  ```tsx
  // Good
  if (!user) return null;
  return <p>{user.name}</p>;
  ```

- Keep types simple and understandable. Do not build complex generic inference for beginners to decode.
- Type component props with a `Props` interface or inline:

  ```tsx
  type EquipmentCardProps = {
    title: string;
    pricePerDay?: number;
    isAvailable?: boolean;
  };

  export function EquipmentCard({ title, pricePerDay, isAvailable = true }: EquipmentCardProps) { ... }
  ```

## 5. Responsive UI — Mandatory

Every page and component **must** work properly at all of these widths:

| Device | Width |
| --- | --- |
| Small mobile | 320px – 480px |
| Large mobile | 481px – 767px |
| Tablet | 768px – 1023px |
| Laptop | 1024px – 1279px |
| Desktop | 1280px and above |

**Rules:**

- **Mobile-first:** write base styles for small screens, then enhance upward with Tailwind breakpoints (`sm:` 640, `md:` 768, `lg:` 1024, `xl:` 1280).
- **Never allow horizontal overflow.** No fixed widths wider than the viewport; watch for wide tables, images, and `whitespace-nowrap` on long text.
- Use flexible layouts: `flex`, `grid` with `grid-cols-1` on mobile → `sm:grid-cols-2` → `lg:grid-cols-3`, etc.
- Make images responsive: `next/image` with proper `width`/`height`, `object-cover`, and an aspect-ratio container where needed.
- Navigation must work on mobile (menu collapses, links are reachable and tappable).
- **Stack columns vertically on smaller screens** instead of squeezing them side by side.
- Forms, tables, cards, dialogs, and dashboards must be usable on mobile:
  - Tables: wrap in `overflow-x-auto` or switch to stacked card layout on mobile.
  - Forms: full-width inputs on mobile, comfortable spacing between fields.
  - Dialogs/modals: fit the viewport (`max-h-[90dvh]`, scrollable body, closable on mobile).
- Provide readable typography and appropriate spacing at every size (minimum ~16px body text on mobile).
- Touch targets: buttons and interactive elements should be at least ~40px tall on touch devices.
- **Never just shrink a desktop layout** to fit a mobile screen — redesign the flow for small screens.
- Before finishing a task, check important pages at mobile (~375px), tablet (~768px), and desktop (~1280px) widths (browser dev tools are enough).

## 6. UI/UX Quality

- Maintain one consistent design system across the whole app — reuse the existing tokens (section 7).
- Keep visual hierarchy clear: one `h1` per page, sensible heading order (`h1` → `h2` → `h3`).
- Reuse consistent styles for buttons, inputs, cards, dialogs — prefer the components in `src/components/ui/`.
- Add **hover, focus-visible, active, and disabled** states to interactive elements (the `Button` component already does this — do the same for custom elements).
- Provide the states users expect: **loading** (spinners/skeletons), **empty**, **success**, and **error**.
- Avoid visual clutter. White space is fine; random colors and nested boxes are not.
- Ensure text contrast is sufficient (use `text-foreground` / `text-muted-foreground` tokens, not random grays).
- **Never ship placeholder or Lorem Ipsum content** in production UI.
- Accessibility matters:
  - Semantic HTML (`<nav>`, `<main>`, `<button>`, `<label>` — not clickable `<div>`s).
  - Every input has a visible `<label>` (or `aria-label` when the label is visually hidden).
  - Keyboard navigation works; focus is visible (`focus-visible` styles).
  - Images have meaningful `alt` text; decorative images use `alt=""`.
  - Icon-only buttons need an accessible name (`aria-label`).

## 7. Tailwind CSS Guidelines

This project uses **Tailwind CSS v4.3.3 with CSS-first configuration**.

- Follow **Tailwind v4 syntax**. There is **no `tailwind.config.ts`** — the theme lives in `src/app/globals.css` inside `@theme inline`.
- **Do not** create or edit a v3-style `tailwind.config.js/ts`, and do not use v3 directives like `@tailwind base`.
- Prefer **utility classes** for styling. Avoid hand-written CSS files for one-off styles.
- Use the **design tokens** (CSS variables) that already exist:

  | Token class | Use for |
  | --- | --- |
  | `bg-background` / `text-foreground` | page background / main text |
  | `bg-card` / `text-card-foreground` | card surfaces |
  | `bg-primary` / `text-primary-foreground` | primary actions |
  | `bg-muted` / `text-muted-foreground` | secondary surfaces / subtle text |
  | `text-destructive` / `bg-destructive` | errors, destructive actions |
  | `border-border` | borders |
  | `rounded-lg`, `rounded-md`, `rounded-xl` | corner radius (from `--radius`) |
  | `font-sans`, `font-heading`, `font-mono` | typography (see "Typography" below) |

- **Avoid raw color values** (`bg-zinc-50`, `text-black`, `#383838`) in new code — they break dark mode and consistency. Use tokens instead. (The starter `page.tsx` still uses some; replace them when you touch that file.)
- Avoid excessive arbitrary values (`w-[137px]`, `mt-[7.5px]`) when a standard scale value (`w-36`, `mt-2`) works.
- Do not duplicate long class combinations — extract a shared component or use `cva` (see "Existing Patterns").
- Keep responsive prefixes readable: `grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`.
- Do not mix styling approaches (e.g. inline `style={{}}` next to Tailwind classes) without a clear reason.
- Dark mode is supported through the `.dark` class variant — always use tokens so dark mode works automatically.

### Typography

Fonts are loaded **once** in `src/app/layout.tsx` via `next/font/google` and exposed as CSS variables:

| Font | CSS variable | Utility | Use for |
| --- | --- | --- | --- |
| Manrope | `--font-manrope` | `font-heading` | H1–H4, hero titles, section headings, card titles, dashboard page titles |
| DM Sans | `--font-dm-sans` | `font-sans` | paragraphs, navigation links, buttons, form labels/inputs, descriptions, tables, badges, metadata |
| Geist Mono | `--font-geist-mono` | `font-mono` | code snippets only |

Rules:

- **Never add another font import** (no Google Fonts `<link>`, no `@font-face`, no `next/font` call outside the root layout).
- `h1`–`h6` automatically use Manrope via the base layer in `globals.css`. For a title that is *not* a heading element (e.g. a `<p>` card title), add `font-heading` explicitly.
- Everything else inherits DM Sans — do not add `font-sans` to individual elements unless overriding a parent.
- Weights: **400** normal, **500** medium, **600** semibold, **700** bold, **800** extrabold (only when necessary). Both fonts are variable fonts, so all of these are available.

**Heading size tokens** — responsive `clamp()` values that grow from mobile to desktop, so no breakpoint classes are needed:

| Token | Mobile | Desktop | Use for |
| --- | --- | --- | --- |
| `text-hero` | 36px | 64px | hero titles |
| `text-page` | 26px | 40px | page headings |
| `text-section` | 24px | 30px | section headings |
| `text-card-title` | 18px | 22px | card titles |

```tsx
<h1 className="text-hero">...</h1>          // hero title (Manrope, applied automatically)
<h2 className="text-section">...</h2>       // section heading
<p className="text-card-title font-heading">...</p> // title outside a heading element
<p className="text-base">...</p>            // body text: 14–16px (DM Sans)
<span className="text-sm">...</span>        // small metadata: 12–14px
```

For body text use the standard scale (`text-sm`/`text-base` for 14–16px, `text-xs`/`text-sm` for 12–14px metadata). Avoid arbitrary font sizes.

## 8. Next.js Guidelines

- Follow **App Router** conventions: routes live in `src/app/`, with `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` as needed.
- **Use Server Components by default.** Add `"use client"` only when you need:
  - interactivity (onClick, useState, hooks), or
  - browser APIs (window, localStorage, geolocation).
- Keep responsibilities separate: fetch and format data on the server when possible; ship only the interactive parts to the client.
- Avoid unnecessary client-side fetching — prefer fetching data in a Server Component (or route handler) over `useEffect` + `fetch`.
- Use Next.js features as intended: `next/image` for images, `next/link` for internal links, `next/font` for fonts.
- Provide `loading.tsx` for routes with data fetching and `error.tsx` for failure states.
- Set page metadata via the `export const metadata` (or `generateMetadata`) in layouts/pages — replace the default `"Create Next App"` title when you build real pages.
- **Never expose secrets to the client:** only `NEXT_PUBLIC_*` variables are visible in the browser. Anything else must stay on the server. Do not commit `.env` files.
- Use typed routes where helpful (the root layout already uses `LayoutProps<"/">`).

## 9. API and Backend Guidelines

> The backend (`server/`) does not exist yet. When API work starts, follow these rules.

- Keep API calls **out of UI components**: put them in `src/lib/api/` (one file per resource, e.g. `equipment.ts`) returning typed data. Components call these helpers — they do not build `fetch` URLs inline.
- Define request/response types once and reuse them (see section 4).
- **Validate incoming data** before using it (check required fields, handle missing/`null` values).
- Handle errors properly:
  - Never `catch` and ignore. Show the user a message and/or log with `console.error`.
  - Distinguish network failures, 4xx client errors, and 5xx server errors where it matters.
- Use meaningful HTTP status codes on the server: `200/201` success, `400` bad request, `401/403` auth, `404` not found, `409` conflict, `500` server error.
- Never expose database credentials, secret keys, or private user information in responses or client code.
- Keep database operations organized in one layer (repository/service) — do not scatter raw queries through route handlers.
- Do not duplicate business logic between client and server; the server is the source of truth.
- Follow the backend architecture once it exists, rather than inventing a parallel convention.

## 10. Code Quality and Maintenance

- **Avoid duplicate code** — extract a helper or component when the same logic appears twice or more.
- Remove unused imports, variables, and functions before you finish.
- Do not add dependencies that are unnecessary — check `package.json` and the standard library first.
- **No debugging leftovers in production code:** remove `console.log`, `debugger`, commented-out blocks, and TODOs you did not intend to keep.
- **Never silently swallow errors** — handle them or let them propagate with context.
- Preserve existing working behavior when making changes. If a change could alter behavior, say so in your summary.
- Avoid unrelated changes ("drive-by refactors") when implementing a feature — keep the diff focused.
- Follow existing project conventions unless there is a clear reason to improve them; if you do change a convention, update this file and explain why.

## 11. Development Workflow

Before implementing any feature:

1. **Understand the existing code** — read the files involved and how they connect.
2. **Identify the files** that actually need changes.
3. **Check for reusable pieces** — is there already a component, utility, or token for this?
4. **Plan the smallest reasonable implementation** that satisfies the requirement.
5. **Implement one feature at a time** — do not bundle unrelated work.
6. **Check for errors** — run `npm run lint` (and `npm run build` when practical).
7. **Review responsive behavior** at mobile, tablet, and desktop widths (section 5).
8. **Summarize** what changed and note any remaining issues.

Never rewrite the entire project when a small change will do.

## 12. Git Commit Guidelines

- Keep each commit focused on **one feature or fix**.
- Write clear, descriptive messages that explain *what* changed and *why* when not obvious.
- Prefer conventional commit prefixes:
  - `feat:` new feature
  - `fix:` bug fix
  - `style:` UI / styling changes (no logic change)
  - `refactor:` code restructuring (no behavior change)
  - `docs:` documentation only
  - `chore:` configuration, dependencies, maintenance
  - Example: `feat: add equipment availability calendar to listing page`
- **Never commit secrets or environment files** (`.env*`).

## 13. Important Rules

- Do not over-engineer simple requirements.
- Do not write unnecessarily complicated code.
- Do not sacrifice responsiveness for desktop appearance.
- Do not sacrifice readability for shorter code.
- Do not change existing functionality without a reason.
- Do not install packages without checking whether the functionality already exists.
- Ask for clarification only when an important requirement is genuinely unclear.
- When explaining implementation decisions, use simple language suitable for a beginner developer.

---

## Final Checklist Before You Finish

- [ ] Code is readable by a beginner — clear names, small functions, early returns.
- [ ] No `any`, no unnecessary type assertions, no stray `console.log`.
- [ ] Mobile-first responsive behavior verified (320px → 1280px+), no horizontal overflow.
- [ ] Design tokens used instead of raw colors; dark mode still works.
- [ ] Loading, empty, and error states handled where relevant.
- [ ] Accessible: semantic HTML, labeled inputs, visible focus, keyboard usable.
- [ ] `npm run lint` passes.
- [ ] Commit message follows the conventional format; no secrets committed.
- [ ] Change summary written, including any known follow-ups.
