import { test, expect } from '../../fixtures'

test.describe('Logout @regression', () => {
  test('logout button clears session', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard')
    await authenticatedPage.getByTestId('logout-button').click()
    await authenticatedPage.waitForURL('**/login')
    await expect(authenticatedPage.getByTestId('login-form')).toBeVisible()
  })

  test('cannot access dashboard after logout', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard')
    await authenticatedPage.getByTestId('logout-button').click()
    await authenticatedPage.waitForURL('**/login')

    await authenticatedPage.goto('/dashboard')
    await authenticatedPage.waitForURL('**/login')
  })

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/login')
    await expect(page.getByTestId('login-form')).toBeVisible()
  })
})
