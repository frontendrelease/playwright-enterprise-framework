'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ItemForm } from '../../_components/ItemForm'
import { Toast } from '../../_components/Toast'
import type { Item } from '@/app/_lib/definitions'

export default function EditItemPage() {
  const params = useParams()
  const id = params.id as string
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`/api/items/${id}`)
        if (!res.ok) throw new Error('Item not found')
        const data = await res.json()
        setItem(data.item)
      } catch {
        setError('Failed to load item')
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id])

  if (loading) {
    return (
      <div className="space-y-4" data-testid="loading-skeleton">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-96 max-w-lg animate-pulse rounded-lg bg-gray-200" />
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="rounded-md bg-red-50 p-6 text-red-700" data-testid="error-message">
        <p className="font-medium">Error</p>
        <p className="mt-1 text-sm">{error || 'Item not found'}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900" data-testid="page-title">
          Edit Item
        </h2>
        <p className="mt-1 text-sm text-gray-500">Update item details</p>
      </div>

      <ItemForm item={item} onSuccess={(msg) => setToast(msg)} />

      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}
    </div>
  )
}
