import { type Page, type Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class DashboardPage extends BasePage {
  readonly url = '/dashboard'

  readonly pageTitle: Locator
  readonly filterInput: Locator
  readonly filterClear: Locator
  readonly rowCount: Locator
  readonly emptyState: Locator
  readonly loadingSkeleton: Locator
  readonly errorMessage: Locator

  constructor(page: Page) {
    super(page)
    this.pageTitle = page.getByTestId('page-title')
    this.filterInput = page.getByTestId('table-filter-input')
    this.filterClear = page.getByTestId('table-filter-clear')
    this.rowCount = page.getByTestId('table-row-count')
    this.emptyState = page.getByTestId('table-empty-state')
    this.loadingSkeleton = page.getByTestId('loading-skeleton')
    this.errorMessage = page.getByTestId('error-message')
  }

  async waitForTableLoad(): Promise<void> {
    await expect(this.loadingSkeleton).not.toBeVisible()
    await expect(this.getByTestId('data-table')).toBeVisible()
  }

  async filterBy(text: string): Promise<void> {
    await this.filterInput.fill(text)
  }

  async clearFilter(): Promise<void> {
    await this.filterClear.click()
  }

  async sortByColumn(column: string): Promise<void> {
    await this.page.getByTestId(`table-header-${column}`).click()
  }

  async getColumnValues(column: string): Promise<string[]> {
    const cells = this.page.getByTestId(`cell-${column}`)
    return cells.allTextContents()
  }

  async getRowCount(): Promise<number> {
    const text = await this.rowCount.textContent()
    const match = text?.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 0
  }

  async clickEdit(itemId: string): Promise<void> {
    await this.page.getByTestId(`edit-${itemId}`).click()
  }

  async clickDelete(itemId: string): Promise<void> {
    await this.page.getByTestId(`delete-${itemId}`).click()
  }

  async expectRowCount(count: number): Promise<void> {
    await expect(this.rowCount).toContainText(`${count} item`)
  }

  async expectEmptyState(): Promise<void> {
    await expect(this.emptyState).toBeVisible()
  }
}
