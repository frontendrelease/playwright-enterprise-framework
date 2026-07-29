import { test, expect } from '@playwright/test'

test.describe('Visual: Login Page @visual', () => {
  test('login page matches snapshot', async ({ page }) => {
    await page.goto('/login')
    await expect(page).toHaveScreenshot('login-page.png', {
      maxDiffPixelRatio: 0.01,
    })
  })

  test('login page with error state', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('login-email').fill('wrong@email.com')
    await page.getByTestId('login-password').fill('wrongpass')
    await page.getByTestId('login-submit').click()
    await page.getByTestId('login-error').waitFor()

    await expect(page).toHaveScreenshot('login-error-state.png', {
      maxDiffPixelRatio: 0.01,
    })
  })
})
