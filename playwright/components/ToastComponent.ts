import { type Page, type Locator, expect } from '@playwright/test'

export class ToastComponent {
  private readonly page: Page
  private readonly toast: Locator
  private readonly message: Locator
  private readonly dismiss: Locator

  constructor(page: Page) {
    this.page = page
    this.toast = page.getByTestId('toast')
    this.message = page.getByTestId('toast-message')
    this.dismiss = page.getByTestId('toast-dismiss')
  }

  async waitForToast(): Promise<void> {
    await expect(this.toast).toBeVisible()
  }

  async expectMessage(text: string): Promise<void> {
    await expect(this.message).toContainText(text)
  }

  async expectType(type: 'success' | 'error' | 'info'): Promise<void> {
    await expect(this.toast).toHaveAttribute('data-toast-type', type)
  }

  async dismiss_toast(): Promise<void> {
    await this.dismiss.click()
  }

  async waitForDismissal(): Promise<void> {
    await expect(this.toast).not.toBeVisible()
  }
}
