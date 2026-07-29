# Architecture

## Test Framework Layers

### 1. Fixtures (Dependency Injection)

Fixtures provide reusable test setup through Playwright's dependency injection system. They compose via `mergeTests()`:

```
auth.fixture.ts ──┐
                  ├── index.ts (merged export)
api-helpers.ts ───┤
                  │
test-data.ts ─────┘
```

- **authenticatedPage** — Browser context with saved storage state (cookies/session). Avoids login on every test.
- **apiContext** — Pre-configured `APIRequestContext` for direct API calls without a browser.
- **itemFactory** — Builder pattern for creating test data via API. Auto-cleans after each test.

### 2. Page Object Model (Abstraction)

```
BasePage (abstract)
├── LoginPage
├── DashboardPage
├── ItemFormPage
└── ItemListPage
```

**BasePage** provides:
- `navigate()` — Go to the page's URL
- `waitForPageLoad()` — Wait for network idle
- `getByTestId()` — Shorthand for `data-testid` locators

**Concrete pages** add:
- Locator properties (typed references to page elements)
- Action methods (fill form, click sort, filter table)
- Assertion helpers (expectError, expectRedirect)

### 3. Component Objects (Composition)

Reusable UI fragments that appear across multiple pages:

- **DataTableComponent** — Sorting, filtering, row counting
- **ToastComponent** — Wait for notification, verify message, dismiss
- **ModalComponent** — Confirm/cancel dialogs

Component objects are instantiated per-test and can be used with any page object.

### 4. Test Organization

Tests are organized by feature, not by page:

```
tests/
├── auth/          ← Authentication flows
├── dashboard/     ← Table functionality
├── items/         ← CRUD operations
├── api/           ← API-level testing (no browser)
├── visual/        ← Screenshot regression
├── accessibility/ ← axe-core compliance
├── mocking/       ← Network interception patterns
└── smoke/         ← Critical path (subset of all above)
```

## Data Flow

```
Global Setup
    │
    ├─→ Reset data/items.json from seed
    └─→ Create authenticated storage state
            │
            ▼
    Test Execution (parallel)
    ├─→ Auth tests: use fresh page (no storage state)
    ├─→ Feature tests: use authenticatedPage fixture
    ├─→ API tests: use apiContext (no browser)
    └─→ Visual tests: use authenticatedPage + toHaveScreenshot()
```

## Configuration Strategy

`playwright.config.ts` uses Playwright's project system:

1. **setup** project runs first (global-setup.ts)
2. **chromium/firefox/webkit/mobile** projects depend on setup
3. `webServer` block auto-starts the Next.js dev server
4. Retry + trace only in CI (keep local runs fast)

## Selector Strategy

Priority order for locators:
1. `data-testid` — Explicit test hooks (most stable)
2. `getByRole` — Accessible role queries
3. `getByLabel` — Form field labels
4. `getByText` — Visible text content

Never use CSS selectors or XPath — they break on style/structure changes.
