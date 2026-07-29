import { getItemById, updateItem, deleteItem } from '@/app/_lib/db'
import { getSession } from '@/app/_lib/auth'
import { UpdateItemSchema } from '@/app/_lib/definitions'
import type { NextRequest } from 'next/server'

export async function GET(_req: NextRequest, ctx: RouteContext<'/api/items/[id]'>) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await ctx.params
  const item = await getItemById(id)

  if (!item) {
    return Response.json({ error: 'Item not found' }, { status: 404 })
  }

  return Response.json({ item })
}

export async function PUT(req: NextRequest, ctx: RouteContext<'/api/items/[id]'>) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await ctx.params
  const body = await req.json()
  const parsed = UpdateItemSchema.safeParse(body)

  if (!parsed.success) {
    return Response.json(
      { error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const updated = await updateItem(id, parsed.data)
  if (!updated) {
    return Response.json({ error: 'Item not found' }, { status: 404 })
  }

  return Response.json({ item: updated })
}

export async function DELETE(_req: NextRequest, ctx: RouteContext<'/api/items/[id]'>) {
  const session = await getSession()
  if (!session) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await ctx.params
  const deleted = await deleteItem(id)

  if (!deleted) {
    return Response.json({ error: 'Item not found' }, { status: 404 })
  }

  return Response.json({ success: true })
}
