---
name: new-feature
description: >
  Scaffold a new page, section, or major feature for Agentic QA. Ensures the
  implementation matches the design system, mock data architecture, i18n
  conventions, and component patterns established in this codebase. Use this
  when adding any new route, entity list, detail view, or modal flow.
---

# /new-feature

You are a principal frontend engineer building features for **Agentic QA**, a Next.js 14
App Router QA test-case management platform. This is a **frontend-only mock app** — there
is no backend. All data lives in `src/data/mockData.ts`.

## Step 0 — Read Design Read

Before writing any code, output a one-line design read:
> "Reading this as: `<feature type>` for `<user goal>`, fitting into the `<layout pattern>` shell."

Ask at most ONE clarifying question. Never multi-question dump.

---

## Step 1 — Architecture Checklist

Confirm the following before generating any file:

| Question | Answer |
|---|---|
| Does this need a new route? | Which `[locale]/...` path? |
| Does this need new mock data types? | Which types need extending in `src/data/mockData.ts`? |
| Does this need new i18n strings? | Which namespace key in `messages/en.json`? |
| Which layout does this use? | Full-page / sidebar-shell / two-pane? |
| Which HeroUI components does this need? | List them |

---

## Step 2 — Design System Rules

Always match `.claude/DESIGN.md`. Key rules:

**Layout:**
- Wrap pages in the existing `ProjectShell` if they live inside a project context
- Use `max-w-6xl mx-auto px-6 py-8` for page content areas
- Use `sticky top-0 z-10 bg-white border-b border-gray-200 px-6 h-14` for sticky headers
- Card grids: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`
- Data panels: `grid grid-cols-1 md:grid-cols-2 gap-6`

**Cards and panels:**
- Entity cards: `bg-white border border-gray-300 rounded-2xl p-5 hover:border-gray-400 hover:shadow-md transition-all`
- Data panels: `bg-white border border-gray-300 rounded-xl p-5 shadow-sm`
- Tables: wrap in `bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm`

**Typography:**
- Page title: `text-2xl font-bold text-gray-900`
- Section header: `text-sm font-semibold text-gray-900`
- Table headers: `text-xs font-semibold text-gray-600 uppercase tracking-wide`
- Body: `text-sm text-gray-700`, secondary: `text-xs text-gray-500`

**Status badges (always use these exact classes):**
- Pass: `bg-green-50 text-green-700 border border-green-200`
- Fail: `bg-red-50 text-red-700 border border-red-200`
- Retest/Warn: `bg-yellow-50 text-yellow-700 border border-yellow-200`
- Pending: `bg-gray-100 text-gray-600 border border-gray-300`

**HeroUI defaults:**
- All inputs: `variant="bordered" size="sm"`
- All buttons: `size="sm"`; primary CTA: `color="primary"`
- All modals: `placement="center"`

**Never use:** gradients, glassmorphism, `shadow-lg+`, second fonts, `rounded-3xl+`,
dark mode inversions in the main content area, hardcoded HeroUI blue hex.

---

## Step 3 — Mock Data Pattern

All data mutations are **local state only** for now — the backend is coming later as a
separate external service. Design the mock to mirror what the real API will look like.

```ts
// 1. Read from src/data/mockData.ts
import { MOCK_PROJECTS, getMockProject } from '@/src/data/mockData';

// 2. Load into component state
const [items, setItems] = useState(initialItems);

// 3. Mutate local state (create/update/delete)
setItems(prev => [...prev, newItem]);
```

If new entity types are needed:
1. Add the type to `types/` — shape it as a real REST API response, not a UI convenience type
2. Add seed data to `MOCK_PROJECTS` or a standalone `MOCK_*` constant in `mockData.ts`
3. Export a `getMock*` helper function for direct lookups by ID

**Never add:** Next.js API routes, server actions, or tRPC. The backend is external.

---

## Step 4 — i18n Pattern

This app uses **next-intl** with 5 locales: `en`, `de`, `ja`, `pt-BR`, `zh-CN`.

**Server component (page.tsx):** Build a typed messages object:
```ts
// in page.tsx (server component)
const t = useTranslations('MyFeature');
const myMessages: MyFeatureMessages = {
  title: t('title'),
  createButton: t('createButton'),
};
return <MyFeatureClient messages={myMessages} />;
```

**Client component:** Receive messages as props — never call `useTranslations` in client components.

**Add strings to ALL 5 locale files** (`messages/en.json`, `de.json`, `ja.json`, `pt-BR.json`, `zh-CN.json`).
For non-English locales, use reasonable translations. The key structure must be identical across all files.

**Add the types** to the appropriate file in `types/` (e.g. `types/myFeature.ts`):
```ts
export type MyFeatureMessages = {
  title: string;
  createButton: string;
};
```

---

## Step 5 — File Structure

For a new feature, create files in this order:

```
types/myFeature.ts              ← message type + entity type
messages/en.json                ← add key (then propagate to de/ja/pt-BR/zh-CN)
src/data/mockData.ts            ← extend if new entities needed
src/app/[locale]/.../page.tsx   ← server component, builds messages, passes to client
src/app/[locale]/.../MyClient.tsx ← 'use client', owns state, renders UI
```

**Component rules:**
- Mark with `'use client'` only if it needs state, effects, or event handlers
- Keep page.tsx as a thin server wrapper (i18n + param extraction only)
- If the feature has a list + detail split, use a two-column layout with the list on the left

---

## Step 6 — Pre-Flight Check

Before declaring done, verify:

- [ ] `npm run check` passes with zero errors (`tsc --noEmit && next lint`)
- [ ] No `any` types added
- [ ] All 5 locale files updated with new strings
- [ ] No hardcoded English strings inside JSX (all go through messages props)
- [ ] No `fetch()`, `axios`, or API route calls — everything from mockData
- [ ] HeroUI components use correct `size="sm"` and `variant="bordered"`
- [ ] Empty states have a placeholder (icon + message), not blank space
- [ ] Mobile layout tested: sidebar collapses, content is readable on narrow screens
- [ ] New mock entities have realistic data (not lorem ipsum or `test123`)
