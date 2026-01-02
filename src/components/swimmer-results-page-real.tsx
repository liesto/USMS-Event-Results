/**
 * Swimmer Individual Results Page - Connected to Real API
 */

import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Header } from './header'
import { SwimmerHero } from './swimmer-hero'
import { StatsGrid } from './stats-grid'
import { FiltersBar } from './filters-bar'
import { ResultsTable } from './results-table'
import { SwimmerSearch } from './swimmer-search'
import { useIndividualResults } from '@/hooks/use-individual-results'

export function SwimmerResultsPageReal() {
  const [searchParams] = useSearchParams()

  // Support both SwimmerID and name-based searches
  const queryParams = {
    SwimmerID: searchParams.get('SwimmerID') || undefined,
    FirstName: searchParams.get('FirstName') || undefined,
    LastName: searchParams.get('LastName') || undefined,
    MI: searchParams.get('MI') || undefined,
  }

  // Check if we have search params
  const hasSearchParams = queryParams.SwimmerID || (queryParams.FirstName && queryParams.LastName)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all')
  const [selectedEvent, setSelectedEvent] = useState('all')
  const [selectedCourse, setSelectedCourse] = useState('all')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'fastest'>('newest')
  const [viewMode, setViewMode] = useState<'all' | 'grouped'>('all')

  // Fetch data from API
  const { data, isLoading, error } = useIndividualResults(queryParams)

  // Filter and sort results
  const filteredResults = useMemo(() => {
    if (!data?.results) return []

    let results = [...data.results]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (r) =>
          r.MeetTitle.toLowerCase().includes(query) ||
          `${r.Distance} ${r.StrokeShortName}`.toLowerCase().includes(query) ||
          r.TeamAbbr.toLowerCase().includes(query)
      )
    }

    // Age group filter
    if (selectedAgeGroup !== 'all') {
      results = results.filter((r) => r.AgeGroup === selectedAgeGroup)
    }

    // Event filter
    if (selectedEvent !== 'all') {
      results = results.filter((r) => `${r.Distance} ${r.StrokeShortName}` === selectedEvent)
    }

    // Course filter
    if (selectedCourse !== 'all') {
      results = results.filter((r) => r.CourseAbbr === selectedCourse)
    }

    // Sort
    results.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.MeetDate).getTime() - new Date(a.MeetDate).getTime()
      } else if (sortOrder === 'oldest') {
        return new Date(a.MeetDate).getTime() - new Date(b.MeetDate).getTime()
      } else {
        return a.FinalTimeSec - b.FinalTimeSec
      }
    })

    return results
  }, [data?.results, searchQuery, selectedAgeGroup, selectedEvent, selectedCourse, sortOrder])

  // Group results by course and age group
  const groupedResults = useMemo(() => {
    if (viewMode !== 'grouped' || !filteredResults.length) return null

    const groups: Record<string, typeof filteredResults> = {}
    filteredResults.forEach((result) => {
      const key = `${result.CourseAbbr} - ${result.AgeGroup}`
      if (!groups[key]) groups[key] = []
      groups[key].push(result)
    })
    return groups
  }, [filteredResults, viewMode])

  // Extract unique values for filters
  const ageGroups = useMemo(() => {
    if (!data?.results) return []
    return Array.from(new Set(data.results.map((r) => r.AgeGroup))).sort()
  }, [data?.results])

  const events = useMemo(() => {
    if (!data?.results) return []
    return Array.from(new Set(data.results.map((r) => `${r.Distance} ${r.StrokeShortName}`))).sort()
  }, [data?.results])

  // Convert API response to component format
  const swimmer = useMemo(() => {
    if (!data?.swimmer) return null

    return {
      id: data.swimmer.SwimmerID,
      name: data.swimmer.FullName,
      club: data.swimmer.ClubAbbr,
      location: data.swimmer.Location || '',
      memberSince: data.swimmer.MemberSince ? parseInt(data.swimmer.MemberSince) : 0,
    }
  }, [data?.swimmer])

  const stats = useMemo(() => {
    if (!data?.stats) return null

    return {
      totalSwims: data.stats.totalSwims,
      podiumFinishes: data.stats.podiumFinishes,
      firstPlace: data.stats.firstPlace,
      uniqueMeets: data.stats.uniqueMeets,
      bestTime: data.stats.bestTime
        ? {
            event: data.stats.bestTime.event,
            time: data.stats.bestTime.time,
            timeSeconds: data.stats.bestTime.timeSec,
            meet: data.stats.bestTime.meet,
            date: data.stats.bestTime.date,
            course: '',
            ageGroup: '',
            place: 0,
            club: '',
            age: 0,
            heat: 0,
            lane: 0,
          }
        : null,
    }
  }, [data?.stats])

  // Convert API results to component format
  const displayResults = useMemo(() => {
    return filteredResults.map((r) => ({
      event: `${r.Distance} ${r.StrokeShortName}`,
      time: r.FinalTime,
      timeSeconds: r.FinalTimeSec,
      meet: r.MeetTitle,
      date: r.MeetDate,
      course: r.CourseAbbr,
      ageGroup: r.AgeGroup,
      place: r.Place,
      club: r.TeamAbbr,
      age: r.Age,
      heat: r.Heat,
      lane: r.Lane,
    }))
  }, [filteredResults])

  // Show search form if no params provided
  if (!hasSearchParams) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl">
            <h1 className="mb-6 text-3xl font-bold">Individual Meet Results</h1>
            <SwimmerSearch />
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              <p className="mt-4 text-slate-600">Loading swimmer results...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl space-y-4">
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <h3 className="font-semibold text-red-900">Error Loading Results</h3>
              <p className="mt-1 text-sm text-red-700">{error.message}</p>
            </div>
            <SwimmerSearch />
          </div>
        </div>
      </div>
    )
  }

  // No data
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="mx-auto max-w-2xl space-y-4">
            <p className="text-center text-slate-600">No results found</p>
            <SwimmerSearch />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Header />
      <div className="container mx-auto space-y-6 px-4 py-8">
        <div className="flex items-center justify-between">
          <div></div>
          <button
            onClick={() => window.location.href = '/individual-results'}
            className="rounded bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
          >
            Search Another Swimmer
          </button>
        </div>

        {swimmer && stats && (
          <>
            <SwimmerHero swimmer={swimmer} stats={stats} />
            <StatsGrid stats={stats} />
            <FiltersBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedAgeGroup={selectedAgeGroup}
              onAgeGroupChange={setSelectedAgeGroup}
              selectedEvent={selectedEvent}
              onEventChange={setSelectedEvent}
              selectedCourse={selectedCourse}
              onCourseChange={setSelectedCourse}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              ageGroups={ageGroups}
              events={events}
            />
          </>
        )}

        <ResultsTable
          results={displayResults}
          groupedResults={
            groupedResults
              ? Object.entries(groupedResults).reduce(
                  (acc, [key, results]) => {
                    acc[key] = results.map((r) => ({
                      event: `${r.Distance} ${r.StrokeShortName}`,
                      time: r.FinalTime,
                      timeSeconds: r.FinalTimeSec,
                      meet: r.MeetTitle,
                      date: r.MeetDate,
                      course: r.CourseAbbr,
                      ageGroup: r.AgeGroup,
                      place: r.Place,
                      club: r.TeamAbbr,
                      age: r.Age,
                      heat: r.Heat,
                      lane: r.Lane,
                    }))
                    return acc
                  },
                  {} as Record<string, any[]>
                )
              : null
          }
          viewMode={viewMode}
        />
      </div>
    </div>
  )
}
