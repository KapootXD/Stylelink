# Stylelink Testing Guide – Phase 3

This guide captures our testing philosophy, how to run and write tests (unit/integration + E2E), and Playwright specifics.

## Philosophy
- Test behavior, not implementation; prefer user-centric queries and flows.
- Favor integration-level coverage where components collaborate.
- Keep tests readable and maintainable; avoid clever over fixtures.
- Use accessible queries first (`getByRole`, `getByLabelText`, etc.).

## Quick Start
```bash
# Unit/Integration
npm test                 # vitest
npm run test:watch       # watch mode
npm run test:ui          # Vitest UI
npm run test:coverage    # coverage report
npm run test:cra         # legacy CRA runner if needed

# End-to-End (Playwright)
npm run test:e2e         # headless E2E suite
npm run test:e2e:ui      # interactive UI runner
npm run test:e2e:headed  # headed browsers
npm run test:e2e:debug   # debug mode
npm run test:e2e:report  # open last report
```

## Structure
```
src/
├─ components/
├─ pages/
├─ hooks/
├─ utils/
└─ test/
   ├─ setup.ts          # global Vitest setup
   └─ test-utils.tsx    # custom render/helpers

tests/
└─ e2e/
   ├─ fixtures/         # test data
   ├─ helpers/          # shared flows (auth, etc.)
   ├─ pages/            # Playwright page objects
   └─ specs/            # E2E specs
```

## Coverage Targets (unit/integration)
| Metric     | Threshold |
|------------|-----------|
| Branches   | 70%       |
| Functions  | 70%       |
| Lines      | 80%       |
| Statements | 80%       |

Run `npm run test:coverage` to generate reports.

## Vitest Essentials
- Custom render wraps Router/providers; import from `src/test/test-utils`.
- Prefer async queries (`findBy...`) and `waitFor` for async UI.
- Mock with `vi.mock`/`vi.spyOn`; place mocks before imports when needed.
- Keep selectors accessible-first; only use `getByTestId` as a last resort.

## Playwright E2E
- Config: `playwright.config.ts` uses `http://localhost:3000`, multi-browser (Chromium/Firefox/WebKit), multi-viewport (desktop/tablet/mobile), retries 2 on CI, screenshots on failure, video/trace on first retry, HTML reporter, and auto-starts `npm run start`.
- Page Objects live in `tests/e2e/pages`; expose intent-based methods (`goto`, `expectLoaded`, `navigateToFeature`, etc.).
- Helpers (e.g., `AuthHelper`) centralize repeated flows like login/logout.
- Fixtures (`tests/e2e/fixtures/test-data.ts`) store sample users, inputs, and mock API payloads.

## CI/CD Pipeline (GitLab)
- Stages: install → lint → unit tests (coverage) → e2e → build (`.gitlab-ci.yml`).
- Jobs:
  - `install_dependencies`: `npm ci` with cache.
  - `lint`: `npm run lint`.
  - `unit_tests`: `npm run test:coverage` (exports Cobertura for GitLab coverage reporting).
  - `e2e_tests`: Playwright in official image; runs `npm run test:e2e`.
  - `build`: `npm run build`; depends on tests.
- Coverage parsing: `/Lines\s*:\s*(\d+\.?\d*)%/` with Cobertura at `coverage/cobertura-coverage.xml`.
- Artifacts: coverage retained 1 week; Playwright artifacts on failure.

### Viewing Results in GitLab
- Coverage and pipeline badges are in README (replace placeholder namespace/project).
- From a job page, open “Artifacts” for coverage HTML and E2E traces/screenshots.
- Merge requests show coverage delta automatically when Cobertura is uploaded.

### Debugging CI Failures
- Lint errors: run `npm run lint` locally.
- Unit failures/coverage drops: run `npm run test:coverage` locally; thresholds enforced in `vitest.config.ts`.
- E2E failures: rerun locally with `npm run test:e2e:headed` or `npm run test:e2e:debug`; inspect CI artifacts (screenshots/trace) from the failing job.
- Build failures: run `npm run build` locally; ensure env vars and asset paths are correct.

### Coverage Requirements
- Minimum: Lines 80%, Branches 70%, Functions 70%, Statements 80%.
- CI fails if thresholds are not met (configured in `vitest.config.ts`).

### Writing E2E Specs
- Put specs in `tests/e2e/specs`. Keep them short and scenario-focused.
- Use POM methods instead of raw selectors inside specs.
- Prefer `page.getByRole`/`getByText` for resilient locators.
- Make assertions on user-visible outcomes (URL changes, headings, CTA visibility, critical content).

### Running Locally
- Start app via Playwright `webServer` auto-start (default) or manually with `npm start`.
- Headed/debug/UI modes help diagnose flakiness; traces/videos live in `playwright-report/` and `test-results/`.

### Debugging E2E
- Use `--ui` or `--debug` to inspect, step, and record locators.
- On failures, open `playwright-report/` for screenshots/traces; artifacts are cleaned via `.gitignore`.
- Add `test.only`/`describe.only` while iterating; remove before committing.

## Best Practices (All Tests)
1. Query priority: Role → Label → Placeholder → Text → TestId.
2. Handle async with `findBy`/`waitFor`; avoid brittle timeouts.
3. Mock at boundaries; avoid over-mocking internal implementation details.
4. Keep fixtures small and relevant; reuse shared generators.
5. Assert meaningful outcomes (URLs, ARIA state, visible text) over internal state.

## Troubleshooting
- Element not found: switch to `findBy`/`waitFor` and ensure the triggering action occurred.
- Redirects: assert the final URL and page shell (e.g., login form) rather than intermediate routes.
- Flaky E2E: run headed with `--debug`, inspect trace/video, and prefer stable, accessible selectors.

## Resources
- Vitest: https://vitest.dev
- Testing Library: https://testing-library.com/docs/react-testing-library/intro
- Playwright: https://playwright.dev
