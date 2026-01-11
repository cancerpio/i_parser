# Tasks: Phone Spec Visualizer

> Status key: `[x]` done, `[ ]` todo

## Phase 1 — Project Setup

- [x] T001 Scaffold Vue 3 + Vite + TypeScript app in repo root
- [x] T002 Add `.gitignore` and basic repo hygiene
- [x] T003 Install runtime deps: `papaparse`, `chart.js`, `vue-chartjs`
- [x] T004 Configure Tailwind CSS (v4) + PostCSS integration
- [x] T005 Configure GitHub Pages base path in `vite.config.ts`
- [x] T006 Add GitHub Actions workflow for Pages build+deploy

## Phase 2 — Data Ingestion (Read-only Google Sheet)

- [x] T010 Add env template `.env.example` with `VITE_SHEET_CSV_URL`
- [x] T011 Implement config loader (`VITE_SHEET_CSV_URL` required)
- [x] T012 Implement CSV fetch client (read-only GET)
- [x] T013 Implement CSV parser + validation:
  - Required headers: `Brand`, `Model`, `Price`
  - Brand scope: Asus/Samsung/Apple only
  - Skip invalid rows + expose skipped counts/reasons
- [x] T014 Implement dataset composable (idle/loading/ready/error)
- [x] T015 Ensure build passes with typecheck (`vue-tsc -b`)

## Phase 3 — Dashboard UI (US1)

- [x] T020 Replace Vite starter UI with dashboard page
- [x] T021 Show summary (loaded count, visible count, per-brand counts)
- [x] T022 Show clear error state vs empty state
- [x] T023 Show at least one visualization (scatter) and a device table

## Phase 4 — Filtering (US2)

- [x] T030 Implement price band selection (dropdown)
- [x] T031 Filter table + chart by selected price band
- [x] T032 Show empty-state message when no devices match band

## Phase 5 — Robustness (US3)

- [x] T040 Missing required headers: show missing header list
- [x] T041 Invalid rows: show “skipped N rows” indicator
- [x] T042 Improve config-missing messaging (guide user to set `VITE_SHEET_CSV_URL`)

## Phase 6 — Release & Deploy

- [x] T050 Document local run steps in root `README.md`
- [ ] T051 Confirm GitHub Pages deploy in Actions + verify live site loads data
