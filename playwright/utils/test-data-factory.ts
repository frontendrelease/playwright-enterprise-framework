import { type Page } from '@playwright/test'

interface ItemData {
  name: string
  category: string
  status: string
  priority: string
}

export class ItemFactory {
  private readonly page: Page
  private createdIds: string[] = []

  constructor(page: Page) {
    this.page = page
  }

  async create(data?: Partial<ItemData>): Promise<string> {
    const item: ItemData = {
      name: data?.name ?? `Test Item ${Date.now()}`,
      category: data?.category ?? 'Features',
      status: data?.status ?? 'active',
      priority: data?.priority ?? 'medium',
    }

    const response = await this.page.request.post('/api/items', {
      data: item,
    })

    const body = await response.json()
    const id = body.item.id
    this.createdIds.push(id)
    return id
  }

  async createMany(count: number, data?: Partial<ItemData>): Promise<string[]> {
    const ids: string[] = []
    for (let i = 0; i < count; i++) {
      const id = await this.create({
        ...data,
        name: data?.name ? `${data.name} ${i + 1}` : `Test Item ${i + 1} - ${Date.now()}`,
      })
      ids.push(id)
    }
    return ids
  }

  async cleanup(): Promise<void> {
    for (const id of this.createdIds) {
      await this.page.request.delete(`/api/items/${id}`).catch(() => {})
    }
    this.createdIds = []
  }
}
