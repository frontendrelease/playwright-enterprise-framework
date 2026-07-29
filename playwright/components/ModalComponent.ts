import { type Page, type Locator, expect } from '@playwright/test'

export class ModalComponent {
  private readonly page: Page
  private readonly modal: Locator
  private readonly title: Locator
  private readonly message: Locator
  private readonly confirmButton: Locator
  private readonly cancelButton: Locator
  private readonly backdrop: Locator

  constructor(page: Page) {
    this.page = page
    this.modal = page.getByTestId('confirm-modal')
    this.title = page.getByTestId('modal-title')
    this.message = page.getByTestId('modal-message')
    this.confirmButton = page.getByTestId('modal-confirm')
    this.cancelButton = page.getByTestId('modal-cancel')
    this.backdrop = page.getByTestId('modal-backdrop')
  }

  async waitForModal(): Promise<void> {
    await expect(this.modal).toBeVisible()
  }

  async expectTitle(text: string): Promise<void> {
    await expect(this.title).toContainText(text)
  }

  async expectMessage(text: string): Promise<void> {
    await expect(this.message).toContainText(text)
  }

  async confirm(): Promise<void> {
    await this.confirmButton.click()
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click()
  }

  async clickBackdrop(): Promise<void> {
    await this.backdrop.click({ position: { x: 10, y: 10 } })
  }

  async expectClosed(): Promise<void> {
    await expect(this.modal).not.toBeVisible()
  }
}
