'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { programsApi } from '@/lib/api'
import { BookOpen, Building2, Calendar, DollarSign, Users, ExternalLink, CheckCircle, ArrowLeft, Globe, FileText } from 'lucide-react'

export default function ProgramDetailPage() {
  const params = useParams()
  const programId = params.id
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (programId) {
      fetchProgram()
    }
  }, [programId])

  const fetchProgram = async () => {
    try {
      setLoading(true)
      const response = await programsApi.getById(programId)
      setProgram(response.data)
    } catch (error) {
      console.error('Error fetching program:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-800"></div>
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading program...</p>
        </div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-neutral-400" />
          <p className="mt-4 text-neutral-600 dark:text-neutral-400">Program not found</p>
          <Link href="/programs" className="mt-4 text-primary-800 hover:text-primary-700">
            Back to Programs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/programs"
          className="inline-flex items-center text-primary-800 hover:text-primary-700 dark:text-primary-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Programs
        </Link>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">
                    {program.title}
                  </h1>
                  {program.is_verified && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  )}
                </div>
                
                <Link
                  href={`/directory/${program.organization_id}`}
                  className="inline-flex items-center text-primary-800 hover:text-primary-700 dark:text-primary-800"
                >
                  <Building2 className="h-4 w-4 mr-1" />
                  {program.organization_name || 'Unknown Organization'}
                </Link>
              </div>
            </div>
          </div>

          {/* Program Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {program.program_type && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <BookOpen className="h-5 w-5 text-primary-800 dark:text-primary-800" />
                <div>
                  <div className="text-sm font-medium">Program Type</div>
                  <div>{program.program_type}</div>
                </div>
              </div>
            )}
            
            {program.stage && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <Users className="h-5 w-5 text-primary-800 dark:text-primary-800" />
                <div>
                  <div className="text-sm font-medium">Business Stage</div>
                  <div>{program.stage}</div>
                </div>
              </div>
            )}
            
            {program.sector && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <div>
                  <div className="text-sm font-medium">Sector</div>
                  <div>{program.sector}</div>
                </div>
              </div>
            )}
            
            {program.cost && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <DollarSign className="h-5 w-5 text-primary-800 dark:text-primary-800" />
                <div>
                  <div className="text-sm font-medium">Cost</div>
                  <div>{program.cost}</div>
                </div>
              </div>
            )}
            
            {program.duration && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <Calendar className="h-5 w-5 text-primary-800 dark:text-primary-800" />
                <div>
                  <div className="text-sm font-medium">Duration</div>
                  <div>{program.duration}</div>
                </div>
              </div>
            )}
            
            {program.start_date && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <Calendar className="h-5 w-5 text-primary-800 dark:text-primary-800" />
                <div>
                  <div className="text-sm font-medium">Start Date</div>
                  <div>{formatDate(program.start_date)}</div>
                </div>
              </div>
            )}
            
            {program.application_deadline && (
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
                <Calendar className="h-5 w-5 text-red-600 dark:text-red-400" />
                <div>
                  <div className="text-sm font-medium">Application Deadline</div>
                  <div className="font-semibold">{formatDate(program.application_deadline)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">Description</h2>
            <p className="text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
              {program.description}
            </p>
          </div>

          {/* Eligibility Criteria */}
          {program.eligibility_criteria && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">Eligibility Criteria</h2>
              <div className="flex flex-wrap gap-2">
                {Object.entries(program.eligibility_criteria).map(([key, value]) => (
                  <span
                    key={key}
                    className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-sm"
                  >
                    {key}: {String(value)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
            {program.application_link && (
              <a
                href={program.application_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 bg-primary-800 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FileText className="h-5 w-5 mr-2" />
                Apply Now
              </a>
            )}
            {program.website && (
              <a
                href={program.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <Globe className="h-5 w-5 mr-2" />
                Visit Website
              </a>
            )}
            <Link
              href={`/directory/${program.organization_id}`}
              className="inline-flex items-center px-6 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <Building2 className="h-5 w-5 mr-2" />
              View Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}


