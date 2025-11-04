'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { organizationsApi, searchApi } from '@/lib/api'
import { Building2, Search, Mail, Globe, Filter } from 'lucide-react'

export default function DirectoryPage() {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchOrganizations()
  }, [categoryFilter])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const params = {}
      if (categoryFilter) params.industry = categoryFilter
      if (searchTerm) params.search = searchTerm

      const response = await organizationsApi.getAll(params)
      const results = response.data
      setOrganizations(results)
      
      // Extract unique industries
      const uniqueIndustries = [...new Set(results.map(o => o.industry).filter(Boolean))]
      setCategories(uniqueIndustries)

      // Log search if it was a search query
      if (searchTerm) {
        try {
          await searchApi.log({ 
            query: searchTerm, 
            results_count: results.length 
          })
        } catch (logError) {
          console.error('Error logging search:', logError)
        }
      }
    } catch (error) {
      console.error('Error fetching organizations:', error)
      // Log failed search
      if (searchTerm) {
        try {
          await searchApi.log({ query: searchTerm, results_count: 0 })
        } catch (logError) {
          console.error('Error logging search:', logError)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchOrganizations()
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Ecosystem Directory</h1>
          
          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 mb-6">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 sm:px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Industries</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              {categoryFilter && (
                <button
                  onClick={() => setCategoryFilter('')}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm"
                >
                  Clear Filter
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Organizations Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading organizations...</p>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-300">No organizations found. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {organizations.map((org) => (
              <div
                key={org.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {org.business_name}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {org.industry && (
                        <span className="inline-block px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
                          {org.industry}
                        </span>
                      )}
                      {org.business_stage && (
                        <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                          {org.business_stage}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {org.description && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm sm:text-base">
                      {org.description}
                    </p>
                  )}

                  <div className="space-y-2 mb-4">
                    {org.business_location && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="mr-2">📍</span>
                        {org.business_location}
                      </div>
                    )}
                    {org.phone_number && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span className="mr-2">📞</span>
                        {org.phone_number}
                      </div>
                    )}
                    {org.email && (
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4 mr-2" />
                        {org.email}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {org.website && (
                      <a
                        href={org.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        <Globe className="h-4 w-4 mr-2" />
                        Website
                      </a>
                    )}
                    {org.social_media && Object.keys(org.social_media).length > 0 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {Object.keys(org.social_media).length} social links
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/directory/${org.id}`}
                    className="block text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

