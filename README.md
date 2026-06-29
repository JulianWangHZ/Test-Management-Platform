# Agentic QA — Test Management Platform

> 🇹🇼 [繁體中文版 README](./README-zh.md)

**Agentic QA** is a modern test case management platform built for QA engineers and development teams. It provides a clean, productivity-focused interface to organize test cases, track test runs, and measure quality across multiple projects — designed with a future AI-powered backend in mind.

---

## Overview

Test management in most teams is fragmented — spreadsheets, Notion docs, or heavyweight tools that don't fit agile workflows. Agentic QA aims to be the lightweight, extensible alternative: fast to set up, easy to navigate, and built to grow with your team.

The current version is a **frontend-only prototype** with realistic mock data. The architecture is deliberately backend-ready — data access is fully abstracted behind a hooks layer so the swap from mock data to a real API will be a mechanical replacement, not a refactor.

| Projects | Project Dashboard |
|---|---|
| ![Projects](./public/screenshots/projects.png) | ![Dashboard](./public/screenshots/dashboard.png) |

| Test Run Editor | Case Detail |
|---|---|
| ![Run Editor](./public/screenshots/run-editor.png) | ![Case Detail](./public/screenshots/case-detail.png) |

---

## Current Features

### Project Management
- Create and manage multiple projects with public/private visibility
- Per-project dashboard with pass rate charts and test run summary
- Most-failing cases panel for quick triage

### Test Run Management
- Create test runs scoped to a project
- Assign test cases to team members
- Track status per case: **Passed**, **Failed**, **Retest**, **Skipped**, **Untested**
- Run-level progress donut chart and overall pass rate

### Test Case Detail (inside a Run)
- Full case detail view with description, steps, preconditions, and expected result
- Inline comments with edit and delete
- Assignee picker with search

### Internationalization
- Full UI in **English** and **Traditional Chinese**
- Next-intl App Router integration — locale is part of the URL path (`/en/...`, `/zh-TW/...`)

---

## Project Structure

```
agentic-qa-tcmp/
├── src/
│   ├── app/[locale]/               # App Router — all routes are locale-prefixed
│   │   ├── layout.tsx              # Root layout (HeroUI provider, i18n)
│   │   ├── page.tsx                # Redirects → /projects
│   │   ├── not-found.tsx           # 404 page
│   │   ├── loading.tsx             # Global loading state
│   │   ├── error.tsx               # Global error boundary
│   │   └── projects/
│   │       ├── page.tsx            # Server shell — builds i18n messages
│   │       ├── ProjectsPage.tsx    # Client — project grid + create modal
│   │       └── [projectId]/
│   │           ├── layout.tsx      # Sidebar navigation
│   │           ├── home/           # Project dashboard (charts, stats)
│   │           ├── runs/           # Test run list
│   │           │   ├── page.tsx
│   │           │   ├── RunsPage.tsx
│   │           │   └── [runId]/    # Run editor (case table + detail pane)
│   │           │       ├── layout.tsx
│   │           │       ├── RunEditor.tsx
│   │           │       ├── RunCaseTable.tsx
│   │           │       ├── RunHeader.tsx
│   │           │       ├── RunInfoCard.tsx
│   │           │       └── cases/[caseId]/
│   │           │           ├── page.tsx
│   │           │           ├── DetailPane.tsx
│   │           │           └── CaseDetail.tsx
│   │           └── members/        # Project member list
│   ├── data/
│   │   └── mockData.ts             # Seed data — replaced by API when backend is ready
│   └── i18n/
│       ├── routing.ts              # Supported locales + default locale
│       └── request.ts              # next-intl server config
├── hooks/                          # Data access layer (abstracts mock → future API)
│   ├── useProject.ts
│   ├── useProjects.ts
│   ├── useRun.ts
│   ├── useRuns.ts
│   └── useCases.ts
├── types/                          # TypeScript types (mirrors future API shape)
├── components/                     # Shared UI components
│   ├── UserAvatar.tsx
│   ├── Comments.tsx
│   ├── History.tsx
│   ├── TestCasePriority.tsx
│   └── ProjectShell.tsx
├── utils/                          # Pure utility functions
│   ├── rateColor.ts                # Pass rate → color threshold
│   ├── formGuard.ts
│   └── errorHandler.ts
├── messages/                       # i18n translation files
│   ├── en.json
│   └── zh-TW.json
└── Dockerfile / docker-compose.yml # Optional local dev without Node.js
```

### Architecture Principles

**Server / Client split** — Every `page.tsx` is a server component. It extracts route params, calls `useTranslations`, and passes typed message props down to a sibling client component. No `useTranslations` ever runs on the client.

**Hooks layer** — Components never import from `mockData.ts` directly. All data reads go through `hooks/`. When the backend lands, only the hooks change — zero component rewrites.

**URL-driven state** — Tab selection and filters live in URL search params, not React state. Pages are bookmarkable and consistent with B2B user expectations.

---

## Getting Started

### Prerequisites

- Node.js 18 or above
- npm

### Install & Run

```bash
git clone https://github.com/JulianWangHZ/Test-Management-Platform.git
cd Test-Management-Platform
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Docker (no Node.js required)

```bash
docker-compose up
```

Open [http://localhost:3000](http://localhost:3000).

---

## Roadmap

The platform is designed to grow in phases. Below is the planned direction — features will be prioritised based on team needs.

### Phase 1 — Backend Integration

The frontend is already shaped around a future REST API. Replacing the mock layer is the first milestone.

- External backend service (REST API)
- JWT-based authentication — sign in / sign up / SSO
- PostgreSQL database with migrations
- Role-based access control (Admin, Manager, Developer, Reporter)
- Real-time run status updates via WebSocket

### Phase 2 — Advanced Test Management

- **Test case import / export** — Excel (xlsx), CSV, Jira
- **CI/CD integration** — Push run results from GitHub Actions, Jenkins, or any pipeline via webhook
- **Bulk operations** — Clone, move, tag test cases across folders
- **Folder & tag management** — Hierarchical case organisation with custom tags
- **Flaky test detection** — Flag cases that inconsistently pass or fail across runs

### Phase 3 — Device & Environment Monitoring

- **Device matrix** — Track test results per browser, OS, screen size, and device type
- **Environment management** — Define staging, QA, production environments per run
- **Compatibility view** — Visualise pass/fail coverage across the device matrix
- **Screenshot & video attachments** — Attach evidence to failed cases

