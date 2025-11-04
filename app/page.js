import Link from 'next/link'
import { Calendar, Building2, Compass, BarChart3 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
            Welcome to the Innovation Zone Ecosystem
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
            Connecting people, organizations, and opportunities in Windsor-Essex
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <Link
            href="/events"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <Calendar className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400 mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Events Hub
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Discover upcoming events, workshops, and networking opportunities
            </p>
          </Link>

          <Link
            href="/directory"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <Building2 className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400 mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ecosystem Directory
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Explore organizations, incubators, and support services
            </p>
          </Link>

          <Link
            href="/support"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <Compass className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400 mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Support Pathways
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Get personalized recommendations based on your needs
            </p>
          </Link>

          <Link
            href="/admin"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
          >
            <BarChart3 className="h-10 w-10 sm:h-12 sm:w-12 text-primary-600 dark:text-primary-400 mb-3 sm:mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Admin Dashboard
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Manage content and view insights
            </p>
          </Link>
        </div>
      </main>
    </div>
  )
}
