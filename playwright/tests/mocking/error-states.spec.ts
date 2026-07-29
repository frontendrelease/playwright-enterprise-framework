import { test, expect } from '../../fixtures'

test.describe('Error States @regression', () => {
  test('shows error message when API returns 500', async ({ authenticatedPage }) => {
    await authenticatedPage.route('**/api/items', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal Server Error' }),
        })
      } else {
        await route.continue()
      }
    })

    await authenticatedPage.goto('/dashboard')

    const errorMessage = authenticatedPage.getByTestId('error-message')
    await expect(errorMessage).toBeVisible()
    await expect(errorMessage).toContainText('Error')
  })

  test('shows loading skeleton during slow response', async ({ authenticatedPage }) => {
    await authenticatedPage.route('**/api/items', async (route) => {
      if (route.request().method() === 'GET') {
        await new Promise((resolve) => setTimeout(resolve, 3000))
        await route.continue()
      } else {
        await route.continue()
      }
    })

    await authenticatedPage.goto('/dashboard')

    const skeleton = authenticatedPage.getByTestId('loading-skeleton')
    await expect(skeleton).toBeVisible()
  })

  test('handles network failure gracefully', async ({ authenticatedPage }) => {
    await authenticatedPage.route('**/api/items', async (route) => {
      if (route.request().method() === 'GET') {
        await route.abort('connectionrefused')
      } else {
        await route.continue()
      }
    })

    await authenticatedPage.goto('/dashboard')

    const errorMessage = authenticatedPage.getByTestId('error-message')
    await expect(errorMessage).toBeVisible()
  })
})
