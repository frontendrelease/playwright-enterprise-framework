import { test, expect } from '@playwright/test'

test.describe('Items API @regression', () => {
  test.describe('GET /api/items', () => {
    test('returns list of items', async ({ request }) => {
      const loginRes = await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })
      expect(loginRes.ok()).toBeTruthy()

      const response = await request.get('/api/items')
      expect(response.ok()).toBeTruthy()

      const body = await response.json()
      expect(body.items).toBeInstanceOf(Array)
      expect(body.total).toBeGreaterThan(0)
    })

    test('supports search filter', async ({ request }) => {
      await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })

      const response = await request.get('/api/items?search=Payment')
      const body = await response.json()

      expect(body.items.length).toBeGreaterThan(0)
      for (const item of body.items) {
        expect(item.name.toLowerCase()).toContain('payment')
      }
    })

    test('supports status filter', async ({ request }) => {
      await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })

      const response = await request.get('/api/items?status=completed')
      const body = await response.json()

      for (const item of body.items) {
        expect(item.status).toBe('completed')
      }
    })

    test('supports sorting', async ({ request }) => {
      await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })

      const response = await request.get('/api/items?sort=name&order=asc')
      const body = await response.json()

      const names = body.items.map((i: { name: string }) => i.name)
      const sorted = [...names].sort((a: string, b: string) => a.localeCompare(b))
      expect(names).toEqual(sorted)
    })

    test('returns 401 when not authenticated', async ({ request }) => {
      const response = await request.get('/api/items', {
        headers: { cookie: '' },
      })
      expect(response.status()).toBe(401)
    })
  })

  test.describe('POST /api/items', () => {
    test('creates a new item', async ({ request }) => {
      await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })

      const response = await request.post('/api/items', {
        data: {
          name: 'API Test Item',
          category: 'Features',
          status: 'active',
          priority: 'high',
        },
      })

      expect(response.status()).toBe(201)
      const body = await response.json()
      expect(body.item.name).toBe('API Test Item')
      expect(body.item.id).toBeTruthy()
    })

    test('returns 400 for invalid data', async ({ request }) => {
      await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })

      const response = await request.post('/api/items', {
        data: { name: '' },
      })

      expect(response.status()).toBe(400)
      const body = await response.json()
      expect(body.error).toBe('Validation failed')
    })

    test('returns 400 for missing required fields', async ({ request }) => {
      await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })

      const response = await request.post('/api/items', {
        data: { name: 'Only Name' },
      })

      expect(response.status()).toBe(400)
    })
  })

  test.describe('PUT /api/items/[id]', () => {
    test('updates an existing item', async ({ request }) => {
      await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })

      const response = await request.put('/api/items/itm_01', {
        data: { priority: 'critical' },
      })

      expect(response.ok()).toBeTruthy()
      const body = await response.json()
      expect(body.item.priority).toBe('critical')
    })

    test('returns 404 for non-existent item', async ({ request }) => {
      await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })

      const response = await request.put('/api/items/itm_nonexistent', {
        data: { name: 'Updated' },
      })

      expect(response.status()).toBe(404)
    })
  })

  test.describe('DELETE /api/items/[id]', () => {
    test('deletes an existing item', async ({ request }) => {
      await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })

      // Create item first
      const createRes = await request.post('/api/items', {
        data: {
          name: 'To Delete',
          category: 'Reports',
          status: 'pending',
          priority: 'low',
        },
      })
      const { item } = await createRes.json()

      const response = await request.delete(`/api/items/${item.id}`)
      expect(response.ok()).toBeTruthy()

      // Verify deletion
      const getRes = await request.get(`/api/items/${item.id}`)
      expect(getRes.status()).toBe(404)
    })

    test('returns 404 for non-existent item', async ({ request }) => {
      await request.post('/api/auth/login', {
        data: { email: 'admin@demo.com', password: 'password123' },
      })

      const response = await request.delete('/api/items/itm_nonexistent')
      expect(response.status()).toBe(404)
    })
  })
})
