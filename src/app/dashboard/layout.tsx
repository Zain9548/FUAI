// app/dashboard/layout.tsx
// Shared layout for all authenticated pages — sidebar + main content

import { DashboardSidebar } from '@/components/dashboard/Sidebar'
import { DashboardHeader } from '@/components/dashboard/Header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
