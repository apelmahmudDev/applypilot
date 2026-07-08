# Codex Project Rules

These rules apply to every Codex session in this repository. Follow them before running or executing any command.

## Project Context

- This repository is a WXT + React + TypeScript browser extension.
- The project is a Smart Job Application Tracker / ApplyPilot browser extension.
- Keep changes consistent with WXT conventions and the existing folder structure.
- Prefer TypeScript and React patterns already used in nearby files.
- Keep edits narrowly scoped to the requested feature or fix.
- Do not introduce new frameworks, state libraries, build tools, or styling systems without a clear need.
- Use existing UI utilities, components, hooks, helpers, and styling patterns before creating new abstractions.
- The extension should remain local-first by default unless the user explicitly asks for backend, login, sync, analytics, AI, or external network features.

## WXT-Specific Rules

- Follow WXT entrypoint conventions for popup, side panel, background, content scripts, and extension pages.
- Do not manually edit generated WXT output files.
- Prefer using WXT configuration files instead of custom build hacks.
- If changing manifest behavior, update it through WXT-supported configuration whenever possible.
- Keep extension pages, content scripts, and background scripts separated by responsibility.
- Do not break WXT entrypoint conventions.
- Do not add custom build tooling unless absolutely necessary and approved by the user.

## Module Pattern Rules

- Use `modules/<feature>` for feature-specific UI, types, schemas, hooks, helpers, mocks, and orchestration that are not broadly shared.
- Keep WXT `entrypoints/` files thin: they should mount the entrypoint, wire top-level state, and compose feature modules.
- Prefer imports from feature modules through the project alias, such as `@/modules/popup/...`, instead of reaching through long relative paths.
- Put reusable primitives and cross-feature utilities in existing shared folders such as `components/`, `hooks/`, `lib/`, or `utils/`, not inside a single feature module.
- Keep module internals organized by responsibility. Use `components/` for feature components, `types.ts` for feature-local types, schema files for validation, and small helper files when they clarify behavior.
- Do not create barrel exports by default. Add an `index.ts` only when a module has a stable public surface used by multiple files.
- Avoid importing from one feature module into another feature module unless the code is intentionally shared. Move shared logic to a common folder instead.
- Keep browser-extension boundaries intact inside modules: content extraction logic, background logic, popup UI, side panel UI, and dashboard UI should remain separated by entrypoint responsibility.

## Command Safety

- Confirm the current directory is the repository root before making changes.
- Expected local repo path: `C:\Developments\browser-extension\applypilot`.
- Confirm the repository root by checking project files such as `package.json`, `wxt.config.ts`, and `pnpm-lock.yaml`.
- Run `git status --short` before making edits or running broad commands.
- Do not overwrite user changes.
- Prefer read-only inspection commands first, such as `rg`, `Get-Content`, `Get-ChildItem`, `git diff`, and `cat package.json`.
- Do not run destructive commands such as `git reset --hard`, `git clean`, recursive deletes, force overwrites, or mass file rewrites unless the user explicitly asks.
- Do not create commits, branches, tags, or pull requests unless the user explicitly asks.
- Do not install, update, or remove dependencies without checking `package.json` and `pnpm-lock.yaml` first.
- Do not manually edit `pnpm-lock.yaml`.
- Use `pnpm` for project scripts and dependency work because this project uses `pnpm-lock.yaml`.
- Avoid commands that write outside this repository unless the user approves them.
- If a command may start a long-running process, explain what it does first and keep track of the running session.
- Prefer PowerShell-compatible commands on Windows.

## Browser Extension Rules

- Be careful with browser-extension permissions, content-script boundaries, background scripts, side panel logic, popup logic, and manifest-related changes.
- Do not add new permissions, host permissions, or broad wildcard permissions unless they are necessary and explained.
- Do not add remote code execution, `eval`, unsafe inline scripts, or unnecessary external scripts.
- Keep content scripts focused on page interaction only.
- Keep background/service worker logic focused on extension-level tasks.
- Keep UI logic inside React components where appropriate.
- Do not add unnecessary persistent background behavior.
- Do not collect or process unrelated page content.
- Do not modify third-party job board pages unless explicitly required by the requested feature.

## ApplyPilot Product Rules

- ApplyPilot should be a privacy-first job application tracker.
- The default storage model should be local-first.
- Do not add backend sync, login, analytics, telemetry, AI features, or external APIs unless explicitly requested.
- Job data should support clear `createdAt` and `updatedAt` values.
- Manual editing should always be available when auto-detection fails.
- Duplicate job detection should use the job URL first, then company + title as a fallback.
- Keep job tracking focused on useful daily workflow: save jobs, edit jobs, update statuses, add notes, set follow-up dates, search, filter, and export.
- Avoid storing unnecessary personal data.
- Keep the product simple, polished, and recruiter-friendly.

## Content Script Rules

- Content scripts should only extract job-related page information.
- Do not collect unrelated page text, private messages, cookies, auth tokens, profile data, or hidden personal data.
- Prefer safe extraction from visible headings, metadata, known job-page selectors, and URL.
- Use fallback logic when selectors fail.
- Do not assume every website has the same structure.
- Content scripts should send only the minimum required detected job fields to the extension UI.
- Never add fragile or overly broad DOM scraping unless necessary and explained.

## Security and Privacy

- Do not hardcode API keys, secrets, tokens, emails, passwords, or private credentials.
- Do not commit `.env` files or secret values.
- Do not log sensitive user data, job application details, resumes, cover letters, personal notes, or authentication tokens.
- Treat stored job application data as private user data.
- Prefer minimum required permissions and minimum required data storage.
- If adding analytics, tracking, telemetry, external network calls, or backend communication, ask first.
- Keep privacy messaging accurate. Do not claim data stays local if a feature sends data outside the browser.
- Do not introduce remote scripts or third-party tracking libraries.

## Data and Storage

- Prefer `chrome.storage.local` or WXT-compatible storage helpers for extension data.
- Preserve existing local storage or extension storage schemas unless the task requires a migration.
- If changing stored data shape, add backward-compatible handling for old data.
- Avoid deleting user data automatically.
- Keep storage keys centralized if the project already has helpers/constants.
- Validate and safely handle missing, malformed, duplicated, or older stored data.
- Avoid using normal browser `localStorage` for core extension data unless the existing project already uses it and the change is scoped.
- Export/import features should handle invalid files gracefully.
- Do not store unnecessary page content or personally sensitive data.

## UI and UX Consistency

- Keep the UI consistent with the current extension design system.
- Reuse existing components, spacing, colors, typography, icons, and layout patterns.
- Make UI responsive inside browser extension constraints such as popup width, side panel width, and small viewport height.
- Avoid overengineering simple screens.
- Keep loading, empty, error, and success states clear.
- Do not add unnecessary animations or heavy UI libraries.
- Side panel views should support quick actions without forcing the user to leave the current job page.
- Full dashboard views should be used for larger management tasks such as analytics, export/import, detailed filtering, and bulk review.
- Keep dark mode styling consistent if the existing UI uses a dark theme.

## Table and Data Table Rules

- For new data tables, follow the shadcn/Radix data-table structure and split table code by responsibility.
- Prefer this structure inside the relevant feature folder:
  - `columns.tsx` for column definitions.
  - `data-table.tsx` for the reusable `<DataTable />` component.
  - `page.tsx`, `view.tsx`, or the feature entry component for fetching/loading data and rendering the table.
- In this WXT + React extension, do not assume Next.js server components. Treat `page.tsx` from shadcn examples as the feature-level screen/view component.
- Keep column definitions focused on headers, cells, sorting labels, row actions, and display formatting.
- Keep table state and UI controls such as sorting, filtering, pagination, row selection, empty state, and loading state inside `data-table.tsx` unless the feature already has a shared table pattern.
- Keep data fetching, storage reads, mutation handlers, and feature-specific orchestration outside `data-table.tsx` when practical.
- Use existing `components/ui/table.tsx` and related shadcn/Radix UI components before creating custom table primitives.
- For dashboard-scale job lists, prefer a data table over card-only layouts when users need scanning, filtering, sorting, or bulk actions.
- Avoid putting large or complex data tables inside the popup. Use the dashboard for full tables and the side panel only for lightweight lists.

## Code Quality

- Use TypeScript types instead of `any` when practical.
- Keep functions small and readable.
- Avoid duplicate logic; extract helpers only when reuse is clear.
- Do not leave dead code, unused imports, console logs, or commented-out experiments.
- Follow existing naming conventions.
- Prefer simple, maintainable code over clever abstractions.
- Handle errors gracefully.
- Do not silence TypeScript or lint errors without a clear reason.
- Keep business logic separate from UI when it improves readability.
- Prefer pure helper functions for filtering, sorting, duplicate detection, export formatting, and date calculations.
- Keep components focused and avoid very large React components when splitting is clearly helpful.

## Dashboard Rules

- The dashboard should be part of the same extension project, not a separate app or separate backend.
- The dashboard should be an extension page opened in a new tab.
- The dashboard should use the same shared storage/data layer as the popup and side panel.
- Dashboard features should focus on full job management:
  - All saved jobs
  - Search
  - Filter by status
  - Sort by date, company, deadline, or status
  - Edit job
  - Delete job
  - Open original job link
  - Analytics
  - Export/import
  - Settings
- Keep dashboard UI clean, professional, and suitable for GitHub screenshots.

## Side Panel Rules

- The side panel should support quick job workflow while browsing.
- When the user clicks “View all” in the side panel, open an “All Applications” view inside the side panel.
- Include an “Open Full Dashboard” button for larger management tasks.
- Side panel views should be lightweight and fast.
- Avoid putting complex analytics, large tables, or heavy management tools inside the side panel.

## Popup Rules

- The popup should be simple and fast.
- The popup should focus on detecting the current job, saving it, editing before save, and opening the side panel or dashboard.
- Do not overload the popup with dashboard-level features.
- Keep popup layout suitable for small extension dimensions.

## Permissions Rules

- Keep extension permissions minimal.
- Do not add broad host permissions such as `<all_urls>` unless the user explicitly approves and the feature truly requires it.
- Prefer `activeTab` when possible.
- Explain why a new permission is needed before adding it.
- Avoid requesting permissions for features that are not implemented yet.
- Keep manifest changes scoped and intentional.

## Dependency Rules

- Do not add dependencies without checking whether existing utilities can solve the problem.
- Ask before adding large UI libraries, chart libraries, date libraries, state management libraries, backend SDKs, analytics SDKs, or AI SDKs.
- Use `pnpm` for dependency installation.
- Do not manually edit `pnpm-lock.yaml`.
- Avoid dependency changes for small fixes.

## Verification

- Before changing code, inspect relevant files and existing scripts in `package.json`.
- For TypeScript or React changes, run the project’s typecheck/compile script when available.
- For build-sensitive extension changes, run `pnpm build` when practical.
- If tests exist and the change affects tested behavior, run the relevant tests.
- If verification is skipped, explain why.
- Before finishing, check `git diff --stat`.
- Summarize changed files and verification results.
- Do not claim verification passed unless the command was actually run and completed successfully.

## Communication Rules

- Explain the plan before making large or risky changes.
- Ask before adding dependencies, permissions, backend services, external APIs, analytics, telemetry, or AI features.
- If a request is ambiguous, inspect the code first and ask only when needed.
- Keep final summaries short, practical, and focused on changed files, verification, and risks.
- Mention any manual browser testing steps required, such as reloading the extension in Chrome.
- Do not expose internal tool details or unnecessary implementation noise to the user.

## Definition of Done

Before finishing a task, provide:

- What was changed.
- Which files were changed.
- What verification was run.
- Any verification that was skipped and why.
- Any follow-up risk or manual step the user should know about.
