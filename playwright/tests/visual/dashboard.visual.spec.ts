import { test, expect } from '../../fixtures'

const MOCK_ITEMS = [
  { id: 'vis_1', name: 'Visual Test Item A', category: 'Features', status: 'active', priority: 'high', createdAt: '2024-01-01T00:00:00Z' },
  { id: 'vis_2', name: 'Visual Test Item B', category: 'Reports', status: 'pending', priority: 'medium', createdAt: '2024-01-02T00:00:00Z' },
  { id: 'vis_3', name: 'Visual Features Item', category: 'Features', status: 'completed', priority: 'low', createdAt: '2024-01-03T00:00:00Z' },
]

test.describe('Visual: Dashboard @visual', () => {
  test('dashboard layout matches snapshot', async ({ authenticatedPage }) => {
    await authenticatedPage.route('**/api/items', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ items: MOCK_ITEMS, total: MOCK_ITEMS.length }),
        })
      } else {
        await route.continue()
      }
    })

    await authenticatedPage.goto('/dashboard')
    await authenticatedPage.getByTestId('data-table').waitFor()

    await expect(authenticatedPage).toHaveScreenshot('dashboard.png', {
      maxDiffPixelRatio: 0.02,
    })
  })

  test('dashboard with filter active', async ({ authenticatedPage }) => {
    await authenticatedPage.route('**/api/items', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ items: MOCK_ITEMS, total: MOCK_ITEMS.length }),
        })
      } else {
        await route.continue()
      }
    })

    await authenticatedPage.goto('/dashboard')
    await authenticatedPage.getByTestId('data-table').waitFor()
    await authenticatedPage.getByTestId('table-filter-input').fill('Features')

    await expect(authenticatedPage).toHaveScreenshot('dashboard-filtered.png', {
      maxDiffPixelRatio: 0.02,
    })
  })
})
