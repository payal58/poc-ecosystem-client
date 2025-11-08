'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { eventsApi } from '@/lib/api'
import { Calendar, MapPin, ExternalLink, ArrowLeft, Clock } from 'lucide-react'

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchEvent()
    }
  }, [params.id])

  const fetchEvent = async () => {
    try {
      setLoading(true)
      const response = await eventsApi.getById(params.id)
      setEvent(response.data)
    } catch (error) {
      console.error('Error fetching event:', error)
      if (error.response?.status === 404) {
        router.push('/events')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Event not found</p>
          <Link href="/events" className="text-primary-600 hover:text-primary-700">
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/events"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Events
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
              {event.category && (
                <span className="inline-block px-4 py-2 text-sm bg-primary-100 text-primary-800 rounded-full">
                  {event.category}
                </span>
              )}
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Date</p>
                  <p className="text-gray-600">
                    {formatDate(event.start_date)}
                    {event.end_date && event.end_date !== event.start_date && (
                      <span> - {formatDate(event.end_date)}</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Location</p>
                  <p className="text-gray-600">{event.location}</p>
                </div>
              </div>

              {event.audience && (
                <div className="flex items-start">
                  <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">Audience</p>
                    <p className="text-gray-600">{event.audience}</p>
                  </div>
                </div>
              )}
            </div>

            {event.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            )}

            {event.link && (
              <div className="pt-6 border-t border-gray-200">
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Visit Event Website
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




