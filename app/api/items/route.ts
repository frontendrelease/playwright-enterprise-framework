import { getItems, createItem } from '@/app/_lib/db'
import { getSession } from '@/app/_lib/auth'
import { CreateItemSchema } from '@/app/_lib/definitions'

export async function GET(request: Request) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const sort = searchParams.get('sort')
  const order = searchParams.get('order') || 'asc'
  const status = searchParams.get('status')
  const search = searchParams.get('search')

  let items = await getItems()

  if (status) {
    items = items.filter((item) => item.status === status)
  }

  if (search) {
    const lower = search.toLowerCase()
    items = items.filter(
      (item) =>
        item.name.toLowerCase().includes(lower) ||
        item.category.toLowerCase().includes(lower),
    )
  }

  if (sort) {
    items.sort((a, b) => {
      const aVal = String(a[sort as keyof typeof a] ?? '')
      const bVal = String(b[sort as keyof typeof b] ?? '')
      return order === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    })
  }

  return Response.json({ items, total: items.length })
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = CreateItemSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const newItem = {
    id: `itm_${Date.now()}`,
    ...parsed.data,
    createdAt: new Date().toISOString(),
  }

  const created = await createItem(newItem)
  return Response.json({ item: created }, { status: 201 })
}
