# Coding Style — Agentic QA

Written from the perspective of a principal frontend engineer. These rules reflect the
patterns already established in this codebase, distilled into explicit guidance so every
new feature is consistent with what exists.

---

## Architecture Principles

**Mock-first, backend-ready.** The app is currently frontend-only; a separate backend
service will be integrated later. All data reads from `src/data/mockData.ts` and all
mutations are local React state for now. Design as if the backend already exists:
types should reflect what a real REST API would return, and mock helpers should mirror
the signature a real data-fetching hook would have.

Do NOT add Next.js API routes, server actions, or tRPC — the backend will be an external
service, not embedded in this app. When the backend is ready, `mockData.ts` will be
replaced with API client calls; that migration should be mechanical, not architectural.

**Server / client split.** Every `page.tsx` in the App Router is a **server component**.
It does three things only: extracts route params, calls `useTranslations`, and passes typed
props to a client component. All interactivity lives in the sibling client component.

```ts
// page.tsx — server component: params + i18n only
export default function Page({ params }: { params: { projectId: string; locale: LocaleCodeType } }) {
  const t = useTranslations('MyFeature');
  const messages: MyFeatureMessages = { title: t('title') };
  return <MyFeatureClient projectId={params.projectId} messages={messages} />;
}
```

```tsx
// MyFeatureClient.tsx — 'use client': state + UI
'use client';
export default function MyFeatureClient({ projectId, messages }: Props) {
  const [items, setItems] = useState(getMockItems(Number(projectId)));
  // ...
}
```

---

## TypeScript

**Explicit types everywhere; no `any`.** If you reach for `any`, stop and model the type.

**Props as inline `type`, not `interface`.** Use `type Props = {...}` not `interface Props`.
Interfaces are for things that can be extended; component props rarely are.

```ts
type Props = {
  projectId: string;
  messages: MyFeatureMessages;
  isDisabled?: boolean;
};
```

**Optional chaining over null checks.** Prefer `member?.User?.username` over
`member && member.User && member.User.username`.

**`useMemo` for derived data; `useState` for mutable state.** Computed values that
depend on props or state (filtered lists, derived labels) go in `useMemo`, never
recomputed on every render.

**Return types on helpers, not on components.** Functions exported from `utils/` or
`aggregate.ts` should have explicit return types. React component return types can be
inferred (`JSX.Element` / `ReactNode` is boilerplate noise on components).

---

## Component Structure

File order inside a component:

```tsx
'use client';                           // 1. directive (if needed)

import ...                             // 2. imports (React → Next → 3rd party → local)

type Props = { ... };                  // 3. Props type

export default function MyComponent({  // 4. main component
  prop1,
  prop2,
}: Props) {
  // a. hooks (useState, useMemo, useEffect, useSearchParams...)
  // b. derived values
  // c. handlers (handleSubmit, handleDelete...)
  // d. early returns (loading, empty guard)
  // e. JSX
}

// 5. sub-components (small, only used here)
function ListItem({ ... }: { ... }) { ... }

// 6. pure helpers (not exported, no hooks)
const computeSomething = (x: number) => x * 2;
```

**No default exports for types or utilities.** Named exports only for anything that's not
a React component.

**Sub-components at the bottom of the file.** If a component is used only within one
file and is small (< 30 lines), define it at the bottom of that file rather than creating
a new file.

---

## State Management

**No global state manager.** State is either:
1. Local `useState` in the component that owns it
2. Props drilled down one or two levels
3. URL search params (`useSearchParams`) for filter/tab state that should survive reload

**URL params for tabs and filters.** Navigation state (which tab is selected, which filter
is active) belongs in the URL, not React state. This makes the UI bookmarkable and
consistent with user expectations in a B2B tool.

**`useEffect` for reading URL params only.** Don't use `useEffect` to sync state with
other state — derive it instead. The only acceptable `useEffect` in this codebase is
reading `searchParams` to initialize tab selection.

---

## Mock Data

**`src/data/mockData.ts` is temporary scaffolding, not permanent architecture.**
It exists to unblock frontend development while the backend is being built. Design
it to be easy to delete, not easy to extend indefinitely.

**Helper function signature convention:**
```ts
export function getMockX(id: number): XType | undefined { ... }
```
Mirror what a real API hook would look like: `useProject(id)` → `getMockProject(id)`.
When the backend arrives, swapping the implementation should be mechanical.

**Types drive the contract.** Types in `types/` represent what the backend API will
return. Never add frontend-only fields to entity types; keep them clean and API-shaped.
If you need a UI-only derived field, compute it locally rather than polluting the type.

**Realistic seed data.** Mock data should reflect real QA workflows — actual test case
titles, realistic status distributions, plausible team member names. Not `test1`, `user1`,
or lorem ipsum.

**Type-safe seeds.** Every mock object must satisfy the corresponding type from `types/`.
Never cast with `as XType` to make invalid data compile.

---

## i18n

**Never hardcode user-visible strings in JSX.** All copy goes through messages props.

**`useTranslations` is server-side only.** Client components receive typed message
objects as props. This avoids hydration issues and keeps client bundles free of the
i18n runtime.

**5 locales always in sync.** `en / de / ja / pt-BR / zh-CN`. Adding a key to `en.json`
without adding it to the other 4 is a breaking change — next-intl will throw at runtime.

**Namespace-per-feature.** Don't dump everything into a single flat namespace. Each
major feature or page gets its own namespace key (e.g., `"RunEditor"`, `"ProjectHome"`).

---

## Styling

**Tailwind utility classes only.** No CSS modules, no `styled-components`, no `css-in-js`.
Custom values (e.g., `bg-[#111111]`) are allowed for one-off project-level tokens not in
the Tailwind config (specifically: the sidebar dark background).

**No inline `style={{}}` for values that have Tailwind equivalents.** Inline styles are
acceptable only for chart colors or dynamically computed widths (e.g., progress bar
`style={{ width: `${rate}%` }}`).

**HeroUI `classNames` prop for component internals.** When customizing HeroUI component
internals (input label color, border color), use `classNames={{ label: '...', inputWrapper: '...' }}`
— not `className` on the outer element.

**No arbitrary breakpoints.** Use only `sm:`, `md:`, `lg:` from Tailwind's default scale.
The `xl:` breakpoint is acceptable but rarely needed given the `max-w-6xl` container.

---

## Imports

**Path aliases always.** Use `@/` for project root imports. Never use relative `../../..`
paths.

**Import order (enforced mentally, not by linter currently):**
1. React (`react`, `react/...`)
2. Next.js (`next/...`, `next-intl`)
3. Third-party (`@heroui/react`, `lucide-react`, `dayjs`, `boring-avatars`)
4. Internal types (`@/types/...`)
5. Internal utils/data (`@/src/data/...`, `@/utils/...`, `@/config/...`)
6. Internal components (`@/components/...`)

**Named imports from HeroUI.** Import only the components you use:
```ts
import { Button, Input, Modal, ModalContent } from '@heroui/react';
```
Never `import * as HeroUI from '@heroui/react'`.

---

## File Naming

| What | Convention | Example |
|---|---|---|
| Page (App Router) | `page.tsx`, `layout.tsx` | `page.tsx` |
| Client component | PascalCase | `ProjectsPage.tsx` |
| Server shell component | PascalCase | `ProjectShell.tsx` |
| Utility function file | camelCase | `aggregate.ts` |
| Type file | camelCase, singular | `project.ts`, `run.ts` |
| Mock data | `mockData.ts` | fixed name |

---

## Error Handling

**No error boundaries or error.tsx yet.** This is a mock frontend — data never fails.
Don't add try/catch around local state reads.

**Guard against undefined with `??` or early return.** If `getMockProject(id)` could
return `undefined`, handle it before rendering:
```tsx
const project = getMockProject(Number(projectId));
if (!project) return <div>Project not found</div>;
```

**`addToast` for user feedback.** Successful mutations (create/update/delete) always fire
an `addToast` from `@heroui/react` with `color: 'success'`. Use the messages prop for the
description text (never hardcode English).

---

## What NOT to Add

- No React Query / SWR — there's no API to query
- No Zustand / Redux — local state is sufficient
- No Storybook — too much overhead for a mock-first app
- No test files — Vitest is not installed; don't add test infrastructure
- No `console.log` statements in committed code
- No `TODO` comments in JSX — fix it or document it in a GitHub issue
- No Docker or CI config — this is a dev-only frontend
