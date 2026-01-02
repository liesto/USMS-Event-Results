"use client"

import { useState, useMemo } from "react"
import { Header } from "./header"
import { TopTimesHero } from "./top-times-hero"
import { TopTimesFilters } from "./top-times-filters"
import { TopTimesTable } from "./top-times-table"
import { topTimesData, strokes, distances, ageGroups, genders } from "@/lib/top-times-data"

export function TopTimesPage() {
  const [course, setCourse] = useState<string>("SCY")
  const [season, setSeason] = useState<string>("2024-2025")
  const [gender, setGender] = useState<string>("M")
  const [stroke, setStroke] = useState<string>("Free")
  const [distance, setDistance] = useState<string>("100")
  const [ageGroup, setAgeGroup] = useState<string>("18-24")
  const [displayTop, setDisplayTop] = useState<string>("100")

  const filteredResults = useMemo(() => {
    const results = topTimesData.filter((r) => {
      const matchesCourse = r.course === course
      const matchesGender = r.gender === gender
      const matchesEvent = r.event === `${distance} ${stroke}`

      let matchesAge = true
      if (ageGroup !== "all") {
        const [min, max] = ageGroup.split("-").map(Number)
        matchesAge = r.age >= min && r.age <= max
      }

      return matchesCourse && matchesGender && matchesEvent && matchesAge
    })

    // Sort by time (fastest first)
    results.sort((a, b) => a.timeSeconds - b.timeSeconds)

    // Limit results
    const limit = Number.parseInt(displayTop)
    return results.slice(0, limit)
  }, [course, gender, stroke, distance, ageGroup, displayTop])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TopTimesHero />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TopTimesFilters
          course={course}
          onCourseChange={setCourse}
          season={season}
          onSeasonChange={setSeason}
          gender={gender}
          onGenderChange={setGender}
          stroke={stroke}
          onStrokeChange={setStroke}
          distance={distance}
          onDistanceChange={setDistance}
          ageGroup={ageGroup}
          onAgeGroupChange={setAgeGroup}
          displayTop={displayTop}
          onDisplayTopChange={setDisplayTop}
          strokes={strokes}
          distances={distances}
          ageGroups={ageGroups}
          genders={genders}
        />

        <TopTimesTable
          results={filteredResults}
          event={`${distance} ${stroke}`}
          course={course}
          ageRange={ageGroup === "all" ? "All Ages" : ageGroup}
          gender={gender === "M" ? "Men" : "Women"}
        />
      </main>
    </div>
  )
}
