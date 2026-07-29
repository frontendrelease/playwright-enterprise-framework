import { test, expect } from '../../fixtures'

test.describe('Visual: Item Form @visual', () => {
  test('create form matches snapshot', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/items/new')
    await authenticatedPage.getByTestId('item-form').waitFor()

    await expect(authenticatedPage).toHaveScreenshot('item-form-create.png', {
      maxDiffPixelRatio: 0.01,
    })
  })

  test('edit form with data matches snapshot', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/items/itm_01')
    await authenticatedPage.getByTestId('item-form').waitFor()

    await expect(authenticatedPage).toHaveScreenshot('item-form-edit.png', {
      maxDiffPixelRatio: 0.01,
    })
  })
})
