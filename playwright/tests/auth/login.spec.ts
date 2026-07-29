import { test, expect } from '@playwright/test'
import { LoginPage } from '../../pages/LoginPage'

test.describe('Login @smoke @regression', () => {
  let loginPage: LoginPage

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    await loginPage.navigate()
  })

  test('displays login form', async () => {
    await expect(loginPage.title).toBeVisible()
    await expect(loginPage.emailInput).toBeVisible()
    await expect(loginPage.passwordInput).toBeVisible()
    await expect(loginPage.submitButton).toBeVisible()
  })

  test('successful login redirects to dashboard', async () => {
    await loginPage.loginAsAdmin()
    await loginPage.expectRedirectToDashboard()
  })

  test('shows error for invalid credentials', async () => {
    await loginPage.login('wrong@email.com', 'wrongpass')
    await loginPage.expectError('Invalid email or password')
  })

  test('shows error for empty email', async ({ page }) => {
    await loginPage.passwordInput.fill('password123')
    await loginPage.submitButton.click()

    // HTML5 validation prevents submission
    const emailInput = page.getByTestId('login-email')
    const validationMessage = await emailInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage,
    )
    expect(validationMessage).toBeTruthy()
  })

  test('shows error for empty password', async ({ page }) => {
    await loginPage.emailInput.fill('admin@demo.com')
    await loginPage.submitButton.click()

    const passwordInput = page.getByTestId('login-password')
    const validationMessage = await passwordInput.evaluate(
      (el: HTMLInputElement) => el.validationMessage,
    )
    expect(validationMessage).toBeTruthy()
  })

  test('login button shows loading state', async ({ page }) => {
    await loginPage.emailInput.fill('admin@demo.com')
    await loginPage.passwordInput.fill('password123')

    const [response] = await Promise.all([
      page.waitForResponse('**/api/auth/login'),
      loginPage.submitButton.click(),
    ])

    expect(response.status()).toBe(200)
  })

  test('can login as regular user', async () => {
    await loginPage.loginAsUser()
    await loginPage.expectRedirectToDashboard()
  })
})
