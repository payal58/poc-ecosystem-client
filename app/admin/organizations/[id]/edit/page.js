'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { organizationsApi } from '@/lib/api'
import { ArrowLeft, Save } from 'lucide-react'

export default function EditOrganizationPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [formData, setFormData] = useState({
    business_name: '',
    business_stage: '',
    description: '',
    industry: '',
    business_sector: '',
    business_location: '',
    legal_structure: '',
    business_status: '',
    website: '',
    email: '',
    phone_number: '',
    social_media: {
      LinkedIn: '',
      'Twitter/X': '',
      Facebook: '',
      Instagram: '',
      YouTube: '',
      TikTok: '',
      Pinterest: ''
    },
    additional_contact_info: '',
  })

  const businessStages = ['Idea', 'Early Stage', 'Growing Business', 'Established Business']
  const legalStructures = ['Sole Proprietorship', 'Partnership', 'Corporation', 'LLC', 'Non-Profit', 'Other']
  const businessStatuses = ['Active', 'Inactive', 'Pending', 'On Hold']

  useEffect(() => {
    if (params.id) {
      fetchOrganization()
    }
  }, [params.id])

  const fetchOrganization = async () => {
    try {
      setFetching(true)
      const response = await organizationsApi.getById(params.id)
      const org = response.data
      
      // Initialize social media object with all platforms
      const socialMedia = {
        LinkedIn: '',
        'Twitter/X': '',
        Facebook: '',
        Instagram: '',
        YouTube: '',
        TikTok: '',
        Pinterest: ''
      }
      
      // Populate social media from response
      if (org.social_media) {
        Object.keys(socialMedia).forEach(platform => {
          if (org.social_media[platform]) {
            socialMedia[platform] = org.social_media[platform]
          }
        })
      }

      setFormData({
        business_name: org.business_name || '',
        business_stage: org.business_stage || '',
        description: org.description || '',
        industry: org.industry || '',
        business_sector: org.business_sector || '',
        business_location: org.business_location || '',
        legal_structure: org.legal_structure || '',
        business_status: org.business_status || '',
        website: org.website || '',
        email: org.email || '',
        phone_number: org.phone_number || '',
        social_media: socialMedia,
        additional_contact_info: org.additional_contact_info || '',
      })
    } catch (error) {
      console.error('Error fetching organization:', error)
      router.push('/admin/organizations')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('social_')) {
      const platform = name.replace('social_', '')
      setFormData({
        ...formData,
        social_media: {
          ...formData.social_media,
          [platform]: value
        }
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean social media - remove empty values
      const cleanedSocialMedia = {}
      Object.entries(formData.social_media).forEach(([key, value]) => {
        if (value && value.trim()) {
          cleanedSocialMedia[key] = value.trim()
        }
      })

      const submitData = {
        ...formData,
        social_media: Object.keys(cleanedSocialMedia).length > 0 ? cleanedSocialMedia : null
      }

      await organizationsApi.update(params.id, submitData)
      router.push('/admin/organizations')
    } catch (error) {
      console.error('Error updating organization:', error)
      alert('Error updating organization. Please check all required fields.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading organization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Link
          href="/admin/organizations"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Organizations
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Edit Organization</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="business_name"
                required
                value={formData.business_name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Business Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Stage <span className="text-red-500">*</span>
              </label>
              <select
                name="business_stage"
                required
                value={formData.business_stage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Business Stage</option>
                {businessStages.map((stage) => (
                  <option key={stage} value={stage}>{stage}</option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Industry <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="industry"
                required
                value={formData.industry}
                onChange={handleChange}
                placeholder="e.g., Technology, Healthcare, Manufacturing"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Business Sector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Sector
              </label>
              <input
                type="text"
                name="business_sector"
                value={formData.business_sector}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Business Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="business_location"
                required
                value={formData.business_location}
                onChange={handleChange}
                placeholder="e.g., Windsor, Ontario"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Legal Structure */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Legal Structure <span className="text-red-500">*</span>
              </label>
              <select
                name="legal_structure"
                required
                value={formData.legal_structure}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Legal Structure</option>
                {legalStructures.map((structure) => (
                  <option key={structure} value={structure}>{structure}</option>
                ))}
              </select>
            </div>

            {/* Business Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Business Status <span className="text-red-500">*</span>
              </label>
              <select
                name="business_status"
                required
                value={formData.business_status}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select Business Status</option>
                {businessStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone_number"
                required
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="(519) 555-0100"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Social Media */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Social Media
              </label>
              <div className="space-y-3">
                {Object.keys(formData.social_media).map((platform) => (
                  <div key={platform}>
                    <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                      {platform}
                    </label>
                    <input
                      type="url"
                      name={`social_${platform}`}
                      value={formData.social_media[platform]}
                      onChange={handleChange}
                      placeholder={`${platform} URL`}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Contact Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Additional Contact Info
              </label>
              <textarea
                name="additional_contact_info"
                rows={3}
                value={formData.additional_contact_info}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
              <Link
                href="/admin/organizations"
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
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
