import fs from 'fs/promises'
import path from 'path'
import type { Item, User } from './definitions'

const DATA_DIR = path.join(process.cwd(), 'data')

export async function getUsers(): Promise<User[]> {
  const raw = await fs.readFile(path.join(DATA_DIR, 'users.json'), 'utf-8')
  return JSON.parse(raw)
}

export async function getItems(): Promise<Item[]> {
  const raw = await fs.readFile(path.join(DATA_DIR, 'items.json'), 'utf-8')
  return JSON.parse(raw)
}

export async function saveItems(items: Item[]): Promise<void> {
  await fs.writeFile(
    path.join(DATA_DIR, 'items.json'),
    JSON.stringify(items, null, 2),
  )
}

export async function getItemById(id: string): Promise<Item | undefined> {
  const items = await getItems()
  return items.find((item) => item.id === id)
}

export async function createItem(item: Item): Promise<Item> {
  const items = await getItems()
  items.push(item)
  await saveItems(items)
  return item
}

export async function updateItem(id: string, updates: Partial<Item>): Promise<Item | null> {
  const items = await getItems()
  const index = items.findIndex((item) => item.id === id)
  if (index === -1) return null
  items[index] = { ...items[index], ...updates }
  await saveItems(items)
  return items[index]
}

export async function deleteItem(id: string): Promise<boolean> {
  const items = await getItems()
  const filtered = items.filter((item) => item.id !== id)
  if (filtered.length === items.length) return false
  await saveItems(filtered)
  return true
}

export async function resetItems(): Promise<void> {
  const seed = await fs.readFile(path.join(DATA_DIR, 'items.seed.json'), 'utf-8')
  await fs.writeFile(path.join(DATA_DIR, 'items.json'), seed)
}
