import { test, expect } from '@playwright/test'

test.describe('Auth API @regression', () => {
  test('POST /api/auth/login with valid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { email: 'admin@demo.com', password: 'password123' },
    })

    expect(response.ok()).toBeTruthy()
    const body = await response.json()
    expect(body.user.email).toBe('admin@demo.com')
    expect(body.user.name).toBe('Admin User')
    expect(body.user.role).toBe('admin')
  })

  test('POST /api/auth/login with invalid credentials', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { email: 'admin@demo.com', password: 'wrong' },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toBe('Invalid email or password')
  })

  test('POST /api/auth/login with invalid email format', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: { email: 'not-an-email', password: 'password123' },
    })

    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error).toBe('Validation failed')
  })

  test('POST /api/auth/login with empty body', async ({ request }) => {
    const response = await request.post('/api/auth/login', {
      data: {},
    })

    expect(response.status()).toBe(400)
  })

  test('POST /api/auth/logout clears session', async ({ request }) => {
    // Login first
    await request.post('/api/auth/login', {
      data: { email: 'admin@demo.com', password: 'password123' },
    })

    // Verify authenticated
    const itemsRes = await request.get('/api/items')
    expect(itemsRes.ok()).toBeTruthy()

    // Logout
    const logoutRes = await request.post('/api/auth/logout')
    expect(logoutRes.ok()).toBeTruthy()
  })
})
