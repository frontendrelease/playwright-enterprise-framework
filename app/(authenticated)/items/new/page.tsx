'use client'

import { useState } from 'react'
import { ItemForm } from '../../_components/ItemForm'
import { Toast } from '../../_components/Toast'

export default function NewItemPage() {
  const [toast, setToast] = useState<string | null>(null)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900" data-testid="page-title">
          Create New Item
        </h2>
        <p className="mt-1 text-sm text-gray-500">Add a new item to your project</p>
      </div>

      <ItemForm onSuccess={(msg) => setToast(msg)} />

      {toast && (
        <Toast message={toast} type="success" onClose={() => setToast(null)} />
      )}
    </div>
  )
}
