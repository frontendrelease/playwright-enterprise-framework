import { type Page, type Locator } from '@playwright/test'

export abstract class BasePage {
  readonly page: Page

  abstract readonly url: string

  constructor(page: Page) {
    this.page = page
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url)
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle')
  }

  async getTitle(): Promise<string> {
    return this.page.title()
  }

  getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId)
  }

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({ fullPage: true, path: `test-results/screenshots/${name}.png` })
  }

  async waitForNavigation(url: string | RegExp): Promise<void> {
    await this.page.waitForURL(url)
  }
}
