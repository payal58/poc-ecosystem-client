'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { organizationsApi, searchApi } from '@/lib/api'
import { Building2, Search, Mail, Globe, Filter, ExternalLink, MapPin, Phone } from 'lucide-react'

export default function DirectoryPage() {
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [categories, setCategories] = useState([])
  const [cities, setCities] = useState([])

  useEffect(() => {
    fetchOrganizations()
  }, [categoryFilter, cityFilter])

  const fetchOrganizations = async () => {
    try {
      setLoading(true)
      const params = {}
      if (categoryFilter) params.sector_type = categoryFilter
      if (cityFilter) params.city = cityFilter
      if (searchTerm) params.search = searchTerm

      const response = await organizationsApi.getAll(params)
      const results = response.data
      setOrganizations(results)
      
      // Extract unique sector types
      const uniqueSectors = [...new Set(results.map(o => o.sector_type).filter(Boolean))]
      setCategories(uniqueSectors)
      
      // Extract unique cities
      const uniqueCities = [...new Set(results.map(o => o.city).filter(Boolean))]
      setCities(uniqueCities)

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1], // Notion-like easing
      }
    },
  }

  return (
    <div className="min-h-screen bg-google-gray-50 dark:bg-google-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 sm:mb-10"
        >
          <h1 className="text-3xl sm:text-4xl font-medium text-google-gray-900 dark:text-google-gray-200 mb-6 tracking-tight">Ecosystem Directory</h1>
          
          {/* Search and Filters */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-google-gray-800 border border-google-gray-300 dark:border-google-gray-700 rounded-lg p-4 sm:p-6 mb-8 shadow-sm"
          >
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-google-gray-500 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search organizations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-google-gray-300 dark:border-google-gray-700 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-google-blue bg-white dark:bg-google-gray-800 text-google-gray-900 dark:text-google-gray-200 placeholder-google-gray-500 dark:placeholder-google-gray-500 transition-all"
                  />
                </div>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 sm:px-6 py-2.5 bg-google-blue text-white rounded-lg hover:bg-primary-600 transition-colors font-medium text-sm shadow-sm hover:shadow-md"
                >
                  Search
                </motion.button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-5 w-5 text-google-gray-600 dark:text-google-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2.5 border border-google-gray-300 dark:border-google-gray-700 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-google-blue bg-white dark:bg-google-gray-800 text-google-gray-900 dark:text-google-gray-200 transition-all"
                >
                  <option value="">All Sectors</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-5 w-5 text-google-gray-600 dark:text-google-gray-400" />
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="flex-1 px-3 sm:px-4 py-2.5 border border-google-gray-300 dark:border-google-gray-700 rounded-lg focus:ring-2 focus:ring-google-blue focus:border-google-blue bg-white dark:bg-google-gray-800 text-google-gray-900 dark:text-google-gray-200 transition-all"
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              {(categoryFilter || cityFilter) && (
                <button
                  onClick={() => {
                    setCategoryFilter('')
                    setCityFilter('')
                  }}
                  className="px-4 py-2 text-google-blue hover:text-primary-600 dark:text-google-blue dark:hover:text-primary-400 text-sm whitespace-nowrap font-medium"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Organizations Grid */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-google-gray-300 dark:border-google-gray-700 border-t-google-blue"></div>
              <p className="mt-4 text-google-gray-600 dark:text-google-gray-400">Loading organizations...</p>
            </motion.div>
          ) : organizations.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16 bg-white dark:bg-google-gray-800 border border-google-gray-300 dark:border-google-gray-700 rounded-lg"
            >
              <Building2 className="h-12 w-12 text-google-gray-400 dark:text-google-gray-600 mx-auto mb-4" />
              <p className="text-google-gray-600 dark:text-google-gray-400">No organizations found. Try adjusting your search.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {organizations.map((org, index) => (
                <motion.div
                  key={org.id}
                  variants={cardVariants}
                  whileHover={{ 
                    y: -4,
                    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] }
                  }}
                  className="group"
                >
                  <Link href={`/directory/${org.id}`}>
                    <div className="h-full bg-white dark:bg-google-gray-800 border border-google-gray-300 dark:border-google-gray-700 rounded-lg p-5 hover:border-google-blue hover:shadow-md dark:hover:border-google-blue transition-all duration-200 cursor-pointer hover:bg-google-gray-50 dark:hover:bg-google-gray-700">
                      {/* Header */}
                      <div className="mb-4">
                        <h3 className="text-base font-medium text-google-gray-900 dark:text-google-gray-200 mb-3 line-clamp-2 group-hover:text-google-blue transition-colors">
                          {org.organization_name || 'Unnamed Organization'}
                        </h3>
                        <div className="flex flex-wrap gap-1.5">
                          {org.sector_type && (
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-google-gray-100 dark:bg-google-gray-700 text-google-gray-700 dark:text-google-gray-300 rounded-full">
                              {org.sector_type}
                            </span>
                          )}
                          {org.city && (
                            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-google-gray-100 dark:bg-google-gray-700 text-google-gray-700 dark:text-google-gray-300 rounded-full">
                              {org.city}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Description */}
                      {org.services_offered && (
                        <p className="text-sm text-google-gray-700 dark:text-google-gray-300 mb-4 line-clamp-2 leading-relaxed">
                          {org.services_offered}
                        </p>
                      )}

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        {org.address && (
                          <div className="flex items-start text-xs text-google-gray-600 dark:text-google-gray-400">
                            <MapPin className="h-3.5 w-3.5 mr-2 mt-0.5 flex-shrink-0 text-google-gray-500" />
                            <span className="line-clamp-1">{org.address}</span>
                          </div>
                        )}
                        {org.phone_number && (
                          <div className="flex items-center text-xs text-google-gray-600 dark:text-google-gray-400">
                            <Phone className="h-3.5 w-3.5 mr-2 flex-shrink-0 text-google-gray-500" />
                            <span>{org.phone_number}</span>
                          </div>
                        )}
                        {org.email_address && (
                          <div className="flex items-center text-xs text-google-gray-600 dark:text-google-gray-400">
                            <Mail className="h-3.5 w-3.5 mr-2 flex-shrink-0 text-google-gray-500" />
                            <span className="line-clamp-1">{org.email_address}</span>
                          </div>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="pt-3 border-t border-google-gray-200 dark:border-google-gray-700 flex items-center justify-between">
                        <span className="text-xs text-google-gray-500 dark:text-google-gray-500 group-hover:text-google-blue transition-colors font-medium">
                          View details →
                        </span>
                        {org.website && (
                          <Globe className="h-3.5 w-3.5 text-google-gray-400 dark:text-google-gray-600 group-hover:text-google-blue transition-colors" />
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

