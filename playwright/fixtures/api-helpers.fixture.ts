import { test as base, type APIRequestContext } from '@playwright/test'

export type ApiFixtures = {
  apiContext: APIRequestContext
}

export const test = base.extend<ApiFixtures>({
  apiContext: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: 'http://localhost:3000',
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    })
    await use(context)
    await context.dispose()
  },
})
