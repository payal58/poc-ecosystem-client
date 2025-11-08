'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { searchApi } from '@/lib/api'
import { BarChart3, ArrowLeft, Search, TrendingUp, AlertCircle } from 'lucide-react'

export default function AdminInsightsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSearches: 0,
    failedSearches: 0,
    mostCommonQueries: [],
  })

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await searchApi.getLogs()
      const searchLogs = response.data
      setLogs(searchLogs)

      // Calculate statistics
      const total = searchLogs.length
      const failed = searchLogs.filter(log => log.results_count === 0).length

      // Most common queries (failed searches)
      const failedQueries = searchLogs
        .filter(log => log.results_count === 0)
        .map(log => log.query.toLowerCase())
      
      const queryCounts = {}
      failedQueries.forEach(query => {
        queryCounts[query] = (queryCounts[query] || 0) + 1
      })

      const mostCommon = Object.entries(queryCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([query, count]) => ({ query, count }))

      setStats({
        totalSearches: total,
        failedSearches: failed,
        mostCommonQueries: mostCommon,
      })
    } catch (error) {
      console.error('Error fetching search logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gap Analysis & Insights</h1>
          <p className="text-gray-600">
            Track search patterns and identify gaps in the ecosystem
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Searches</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalSearches}</p>
              </div>
              <Search className="h-8 w-8 text-primary-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Failed Searches</p>
                <p className="text-3xl font-bold text-red-600">{stats.failedSearches}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalSearches > 0
                    ? Math.round(((stats.totalSearches - stats.failedSearches) / stats.totalSearches) * 100)
                    : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Most Common Failed Queries */}
        {stats.mostCommonQueries.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Most Common Failed Queries
            </h2>
            <div className="space-y-2">
              {stats.mostCommonQueries.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-900 font-medium">{item.query}</span>
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    {item.count} {item.count === 1 ? 'time' : 'times'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Logs Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Search Logs</h2>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">Loading logs...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No search logs found yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Query
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Results
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.query}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            log.results_count === 0
                              ? 'bg-red-100 text-red-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {log.results_count} {log.results_count === 1 ? 'result' : 'results'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(log.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}




