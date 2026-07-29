import { z } from 'zod'

export const ItemStatus = z.enum(['active', 'pending', 'completed'])
export type ItemStatus = z.infer<typeof ItemStatus>

export const ItemPriority = z.enum(['critical', 'high', 'medium', 'low'])
export type ItemPriority = z.infer<typeof ItemPriority>

export const ItemCategory = z.enum(['Features', 'Infrastructure', 'Reports', 'Design'])
export type ItemCategory = z.infer<typeof ItemCategory>

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required').max(100, 'Name must be 100 characters or less'),
  category: ItemCategory,
  status: ItemStatus,
  priority: ItemPriority,
  createdAt: z.string(),
})

export const CreateItemSchema = ItemSchema.omit({ id: true, createdAt: true })
export const UpdateItemSchema = CreateItemSchema.partial()

export type Item = z.infer<typeof ItemSchema>
export type CreateItemInput = z.infer<typeof CreateItemSchema>
export type UpdateItemInput = z.infer<typeof UpdateItemSchema>

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string(),
  name: z.string(),
  role: z.enum(['admin', 'user']),
})

export type User = z.infer<typeof UserSchema>

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof LoginSchema>

export interface SessionPayload {
  userId: string
  email: string
  name: string
  role: string
  expiresAt: Date
}
