'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Calendar, Building2, Compass as CompassIcon, BarChart3, Moon, Sun, Menu, X, LogIn, LogOut, User, BookOpen } from 'lucide-react'
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function Navbar({ darkMode, toggleDarkMode }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const { user, token, logout } = useAuth()
  
  // Memoize auth checks
  const isAuthenticated = !!token && !!user
  const isAdmin = user?.role === 'admin'

  // Memoize nav items to prevent unnecessary re-renders
  const navItems = useMemo(() => {
    const items = [
      { href: '/events', label: 'Events', icon: Calendar },
      { href: '/directory', label: 'Directory', icon: Building2 },
      { href: '/programs', label: 'Programs', icon: BookOpen },
      { href: '/support', label: 'Support Pathways', icon: CompassIcon },
    ]
    
    // Only show admin link if user is admin
    if (isAuthenticated && isAdmin) {
      items.push({ href: '/admin', label: 'Admin', icon: BarChart3 })
    }
    
    return items
  }, [isAuthenticated, isAdmin])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <nav className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white shadow-sm'} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Compass className={`h-8 w-8 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
              <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Innovation Zone
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname?.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? darkMode
                        ? 'text-primary-400 bg-gray-800'
                        : 'text-primary-600 bg-primary-50'
                      : darkMode
                      ? 'text-gray-300 hover:text-primary-400 hover:bg-gray-800'
                      : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Link>
              )
            })}
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2 ml-2">
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {user?.full_name || user?.email}
                </span>
                <button
                  onClick={logout}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    darkMode
                      ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ml-2 ${
                  darkMode
                    ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <LogIn className="h-4 w-4 mr-1" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden pb-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex flex-col space-y-1 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? darkMode
                          ? 'text-primary-400 bg-gray-800'
                          : 'text-primary-600 bg-primary-50'
                        : darkMode
                        ? 'text-gray-300 hover:text-primary-400 hover:bg-gray-800'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}




