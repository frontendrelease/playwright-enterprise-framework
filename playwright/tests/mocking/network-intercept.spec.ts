import { test, expect } from '../../fixtures'

test.describe('Network Interception @regression', () => {
  test('displays mocked data from intercepted API', async ({ authenticatedPage }) => {
    const mockItems = [
      {
        id: 'mock_1',
        name: 'Mocked Item One',
        category: 'Features',
        status: 'active',
        priority: 'high',
        createdAt: '2024-01-01T00:00:00Z',
      },
      {
        id: 'mock_2',
        name: 'Mocked Item Two',
        category: 'Reports',
        status: 'pending',
        priority: 'low',
        createdAt: '2024-01-02T00:00:00Z',
      },
    ]

    await authenticatedPage.route('**/api/items', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ items: mockItems, total: 2 }),
        })
      } else {
        await route.continue()
      }
    })

    await authenticatedPage.goto('/dashboard')
    await authenticatedPage.getByTestId('data-table').waitFor()

    await expect(authenticatedPage.getByText('Mocked Item One')).toBeVisible()
    await expect(authenticatedPage.getByText('Mocked Item Two')).toBeVisible()

    const rowCount = authenticatedPage.getByTestId('table-row-count')
    await expect(rowCount).toContainText('2 items')
  })

  test('intercepts and modifies API response', async ({ authenticatedPage }) => {
    await authenticatedPage.route('**/api/items', async (route) => {
      const response = await route.fetch()
      const json = await response.json()

      // Modify: only return first 3 items
      json.items = json.items.slice(0, 3)
      json.total = 3

      await route.fulfill({ response, body: JSON.stringify(json) })
    })

    await authenticatedPage.goto('/dashboard')
    await authenticatedPage.getByTestId('data-table').waitFor()

    const rowCount = authenticatedPage.getByTestId('table-row-count')
    await expect(rowCount).toContainText('3 items')
  })

  test('captures and asserts on request payload', async ({ authenticatedPage }) => {
    let capturedPayload: Record<string, unknown> | null = null

    await authenticatedPage.route('**/api/items', async (route) => {
      if (route.request().method() === 'POST') {
        capturedPayload = route.request().postDataJSON()
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            item: { id: 'captured_1', ...capturedPayload, createdAt: new Date().toISOString() },
          }),
        })
      } else {
        await route.continue()
      }
    })

    await authenticatedPage.goto('/items/new')
    await authenticatedPage.getByTestId('item-name-input').fill('Captured Item')
    await authenticatedPage.getByTestId('item-category-select').selectOption('Design')
    await authenticatedPage.getByTestId('item-status-select').selectOption('active')
    await authenticatedPage.getByTestId('item-priority-select').selectOption('critical')
    await authenticatedPage.getByTestId('item-form-submit').click()

    await authenticatedPage.waitForTimeout(500)

    expect(capturedPayload).toEqual({
      name: 'Captured Item',
      category: 'Design',
      status: 'active',
      priority: 'critical',
    })
  })
})
