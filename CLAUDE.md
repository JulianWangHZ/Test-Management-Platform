# Agentic QA — Claude Project Context

## Stack

Next.js 14 App Router · TypeScript · Tailwind CSS · HeroUI · next-intl (5 locales)
lucide-react · boring-avatars · ApexCharts · dayjs

## Architecture

- **Currently frontend-only** — all data in `src/data/mockData.ts`
- **Backend is coming** as a separate external service; this mock layer will be replaced
- Do NOT add Next.js API routes, server actions, or tRPC — backend is external
- `page.tsx` = server component (i18n + params only); all interactivity in sibling client component
- Client components receive typed `messages` props — never call `useTranslations` in them

## After Every Code Change

**Always run `npm run check` after editing any file.** Fix all errors before declaring done.
`npm run check` = `tsc --noEmit && next lint`
Zero errors is the only acceptable exit state. Never leave type errors or lint warnings unresolved.

## Skills

| Skill | When to use |
|---|---|
| `/new-feature` | Adding a new page, route, or major feature |
| `/design-check` | Auditing UI changes for design consistency |
| `/i18n-sync` | Adding or updating translation strings |

---

@.claude/DESIGN.md

---

@.claude/CODING_STYLE.md
