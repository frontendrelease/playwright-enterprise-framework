'use client'

import { useRouter } from 'next/navigation'

interface HeaderProps {
  user: {
    name: string
    email: string
    role: string
  }
}

export function Header({ user }: HeaderProps) {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6" data-testid="header">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Welcome,</span>
        <span className="text-sm font-medium text-gray-900" data-testid="user-name">
          {user.name}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600" data-testid="user-role">
          {user.role}
        </span>
      </div>
      <button
        onClick={handleLogout}
        className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
        data-testid="logout-button"
      >
        Logout
      </button>
    </header>
  )
}
