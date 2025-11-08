'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { pathwaysApi } from '@/lib/api'
import { ArrowLeft, Save } from 'lucide-react'

export default function EditPathwayPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    question: '',
    answer_options: '',
    recommended_resources: '',
  })

  useEffect(() => {
    if (params.id) {
      fetchPathway()
    }
  }, [params.id])

  const fetchPathway = async () => {
    try {
      setFetching(true)
      const response = await pathwaysApi.getById(params.id)
      const pathway = response.data
      setFormData({
        question: pathway.question || '',
        answer_options: pathway.answer_options
          ? JSON.stringify(pathway.answer_options, null, 2)
          : '',
        recommended_resources: pathway.recommended_resources
          ? JSON.stringify(pathway.recommended_resources, null, 2)
          : '',
      })
    } catch (error) {
      console.error('Error fetching pathway:', error)
      router.push('/admin/pathways')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Parse JSON strings
      let answerOptions = null
      let recommendedResources = null

      if (formData.answer_options.trim()) {
        try {
          answerOptions = JSON.parse(formData.answer_options)
        } catch {
          alert('Invalid JSON for answer options')
          setLoading(false)
          return
        }
      }

      if (formData.recommended_resources.trim()) {
        try {
          recommendedResources = JSON.parse(formData.recommended_resources)
        } catch {
          alert('Invalid JSON for recommended resources')
          setLoading(false)
          return
        }
      }

      await pathwaysApi.update(params.id, {
        question: formData.question,
        answer_options: answerOptions,
        recommended_resources: recommendedResources,
      })
      router.push('/admin/pathways')
    } catch (error) {
      console.error('Error updating pathway:', error)
      alert('Error updating pathway. Please check all fields.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading pathway...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin/pathways"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pathways
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Pathway</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="question"
                required
                value={formData.question}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer Options (JSON)
              </label>
              <textarea
                name="answer_options"
                rows={6}
                value={formData.answer_options}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Recommended Resources (JSON)
              </label>
              <textarea
                name="recommended_resources"
                rows={8}
                value={formData.recommended_resources}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href="/admin/pathways"
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}




