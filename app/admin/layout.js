'use client'

import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminLayout({ children }) {
  const { user, token, loading } = useAuth()
  const router = useRouter()

  // Memoize auth checks to avoid unnecessary re-renders
  const isAuthenticated = useMemo(() => !!token && !!user, [token, user])
  const isAdmin = useMemo(() => user?.role === 'admin', [user])

  useEffect(() => {
    // Only check auth after loading is complete
    if (!loading) {
      // Check localStorage directly as a fallback
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('auth_user') : null
      
      // If we have stored auth but React state isn't ready yet, wait a bit
      if (storedToken && storedUser && !isAuthenticated) {
        console.log('AdminLayout: Found stored auth, waiting for state to sync...')
        return // Wait for state to sync
      }
      
      if (!isAuthenticated && !storedToken) {
        console.log('AdminLayout: Not authenticated, redirecting to login')
        const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/admin'
        window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
      } else if (isAuthenticated && !isAdmin) {
        console.log('AdminLayout: Not admin, redirecting to home')
        window.location.href = '/'
      }
    }
  }, [isAuthenticated, isAdmin, loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return <>{children}</>
}

