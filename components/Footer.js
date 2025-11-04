'use client'

import Link from 'next/link'
import { Compass, Calendar, Building2, Compass as CompassIcon } from 'lucide-react'

export default function Footer({ darkMode }) {
  const footerLinks = [
    { href: '/events', label: 'Events', icon: Calendar },
    { href: '/directory', label: 'Directory', icon: Building2 },
    { href: '/support', label: 'Support Pathways', icon: CompassIcon },
  ]

  return (
    <footer className={`${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <Compass className={`h-8 w-8 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
              <span className={`ml-2 text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Innovation Zone
              </span>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Connecting people, organizations, and opportunities in Windsor-Essex innovation ecosystem.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={`flex items-center text-sm ${
                        darkMode
                          ? 'text-gray-400 hover:text-primary-400'
                          : 'text-gray-600 hover:text-primary-600'
                      } transition-colors`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={`text-sm font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Contact
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              Innovation Zone Ecosystem Platform
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Windsor-Essex, Ontario, Canada
            </p>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <p className={`text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            © {new Date().getFullYear()} Innovation Zone Ecosystem Platform – Windsor-Essex (POC). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

