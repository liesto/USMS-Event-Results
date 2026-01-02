"use client"

import { Search, X, LayoutGrid, List } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface FiltersBarProps {
  searchQuery: string
  onSearchChange: (value: string) => void
  selectedAgeGroup: string
  onAgeGroupChange: (value: string) => void
  selectedEvent: string
  onEventChange: (value: string) => void
  selectedCourse: string
  onCourseChange: (value: string) => void
  sortOrder: "newest" | "oldest" | "fastest"
  onSortChange: (value: "newest" | "oldest" | "fastest") => void
  viewMode: "all" | "grouped"
  onViewModeChange: (value: "all" | "grouped") => void
  ageGroups: string[]
  events: string[]
  resultCount: number
}

export function FiltersBar({
  searchQuery,
  onSearchChange,
  selectedAgeGroup,
  onAgeGroupChange,
  selectedEvent,
  onEventChange,
  selectedCourse,
  onCourseChange,
  sortOrder,
  onSortChange,
  viewMode,
  onViewModeChange,
  ageGroups,
  events,
  resultCount,
}: FiltersBarProps) {
  const hasActiveFilters =
    searchQuery || selectedAgeGroup !== "all" || selectedEvent !== "all" || selectedCourse !== "all"

  const clearFilters = () => {
    onSearchChange("")
    onAgeGroupChange("all")
    onEventChange("all")
    onCourseChange("all")
  }

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search meets, events, or clubs..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={selectedCourse} onValueChange={onCourseChange}>
            <SelectTrigger className="w-[130px] bg-card">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              <SelectItem value="SCY">SCY</SelectItem>
              <SelectItem value="SCM">SCM</SelectItem>
              <SelectItem value="LCM">LCM</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAgeGroup} onValueChange={onAgeGroupChange}>
            <SelectTrigger className="w-[140px] bg-card">
              <SelectValue placeholder="Age Group" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Age Groups</SelectItem>
              {ageGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedEvent} onValueChange={onEventChange}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {events.map((event) => (
                <SelectItem key={event} value={event}>
                  {event}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(v) => onSortChange(v as typeof sortOrder)}>
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="fastest">Fastest Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results count and view toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{resultCount}</span> results
          </p>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-primary hover:text-primary/80 h-auto py-1 px-2"
            >
              Clear filters
            </Button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
          <Button
            variant={viewMode === "all" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("all")}
            className="h-8 px-3"
          >
            <List className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">All Results</span>
          </Button>
          <Button
            variant={viewMode === "grouped" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grouped")}
            className="h-8 px-3"
          >
            <LayoutGrid className="h-4 w-4 mr-1.5" />
            <span className="hidden sm:inline">By Group</span>
          </Button>
        </div>
      </div>

      {/* Active Filter Badges */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              Search: {searchQuery}
              <button onClick={() => onSearchChange("")} className="ml-1 hover:bg-foreground/10 rounded-full p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedCourse !== "all" && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              {selectedCourse}
              <button onClick={() => onCourseChange("all")} className="ml-1 hover:bg-foreground/10 rounded-full p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedAgeGroup !== "all" && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              {selectedAgeGroup}
              <button
                onClick={() => onAgeGroupChange("all")}
                className="ml-1 hover:bg-foreground/10 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {selectedEvent !== "all" && (
            <Badge variant="secondary" className="gap-1.5 pr-1">
              {selectedEvent}
              <button onClick={() => onEventChange("all")} className="ml-1 hover:bg-foreground/10 rounded-full p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
