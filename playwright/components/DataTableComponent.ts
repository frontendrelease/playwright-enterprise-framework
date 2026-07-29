import { type Page, type Locator, expect } from '@playwright/test'

export class DataTableComponent {
  private readonly page: Page
  private readonly root: Locator
  private readonly filterInput: Locator
  private readonly filterClear: Locator
  private readonly rowCount: Locator
  private readonly emptyState: Locator

  constructor(page: Page) {
    this.page = page
    this.root = page.getByTestId('data-table')
    this.filterInput = page.getByTestId('table-filter-input')
    this.filterClear = page.getByTestId('table-filter-clear')
    this.rowCount = page.getByTestId('table-row-count')
    this.emptyState = page.getByTestId('table-empty-state')
  }

  async isVisible(): Promise<boolean> {
    return this.root.isVisible()
  }

  async filter(text: string): Promise<void> {
    await this.filterInput.fill(text)
  }

  async clearFilter(): Promise<void> {
    await this.filterClear.click()
  }

  async sortBy(column: string): Promise<void> {
    await this.page.getByTestId(`table-header-${column}`).click()
  }

  async getSortDirection(column: string): Promise<string | null> {
    return this.page.getByTestId(`table-header-${column}`).getAttribute('aria-sort')
  }

  async getColumnValues(column: string): Promise<string[]> {
    return this.page.getByTestId(`cell-${column}`).allTextContents()
  }

  async getRowCount(): Promise<number> {
    const text = await this.rowCount.textContent()
    const match = text?.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : 0
  }

  async expectRowCount(count: number): Promise<void> {
    await expect(this.rowCount).toContainText(`${count} item`)
  }

  async expectEmpty(): Promise<void> {
    await expect(this.emptyState).toBeVisible()
  }

  async expectNotEmpty(): Promise<void> {
    await expect(this.emptyState).not.toBeVisible()
  }
}
