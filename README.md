# Playwright Framework Demo

A production-ready Playwright test framework demonstrating best practices for end-to-end testing, including Page Object Models, custom fixtures, visual regression, accessibility testing, and CI/CD integration.

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install --with-deps

# Run all tests
npx playwright test

# Run with UI mode (interactive)
npx playwright test --ui

# View test report
npx playwright show-report
```

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Test Suites                              │
│  auth/ │ dashboard/ │ items/ │ api/ │ visual/ │ a11y │ mocking  │
├─────────────────────────────────────────────────────────────────┤
│                     Custom Fixtures                              │
│         auth.fixture │ api-helpers │ test-data-factory           │
├─────────────────────────────────────────────────────────────────┤
│              Page Objects          │     Component Objects       │
│  LoginPage │ DashboardPage │ ...   │  Toast │ Modal │ Table     │
├─────────────────────────────────────────────────────────────────┤
│                      Base Page                                   │
│              navigate() │ waitForPageLoad() │ getByTestId()      │
├─────────────────────────────────────────────────────────────────┤
│                   Playwright Test Runner                         │
│        chromium │ firefox │ webkit │ mobile-chrome               │
├─────────────────────────────────────────────────────────────────┤
│                   Demo Application (Next.js)                     │
│           /login │ /dashboard │ /items/new │ /items/[id]         │
└─────────────────────────────────────────────────────────────────┘
```

## Project Structure

```
playwright-framework-demo/
├── app/                          # Next.js demo application
│   ├── _lib/                     # Server utilities (auth, db, types)
│   ├── api/                      # API route handlers
│   ├── login/                    # Login page
│   └── (authenticated)/          # Protected pages (dashboard, items)
│
├── playwright/                   # Test framework
│   ├── fixtures/                 # Custom test fixtures
│   │   ├── index.ts              # Merged fixture exports
│   │   ├── auth.fixture.ts       # Pre-authenticated page
│   │   ├── api-helpers.fixture.ts # API request context
│   │   └── test-data.fixture.ts  # Test data factory
│   │
│   ├── pages/                    # Page Object Model
│   │   ├── BasePage.ts           # Abstract base class
│   │   ├── LoginPage.ts          # Login page interactions
│   │   ├── DashboardPage.ts      # Dashboard interactions
│   │   └── ItemFormPage.ts       # Form interactions
│   │
│   ├── components/               # Reusable component objects
│   │   ├── DataTableComponent.ts # Table sort/filter/pagination
│   │   ├── ToastComponent.ts     # Toast notifications
│   │   └── ModalComponent.ts     # Confirmation dialogs
│   │
│   ├── tests/                    # Test suites
│   │   ├── auth/                 # Login/logout tests
│   │   ├── dashboard/            # Table sort, filter, data-driven
│   │   ├── items/                # CRUD operations
│   │   ├── api/                  # Direct API testing
│   │   ├── visual/               # Screenshot comparisons
│   │   ├── accessibility/        # axe-core a11y scans
│   │   ├── mocking/              # Network interception
│   │   └── smoke/                # Critical path checks
│   │
│   ├── utils/                    # Shared utilities
│   └── global-setup.ts           # Data reset + auth state
│
├── data/                         # JSON data store
├── playwright.config.ts          # Playwright configuration
├── Dockerfile                    # Container for consistent runs
├── docker-compose.yml            # App + tests orchestration
└── .github/workflows/            # CI/CD pipeline
```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:smoke` | Smoke tests only |
| `npm run test:visual` | Visual regression only |
| `npm run test:a11y` | Accessibility tests only |
| `npm run test:api` | API tests only |
| `npm run test:headed` | Run with browser visible |
| `npm run test:debug` | Debug mode (step through) |
| `npm run report` | View HTML report |

### Run by browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run specific test file

```bash
npx playwright test tests/auth/login.spec.ts
```

### Run by tag

```bash
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep @visual
npx playwright test --grep @a11y
```

## Test Tags

| Tag | Purpose |
|-----|---------|
| `@smoke` | Critical path tests, run on every deployment |
| `@regression` | Full regression suite |
| `@visual` | Screenshot comparison tests |
| `@a11y` | Accessibility compliance tests |

## Key Patterns Demonstrated

### Page Object Model
Tests use page objects that encapsulate page-specific selectors and actions:

```typescript
const loginPage = new LoginPage(page)
await loginPage.navigate()
await loginPage.login('admin@demo.com', 'password123')
await loginPage.expectRedirectToDashboard()
```

### Custom Fixtures
Pre-configured test contexts (authenticated pages, API helpers, data factories):

```typescript
test('shows dashboard', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard')
  // Already logged in — no login step needed
})
```

### Data-Driven Tests
Parameterized test cases from arrays:

```typescript
const cases = [
  { filter: 'Features', minExpected: 3 },
  { filter: 'Reports', minExpected: 2 },
]
for (const { filter, minExpected } of cases) {
  test(`filters by: ${filter}`, async ({ authenticatedPage }) => { ... })
}
```

### Network Mocking
Intercept and modify API responses:

```typescript
await page.route('**/api/items', async (route) => {
  await route.fulfill({ status: 500, body: '{"error": "fail"}' })
})
```

### Visual Regression
Screenshot comparisons with dynamic content masking:

```typescript
await expect(page).toHaveScreenshot('dashboard.png', {
  mask: [page.getByTestId('timestamp')],
})
```

## How to Add a New Test

1. **Create a page object** (if testing a new page) in `playwright/pages/`
2. **Create the test file** in the appropriate `playwright/tests/` subdirectory
3. **Import fixtures**: `import { test, expect } from '../../fixtures'`
4. **Use page objects** for interactions and assertions
5. **Tag your test** with `@smoke`, `@regression`, etc.
6. **Run and verify**: `npx playwright test your-new-test.spec.ts`

## CI/CD

GitHub Actions runs tests across 3 browsers with 2 shards each (6 parallel jobs). On failure, traces and screenshots are uploaded as artifacts for debugging.

## Docker

```bash
# Run tests in Docker (consistent environment)
docker compose up tests

# Run app only
docker compose up app
```

## Demo Application

The bundled Next.js app provides realistic test targets:

- **Login** — Form validation, session management, error states
- **Dashboard** — Data table with sorting, filtering, search
- **CRUD** — Create/edit/delete with confirmation dialogs
- **Toasts** — Success/error notifications

Credentials: `admin@demo.com` / `password123`
