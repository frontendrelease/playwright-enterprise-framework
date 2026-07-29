'use client'

interface ConfirmModalProps {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmModal({
  title,
  message,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" data-testid="confirm-modal">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} data-testid="modal-backdrop" />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl" data-testid="modal-content">
        <h2 className="text-lg font-semibold text-gray-900" data-testid="modal-title">
          {title}
        </h2>
        <p className="mt-2 text-sm text-gray-600" data-testid="modal-message">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            data-testid="modal-cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            data-testid="modal-confirm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
