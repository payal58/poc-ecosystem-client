'use client'

import Link from 'next/link'
import { Calendar, Building2, Compass, BarChart3, Plus } from 'lucide-react'

export default function AdminDashboard() {
  const adminSections = [
    {
      title: 'Events',
      description: 'Manage events, workshops, and networking opportunities',
      href: '/admin/events',
      icon: Calendar,
      color: 'bg-blue-500',
    },
    {
      title: 'Organizations',
      description: 'Manage organizations in the ecosystem directory',
      href: '/admin/organizations',
      icon: Building2,
      color: 'bg-green-500',
    },
    {
      title: 'Pathways',
      description: 'Manage support pathway questions and recommendations',
      href: '/admin/pathways',
      icon: Compass,
      color: 'bg-purple-500',
    },
    {
      title: 'Insights',
      description: 'View search logs and gap analysis',
      href: '/admin/insights',
      icon: BarChart3,
      color: 'bg-orange-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            Manage content and view insights for the Innovation Zone Ecosystem Platform
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon
            return (
              <Link
                key={section.href}
                href={section.href}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className={`${section.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center mb-3 sm:mb-4`}>
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {section.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {section.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

