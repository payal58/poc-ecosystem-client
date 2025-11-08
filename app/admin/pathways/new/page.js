'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { pathwaysApi } from '@/lib/api'
import { ArrowLeft, Save } from 'lucide-react'

export default function NewPathwayPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    question: '',
    answer_options: '',
    recommended_resources: '',
  })

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

      await pathwaysApi.create({
        question: formData.question,
        answer_options: answerOptions,
        recommended_resources: recommendedResources,
      })
      router.push('/admin/pathways')
    } catch (error) {
      console.error('Error creating pathway:', error)
      alert('Error creating pathway. Please check all fields.')
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Create New Pathway</h1>

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
                placeholder='{"key1": "Option 1", "key2": "Option 2"}'
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
              <p className="mt-1 text-sm text-gray-500">
                JSON object mapping answer keys to display text
              </p>
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
                placeholder='{"answer_key": {"organizations": [1, 2], "events": [1], "description": "..."}}'
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono text-sm"
              />
              <p className="mt-1 text-sm text-gray-500">
                JSON object mapping answer keys to recommended resources
              </p>
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
                {loading ? 'Creating...' : 'Create Pathway'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}




