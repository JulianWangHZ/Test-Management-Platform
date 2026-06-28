---
name: i18n-sync
description: >
  Add, update, or audit translation keys across all 5 locale files
  (en, de, ja, pt-BR, zh-CN). Use this when adding new UI strings,
  renaming existing keys, or checking for missing translations.
---

# /i18n-sync

You are managing translations for Agentic QA. The app uses **next-intl** with 5 locale files:
- `messages/en.json` — source of truth (English)
- `messages/de.json` — German
- `messages/ja.json` — Japanese
- `messages/pt-BR.json` — Brazilian Portuguese
- `messages/zh-CN.json` — Simplified Chinese

## Rules

**1. Always update all 5 files in the same operation.** Never add a key to `en.json`
without propagating it to the other 4. Missing keys cause runtime crashes in next-intl.

**2. Never add machine-translated filler.** For non-English locales, provide a reasonable
translation. If uncertain about a specific locale, write `[TODO: {locale}]` as a placeholder
and flag it — but never leave a key missing entirely.

**3. Key structure must be identical across all files.** Same nesting, same key names.
Only the values differ.

**4. Follow existing namespace conventions.** Before adding a new top-level namespace, check
if an existing one is more appropriate (e.g., don't create `Form` if the key fits in the
existing feature namespace).

## Workflow

### Adding new keys

1. Open `messages/en.json` and locate the correct namespace (or create it if new)
2. Add the key with its English value
3. Replicate the same key in de/ja/pt-BR/zh-CN with appropriate translations
4. If a new namespace was added, add the corresponding type to `types/` (e.g., `MyFeatureMessages`)
5. Verify the type matches exactly what `useTranslations('Namespace')` will return

### Auditing missing keys

Run a structural diff:
- Extract all keys from `en.json` (flattened dot-notation)
- Check each locale file for the same keys
- Report any that are missing or have empty values

### Renaming / removing keys

1. Find all usages of the key in `src/` (grep for the key name in `useTranslations` calls
   and in the Messages types)
2. Update or remove in all 5 locale files simultaneously
3. Update the corresponding Messages type in `types/`
4. Update all call sites

## Type Pattern

Every i18n namespace used by a client component should have a corresponding Messages type:

```ts
// types/myFeature.ts
export type MyFeatureMessages = {
  title: string;
  createButton: string;
  emptyState: string;
};
```

The server component (`page.tsx`) builds the typed object:
```ts
const t = useTranslations('MyFeature');
const messages: MyFeatureMessages = {
  title: t('title'),
  createButton: t('createButton'),
  emptyState: t('emptyState'),
};
```

## Output Format

When adding keys, show the exact diff for each file:

```
### messages/en.json
Added under "TestRun":
  "filterPlaceholder": "Filter by status...",
  "noRunsFound": "No test runs match your filter"

### messages/de.json
  "filterPlaceholder": "Nach Status filtern...",
  "noRunsFound": "Keine Testläufe entsprechen Ihrem Filter"

### messages/ja.json
  "filterPlaceholder": "ステータスでフィルター...",
  "noRunsFound": "フィルターに一致するテスト実行がありません"

### messages/pt-BR.json
  "filterPlaceholder": "Filtrar por status...",
  "noRunsFound": "Nenhuma execução de teste corresponde ao seu filtro"

### messages/zh-CN.json
  "filterPlaceholder": "按状态筛选...",
  "noRunsFound": "没有与您的筛选条件匹配的测试运行"
```
