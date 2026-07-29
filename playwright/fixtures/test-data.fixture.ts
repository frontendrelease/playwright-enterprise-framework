import { test as base, type Page } from '@playwright/test'
import { ItemFactory } from '../utils/test-data-factory'

export type DataFixtures = {
  itemFactory: ItemFactory
}

export const test = base.extend<DataFixtures>({
  itemFactory: async ({ page }, use) => {
    const factory = new ItemFactory(page)
    await use(factory)
    await factory.cleanup()
  },
})
