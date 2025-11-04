'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Calendar, Building2, Compass as CompassIcon, BarChart3, Moon, Sun, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Navbar({ darkMode, toggleDarkMode }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/directory', label: 'Directory', icon: Building2 },
    { href: '/support', label: 'Support Pathways', icon: CompassIcon },
    { href: '/admin', label: 'Admin', icon: BarChart3 },
  ]

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

