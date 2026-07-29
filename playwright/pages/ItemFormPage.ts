import { type Page, type Locator, expect } from '@playwright/test'
import { BasePage } from './BasePage'

export class ItemFormPage extends BasePage {
  readonly url = '/items/new'

  readonly nameInput: Locator
  readonly categorySelect: Locator
  readonly statusSelect: Locator
  readonly prioritySelect: Locator
  readonly submitButton: Locator
  readonly cancelButton: Locator
  readonly formError: Locator
  readonly pageTitle: Locator

  constructor(page: Page) {
    super(page)
    this.nameInput = page.getByTestId('item-name-input')
    this.categorySelect = page.getByTestId('item-category-select')
    this.statusSelect = page.getByTestId('item-status-select')
    this.prioritySelect = page.getByTestId('item-priority-select')
    this.submitButton = page.getByTestId('item-form-submit')
    this.cancelButton = page.getByTestId('item-form-cancel')
    this.formError = page.getByTestId('form-error')
    this.pageTitle = page.getByTestId('page-title')
  }

  async fillForm(data: {
    name?: string
    category?: string
    status?: string
    priority?: string
  }): Promise<void> {
    if (data.name !== undefined) await this.nameInput.fill(data.name)
    if (data.category) await this.categorySelect.selectOption(data.category)
    if (data.status) await this.statusSelect.selectOption(data.status)
    if (data.priority) await this.prioritySelect.selectOption(data.priority)
  }

  async submit(): Promise<void> {
    await this.submitButton.click()
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click()
  }

  async expectValidationError(field: string, message: string): Promise<void> {
    const error = this.page.getByTestId(`error-${field}`)
    await expect(error).toBeVisible()
    await expect(error).toContainText(message)
  }

  async expectFormError(message: string): Promise<void> {
    await expect(this.formError).toBeVisible()
    await expect(this.formError).toContainText(message)
  }

  async expectNameValue(value: string): Promise<void> {
    await expect(this.nameInput).toHaveValue(value)
  }

  async expectCategoryValue(value: string): Promise<void> {
    await expect(this.categorySelect).toHaveValue(value)
  }
}
