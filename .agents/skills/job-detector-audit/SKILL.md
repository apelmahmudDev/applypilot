---
name: job-detector-audit
description: Audit, debug, and improve job-data extraction in ApplyPilot for LinkedIn, Indeed, job boards, and generic career pages. Use when the job title, company, location, salary, job type, description, URL, platform, or company logo is missing, incorrect, duplicated, or detected inconsistently.
---

---

# Job Detector Audit

## Goal

Find and fix job-detection problems without breaking existing website-specific detectors or the generic fallback.

Follow the repository's `AGENTS.md` instructions throughout the task.

## Detection Fields

Check the following fields when relevant:

- Job title
- Company name
- Location
- Salary
- Job type
- Job description
- Job URL
- Platform
- Company logo

Use the project's existing field names and data types. Do not change the job-record schema unless explicitly requested.

## Workflow

1. Inspect the existing detection pipeline before editing code.
2. Identify the website and page type:
   - Job details page
   - Job search or listing page
   - Company career page
   - Generic or unsupported page

3. Reproduce the reported issue and identify its root cause.
4. Extract data using this priority:
   - JSON-LD `JobPosting`
   - Open Graph and page metadata
   - Semantic and accessible HTML
   - Stable website-specific attributes
   - Generic fallback detection

5. Do not rely on generated CSS class names as the only detection method.
6. Normalize extracted values:
   - Trim unnecessary whitespace
   - Remove duplicated text
   - Convert relative URLs to absolute URLs
   - Remove obvious labels from field values
   - Preserve useful description formatting

7. Return a missing value instead of guessing uncertain information.
8. Preserve manual editing when automatic detection fails.
9. Confirm that website-specific changes do not break the generic fallback.
10. Add or update relevant tests or HTML fixtures when the repository has an applicable test setup.

## Safety

- Do not collect unrelated page content, private messages, cookies, tokens, or hidden personal information.
- Do not store complete page HTML.
- Do not add permissions, dependencies, external APIs, or broad refactors unless explicitly requested.
- Keep the change limited to the affected detector and shared logic that genuinely requires modification.

## Verification

Run the relevant scripts available in `package.json`, such as:

- Type checking
- Linting
- Detector tests
- Production build

Never claim that a check passed unless it was successfully run.

When automated tests are unavailable, describe the exact browser pages and scenarios that require manual testing.

## Completion Report

At the end, report:

- Root cause of the detection problem
- Detection strategy used
- Files changed
- Tests or checks performed
- Manual browser testing required
- Remaining limitations or risks
