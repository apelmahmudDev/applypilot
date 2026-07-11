<p align="center">
  <img src="./public/logo.png" alt="ApplyPilot logo" width="92" />
</p>

<h1 align="center">Applypilot</h1>

<p align="center">
  A privacy-first browser extension for tracking job applications while you browse job boards.
</p>

<hr />

ApplyPilot helps you detect the current job page, review or edit the captured details, save the job locally, and manage your applications from a popup, side panel, and dashboard.

## Highlights

- Fast popup flow for detect, review, edit, and save
- Side panel workspace for browsing-time job tracking
- Dashboard for larger management views and data-heavy workflows
- Local-first storage using browser storage
- Duplicate detection by job URL first, then company plus title
- Reminder support with follow-up date, time, and note fields
- Minimal extension permissions by default

## Product Surfaces

### Popup

The popup is designed for quick actions on the current page:

- Detect the job posting from the active tab
- Show a compact summary of the detected role
- Edit important fields before saving
- Save immediately when the detected data looks good
- Jump to the side panel or full dashboard after saving

### Side Panel

The side panel is the browsing companion for day-to-day tracking:

- Detect the current job page while you browse
- Save, edit, or review jobs without leaving the tab
- View recent jobs and upcoming reminders
- Open detailed job and reminder views
- Manage application status and follow-up workflows

### Dashboard

The dashboard is the larger workspace for management-style tasks:

- Full application browsing
- Table-oriented views
- Analytics and export-oriented flows
- More room for scaling job management over time

## How It Works

1. Open a job posting in the browser.
2. Open the ApplyPilot popup or side panel.
3. ApplyPilot detects the visible job details from the active tab.
4. Review the captured information.
5. Save immediately or edit before saving.
6. Manage the saved record later from the side panel or dashboard.

Saved jobs are stored locally in the browser. Each record keeps `createdAt` and `updatedAt` values, and saves try to avoid duplicates by checking URL first and then company plus title.

## Tech Stack

- WXT
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui and Radix primitives
- TanStack Form
- TanStack Table
- Zod
- Sonner
- pnpm

## Current Permissions

The current manifest is intentionally small:

- `activeTab`
- `scripting`
- `sidePanel`
- `storage`

Current host permission:

- `*://*.linkedin.com/*`

If detection expands to more sites later, permissions should stay as narrow as possible.

## Getting Started

### Prerequisites

- Node.js
- pnpm

### Install

```bash
pnpm install
```

### Run In Development

Chrome / Chromium:

```bash
pnpm dev
```

Firefox:

```bash
pnpm dev:firefox
```

### Type Check

```bash
pnpm compile
```

### Production Build

```bash
pnpm build
```

Firefox production build:

```bash
pnpm build:firefox
```

### Create Zip Packages

```bash
pnpm zip
```

Firefox zip:

```bash
pnpm zip:firefox
```

## Load The Extension

### Chrome / Chromium

1. Run `pnpm dev` or `pnpm build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click `Load unpacked`.
5. Select the WXT output directory.

### Firefox

1. Run `pnpm dev:firefox` or `pnpm build:firefox`.
2. Open `about:debugging`.
3. Choose `This Firefox`.
4. Click `Load Temporary Add-on`.
5. Select the generated manifest from the build output.

## Development Notes

- Use `pnpm` because the repo is locked with `pnpm-lock.yaml`.
- Keep `entrypoints/` thin and move feature logic into `modules/`.
- Prefer existing shared UI components from `components/ui`.
- Keep the popup lightweight and focused on quick save flows.
- Keep larger management flows in the side panel and dashboard.
- Preserve local-first behavior unless a feature explicitly needs something else.
- Avoid broad permissions, remote services, analytics, and telemetry unless intentionally added.

## Data Model Notes

Saved jobs support fields such as:

- title
- company
- location
- url
- platform
- salary
- notes
- status
- reminder fields
- timestamps

Storage behavior includes:

- normalization before save
- backward-safe stored record parsing
- duplicate detection
- create, update, delete, and list operations

## Status

ApplyPilot is under active development. The popup, side panel, local storage, and detection flow are already in place, and the dashboard is positioned to keep growing into the larger management surface.
