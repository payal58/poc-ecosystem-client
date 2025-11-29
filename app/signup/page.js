'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Mail, Lock, User, UserPlus, Compass } from 'lucide-react'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup, token, user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && token && user) {
      const redirect = user.role === 'admin' ? '/admin' : '/'
      router.push(redirect)
    }
  }, [authLoading, token, user, router])

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      console.log('Attempting signup for:', email)
      const result = await signup(email, password, fullName, role)
      console.log('Signup result:', result)
      
      if (result && result.success) {
        // Wait for state to be fully updated
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Redirect based on user role
        const redirectPath = result.user?.role === 'admin' ? '/admin' : '/'
        console.log('Signup successful. Redirecting to:', redirectPath)
        
        // Use window.location for a full page reload to ensure clean state
        window.location.href = redirectPath
        // Don't set loading to false here - let redirect happen
        return
      } else {
        setError(result?.error || 'Signup failed. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      console.error('Signup error:', error)
      setError(error.message || 'An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center group">
            <Compass className="h-10 w-10 text-primary-800 dark:text-primary-800 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors" />
            <span className="ml-2 text-2xl font-bold text-neutral-900 dark:text-white group-hover:text-primary-800 dark:group-hover:text-primary-800 transition-colors">
              Innovation Zone
            </span>
          </Link>
        </div>
        
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-neutral-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Or{' '}
            <Link
              href="/login"
              className="font-medium text-primary-800 hover:text-primary-800"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-neutral-300 dark:border-neutral-600 placeholder-gray-500 dark:placeholder-gray-400 text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary-800 focus:border-primary-800 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-neutral-300 dark:border-neutral-600 placeholder-gray-500 dark:placeholder-gray-400 text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary-800 focus:border-primary-800 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none relative block w-full px-10 py-3 border border-neutral-300 dark:border-neutral-600 placeholder-gray-500 dark:placeholder-gray-400 text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary-800 focus:border-primary-800 sm:text-sm"
                  placeholder="Password (min. 6 characters)"
                />
              </div>
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 rounded-md focus:outline-none focus:ring-primary-800 focus:border-primary-800 sm:text-sm"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-800 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center">
                  <UserPlus className="h-5 w-5 mr-2" />
                  Create account
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

