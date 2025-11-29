'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { programsApi, organizationsApi } from '@/lib/api'
import { ArrowLeft, Save } from 'lucide-react'

export default function EditProgramPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [organizations, setOrganizations] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organization_id: '',
    program_type: '',
    stage: '',
    sector: '',
    eligibility_criteria: {},
    cost: '',
    duration: '',
    application_deadline: '',
    start_date: '',
    website: '',
    application_link: '',
    is_verified: false,
    is_active: true,
  })

  const programTypes = [
    'accelerator',
    'incubator',
    'workshop',
    'mentorship',
    'fund',
    'grant',
    'network',
    'certification',
    'workspace',
    'program',
    'initiative'
  ]

  const stages = ['idea', 'startup', 'growth', 'scale', 'All']
  const sectors = ['Technology', 'Healthcare', 'GreenTech', 'Food & Beverage', 'Manufacturing', 'Digital Media', 'All']
  const costs = ['Free', 'Paid', 'Sliding scale', 'Equity-based', 'Membership-based', 'Monthly fee', 'Application fee']

  useEffect(() => {
    fetchOrganizations()
    if (params.id) {
      fetchProgram()
    }
  }, [params.id])

  const fetchOrganizations = async () => {
    try {
      const response = await organizationsApi.getAll()
      setOrganizations(response.data)
    } catch (error) {
      console.error('Error fetching organizations:', error)
    }
  }

  const fetchProgram = async () => {
    try {
      setFetching(true)
      const response = await programsApi.getById(params.id)
      const program = response.data
      
      // Format dates for input fields
      const formatDate = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        return date.toISOString().split('T')[0]
      }

      setFormData({
        title: program.title || '',
        description: program.description || '',
        organization_id: program.organization_id || '',
        program_type: program.program_type || '',
        stage: program.stage || '',
        sector: program.sector || '',
        eligibility_criteria: program.eligibility_criteria || {},
        cost: program.cost || '',
        duration: program.duration || '',
        application_deadline: formatDate(program.application_deadline),
        start_date: formatDate(program.start_date),
        website: program.website || '',
        application_link: program.application_link || '',
        is_verified: program.is_verified || false,
        is_active: program.is_active !== undefined ? program.is_active : true,
      })
    } catch (error) {
      console.error('Error fetching program:', error)
      router.push('/admin/programs')
    } finally {
      setFetching(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || '' : value),
    })
  }

  const handleEligibilityChange = (key, value) => {
    setFormData({
      ...formData,
      eligibility_criteria: {
        ...formData.eligibility_criteria,
        [key]: value
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const submitData = {
        ...formData,
        organization_id: parseInt(formData.organization_id),
        eligibility_criteria: Object.keys(formData.eligibility_criteria).length > 0 
          ? formData.eligibility_criteria 
          : null,
        application_deadline: formData.application_deadline || null,
        start_date: formData.start_date || null,
      }

      await programsApi.update(params.id, submitData)
      router.push('/admin/programs')
    } catch (error) {
      console.error('Error updating program:', error)
      alert('Error updating program. Please check all required fields.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-300">Loading program...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Link
          href="/admin/programs"
          className="inline-flex items-center text-primary-800 dark:text-primary-800 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Link>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-6">Edit Program</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Program Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              />
            </div>

            {/* Organization */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Organization <span className="text-red-500">*</span>
              </label>
              <select
                name="organization_id"
                required
                value={formData.organization_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="">Select Organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.organization_name || `Organization #${org.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Program Type */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Program Type <span className="text-red-500">*</span>
              </label>
              <select
                name="program_type"
                required
                value={formData.program_type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
              >
                <option value="">Select Program Type</option>
                {programTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* Stage and Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Stage
                </label>
                <select
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                >
                  <option value="">Select Stage</option>
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>
                      {stage.charAt(0).toUpperCase() + stage.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Sector
                </label>
                <select
                  name="sector"
                  value={formData.sector}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                >
                  <option value="">Select Sector</option>
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Cost and Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Cost
                </label>
                <select
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                >
                  <option value="">Select Cost</option>
                  {costs.map((cost) => (
                    <option key={cost} value={cost}>{cost}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 12 weeks, 6 months"
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="application_deadline"
                  value={formData.application_deadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            {/* Website and Application Link */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Application Link
                </label>
                <input
                  type="url"
                  name="application_link"
                  value={formData.application_link}
                  onChange={handleChange}
                  placeholder="https://example.com/apply"
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-800 focus:border-transparent bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Eligibility Criteria
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.eligibility_criteria['pre-revenue'] || false}
                    onChange={(e) => handleEligibilityChange('pre-revenue', e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  <label className="text-sm text-neutral-700 dark:text-neutral-300">Pre-revenue</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.eligibility_criteria['student'] || false}
                    onChange={(e) => handleEligibilityChange('student', e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  <label className="text-sm text-neutral-700 dark:text-neutral-300">Student</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.eligibility_criteria['women-led'] || false}
                    onChange={(e) => handleEligibilityChange('women-led', e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  <label className="text-sm text-neutral-700 dark:text-neutral-300">Women-led</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.eligibility_criteria['BIPOC'] || false}
                    onChange={(e) => handleEligibilityChange('BIPOC', e.target.checked)}
                    className="rounded border-neutral-300"
                  />
                  <label className="text-sm text-neutral-700 dark:text-neutral-300">BIPOC</label>
                </div>
              </div>
            </div>

            {/* Status Checkboxes */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="rounded border-neutral-300"
                />
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Active</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={formData.is_verified}
                  onChange={handleChange}
                  className="rounded border-neutral-300"
                />
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Innovation Zone Verified</label>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
              <Link
                href="/admin/programs"
                className="px-6 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
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

