import { test, expect } from '../../fixtures'
import { ItemFormPage } from '../../pages/ItemFormPage'
import { ToastComponent } from '../../components/ToastComponent'

test.describe('Edit Item @regression', () => {
  test('displays pre-filled form for existing item', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/items/itm_01')

    const form = new ItemFormPage(authenticatedPage)
    await expect(form.pageTitle).toContainText('Edit Item')
    await form.expectNameValue('Quarterly Revenue Report')
    await form.expectCategoryValue('Reports')
    await expect(form.submitButton).toContainText('Update Item')
  })

  test('updates item successfully', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/items/itm_02')

    const form = new ItemFormPage(authenticatedPage)
    const toast = new ToastComponent(authenticatedPage)

    await form.fillForm({ name: 'Updated Onboarding Flow' })
    await form.submit()

    await toast.waitForToast()
    await toast.expectMessage('Item updated successfully')
  })

  test('shows error for non-existent item', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/items/itm_nonexistent')

    const errorMessage = authenticatedPage.getByTestId('error-message')
    await expect(errorMessage).toBeVisible()
  })

  test('preserves other fields when updating one field', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/items/itm_04')

    const form = new ItemFormPage(authenticatedPage)
    await form.fillForm({ priority: 'critical' })

    const [response] = await Promise.all([
      authenticatedPage.waitForResponse('**/api/items/itm_04'),
      form.submit(),
    ])

    const data = await response.json()
    expect(data.item.name).toBe('Email Notification Service')
    expect(data.item.priority).toBe('critical')
  })
})
