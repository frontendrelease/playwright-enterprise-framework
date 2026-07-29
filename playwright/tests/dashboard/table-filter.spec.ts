import { test, expect } from '../../fixtures'
import { DashboardPage } from '../../pages/DashboardPage'

test.describe('Table Filtering @regression', () => {
  let dashboard: DashboardPage

  test.beforeEach(async ({ authenticatedPage }) => {
    dashboard = new DashboardPage(authenticatedPage)
    await dashboard.navigate()
    await dashboard.waitForTableLoad()
  })

  test('filters items by name', async () => {
    await dashboard.filterBy('Payment')

    const count = await dashboard.getRowCount()
    expect(count).toBeGreaterThan(0)

    const names = await dashboard.getColumnValues('name')
    for (const name of names) {
      expect(name.toLowerCase()).toContain('payment')
    }
  })

  test('filters items by category', async () => {
    await dashboard.filterBy('Infrastructure')

    const categories = await dashboard.getColumnValues('category')
    for (const category of categories) {
      expect(category).toBe('Infrastructure')
    }
  })

  test('shows empty state for no results', async () => {
    await dashboard.filterBy('xyznonexistent')
    await dashboard.expectEmptyState()
  })

  test('clear button resets filter', async () => {
    const initialCount = await dashboard.getRowCount()

    await dashboard.filterBy('Payment')
    const filteredCount = await dashboard.getRowCount()
    expect(filteredCount).toBeLessThan(initialCount)

    await dashboard.clearFilter()
    const resetCount = await dashboard.getRowCount()
    expect(resetCount).toBe(initialCount)
  })

  test('filter is case-insensitive', async () => {
    await dashboard.filterBy('PAYMENT')
    const upperCount = await dashboard.getRowCount()

    await dashboard.filterBy('payment')
    const lowerCount = await dashboard.getRowCount()

    expect(upperCount).toBe(lowerCount)
    expect(upperCount).toBeGreaterThan(0)
  })
})
