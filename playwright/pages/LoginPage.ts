import { type Page, type Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly url = '/login'

  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly submitButton: Locator
  readonly errorMessage: Locator
  readonly title: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.getByTestId('login-email')
    this.passwordInput = page.getByTestId('login-password')
    this.submitButton = page.getByTestId('login-submit')
    this.errorMessage = page.getByTestId('login-error')
    this.title = page.getByTestId('login-title')
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email)
    await this.passwordInput.fill(password)
    await this.submitButton.click()
  }

  async loginAsAdmin(): Promise<void> {
    await this.login('admin@demo.com', 'password123')
  }

  async loginAsUser(): Promise<void> {
    await this.login('user@demo.com', 'password123')
  }

  async expectError(message: string): Promise<void> {
    await expect(this.errorMessage).toBeVisible()
    await expect(this.errorMessage).toContainText(message)
  }

  async expectNoError(): Promise<void> {
    await expect(this.errorMessage).not.toBeVisible()
  }

  async expectRedirectToDashboard(): Promise<void> {
    await this.page.waitForURL('**/dashboard')
  }
}
