"use client"

import { useState, useMemo } from "react"
import { Header } from "./header"
import { SwimmerHero } from "./swimmer-hero"
import { StatsGrid } from "./stats-grid"
import { FiltersBar } from "./filters-bar"
import { ResultsTable } from "./results-table"
import { swimmerData, swimResults } from "@/lib/swimmer-data"

export function SwimmerResultsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all")
  const [selectedEvent, setSelectedEvent] = useState("all")
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest" | "fastest">("newest")
  const [viewMode, setViewMode] = useState<"all" | "grouped">("all")

  const filteredResults = useMemo(() => {
    let results = [...swimResults]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      results = results.filter(
        (r) =>
          r.meet.toLowerCase().includes(query) ||
          r.event.toLowerCase().includes(query) ||
          r.club.toLowerCase().includes(query),
      )
    }

    if (selectedAgeGroup !== "all") {
      results = results.filter((r) => r.ageGroup === selectedAgeGroup)
    }

    if (selectedEvent !== "all") {
      results = results.filter((r) => r.event === selectedEvent)
    }

    if (selectedCourse !== "all") {
      results = results.filter((r) => r.course === selectedCourse)
    }

    results.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else if (sortOrder === "oldest") {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      } else {
        return a.timeSeconds - b.timeSeconds
      }
    })

    return results
  }, [searchQuery, selectedAgeGroup, selectedEvent, selectedCourse, sortOrder])

  const groupedResults = useMemo(() => {
    if (viewMode !== "grouped") return null
    const groups: Record<string, typeof swimResults> = {}
    filteredResults.forEach((result) => {
      const key = `${result.course} - ${result.ageGroup}`
      if (!groups[key]) groups[key] = []
      groups[key].push(result)
    })
    return groups
  }, [filteredResults, viewMode])

  const stats = useMemo(() => {
    const totalSwims = swimResults.length
    const podiumFinishes = swimResults.filter((r) => r.place <= 3).length
    const firstPlace = swimResults.filter((r) => r.place === 1).length
    const uniqueMeets = new Set(swimResults.map((r) => r.meet)).size
    const bestTime = swimResults.reduce((best, r) => {
      if (!best || r.timeSeconds < best.timeSeconds) return r
      return best
    }, swimResults[0])
    return { totalSwims, podiumFinishes, firstPlace, uniqueMeets, bestTime }
  }, [])

  const ageGroups = useMemo(() => {
    const groups = new Set(swimResults.map((r) => r.ageGroup))
    return Array.from(groups).sort()
  }, [])

  const events = useMemo(() => {
    const eventSet = new Set(swimResults.map((r) => r.event))
    return Array.from(eventSet).sort()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <SwimmerHero swimmer={swimmerData} stats={stats} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          resultCount={filteredResults.length}
        />
        <ResultsTable results={filteredResults} groupedResults={groupedResults} viewMode={viewMode} />
      </main>
    </div>
  )
}
