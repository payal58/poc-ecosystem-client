'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { programsApi, searchApi } from '@/lib/api'
import { BookOpen, Search, Filter, Calendar, DollarSign, Users, Building2, ExternalLink, CheckCircle } from 'lucide-react'

export default function ProgramsPage() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [programTypeFilter, setProgramTypeFilter] = useState('')
  const [stageFilter, setStageFilter] = useState('')
  const [sectorFilter, setSectorFilter] = useState('')
  const [organizationFilter, setOrganizationFilter] = useState('')
  const [programTypes, setProgramTypes] = useState([])
  const [stages, setStages] = useState([])
  const [sectors, setSectors] = useState([])
  const [organizations, setOrganizations] = useState([])

  useEffect(() => {
    fetchPrograms()
  }, [programTypeFilter, stageFilter, sectorFilter, organizationFilter])

  const fetchPrograms = async () => {
    try {
      setLoading(true)
      const params = { is_active: true }
      if (programTypeFilter) params.program_type = programTypeFilter
      if (stageFilter) params.stage = stageFilter
      if (sectorFilter) params.sector = sectorFilter
      if (searchTerm) params.search = searchTerm
      if (organizationFilter) params.organization_name = organizationFilter

      const response = await programsApi.getAll(params)
      const results = response.data
      setPrograms(results)
      
      // Extract unique values for filters
      const uniqueTypes = [...new Set(results.map(p => p.program_type).filter(Boolean))]
      const uniqueStages = [...new Set(results.map(p => p.stage).filter(Boolean))]
      const uniqueSectors = [...new Set(results.map(p => p.sector).filter(Boolean))]
      const uniqueOrganizations = [...new Set(results.map(p => p.organization_name).filter(Boolean))]
      
      setProgramTypes(uniqueTypes)
      setStages(uniqueStages)
      setSectors(uniqueSectors)
      setOrganizations(uniqueOrganizations)

      // Log search if it was a search query
      if (searchTerm) {
        try {
          await searchApi.log({ 
            query: searchTerm, 
            results_count: results.length 
          })
        } catch (logError) {
          console.error('Error logging search:', logError)
        }
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
      setPrograms([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchPrograms()
  }

  const clearFilters = () => {
    setProgramTypeFilter('')
    setStageFilter('')
    setSectorFilter('')
    setSearchTerm('')
    setOrganizationFilter('')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Programs</h1>
          
          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  Clear
                </button>
              </div>
              
              {/* Program Type Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Program Type
                </label>
                <select
                  value={programTypeFilter}
                  onChange={(e) => setProgramTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Types</option>
                  {programTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Stage Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Stage
                </label>
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Stages</option>
                  {stages.map((stage) => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>

              {/* Sector Filter */}
              {/* Organization Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Organization
                </label>
                <select
                  value={organizationFilter}
                  onChange={(e) => setOrganizationFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Organizations</option>
                  {organizations.map((org) => (
                    <option key={org} value={org}>{org}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sector
                </label>
                <select
                  value={sectorFilter}
                  onChange={(e) => setSectorFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Sectors</option>
                  {sectors.map((sector) => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Programs List */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading programs...</p>
              </div>
            ) : programs.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-4 text-gray-600 dark:text-gray-300">No programs found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {programs.map((program) => {
                  // Check if program has an application_link that's different from Invest WindsorEssex
                  // If so, redirect directly to the original source
                  const isInvestWindsor = program.organization_name?.toLowerCase().includes('invest windsor')
                  const hasOriginalSource = program.application_link && 
                    !program.application_link.includes('investwindsoressex.com')
                  
                  const handleClick = (e) => {
                    if (isInvestWindsor && hasOriginalSource) {
                      e.preventDefault()
                      window.open(program.application_link, '_blank', 'noopener,noreferrer')
                    }
                  }

                  const cardContent = (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {program.title}
                          </h3>
                          {program.is_verified && (
                            <CheckCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" title="Innovation Zone Verified" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-4 w-4" />
                            <span>{program.organization_name || 'Unknown Organization'}</span>
                          </div>
                          {program.program_type && (
                            <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded">
                              {program.program_type}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {program.description}
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                          {program.stage && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{program.stage}</span>
                            </div>
                          )}
                          {program.sector && (
                            <div className="flex items-center gap-1">
                              <span>{program.sector}</span>
                            </div>
                          )}
                          {program.cost && (
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{program.cost}</span>
                            </div>
                          )}
                          {program.duration && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{program.duration}</span>
                            </div>
                          )}
                          {program.application_deadline && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>Deadline: {formatDate(program.application_deadline)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="h-5 w-5 text-gray-400 flex-shrink-0 ml-4" />
                    </div>
                  )

                  return (
                    <div
                      key={program.id}
                      onClick={isInvestWindsor && hasOriginalSource ? handleClick : undefined}
                      className={`block bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow p-6 ${
                        isInvestWindsor && hasOriginalSource ? 'cursor-pointer' : ''
                      }`}
                    >
                      {isInvestWindsor && hasOriginalSource ? (
                        cardContent
                      ) : (
                        <Link href={`/programs/${program.id}`} className="block w-full">
                          {cardContent}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

