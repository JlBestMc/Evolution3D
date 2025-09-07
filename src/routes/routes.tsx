import { Suspense, lazy } from 'react'
import type { ReactElement } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Lazy loaded pages (code splitting)
const WelcomePage = lazy(() => import('../pages/welcomePage/WelcomePage'))
const TimelinePage = lazy(() => import('../pages/timelinePage/TimelinePage'))
const AuthPage = lazy(() => import('../auth/auth'))

// Centralized path constants (import elsewhere if needed)
export const PATHS = {
  root: '/',
  timeline: '/timeline',
  auth: '/auth'
} as const

// Simple auth selector placeholder (replace with real logic / context)
function useAuth() {
  // TODO: integrate real auth state (context, Zustand, etc.)
  const isAuthenticated = false
  return { isAuthenticated }
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to={PATHS.auth} replace />
  return children
}

// 404 Not Found lightweight component
function NotFound() {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-4 text-white bg-black">
      <h1 className="text-4xl font-semibold tracking-wide">404</h1>
      <p className="text-sm opacity-70">Page not found</p>
      <a href={PATHS.root} className="text-blue-400 hover:underline">Go Home</a>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="w-screen h-screen flex items-center justify-center bg-black text-white">Loading…</div>}>
      <Routes>
        <Route path={PATHS.root} element={<WelcomePage />} />
        <Route path={PATHS.auth} element={<AuthPage />} />
        <Route
          path={PATHS.timeline}
          element={
            //<ProtectedRoute>*}
              <TimelinePage />
            //</ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}