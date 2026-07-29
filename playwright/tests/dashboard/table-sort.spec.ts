import { test, expect } from '../../fixtures'
import { DashboardPage } from '../../pages/DashboardPage'

test.describe('Table Sorting @regression', () => {
  let dashboard: DashboardPage

  test.beforeEach(async ({ authenticatedPage }) => {
    dashboard = new DashboardPage(authenticatedPage)
    await dashboard.navigate()
    await dashboard.waitForTableLoad()
  })

  test('sorts by name ascending', async ({ authenticatedPage }) => {
    await dashboard.sortByColumn('name')

    const names = await dashboard.getColumnValues('name')
    const sorted = [...names].sort((a, b) => a.localeCompare(b))
    expect(names).toEqual(sorted)
  })

  test('sorts by name descending on second click', async ({ authenticatedPage }) => {
    await dashboard.sortByColumn('name')
    await dashboard.sortByColumn('name')

    const names = await dashboard.getColumnValues('name')
    const sorted = [...names].sort((a, b) => b.localeCompare(a))
    expect(names).toEqual(sorted)
  })

  test('sorts by priority', async ({ authenticatedPage }) => {
    await dashboard.sortByColumn('priority')

    const priorities = await dashboard.getColumnValues('priority')
    const sorted = [...priorities].sort((a, b) => a.localeCompare(b))
    expect(priorities).toEqual(sorted)
  })

  test('sorts by status', async ({ authenticatedPage }) => {
    await dashboard.sortByColumn('status')

    const statuses = await dashboard.getColumnValues('status')
    const sorted = [...statuses].sort((a, b) => a.localeCompare(b))
    expect(statuses).toEqual(sorted)
  })

  test('shows sort indicator on active column', async ({ authenticatedPage }) => {
    await dashboard.sortByColumn('name')

    const header = authenticatedPage.getByTestId('table-header-name')
    await expect(header).toHaveAttribute('aria-sort', 'ascending')
  })
})
