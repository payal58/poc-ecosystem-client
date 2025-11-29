'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { usePathway } from '@/contexts/PathwayContext'
import { organizationsApi, eventsApi } from '@/lib/api'
import { CheckCircle, Building2, Calendar, ArrowLeft, Sparkles } from 'lucide-react'

export default function SupportResultsPage() {
  const router = useRouter()
  const { pathwayResults, setPathwayResults } = usePathway()
  const [recommendations, setRecommendations] = useState([])
  const [aiResponse, setAiResponse] = useState(null)
  const [organizations, setOrganizations] = useState([])
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get data from context
    if (pathwayResults) {
      try {
        setRecommendations(pathwayResults.recommendations || [])
        
        // Check if we have AI response
        const aiRec = pathwayResults.recommendations?.find(r => r.type === 'ai_recommendation')
        if (aiRec) {
          setAiResponse(aiRec.content)
          setLoading(false) // Set loading to false when AI response is found
        } else {
          // Legacy format - load resources from recommendations
          loadResources(pathwayResults.recommendations || [])
        }
      } catch (error) {
        console.error('Error parsing recommendations:', error)
        setLoading(false)
        router.push('/support')
      }
    } else {
      // No data found, redirect back to support page
      setLoading(false)
      router.push('/support')
    }
  }, [pathwayResults, router])

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
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-300">Loading recommendations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Link
          href="/support"
          className="inline-flex items-center text-primary-800 dark:text-primary-800 hover:text-primary-700 dark:hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Pathways
        </Link>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 sm:p-8 mb-6">
          <div className="flex items-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white">
              Your Personalized Recommendations
            </h1>
          </div>
          <p className="text-neutral-600 dark:text-neutral-300">
            Based on your responses, we&apos;ve curated the following resources for you.
          </p>
        </div>

        {/* AI Response */}
        {aiResponse && (
          <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 rounded-lg shadow-lg p-6 sm:p-8 mb-6 border border-primary-200 dark:border-primary-800">
            <div className="flex items-center mb-4">
              <Sparkles className="h-6 w-6 text-primary-800 dark:text-primary-800 mr-2" />
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white">
                AI-Powered Recommendations
              </h2>
            </div>
            <div className="prose prose-sm sm:prose-base max-w-none dark:prose-invert prose-headings:text-neutral-900 dark:prose-headings:text-neutral-100 prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-strong:text-neutral-900 dark:prose-strong:text-neutral-100 prose-ul:text-neutral-700 dark:prose-ul:text-neutral-300 prose-ol:text-neutral-700 dark:prose-ol:text-neutral-300 prose-li:text-neutral-700 dark:prose-li:text-neutral-300 prose-a:text-primary-800 dark:prose-a:text-primary-800 hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-300">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4 text-neutral-900 dark:text-white" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-5 mb-3 text-neutral-900 dark:text-white" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-4 mb-2 text-neutral-900 dark:text-white" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 leading-relaxed text-neutral-700 dark:text-neutral-300" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-neutral-700 dark:text-neutral-300" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-neutral-700 dark:text-neutral-300" {...props} />,
                  li: ({node, ...props}) => <li className="ml-4 text-neutral-700 dark:text-neutral-300" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-neutral-900 dark:text-white" {...props} />,
                  em: ({node, ...props}) => <em className="italic text-neutral-700 dark:text-neutral-300" {...props} />,
                  a: ({node, ...props}) => <a className="text-primary-800 dark:text-primary-800 hover:text-primary-700 dark:hover:text-primary-300 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                  code: ({node, inline, ...props}) => 
                    inline ? (
                      <code className="bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-sm font-mono text-neutral-900 dark:text-neutral-100" {...props} />
                    ) : (
                      <code className="block bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg text-sm font-mono text-neutral-900 dark:text-neutral-100 overflow-x-auto mb-4" {...props} />
                    ),
                  blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary-800 pl-4 italic my-4 text-neutral-600 dark:text-neutral-400" {...props} />,
                }}
              >
                {aiResponse}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Legacy Organizations */}
        {organizations.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
              <Building2 className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary-800 dark:text-primary-800" />
              Recommended Organizations
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    {org.business_name || org.name}
                  </h3>
                  {org.industry && (
                    <span className="inline-block px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full mb-3">
                      {org.industry || org.category}
                    </span>
                  )}
                  {org.description && (
                    <p className="text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-2 text-sm sm:text-base">
                      {org.description}
                    </p>
                  )}
                  <Link
                    href={`/directory/${org.id}`}
                    className="text-primary-800 dark:text-primary-800 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm sm:text-base"
                  >
                    Learn More →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Legacy Events */}
        {events.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white mb-4 flex items-center">
              <Calendar className="h-5 w-5 sm:h-6 sm:w-6 mr-2 text-primary-800 dark:text-primary-800" />
              Recommended Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    {event.title}
                  </h3>
                  {event.category && (
                    <span className="inline-block px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full mb-3">
                      {event.category}
                    </span>
                  )}
                  {event.description && (
                    <p className="text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-2 text-sm sm:text-base">
                      {event.description}
                    </p>
                  )}
                  <Link
                    href={`/events/${event.id}`}
                    className="text-primary-800 dark:text-primary-800 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm sm:text-base"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {!aiResponse && organizations.length === 0 && events.length === 0 && (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 sm:p-8 text-center">
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              No specific recommendations at this time.
            </p>
            <Link
              href="/directory"
              className="inline-block px-6 py-2 bg-primary-800 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Browse All Resources
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
