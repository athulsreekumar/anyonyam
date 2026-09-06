import { Outlet } from 'react-router-dom'
import { Topbar } from '@/components/organisms/Topbar'
import { Footer } from '@/components/organisms/Footer'

export function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Topbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
