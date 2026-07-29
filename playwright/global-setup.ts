import { test as setup } from '@playwright/test'
import fs from 'fs/promises'
import path from 'path'

const AUTH_FILE = path.join(__dirname, '.auth', 'admin.json')

setup('authenticate as admin', async ({ page }) => {
  const seedPath = path.join(process.cwd(), 'data', 'items.seed.json')
  const itemsPath = path.join(process.cwd(), 'data', 'items.json')
  const seed = await fs.readFile(seedPath, 'utf-8')
  await fs.writeFile(itemsPath, seed)

  await page.goto('/login')
  await page.getByLabel('Email address').fill('admin@demo.com')
  await page.getByLabel('Password').fill('password123')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('**/dashboard')

  await page.context().storageState({ path: AUTH_FILE })
})
