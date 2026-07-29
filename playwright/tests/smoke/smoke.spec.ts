import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'

test.describe('Smoke Tests @smoke', () => {
  test('critical path: login → dashboard → create item', async ({ page }) => {
    // Step 1: Login
    await test.step('Login as admin', async () => {
      const loginPage = new LoginPage(page)
      await loginPage.navigate()
      await loginPage.loginAsAdmin()
      await page.waitForURL('**/dashboard')
    })

    // Step 2: Verify dashboard loads
    await test.step('Dashboard displays items', async () => {
      await page.getByTestId('data-table').waitFor()
      const rowCount = await page.getByTestId('table-row-count').textContent()
      expect(rowCount).toContain('item')
    })

    // Step 3: Navigate to create form
    await test.step('Navigate to create item', async () => {
      await page.getByTestId('nav-new-item').click()
      await page.waitForURL('**/items/new')
      await expect(page.getByTestId('item-form')).toBeVisible()
    })

    // Step 4: Create an item
    await test.step('Create new item', async () => {
      await page.getByTestId('item-name-input').fill('Smoke Test Item')
      await page.getByTestId('item-category-select').selectOption('Features')
      await page.getByTestId('item-status-select').selectOption('active')
      await page.getByTestId('item-priority-select').selectOption('high')
      await page.getByTestId('item-form-submit').click()

      await page.waitForURL('**/dashboard')
      await page.getByTestId('data-table').waitFor()
    })
  })

  test('unauthenticated access is blocked', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL('**/login')
    await expect(page.getByTestId('login-form')).toBeVisible()
  })

  test('navigation between pages works', async ({ page }) => {
    const loginPage = new LoginPage(page)
    await loginPage.navigate()
    await loginPage.loginAsAdmin()
    await page.waitForURL('**/dashboard')

    // Navigate to new item
    await page.getByTestId('nav-new-item').click()
    await page.waitForURL('**/items/new')

    // Navigate back to dashboard
    await page.getByTestId('nav-dashboard').click()
    await page.waitForURL('**/dashboard')
  })
})
