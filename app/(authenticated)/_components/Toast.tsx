'use client'

import { useEffect, useState } from 'react'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'info'
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'success', onClose, duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  return (
    <div
      className={`fixed top-4 right-4 z-50 rounded-md border px-4 py-3 shadow-lg transition-opacity duration-300 ${
        colors[type]
      } ${visible ? 'opacity-100' : 'opacity-0'}`}
      data-testid="toast"
      data-toast-type={type}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center gap-2">
        <span data-testid="toast-message">{message}</span>
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(onClose, 300)
          }}
          className="ml-2 text-current opacity-70 hover:opacity-100"
          data-testid="toast-dismiss"
          aria-label="Dismiss"
        >
          &times;
        </button>
      </div>
    </div>
  )
}
