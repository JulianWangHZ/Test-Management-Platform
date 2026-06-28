---
name: design-check
description: >
  Audit one or more UI components or pages for design consistency against the
  Agentic QA design system. Use this after implementing a feature, before
  committing, or when a component looks "off" compared to the rest of the app.
---

# /design-check

You are conducting a design-system audit of Agentic QA UI components. Your reference
is `.claude/DESIGN.md`. Be specific: name the exact className that violates the rule
and provide the corrected version. Do not rewrite entire files — only flag deviations.

## Audit Dimensions

Run each dimension in sequence. Report findings as a table at the end.

---

### 1. Surface & Background

Check that:
- Page backgrounds use `bg-[#f5f6f8]` or `bg-gray-50` (not `bg-white` or raw `bg-gray-100`)
- Cards/panels use `bg-white` with `border border-gray-300`
- The only dark surface is the sidebar (`bg-[#111111]`) — no other dark backgrounds
- No gradients, glassmorphism, or `backdrop-blur` anywhere in the main content area

### 2. Border Radius Discipline

- Entity cards: `rounded-2xl` only
- Data panels and tables: `rounded-xl` only
- Badges and pills: `rounded-full` only
- Nothing uses `rounded-3xl` or above

### 3. Typography Consistency

Check against the defined scale:
- Page heading: exactly `text-2xl font-bold text-gray-900`
- Section header: `text-sm font-semibold text-gray-900`
- Table headers: `text-xs font-semibold text-gray-600 uppercase tracking-wide`
- Secondary text: `text-xs text-gray-500` (not `text-gray-400` for label-level text)
- Are there any hardcoded color values like `text-[#333]` when a Tailwind class exists?

### 4. Color Discipline

- Status colors (green/amber/red) appear ONLY on status badges and pass-rate indicators
- No hardcoded hex for HeroUI primary — `color="primary"` prop only
- No purple, pink, or other accent colors not in the DESIGN.md palette

### 5. HeroUI Component Defaults

Verify every HeroUI component uses the project defaults:
- `<Input>` / `<Select>` / `<Textarea>`: `variant="bordered" size="sm"` unless explicitly justified
- `<Button>`: `size="sm"` everywhere; `color="primary"` for CTAs only
- `<Modal>`: `placement="center"` always
- No instances of `size="md"` or `size="lg"` buttons without a clear reason

### 6. Elevation / Shadow

- Static elements: max `shadow-sm`
- Hover state: max `shadow-md`
- `shadow-lg` or above: flag as violation unless it's a HeroUI modal (which manages its own shadow)

### 7. Icon Usage

- Icon library: lucide-react only (never heroicons, react-icons, or SVG strings)
- Size conventions: `size={11}` fill icons, `size={14}` avatar-adjacent, `size={16}` standard, `size={22}` empty state icons
- Icons in navigation: `strokeWidth={2.2}` active, `strokeWidth={1.8}` inactive

### 8. Interaction States

- All interactive cards/rows must have `transition-colors` or `transition-all`
- Hover on cards: `hover:border-gray-400 hover:shadow-md`
- Hover on table rows: `hover:bg-blue-50/30`
- Missing `transition-*` on an element that changes on hover: flag it

### 9. Empty States

Every list, table, or data grid must have an empty state. Minimum: icon + short message.
Pattern:
```tsx
<div className="flex flex-col items-center justify-center py-24 text-center">
  <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
    <SomeIcon size={22} className="text-gray-400" />
  </div>
  <p className="text-gray-600 font-medium text-sm">No items yet</p>
  <p className="text-gray-400 text-xs mt-1">Create your first item to get started</p>
</div>
```

### 10. i18n Hardcoding

- Any English string directly in JSX that should be in messages props: flag it
- Exception: test/debug strings in non-user-facing code (e.g., `<div>loading...</div>`) are allowed short-term but should be noted

---

## Output Format

Report findings as:

```
## Design Audit Results

### PASS
- [list of dimensions that passed]

### VIOLATIONS
| # | Dimension | Location | Issue | Fix |
|---|---|---|---|---|
| 1 | Border Radius | RunsPage.tsx:45 | `rounded-3xl` on filter chip | Change to `rounded-full` |
| 2 | HeroUI Default | MemberForm.tsx:22 | `<Input size="md">` | Change to `size="sm"` |

### LOW-PRIORITY NOTES
- [anything worth mentioning but not a blocking violation]
```

If zero violations found, say so explicitly and note which files were audited.
