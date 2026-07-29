import { test, expect } from '../../fixtures'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility @a11y', () => {
  test('login page has no accessibility violations', async ({ page }) => {
    await page.goto('/login')

    const results = await new AxeBuilder({ page }).analyze()
    expect(results.violations).toEqual([])
  })

  test('dashboard has no accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/dashboard')
    await authenticatedPage.getByTestId('data-table').waitFor()

    const results = await new AxeBuilder({ page: authenticatedPage }).analyze()
    expect(results.violations).toEqual([])
  })

  test('create item form has no accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/items/new')
    await authenticatedPage.getByTestId('item-form').waitFor()

    const results = await new AxeBuilder({ page: authenticatedPage }).analyze()
    expect(results.violations).toEqual([])
  })

  test('edit item form has no accessibility violations', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/items/itm_01')
    await authenticatedPage.getByTestId('item-form').waitFor()

    const results = await new AxeBuilder({ page: authenticatedPage }).analyze()
    expect(results.violations).toEqual([])
  })
})
