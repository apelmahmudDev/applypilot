# ApplyPilot

ApplyPilot is a privacy-first browser extension for saving and managing job applications while browsing job boards. The current app is built with WXT, React, TypeScript, Tailwind CSS, shadcn/Radix UI components, TanStack Form, TanStack Table, and Zod.

The product goal is simple: detect a job page, let the user quickly review or edit the important fields, save the job locally, and then offer larger workspaces for deeper management.

## Current Popup Flow

The popup currently supports three views:

- `Detected Job`: shows the detected job summary and quick actions.
- `Edit Before Saving`: opens a compact in-popup form for correcting important fields before saving.
- `Saved State`: confirms the save and offers entry points to the side panel or dashboard.

The compact edit form intentionally keeps only the fields that fit the popup workflow:

- Job title
- Company
- Location
- Job URL
- Platform
- Status
- Notes

Larger fields and advanced workflows belong in the side panel or full dashboard.

## Tech Stack

- WXT for browser extension structure and builds
- React 19 with TypeScript
- Tailwind CSS 4
- shadcn/Radix UI primitives
- Lucide React icons
- TanStack Form for popup form state
- Zod for form validation
- TanStack Table for future dashboard data tables
- pnpm for package management

## Project Structure

```txt
entrypoints/
  background.ts          Extension background entrypoint
  content.ts             Content script entrypoint
  popup/                 Popup HTML, React bootstrap, and app container

modules/
  popup/                 Popup feature module
    components/          Popup views and shell components
    job-form.schema.ts   Zod validation schema
    mock-job.ts          Temporary detected job fixture
    types.ts             Popup and job form types

components/
  ui/                    Shared shadcn/Radix UI components

assets/
  tailwind.css           Global Tailwind and theme styles

public/
  icon/                  Extension icons
```

`entrypoints/popup/App.tsx` is intentionally small. Popup UI and validation logic live in `modules/popup` so the entrypoint stays focused on view orchestration.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Start the Chrome development build:

```bash
pnpm dev
```

Start the Firefox development build:

```bash
pnpm dev:firefox
```

Type-check the project:

```bash
pnpm compile
```

Create a production build:

```bash
pnpm build
```

Create a distributable zip:

```bash
pnpm zip
```

## Loading The Extension

For Chrome or Chromium-based browsers:

1. Run `pnpm dev` or `pnpm build`.
2. Open `chrome://extensions`.
3. Enable Developer mode.
4. Click Load unpacked.
5. Select the generated extension output directory from WXT.
6. Reload the extension after code changes when needed.

## Development Notes

- Use `pnpm` because this repo uses `pnpm-lock.yaml`.
- Keep browser extension permissions minimal.
- Keep the popup fast and focused on save/edit/open actions.
- Use the side panel for browsing-time workflows.
- Use the dashboard for larger management tasks like full tables, filtering, analytics, import, and export.
- Prefer local-first storage unless a feature explicitly requires a backend.
- Use existing `components/ui` primitives before adding custom UI.

## Form Pattern

Popup forms should use the shared UI components and validation stack:

- `Field`, `FieldLabel`, and `FieldError` for form structure
- `Input`, `Textarea`, `InputGroup`, and `Select` for controls
- TanStack Form for form state
- Zod schemas for validation

Validation schemas should live near the feature that owns the form, such as `modules/popup/job-form.schema.ts`.

## Data Table Pattern

For dashboard-scale tables, follow the shadcn/Radix data-table split inside the relevant feature module:

```txt
feature/
  columns.tsx
  data-table.tsx
  view.tsx
```

- `columns.tsx` defines columns, cells, headers, sorting labels, and row actions.
- `data-table.tsx` owns reusable table UI, sorting, filtering, pagination, selection, empty state, and loading state.
- `view.tsx` or the feature entry component loads data and renders the table.

Avoid putting large tables inside the popup.

## Privacy Direction

ApplyPilot should treat job application data as private user data. The default direction is local-first storage, minimal permissions, and no analytics, telemetry, backend sync, AI calls, or external network features unless explicitly added for a clear product reason.

## Status

This project is under active development. The popup UI is the most developed area today; dashboard, side panel, persistent storage, real job detection, and full job management workflows are expected to grow from the same module-based architecture.

