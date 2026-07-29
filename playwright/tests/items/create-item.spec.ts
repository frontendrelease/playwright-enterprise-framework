import { test, expect } from '../../fixtures'
import { ItemFormPage } from '../../pages/ItemFormPage'
import { ToastComponent } from '../../components/ToastComponent'

test.describe('Create Item @regression', () => {
  let form: ItemFormPage

  test.beforeEach(async ({ authenticatedPage }) => {
    form = new ItemFormPage(authenticatedPage)
    await authenticatedPage.goto('/items/new')
  })

  test('displays create form with empty fields', async () => {
    await expect(form.pageTitle).toContainText('Create New Item')
    await expect(form.nameInput).toHaveValue('')
    await expect(form.submitButton).toContainText('Create Item')
  })

  test('creates item successfully', async ({ authenticatedPage }) => {
    const toast = new ToastComponent(authenticatedPage)

    await form.fillForm({
      name: 'New Test Item',
      category: 'Features',
      status: 'active',
      priority: 'high',
    })
    await form.submit()

    await toast.waitForToast()
    await toast.expectMessage('Item created successfully')
    await toast.expectType('success')
  })

  test('shows validation error for empty name', async ({ authenticatedPage }) => {
    await form.fillForm({
      name: '',
      category: 'Features',
      status: 'active',
      priority: 'medium',
    })
    await form.submit()

    await form.expectValidationError('name', 'Name is required')
  })

  test('cancel returns to previous page', async ({ authenticatedPage }) => {
    await form.cancel()
    await expect(authenticatedPage).not.toHaveURL(/\/items\/new/)
  })

  test('submit button shows loading state', async ({ authenticatedPage }) => {
    await form.fillForm({
      name: 'Loading Test',
      category: 'Reports',
      status: 'pending',
      priority: 'low',
    })

    const [response] = await Promise.all([
      authenticatedPage.waitForResponse('**/api/items'),
      form.submit(),
    ])

    expect(response.status()).toBe(201)
  })
})
