'use client'

import { useEffect, useState, useCallback } from 'react'
import { DataTable } from '../_components/DataTable'
import { ConfirmModal } from '../_components/ConfirmModal'
import { Toast } from '../_components/Toast'
import type { Item } from '@/app/_lib/definitions'

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const fetchItems = useCallback(async () => {
    try {
      const res = await fetch('/api/items')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setItems(data.items)
    } catch {
      setError('Failed to load items')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  async function handleDelete() {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/items/${deleteId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      setItems((prev) => prev.filter((item) => item.id !== deleteId))
      setToast({ message: 'Item deleted successfully', type: 'success' })
    } catch {
      setToast({ message: 'Failed to delete item', type: 'error' })
    } finally {
      setDeleteId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4" data-testid="loading-skeleton">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-64 animate-pulse rounded-lg bg-gray-200" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-6 text-red-700" data-testid="error-message">
        <p className="font-medium">Error</p>
        <p className="mt-1 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900" data-testid="page-title">
          Dashboard
        </h2>
        <p className="mt-1 text-sm text-gray-500">Manage your project items</p>
      </div>

      <DataTable items={items} onDelete={(id) => setDeleteId(id)} />

      {deleteId && (
        <ConfirmModal
          title="Delete Item"
          message="Are you sure you want to delete this item? This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
