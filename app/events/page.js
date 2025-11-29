'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { eventsApi, searchApi } from '@/lib/api'
import { Search, Plus, Minus, Wifi } from 'lucide-react'

export default function EventsPage() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [audienceFilter, setAudienceFilter] = useState('')
  const [categories, setCategories] = useState([])
  const [audiences, setAudiences] = useState([])
  const [expandedFilters, setExpandedFilters] = useState({
    category: true,
    series: false,
    organizers: false,
    virtual: false
  })
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    fetchEvents()
  }, [categoryFilter, audienceFilter])

  // Also fetch events when month changes
  useEffect(() => {
    fetchEvents()
  }, [currentMonth])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      
      // Fetch database events
      let databaseEvents = []
      try {
        const dbResponse = await eventsApi.getAll({
          category: categoryFilter || undefined,
          audience: audienceFilter || undefined,
          search: searchTerm || undefined
        })
        databaseEvents = dbResponse.data || []
        console.log('Database events count:', databaseEvents.length)
      } catch (dbError) {
        console.error('Error fetching database events:', dbError)
      }
      
      // Fetch external events
      let externalEvents = []
      try {
        const response = await eventsApi.getExternal()
        console.log('External events API response:', response.data)
        const externalData = response.data
        externalEvents = externalData?.events || []
        console.log('External events count:', externalEvents.length)
        
        // Check if there's an error message from the API
        if (externalData?.error) {
          console.warn('External API Error:', externalData.error)
        }
      } catch (extError) {
        console.error('Error fetching external events:', extError)
        // Continue even if external API fails
      }
      
      // Combine database and external events
      let allEvents = [...databaseEvents, ...externalEvents]
      console.log('Total events count:', allEvents.length)
      
      // Apply client-side filtering if needed (for external events that weren't filtered server-side)
      if (categoryFilter && !categoryFilter.includes(',')) {
        allEvents = allEvents.filter(event => 
          event.category && event.category.toLowerCase().includes(categoryFilter.toLowerCase())
        )
      }
      
      if (audienceFilter) {
        allEvents = allEvents.filter(event => 
          event.audience && event.audience.toLowerCase().includes(audienceFilter.toLowerCase())
        )
      }
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        allEvents = allEvents.filter(event => 
          event.title?.toLowerCase().includes(searchLower) ||
          event.description?.toLowerCase().includes(searchLower) ||
          event.location?.toLowerCase().includes(searchLower)
        )
      }
      
      setEvents(allEvents)
      
      // Extract unique categories and audiences from all events (before filtering)
      const uniqueCategories = [...new Set(allEvents.map(e => e.category).filter(Boolean))]
      const uniqueAudiences = [...new Set(allEvents.flatMap(e => e.audience?.split(', ') || []).filter(Boolean))]
      setCategories(uniqueCategories)
      setAudiences(uniqueAudiences)

      // Log search if it was a search query
      if (searchTerm) {
        try {
          await searchApi.log({ 
            query: searchTerm, 
            results_count: allEvents.length 
          })
        } catch (logError) {
          console.error('Error logging search:', logError)
        }
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      // Try to at least show database events if external fails
      try {
        const dbResponse = await eventsApi.getAll()
        setEvents(dbResponse.data || [])
      } catch (dbError) {
        console.error('Error fetching database events as fallback:', dbError)
        setEvents([])
      }
      // Log failed search
      if (searchTerm) {
        try {
          await searchApi.log({ query: searchTerm, results_count: 0 })
        } catch (logError) {
          console.error('Error logging search:', logError)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchEvents()
  }

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    }).toLowerCase()
  }

  const formatDateNumber = (date) => {
    return date.getDate()
  }

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped = {}
    console.log('Grouping events by date. Total events:', events.length)
    events.forEach(event => {
      try {
        // Handle both ISO format (2025-11-12T16:30:00) and date format (2025-11-12)
        let eventDate
        if (event.start_date) {
          // Parse the date string - handle ISO format with or without timezone
          const dateStr = event.start_date
          // If it's in format "2025-11-12T16:30:00", parse it
          eventDate = new Date(dateStr)
          
          // Check if date is valid
          if (isNaN(eventDate.getTime())) {
            console.warn('Invalid date for event:', event.id, event.start_date)
            return
          }
        } else {
          console.warn('Missing start_date for event:', event.id)
          return
        }
        
        // Use local date (YYYY-MM-DD) for grouping, not UTC
        // This ensures events appear on the correct day regardless of timezone
        const year = eventDate.getFullYear()
        const month = String(eventDate.getMonth() + 1).padStart(2, '0')
        const day = String(eventDate.getDate()).padStart(2, '0')
        const dateKey = `${year}-${month}-${day}`
        
        if (!grouped[dateKey]) {
          grouped[dateKey] = []
        }
        grouped[dateKey].push(event)
      } catch (error) {
        console.error('Error processing event date:', event.id, error, event)
      }
    })
    console.log('Events grouped by date:', Object.keys(grouped).length, 'dates')
    console.log('Date keys:', Object.keys(grouped).slice(0, 10))
    return grouped
  }, [events])

  // Get calendar weeks for the current month
  const getCalendarWeeks = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    // First day of the month
    const firstDay = new Date(year, month, 1)
    const firstDayOfWeek = firstDay.getDay() // 0 = Sunday
    
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0)
    const lastDate = lastDay.getDate()
    
    // Build calendar grid
    const weeks = []
    let currentWeek = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      const prevMonthDate = new Date(year, month, 0 - (firstDayOfWeek - i - 1))
      currentWeek.push(prevMonthDate)
    }
    
    // Add days of the month
    for (let date = 1; date <= lastDate; date++) {
      const currentDate = new Date(year, month, date)
      currentWeek.push(currentDate)
      
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek])
        currentWeek = []
      }
    }
    
    // Add remaining days from next month to complete the last week
    if (currentWeek.length > 0) {
      const remainingDays = 7 - currentWeek.length
      for (let i = 1; i <= remainingDays; i++) {
        const nextMonthDate = new Date(year, month + 1, i)
        currentWeek.push(nextMonthDate)
      }
      weeks.push(currentWeek)
    }
    
    return weeks
  }

  const calendarWeeks = useMemo(() => getCalendarWeeks(), [currentMonth])

  const getEventsForDate = (date) => {
    // Use local date (YYYY-MM-DD) for matching, not UTC
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const dateKey = `${year}-${month}-${day}`
    const dayEvents = eventsByDate[dateKey] || []
    
    // Debug logging for today's date
    if (isToday(date) && dayEvents.length > 0) {
      console.log(`Found ${dayEvents.length} events for today (${dateKey}):`, dayEvents.map(e => e.title))
    }
    
    return dayEvents
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth() && 
           date.getFullYear() === currentMonth.getFullYear()
  }

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }))
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Events</h1>
          
          {/* Search Bar */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search events..."
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
          {/* Left Sidebar - Filters */}
          <div className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 lg:mb-0">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
              
              {/* Event Category */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('category')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  <span>Event Category</span>
                  {expandedFilters.category ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
                {expandedFilters.category && (
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <label key={cat} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={categoryFilter === cat}
                          onChange={(e) => setCategoryFilter(e.target.checked ? cat : '')}
                          className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600"
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-300">{cat}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Series */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('series')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
                >
                  <span>Series</span>
                  {expandedFilters.series ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Organizers */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('organizers')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
                >
                  <span>Organizers</span>
                  {expandedFilters.organizers ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              </div>

              {/* Virtual Events */}
              <div className="mb-4">
                <button
                  onClick={() => toggleFilter('virtual')}
                  className="flex items-center justify-between w-full text-left font-medium text-gray-700 mb-2"
                >
                  <span>Virtual Events</span>
                  {expandedFilters.virtual ? (
                    <Minus className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Section - Calendar View */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-300">Loading events...</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                {/* Calendar Header */}
                <div className="bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={goToPreviousMonth}
                      className="px-2 sm:px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      ←
                    </button>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                      {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h2>
                    <button
                      onClick={goToNextMonth}
                      className="px-2 sm:px-3 py-1 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    >
                      →
                    </button>
                  </div>
                  <button
                    onClick={goToToday}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                  >
                    Today
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="p-2 sm:p-4 overflow-x-auto">
                  {/* Days of Week Header */}
                  <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 mb-2 min-w-[600px]">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                      <div key={day} className="p-1 sm:p-2 text-center text-xs font-semibold text-gray-700 dark:text-gray-300">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar Weeks */}
                  {calendarWeeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700 last:border-b-0 min-w-[600px]">
                      {week.map((date, dayIndex) => {
                        const dayEvents = getEventsForDate(date)
                        const isCurrentMonthDay = isCurrentMonth(date)
                        const isTodayDate = isToday(date)
                        
                        return (
                          <div
                            key={dayIndex}
                            className={`min-h-[120px] sm:min-h-[150px] p-1 sm:p-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 ${
                              !isCurrentMonthDay 
                                ? 'bg-gray-50 dark:bg-gray-900' 
                                : isTodayDate 
                                ? 'bg-blue-50 dark:bg-blue-900/20' 
                                : 'bg-white dark:bg-gray-800'
                            }`}
                          >
                            <div className={`text-xs sm:text-sm font-medium mb-1 sm:mb-2 ${
                              !isCurrentMonthDay 
                                ? 'text-gray-400 dark:text-gray-600' 
                                : isTodayDate 
                                ? 'text-primary-600 dark:text-primary-400 font-semibold' 
                                : 'text-gray-700 dark:text-gray-300'
                            }`}>
                              {formatDateNumber(date)}
                            </div>
                            <div className="space-y-1 sm:space-y-1.5">
                              {dayEvents.slice(0, 3).map((event, eventIndex) => {
                                // Different colors for variety
                                const colors = [
                                  'bg-gradient-to-r from-purple-500 to-purple-600',
                                  'bg-gradient-to-r from-blue-500 to-blue-600',
                                  'bg-gradient-to-r from-green-500 to-green-600',
                                  'bg-gradient-to-r from-orange-500 to-orange-600'
                                ]
                                const colorClass = colors[eventIndex % colors.length] || 'bg-gradient-to-r from-primary-500 to-primary-600'
                                
                                // All events should link to original source (external URL)
                                const eventUrl = event.external_url || event.link || '#'
                                
                                const eventContent = (
                                  <>
                                    <div className="text-[9px] sm:text-[10px] font-medium mb-0.5 opacity-90">
                                      {formatTime(event.start_date)}
                                      {event.end_date && event.end_date !== event.start_date && (
                                        <span className="hidden sm:inline"> - {formatTime(event.end_date)}</span>
                                      )}
                                    </div>
                                    <div className="text-[9px] sm:text-[10px] font-semibold line-clamp-2 leading-tight group-hover:underline">
                                      {event.title}
                                    </div>
                                    {(event.link || event.external_url) && (
                                      <div className="flex items-center justify-end mt-0.5">
                                        <Wifi className="h-2 sm:h-2.5 w-2 sm:w-2.5 opacity-75" />
                                      </div>
                                    )}
                                  </>
                                )
                                
                                // Always use external link, open in new tab
                                return (
                                  <a
                                    key={event.id}
                                    href={eventUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`block p-1 sm:p-1.5 rounded text-white hover:opacity-90 transition-all cursor-pointer group shadow-sm ${colorClass}`}
                                  >
                                    {eventContent}
                                  </a>
                                )
                              })}
                              {dayEvents.length > 3 && (
                                <Link
                                  href={`/events?date=${date.toISOString().split('T')[0]}`}
                                  className="text-[9px] sm:text-[10px] text-primary-600 hover:text-primary-700 font-medium block mt-1"
                                >
                                  + {dayEvents.length - 3} More
                                </Link>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
