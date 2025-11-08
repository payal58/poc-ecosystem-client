'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { organizationsApi } from '@/lib/api'
import { Building2, Mail, Globe, ArrowLeft, MapPin, Phone, Briefcase, TrendingUp, CheckCircle, ExternalLink } from 'lucide-react'

// Dynamically import Map component to avoid SSR issues
const Map = dynamic(() => import('@/components/Map'), { ssr: false })

export default function OrganizationDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchOrganization()
    }
  }, [params.id])

  const fetchOrganization = async () => {
    try {
      setLoading(true)
      const response = await organizationsApi.getById(params.id)
      setOrganization(response.data)
    } catch (error) {
      console.error('Error fetching organization:', error)
      if (error.response?.status === 404) {
        router.push('/directory')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading organization...</p>
        </div>
      </div>
    )
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Organization not found</p>
          <Link href="/directory" className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
            Back to Directory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Link
          href="/directory"
          className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Directory
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    {organization.organization_name || 'Unnamed Organization'}
                  </h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {organization.sector_type && (
                      <span className="inline-block px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full">
                        {organization.sector_type}
                      </span>
                    )}
                    {organization.city && (
                      <span className="inline-block px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                        {organization.city}
                      </span>
                    )}
                    {organization.province_state && (
                      <span className="inline-block px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded-full">
                        {organization.province_state}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {organization.services_offered && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Services Offered
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {organization.services_offered}
                </p>
              </div>
            )}
            
            {organization.notes && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  Notes
                </h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {organization.notes}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Business Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Business Information
                </h2>
                
                {organization.address && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Address</p>
                      <p className="text-gray-600 dark:text-gray-300">{organization.address}</p>
                    </div>
                  </div>
                )}

                {organization.city && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">City</p>
                      <p className="text-gray-600 dark:text-gray-300">{organization.city}</p>
                    </div>
                  </div>
                )}

                {organization.province_state && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Province/State</p>
                      <p className="text-gray-600 dark:text-gray-300">{organization.province_state}</p>
                    </div>
                  </div>
                )}

                {organization.sector_type && (
                  <div className="flex items-start">
                    <Briefcase className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Sector Type</p>
                      <p className="text-gray-600 dark:text-gray-300">{organization.sector_type}</p>
                    </div>
                  </div>
                )}

                {(organization.latitude && organization.longitude) && (
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Coordinates</p>
                      <p className="text-gray-600 dark:text-gray-300">
                        {organization.latitude}, {organization.longitude}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h2>

                {organization.email_address && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Email</p>
                      <a
                        href={`mailto:${organization.email_address}`}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        {organization.email_address}
                      </a>
                    </div>
                  </div>
                )}

                {organization.contact_name && (
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Contact Name</p>
                      <p className="text-gray-600 dark:text-gray-300">{organization.contact_name}</p>
                    </div>
                  </div>
                )}

                {organization.phone_number && (
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Phone</p>
                      <a
                        href={`tel:${organization.phone_number}`}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                      >
                        {organization.phone_number}
                      </a>
                    </div>
                  </div>
                )}

                {organization.website && (
                  <div className="flex items-start">
                    <Globe className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white mb-1">Website</p>
                      <a
                        href={organization.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 inline-flex items-center"
                      >
                        {organization.website}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Map Section */}
            {organization.latitude && organization.longitude && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Location
                </h2>
                <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700" style={{ height: '400px' }}>
                  <Map
                    latitude={parseFloat(organization.latitude)}
                    longitude={parseFloat(organization.longitude)}
                    organizationName={organization.organization_name || 'Organization'}
                  />
                </div>
              </div>
            )}

            {/* External Link */}
            {organization.external_url && (
              <div className="mb-6">
                <a
                  href={organization.external_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  View on Source Website
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
