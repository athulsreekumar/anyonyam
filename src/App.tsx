import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { PublicLayout } from '@/components/templates/PublicLayout'
import { Spinner } from '@/components/atoms/Spinner'
import { HomePage } from '@/pages/HomePage'
import { HistoryPage } from '@/pages/HistoryPage'
import { TodayPage } from '@/pages/TodayPage'
import { ContactPage } from '@/pages/ContactPage'
import { GalleryPage } from '@/pages/GalleryPage'
import { LoginPage } from '@/pages/LoginPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { DirectoryPage } from '@/pages/DirectoryPage'
import { RequestsPage } from '@/pages/RequestsPage'
import { LogoutPage } from '@/pages/LogoutPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { RequireAuth } from '@/auth/RequireAuth'
import { RequireAdmin } from '@/auth/RequireAdmin'

// Code-split the admin-only routes: AdminPage (transitively, via
// PendingSubscriptionTable) pulls in exceljs for the export feature, which
// alone is ~1MB minified - no visitor to the public site or a member's own
// profile should pay for that in their initial bundle.
const AdminPage = lazy(() => import('@/pages/AdminPage').then((m) => ({ default: m.AdminPage })))
const SearchPage = lazy(() => import('@/pages/SearchPage').then((m) => ({ default: m.SearchPage })))

function RouteFallback() {
  return (
    <div className="flex justify-center py-32">
      <Spinner size="lg" />
    </div>
  )
}

export function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about/history" element={<HistoryPage />} />
        <Route path="/about/today" element={<TodayPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route
          path="/profile/:memberNo"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        <Route
          path="/directory"
          element={
            <RequireAuth>
              <DirectoryPage />
            </RequireAuth>
          }
        />
        <Route
          path="/requests"
          element={
            <RequireAuth>
              <RequestsPage />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Suspense fallback={<RouteFallback />}>
                <AdminPage />
              </Suspense>
            </RequireAdmin>
          }
        />
        <Route
          path="/search"
          element={
            <RequireAdmin>
              <Suspense fallback={<RouteFallback />}>
                <SearchPage />
              </Suspense>
            </RequireAdmin>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
