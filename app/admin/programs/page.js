'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { programsApi, organizationsApi } from '@/lib/api'
import { BookOpen, Plus, Edit, Trash2, ArrowLeft, CheckCircle, XCircle } from 'lucide-react'

export default function AdminProgramsPage() {
  const router = useRouter()
  const [programs, setPrograms] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [programsRes, orgsRes] = await Promise.all([
        programsApi.getAll(),
        organizationsApi.getAll()
      ])
      setPrograms(programsRes.data)
      setOrganizations(orgsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOrganizationName = (orgId) => {
    const org = organizations.find(o => o.id === orgId)
    return org?.organization_name || `Organization #${orgId}`
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this program?')) {
      return
    }

    try {
      await programsApi.delete(id)
      setPrograms(programs.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting program:', error)
      alert('Error deleting program. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <Link
              href="/admin"
              className="inline-flex items-center text-primary-800 hover:text-primary-700 mb-2 sm:mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">Manage Programs</h1>
          </div>
          <Link
            href="/admin/programs/new"
            className="inline-flex items-center px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Program
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
            <p className="mt-4 text-neutral-600">Loading programs...</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-neutral-50 dark:bg-neutral-900">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Program Title
                    </th>
                    <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Organization
                    </th>
                    <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {programs.map((program) => (
                    <tr key={program.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-700">
                      <td className="px-3 sm:px-6 py-4">
                        <div className="text-sm font-medium text-neutral-900 dark:text-white">
                          {program.title}
                        </div>
                        <div className="sm:hidden mt-1">
                          <div className="text-xs text-neutral-600 dark:text-neutral-400">
                            {getOrganizationName(program.organization_id)}
                          </div>
                          <div className="flex gap-2 mt-1">
                            <span className="inline-block px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
                              {program.program_type}
                            </span>
                            {program.is_active ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Active
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                                <XCircle className="h-3 w-3 mr-1" />
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm text-neutral-600 dark:text-neutral-300">
                        {getOrganizationName(program.organization_id)}
                      </td>
                      <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
                          {program.program_type}
                        </span>
                      </td>
                      <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {program.is_active ? (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full">
                              <XCircle className="h-3 w-3 mr-1" />
                              Inactive
                            </span>
                          )}
                          {program.is_verified && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                              Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/programs/${program.id}/edit`}
                            className="text-primary-800 dark:text-primary-800 hover:text-primary-900 dark:hover:text-primary-300"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(program.id)}
                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {programs.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No programs found. Create your first program!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

