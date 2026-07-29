import { type Page } from '@playwright/test'

export async function waitForApiResponse(page: Page, urlPattern: string | RegExp): Promise<void> {
  await page.waitForResponse(
    (response) =>
      (typeof urlPattern === 'string'
        ? response.url().includes(urlPattern)
        : urlPattern.test(response.url())) && response.status() < 400,
  )
}

export async function mockApiResponse(
  page: Page,
  urlPattern: string,
  data: unknown,
  status = 200,
): Promise<void> {
  await page.route(`**${urlPattern}`, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(data),
    })
  })
}

export async function mockApiError(page: Page, urlPattern: string, status = 500): Promise<void> {
  await page.route(`**${urlPattern}`, async (route) => {
    await route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    })
  })
}

export async function delayApiResponse(
  page: Page,
  urlPattern: string,
  delayMs: number,
): Promise<void> {
  await page.route(`**${urlPattern}`, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, delayMs))
    await route.continue()
  })
}
