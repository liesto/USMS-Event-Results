"use client"

import { Filter, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TopTimesFiltersProps {
  course: string
  onCourseChange: (value: string) => void
  season: string
  onSeasonChange: (value: string) => void
  gender: string
  onGenderChange: (value: string) => void
  stroke: string
  onStrokeChange: (value: string) => void
  distance: string
  onDistanceChange: (value: string) => void
  ageGroup: string
  onAgeGroupChange: (value: string) => void
  displayTop: string
  onDisplayTopChange: (value: string) => void
  strokes: string[]
  distances: string[]
  ageGroups: { value: string; label: string }[]
  genders: { value: string; label: string }[]
}

export function TopTimesFilters({
  course,
  onCourseChange,
  season,
  onSeasonChange,
  gender,
  onGenderChange,
  stroke,
  onStrokeChange,
  distance,
  onDistanceChange,
  ageGroup,
  onAgeGroupChange,
  displayTop,
  onDisplayTopChange,
  strokes,
  distances,
  ageGroups,
  genders,
}: TopTimesFiltersProps) {
  const resetFilters = () => {
    onCourseChange("SCY")
    onSeasonChange("2024-2025")
    onGenderChange("M")
    onStrokeChange("Free")
    onDistanceChange("100")
    onAgeGroupChange("18-24")
    onDisplayTopChange("100")
  }

  return (
    <Card className="mb-8">
      <CardContent className="pt-6">
        {/* Course Type Toggle - Most prominent */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-muted-foreground mb-3 block">Pool Course</Label>
          <Tabs value={course} onValueChange={onCourseChange} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3 h-12">
              <TabsTrigger
                value="SCY"
                className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex flex-col items-center">
                  <span>SCY</span>
                  <span className="text-[10px] opacity-70 hidden sm:block">Short Course Yards</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="SCM"
                className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex flex-col items-center">
                  <span>SCM</span>
                  <span className="text-[10px] opacity-70 hidden sm:block">Short Course Meters</span>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="LCM"
                className="text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <div className="flex flex-col items-center">
                  <span>LCM</span>
                  <span className="text-[10px] opacity-70 hidden sm:block">Long Course Meters</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Filter Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
          {/* Season */}
          <div className="space-y-2">
            <Label htmlFor="season" className="text-sm text-muted-foreground">
              Season
            </Label>
            <Select value={season} onValueChange={onSeasonChange}>
              <SelectTrigger id="season">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024-2025">2024-2025</SelectItem>
                <SelectItem value="2023-2024">2023-2024</SelectItem>
                <SelectItem value="2022-2023">2022-2023</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender" className="text-sm text-muted-foreground">
              Gender
            </Label>
            <Select value={gender} onValueChange={onGenderChange}>
              <SelectTrigger id="gender">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {genders.map((g) => (
                  <SelectItem key={g.value} value={g.value}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Stroke */}
          <div className="space-y-2">
            <Label htmlFor="stroke" className="text-sm text-muted-foreground">
              Stroke
            </Label>
            <Select value={stroke} onValueChange={onStrokeChange}>
              <SelectTrigger id="stroke">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {strokes.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Distance */}
          <div className="space-y-2">
            <Label htmlFor="distance" className="text-sm text-muted-foreground">
              Distance
            </Label>
            <Select value={distance} onValueChange={onDistanceChange}>
              <SelectTrigger id="distance">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {distances.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ageGroup" className="text-sm text-muted-foreground">
              Age Group
            </Label>
            <Select value={ageGroup} onValueChange={onAgeGroupChange}>
              <SelectTrigger id="ageGroup">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ageGroups.map((ag) => (
                  <SelectItem key={ag.value} value={ag.value}>
                    {ag.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Display Top */}
          <div className="space-y-2">
            <Label htmlFor="displayTop" className="text-sm text-muted-foreground">
              Display Top
            </Label>
            <Select value={displayTop} onValueChange={onDisplayTopChange}>
              <SelectTrigger id="displayTop">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">Top 25</SelectItem>
                <SelectItem value="50">Top 50</SelectItem>
                <SelectItem value="100">Top 100</SelectItem>
                <SelectItem value="200">Top 200</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset Filters
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>
              Showing <span className="font-semibold text-foreground">{course}</span> ·{" "}
              <span className="font-semibold text-foreground">{gender === "M" ? "Men" : "Women"}</span> ·{" "}
              <span className="font-semibold text-foreground">
                {distance} {stroke}
              </span>
              {ageGroup !== "all" && (
                <>
                  {" "}
                  · <span className="font-semibold text-foreground">{ageGroup}</span>
                </>
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
