'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Compass, Calendar, Building2, Compass as CompassIcon, BarChart3 } from 'lucide-react'

export default function Layout({ children }) {
  const pathname = usePathname()

  const navItems = [
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/directory', label: 'Directory', icon: Building2 },
    { href: '/support', label: 'Support Pathways', icon: CompassIcon },
    { href: '/admin', label: 'Admin', icon: BarChart3 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Compass className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">
                Innovation Zone
              </span>
            </Link>
            <div className="flex space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname?.startsWith(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}

