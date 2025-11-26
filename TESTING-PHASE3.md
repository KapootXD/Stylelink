# End-to-End Testing (Phase 3)

## Overview
- Playwright drives real browsers (Chromium, Firefox, WebKit) against the running app at `http://localhost:3000`.
- Tests live in `tests/e2e` with fixtures, helpers, page objects, and specs to keep concerns isolated.
- The config (`playwright.config.ts`) standardizes timeouts, retries (2 on CI, 0 locally), screenshots/video/trace capture, and multi-viewport coverage (desktop/tablet/mobile).

## Writing E2E Tests
- Add new specs under `tests/e2e/specs`. Keep tests small, focused, and independent.
- Use the exported test data fixtures from `tests/e2e/fixtures/test-data.ts` instead of hardcoding literals.
- Encapsulate selectors and flows in page objects under `tests/e2e/pages` to keep specs declarative.
- Reuse helpers (e.g., `AuthHelper` in `tests/e2e/helpers/auth-helper.ts`) for setup flows like sign-in/out.
- Prefer role-based and text-based locators (`getByRole`, `getByText`) for resilience.

## Page Object Model Pattern
- Each page object should expose:
  - A `goto` method for navigation.
  - Assertions like `expectLoaded` that validate page readiness.
  - Action methods that wrap user intents (e.g., `navigateToFeature`, `applyFilter`).
- Keep selectors private to the page object; expose intent-based methods to specs.
- Share common flows in helpers to avoid duplicating logic across page objects.

## Running E2E Tests Locally
- Start the app in another terminal: `npm start` (serves at `http://localhost:3000`).
- Run the full suite headless: `npm run test:e2e`.
- Open the interactive UI runner: `npm run test:e2e:ui`.
- Run headed for easier observation: `npm run test:e2e:headed`.
- Show the last report: `npm run test:e2e:report`.

## Debugging E2E Tests
- Run a single test with debug tools: `npm run test:e2e:debug tests/e2e/specs/example.spec.ts`.
- Use the built-in inspector (`--ui` or `--debug`) to pause, step, and record new locators.
- On failures, check the Playwright artifacts in `playwright-report/` and `test-results/` (screenshots, traces, videos captured on retry).
- Add `test.only` or `test.describe.only` while investigating, then remove before committing.
