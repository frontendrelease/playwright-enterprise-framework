import { redirect } from 'next/navigation'
import { getSession } from '@/app/_lib/auth'
import { Sidebar } from './_components/Sidebar'
import { Header } from './_components/Header'

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header user={{ name: session.name, email: session.email, role: session.role }} />
        <main className="flex-1 overflow-y-auto p-6" data-testid="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}
