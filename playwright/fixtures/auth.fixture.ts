import { test as base, type Page } from '@playwright/test'
import path from 'path'

const AUTH_FILE = path.join(__dirname, '..', '.auth', 'admin.json')

export type AuthFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: AUTH_FILE })
    const page = await context.newPage()
    await use(page)
    await context.close()
  },
})
