'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { pathwaysApi } from '@/lib/api'
import { Compass, Plus, Edit, Trash2, ArrowLeft } from 'lucide-react'

export default function AdminPathwaysPage() {
  const router = useRouter()
  const [pathways, setPathways] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPathways()
  }, [])

  const fetchPathways = async () => {
    try {
      setLoading(true)
      const response = await pathwaysApi.getAll()
      setPathways(response.data)
    } catch (error) {
      console.error('Error fetching pathways:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this pathway?')) {
      return
    }

    try {
      await pathwaysApi.delete(id)
      setPathways(pathways.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting pathway:', error)
      alert('Error deleting pathway. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center text-primary-800 hover:text-primary-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-neutral-900">Manage Pathways</h1>
          </div>
          <Link
            href="/admin/pathways/new"
            className="inline-flex items-center px-4 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Pathway
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
            <p className="mt-4 text-neutral-600">Loading pathways...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pathways.map((pathway) => (
              <div
                key={pathway.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                      {pathway.question}
                    </h3>
                    {pathway.answer_options && (
                      <div className="mb-3">
                        <p className="text-sm text-neutral-600 mb-2">Answer Options:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(pathway.answer_options).map(([key, value]) => (
                            <span
                              key={key}
                              className="px-3 py-1 text-sm bg-neutral-100 text-neutral-700 rounded-full"
                            >
                              {value}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Link
                      href={`/admin/pathways/${pathway.id}/edit`}
                      className="text-primary-800 hover:text-primary-900"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(pathway.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {pathways.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Compass className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                <p className="text-neutral-600">No pathways found. Create your first pathway!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}





