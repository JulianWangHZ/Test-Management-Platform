---
version: alpha
name: Agentic QA
description: >
  A B2B QA test-case management platform. Design language is precision-minimalist,
  leaning toward Linear and Notion — structured, information-dense, no decorative
  flourishes. The primary user is a QA engineer or team lead who lives in this
  tool all day; every pixel should reduce cognitive overhead, not add to it.

colors:
  # Surfaces
  page-bg: "#f5f6f8"
  surface: "#ffffff"
  sidebar-bg: "#111111"
  header-bg: "#ffffff"

  # Text
  text-primary: "#111827"
  text-secondary: "#6b7280"
  text-muted: "#9ca3af"
  text-sidebar: "rgba(255,255,255,0.70)"
  text-sidebar-muted: "rgba(255,255,255,0.55)"

  # Borders
  border: "#d1d5db"
  border-subtle: "#e5e7eb"
  border-sidebar: "rgba(255,255,255,0.10)"

  # Semantic status
  pass: "#16a34a"
  fail: "#dc2626"
  warn: "#d97706"
  skip: "#6b7280"
  pass-bg: "#f0fdf4"
  fail-bg: "#fef2f2"
  warn-bg: "#fffbeb"
  skip-bg: "#f3f4f6"

  # Accent (HeroUI primary — do not hardcode, use color="primary")
  primary: "#006FEE"

  # Avatar palette (boring-avatars beam)
  avatar-1: "#0A0310"
  avatar-2: "#49007E"
  avatar-3: "#FF005B"
  avatar-4: "#FF7D10"
  avatar-5: "#FFB238"

typography:
  page-heading:
    fontSize: 24px
    fontWeight: "700"
    lineHeight: 32px
  section-heading:
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
  table-header:
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.05em
  body:
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label:
    fontSize: 12px
    fontWeight: "400"
    lineHeight: 16px
  mono:
    fontSize: 12px
    fontFamily: "ui-monospace, monospace"

rounded:
  card: "1rem"
  panel: "0.75rem"
  badge: "9999px"

spacing:
  page-x: "24px"
  page-y: "32px"
  container-max: "1152px"
  card-gap: "16px"
  panel-gap: "24px"
  card-padding: "20px"
  header-height: "56px"
  sidebar-width: "256px"

components:
  project-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.card}"
    padding: "{spacing.card-padding}"
  project-card-hover:
    borderColor: "#9ca3af"
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.07)"
  data-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
    padding: "{spacing.card-padding}"
    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)"
  status-badge:
    rounded: "{rounded.badge}"
    padding: "4px 10px"
    fontSize: "12px"
    fontWeight: "600"
  sidebar-nav-active:
    backgroundColor: "rgba(255,255,255,0.15)"
    textColor: "#ffffff"
    rounded: "0.5rem"
    padding: "10px 12px"
  sidebar-nav-inactive:
    textColor: "rgba(255,255,255,0.55)"
    rounded: "0.5rem"
    padding: "10px 12px"
  table-header-row:
    backgroundColor: "#f9fafb"
    textColor: "{colors.text-secondary}"
  input-standard:
    variant: "bordered"
    size: "sm"
  button-standard:
    size: "sm"
---

## Overview

Agentic QA reads as a **productivity SaaS tool**, not a marketing site or consumer app. The
design is utility-first: every element exists to help the user read data, take action, or
navigate — nothing more.

Reference points: Linear's sidebar density, Notion's card grids, GitHub's table layouts.
The emotional tone is **calm competence** — trustworthy, fast to scan, never loud.

No gradients, no glass, no animations beyond subtle hover/transition transitions. Dark mode
is not in scope; the palette is built for light mode only.

## Colors

The palette is deliberately constrained — near-monochromatic neutrals with semantic color
reserved exclusively for status signals.

**Two-surface split:** The sidebar lives on `#111111` (near-black), creating a strong spatial
anchor for navigation. The main content area uses `#f5f6f8` as its page background, while
individual cards and panels sit on `#ffffff` — the contrast between the page background and
card surface creates depth without elevation shadows.

**Status color discipline:** Green/amber/red are used *only* for pass/warn/fail status. Never
use these colors for decorative purposes or general UI affordances. Status badge backgrounds
are low-saturation tints (e.g. `green-50`, `red-50`) so they read without screaming.

**Primary accent (HeroUI blue):** Used only for primary action buttons and interactive
highlights (hover row tint `blue-50/30`). Always use HeroUI's `color="primary"` prop —
never hardcode the blue value directly.

## Typography

System font stack (Tailwind default) — no custom web font. This is intentional for a B2B
productivity tool where load performance and rendering consistency across OSes matter more
than brand distinctiveness.

**Scale hierarchy:**
- Page title: `text-2xl font-bold text-gray-900` — one per page
- Section header: `text-sm font-semibold text-gray-900` — inside panels
- Table column headers: `text-xs font-semibold text-gray-600 uppercase tracking-wide`
- Body text: `text-sm text-gray-700` or `text-gray-900` for emphasis
- Secondary/meta: `text-xs text-gray-500`
- Row index / IDs: `text-xs font-mono text-gray-500`

**Sidebar typography:** All white with opacity. Project name: `text-sm font-semibold`.
Section labels: `text-xs font-medium uppercase tracking-widest text-white/40`.

## Layout

**Shell:** Fixed left sidebar (`w-64`, `bg-[#111111]`) + scrollable main content area
(`bg-[#f5f6f8]`). On mobile the sidebar becomes a slide-in drawer triggered by a top bar
hamburger.

**Page container:** `max-w-6xl mx-auto px-6 py-8` for standard content pages. The sticky
page header (when present) is `h-14 bg-white border-b border-gray-200 px-6`.

**Card grids:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4` for entity listings
(projects, cases). Data panels within a page use `grid grid-cols-1 md:grid-cols-2 gap-6`.

**Tables:** Full-width, no fixed column widths except for narrow utility columns (index `w-8`,
status `w-44`). `divide-y divide-gray-200` for rows, `bg-gray-50 border-b border-gray-200`
for the header row.

**Two-pane layouts (RunEditor):** Left list pane (sticky header) + right detail pane. Detail
pane uses `Tabs` (HeroUI `size="sm"`) to switch between Case Detail / Comments / History.

## Elevation & Depth

Depth is communicated through background contrast, not heavy shadows.

- **Level 0:** Page background `#f5f6f8`
- **Level 1:** Cards, panels — `bg-white border border-gray-300 rounded-xl shadow-sm`
- **Level 2:** Sticky headers — `bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10`
- **Level 3:** Modals — HeroUI `<Modal placement="center">`, uses default HeroUI elevation

Rule: `shadow-sm` is the maximum elevation used on static elements. `shadow-md` only appears
on hover (project cards). Never use `shadow-lg` or above.

## Shapes

**Project cards:** `rounded-2xl` (16px) — the most prominent content container, intentionally
softer.

**Data panels and tables:** `rounded-xl` (12px) — slightly tighter for denser layouts.

**Status badges:** `rounded-full` — pill shape, always inline-flex with centered text.

**Buttons and inputs:** HeroUI defaults. Never override border-radius on HeroUI components.

## Components

### Status Badges
Four states rendered as inline-flex pills with border:
- **Pass:** `bg-green-50 text-green-700 border border-green-200`
- **Fail:** `bg-red-50 text-red-700 border border-red-200`
- **Warn/Retest:** `bg-yellow-50 text-yellow-700 border border-yellow-200`
- **Pending/Skip:** `bg-gray-100 text-gray-600 border border-gray-300`

Add a colored dot (`w-1.5 h-1.5 rounded-full`) before the label text for extra scannability.

### Sidebar Navigation
NavItem pattern: `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium`.
Active: `bg-white/15 text-white`. Inactive: `text-white/55 hover:bg-white/10 hover:text-white/90`.
Icon `strokeWidth` increases from 1.8 (inactive) to 2.2 (active) to reinforce selection state.

### HeroUI Component Defaults
- All `<Input>` and `<Textarea>`: `variant="bordered" size="sm"`
- All `<Button>`: `size="sm"`; primary actions get `color="primary"`; secondary get `variant="bordered"`
- `<Modal>`: always `placement="center"`
- `<Select>`: `variant="bordered" size="sm"`
- Custom `classNames` on inputs: `label: 'text-gray-700 font-medium'`, `inputWrapper: 'border-gray-300 hover:border-gray-400'`

### Avatars
`boring-avatars` `variant="beam"` with the custom 5-color palette. Fallback: Lucide `<User>` icon.
Size conventions: `size={14}` for inline/table use, larger sizes for profile displays.

### Pass Rate Bar
Double-segment progress bar: green segment = passed, red segment = failed, remainder = untested.
Height `h-1.5`, `bg-gray-100` track, `rounded-full`, no gap between segments.

## Do's and Don'ts

**Do:**
- Use `transition-all` or `transition-colors` on hover states (200ms default)
- Use `truncate` and `line-clamp-{n}` on variable-length strings (card titles, descriptions)
- Use `sticky top-0 z-10` for panel/page headers that scroll
- Match icon sizes to context: `size={11}` fill icons in tight stat rows, `size={16}` standard, `size={22}` empty states
- Use `text-xs font-mono` for IDs, sequence numbers, and machine-generated values
- Gate destructive/edit actions with `isDisabled` on HeroUI components — never hide them

**Don't:**
- Use gradients, glassmorphism, or backdrop-blur anywhere in the main UI
- Introduce a second font or use `font-display` classes in the main app
- Use `shadow-lg` or above on any static element
- Use status colors (green/amber/red) for anything other than pass/warn/fail
- Use `rounded-3xl` or above — `rounded-2xl` is the maximum border-radius
- Add section-level dark/light inversions; the sidebar is the only dark surface
- Use full-width `<Button>` without an explicit layout reason
- Write inline `style={{}}` for values that exist in the Tailwind config
