import { test, expect } from '../../fixtures'
import { DashboardPage } from '../../pages/DashboardPage'

/**
 * Data-driven tests: parameterized test cases that demonstrate
 * how to run the same test logic with different inputs.
 */

const categoryFilterCases = [
  { filter: 'Features', minExpected: 3 },
  { filter: 'Infrastructure', minExpected: 3 },
  { filter: 'Reports', minExpected: 2 },
  { filter: 'Design', minExpected: 2 },
]

test.describe('Data-driven: Category filters @regression', () => {
  for (const { filter, minExpected } of categoryFilterCases) {
    test(`filters by category: ${filter}`, async ({ authenticatedPage }) => {
      const dashboard = new DashboardPage(authenticatedPage)
      await dashboard.navigate()
      await dashboard.waitForTableLoad()

      await dashboard.filterBy(filter)

      const count = await dashboard.getRowCount()
      expect(count).toBeGreaterThanOrEqual(minExpected)

      const categories = await dashboard.getColumnValues('category')
      for (const category of categories) {
        expect(category).toBe(filter)
      }
    })
  }
})

const sortTestCases = [
  { column: 'name', label: 'Name' },
  { column: 'category', label: 'Category' },
  { column: 'status', label: 'Status' },
  { column: 'priority', label: 'Priority' },
]

test.describe('Data-driven: Sorting columns @regression', () => {
  for (const { column, label } of sortTestCases) {
    test(`ascending sort works for ${label}`, async ({ authenticatedPage }) => {
      const dashboard = new DashboardPage(authenticatedPage)
      await dashboard.navigate()
      await dashboard.waitForTableLoad()

      await dashboard.sortByColumn(column)

      const values = await dashboard.getColumnValues(column)
      const sorted = [...values].sort((a, b) => a.localeCompare(b))
      expect(values).toEqual(sorted)
    })
  }
})
