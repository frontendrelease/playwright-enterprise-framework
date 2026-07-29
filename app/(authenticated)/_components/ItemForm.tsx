'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Item } from '@/app/_lib/definitions'

interface ItemFormProps {
  item?: Item
  onSuccess?: (message: string) => void
}

export function ItemForm({ item, onSuccess }: ItemFormProps) {
  const router = useRouter()
  const isEditing = !!item

  const [name, setName] = useState<string>(item?.name ?? '')
  const [category, setCategory] = useState<string>(item?.category ?? 'Features')
  const [status, setStatus] = useState<string>(item?.status ?? 'pending')
  const [priority, setPriority] = useState<string>(item?.priority ?? 'medium')
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrors({})
    setLoading(true)

    try {
      const url = isEditing ? `/api/items/${item.id}` : '/api/items'
      const method = isEditing ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, status, priority }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.details) {
          setErrors(data.details)
        } else {
          setErrors({ _form: [data.error || 'Something went wrong'] })
        }
        return
      }

      onSuccess?.(isEditing ? 'Item updated successfully' : 'Item created successfully')
      router.push('/dashboard')
      router.refresh()
    } catch {
      setErrors({ _form: ['An unexpected error occurred'] })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6" data-testid="item-form">
      {errors._form && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700" data-testid="form-error" role="alert">
          {errors._form[0]}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          data-testid="item-name-input"
          placeholder="Enter item name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600" data-testid="error-name">{errors.name[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Category
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          data-testid="item-category-select"
        >
          <option value="Features">Features</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Reports">Reports</option>
          <option value="Design">Design</option>
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600" data-testid="error-category">{errors.category[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          data-testid="item-status-select"
        >
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600" data-testid="error-status">{errors.status[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          data-testid="item-priority-select"
        >
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        {errors.priority && (
          <p className="mt-1 text-sm text-red-600" data-testid="error-priority">{errors.priority[0]}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          data-testid="item-form-submit"
        >
          {loading ? 'Saving...' : isEditing ? 'Update Item' : 'Create Item'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          data-testid="item-form-cancel"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
