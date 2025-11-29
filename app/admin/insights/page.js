'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { searchApi, programsApi, organizationsApi, eventsApi } from '@/lib/api'
import { BarChart3, ArrowLeft, Search, TrendingUp, AlertCircle, BookOpen, Building2, Calendar } from 'lucide-react'

export default function AdminInsightsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSearches: 0,
    failedSearches: 0,
    successRate: 0,
    mostCommonQueries: [],
    mostCommonFailedQueries: [],
    recentSearches: [],
  })
  const [contentStats, setContentStats] = useState({
    totalPrograms: 0,
    totalOrganizations: 0,
    totalEvents: 0,
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [logsRes, programsRes, orgsRes, eventsRes] = await Promise.all([
        searchApi.getLogs().catch(() => ({ data: [] })),
        programsApi.getAll().catch(() => ({ data: [] })),
        organizationsApi.getAll().catch(() => ({ data: [] })),
        eventsApi.getAll().catch(() => ({ data: [] })),
      ])

      const searchLogs = logsRes.data || []
      setLogs(searchLogs)

      // Calculate search statistics
      const total = searchLogs.length
      const failed = searchLogs.filter(log => log.results_count === 0).length
      const successRate = total > 0 ? Math.round(((total - failed) / total) * 100) : 0

      // Most common queries (all searches)
      const allQueries = searchLogs.map(log => log.query.toLowerCase().trim())
      const queryCounts = {}
      allQueries.forEach(query => {
        if (query) {
          queryCounts[query] = (queryCounts[query] || 0) + 1
        }
      })

      const mostCommon = Object.entries(queryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([query, count]) => ({ query, count }))

      // Most common failed queries
      const failedQueries = searchLogs
        .filter(log => log.results_count === 0)
        .map(log => log.query.toLowerCase().trim())
        .filter(q => q)
      
      const failedQueryCounts = {}
      failedQueries.forEach(query => {
        failedQueryCounts[query] = (failedQueryCounts[query] || 0) + 1
      })

      const mostCommonFailed = Object.entries(failedQueryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([query, count]) => ({ query, count }))

      // Recent searches (last 10)
      const recent = searchLogs
        .slice(0, 10)
        .map(log => ({
          query: log.query,
          results: log.results_count,
          date: log.created_at,
          success: log.results_count > 0
        }))

      setStats({
        totalSearches: total,
        failedSearches: failed,
        successRate,
        mostCommonQueries: mostCommon,
        mostCommonFailedQueries: mostCommonFailed,
        recentSearches: recent,
      })

      // Content statistics
      setContentStats({
        totalPrograms: programsRes.data?.length || 0,
        totalOrganizations: orgsRes.data?.length || 0,
        totalEvents: eventsRes.data?.length || 0,
      })
    } catch (error) {
      console.error('Error fetching insights data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatRelativeTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    return formatDate(dateString)
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-primary-800 dark:text-primary-800 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">Gap Analysis & Insights</h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Track search patterns and identify gaps in the ecosystem
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-300">Loading insights...</p>
          </div>
        ) : (
          <>
            {/* Content Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Programs</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">{contentStats.totalPrograms}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-primary-800 dark:text-primary-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Organizations</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">{contentStats.totalOrganizations}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Events</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">{contentStats.totalEvents}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            {/* Search Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Total Searches</p>
                    <p className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">{stats.totalSearches}</p>
                  </div>
                  <Search className="h-8 w-8 text-primary-800 dark:text-primary-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Failed Searches</p>
                    <p className="text-2xl sm:text-3xl font-bold text-red-600 dark:text-red-400">{stats.failedSearches}</p>
                  </div>
                  <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>
              </div>

              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">Success Rate</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
                      {stats.successRate}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            {/* Most Common Failed Queries */}
            {stats.mostCommonFailedQueries.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                  Most Common Failed Queries
                </h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                  These queries returned no results - consider adding content for these topics
                </p>
                <div className="space-y-2">
                  {stats.mostCommonFailedQueries.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                    >
                      <span className="text-neutral-900 dark:text-white font-medium">{item.query}</span>
                      <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm font-medium">
                        {item.count} {item.count === 1 ? 'time' : 'times'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Most Common Queries */}
            {stats.mostCommonQueries.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                  Most Popular Search Queries
                </h2>
                <div className="space-y-2">
                  {stats.mostCommonQueries.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                    >
                      <span className="text-neutral-900 dark:text-white font-medium">{item.query}</span>
                      <span className="px-3 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-sm font-medium">
                        {item.count} {item.count === 1 ? 'time' : 'times'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {stats.recentSearches.length > 0 && (
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-4">
                  Recent Searches
                </h2>
                <div className="space-y-2">
                  {stats.recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg"
                    >
                      <div className="flex-1">
                        <span className="text-neutral-900 dark:text-white font-medium">{search.query}</span>
                        <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                          search.success
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                        }`}>
                          {search.results} {search.results === 1 ? 'result' : 'results'}
                        </span>
                      </div>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-4">
                        {formatRelativeTime(search.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Logs Table */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
              <div className="px-4 sm:px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">All Search Logs</h2>
              </div>
              {logs.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="text-neutral-600 dark:text-neutral-400">No search logs found yet.</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                    Search logs will appear here as users search the platform.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-neutral-50 dark:bg-neutral-900">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Query
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Results
                        </th>
                        <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {logs.map((log) => (
                        <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                          <td className="px-3 sm:px-6 py-4">
                            <div className="text-sm font-medium text-neutral-900 dark:text-white">{log.query}</div>
                            <div className="md:hidden mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                              {formatRelativeTime(log.created_at)}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 text-xs rounded-full ${
                                log.results_count === 0
                                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                                  : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                              }`}
                            >
                              {log.results_count} {log.results_count === 1 ? 'result' : 'results'}
                            </span>
                          </td>
                          <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">
                            {formatDate(log.created_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
