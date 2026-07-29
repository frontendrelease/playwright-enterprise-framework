'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Item } from '@/app/_lib/definitions'

interface DataTableProps {
  items: Item[]
  onDelete?: (id: string) => void
}

type SortField = 'name' | 'category' | 'status' | 'priority' | 'createdAt'
type SortOrder = 'asc' | 'desc'

export function DataTable({ items, onDelete }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filter, setFilter] = useState('')

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase()),
  )

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aVal = String(a[sortField])
    const bVal = String(b[sortField])
    return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
  })

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const columns: { key: SortField; label: string }[] = [
    { key: 'name', label: 'Name' },
    { key: 'category', label: 'Category' },
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'createdAt', label: 'Created' },
  ]

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-gray-100 text-gray-700',
  }

  const priorityColors: Record<string, string> = {
    critical: 'bg-red-100 text-red-700',
    high: 'bg-orange-100 text-orange-700',
    medium: 'bg-blue-100 text-blue-700',
    low: 'bg-gray-100 text-gray-600',
  }

  return (
    <div data-testid="data-table">
      <div className="mb-4 flex items-center gap-4">
        <input
          type="text"
          placeholder="Search items..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          data-testid="table-filter-input"
          aria-label="Filter items"
        />
        {filter && (
          <button
            onClick={() => setFilter('')}
            className="text-sm text-gray-500 hover:text-gray-700"
            data-testid="table-filter-clear"
          >
            Clear
          </button>
        )}
        <span className="ml-auto text-sm text-gray-500" data-testid="table-row-count">
          {sortedItems.length} item{sortedItems.length !== 1 ? 's' : ''}
        </span>
      </div>

      {sortedItems.length === 0 ? (
        <div className="py-12 text-center text-gray-500" data-testid="table-empty-state">
          No items found
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="cursor-pointer px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:text-gray-700"
                    data-testid={`table-header-${col.key}`}
                    aria-sort={
                      sortField === col.key
                        ? sortOrder === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : 'none'
                    }
                  >
                    <span className="flex items-center gap-1">
                      {col.label}
                      {sortField === col.key && (
                        <span data-testid="sort-indicator">
                          {sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </span>
                  </th>
                ))}
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedItems.map((item) => (
                <tr key={item.id} data-testid={`table-row-${item.id}`} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900" data-testid="cell-name">
                    {item.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600" data-testid="cell-category">
                    {item.category}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm" data-testid="cell-status">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[item.status]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm" data-testid="cell-priority">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${priorityColors[item.priority]}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500" data-testid="cell-created">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <Link
                      href={`/items/${item.id}`}
                      className="text-blue-600 hover:text-blue-800"
                      data-testid={`edit-${item.id}`}
                    >
                      Edit
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item.id)}
                        className="ml-3 text-red-600 hover:text-red-800"
                        data-testid={`delete-${item.id}`}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
