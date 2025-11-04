'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { organizationsApi, eventsApi } from '@/lib/api'
import { CheckCircle, Building2, Calendar, ArrowLeft } from 'lucide-react'

export default function SupportResultsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [recommendations, setRecommendations] = useState([])
  const [organizations, setOrganizations] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const dataParam = searchParams.get('data')
    if (dataParam) {
      try {
        const data = JSON.parse(decodeURIComponent(dataParam))
        setRecommendations(data.recommendations || [])
        loadResources(data.recommendations || [])
      } catch (error) {
        console.error('Error parsing recommendations:', error)
        router.push('/support')
      }
    } else {
      router.push('/support')
    }
  }, [searchParams, router])

  const loadResources = async (recs) => {
    try {
      setLoading(true)
      const orgIds = new Set()
      const eventIds = new Set()

      recs.forEach(rec => {
        if (rec.resources?.organizations) {
          rec.resources.organizations.forEach(id => orgIds.add(id))
        }
        if (rec.resources?.events) {
          rec.resources.events.forEach(id => eventIds.add(id))
        }
      })

      // Fetch organizations and events
      const [orgsResponse, eventsResponse] = await Promise.all([
        organizationsApi.getAll(),
        eventsApi.getAll()
      ])

      const filteredOrgs = orgsResponse.data.filter(org => orgIds.has(org.id))
      const filteredEvents = eventsResponse.data.filter(event => eventIds.has(event.id))

      setOrganizations(filteredOrgs)
      setEvents(filteredEvents)
    } catch (error) {
      console.error('Error loading resources:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/support"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pathways
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Your Personalized Recommendations
            </h1>
          </div>
          <p className="text-gray-600">
            Based on your responses, we've curated the following resources for you.
          </p>
        </div>

        {organizations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Building2 className="h-6 w-6 mr-2 text-primary-600" />
              Recommended Organizations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {org.name}
                  </h3>
                  {org.category && (
                    <span className="inline-block px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-full mb-3">
                      {org.category}
                    </span>
                  )}
                  {org.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {org.description}
                    </p>
                  )}
                  <Link
                    href={`/directory/${org.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {events.length > 0 && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-6 w-6 mr-2 text-primary-600" />
              Recommended Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {event.title}
                  </h3>
                  {event.category && (
                    <span className="inline-block px-3 py-1 text-sm bg-primary-100 text-primary-800 rounded-full mb-3">
                      {event.category}
                    </span>
                  )}
                  {event.description && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  <Link
                    href={`/events/${event.id}`}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {organizations.length === 0 && events.length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              No specific recommendations at this time.
            </p>
            <Link
              href="/directory"
              className="inline-block px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              Browse All Resources
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

