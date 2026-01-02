"use client"

import { Trophy, Medal, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { TopTimeResult } from "@/lib/top-times-data"

interface TopTimesTableProps {
  results: TopTimeResult[]
  event: string
  course: string
  ageRange: string
  gender: string
}

export function TopTimesTable({ results, event, course, ageRange, gender }: TopTimesTableProps) {
  const courseLabel = {
    SCY: "Short Course Yards",
    SCM: "Short Course Meters",
    LCM: "Long Course Meters",
  }[course]

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-16 text-center">
          <div className="text-muted-foreground">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm">Try adjusting your filter criteria</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="border-b bg-muted/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              {event} Rankings
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {courseLabel} · {gender} · Ages {ageRange}
            </p>
          </div>
          <Badge variant="secondary" className="w-fit">
            {results.length} swimmers
          </Badge>
        </div>
      </CardHeader>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50 text-sm">
              <th className="text-left py-3 px-4 font-semibold w-16">Rank</th>
              <th className="text-left py-3 px-4 font-semibold">Swimmer</th>
              <th className="text-left py-3 px-4 font-semibold">Age</th>
              <th className="text-left py-3 px-4 font-semibold">Club</th>
              <th className="text-left py-3 px-4 font-semibold">LMSC</th>
              <th className="text-left py-3 px-4 font-semibold">Time</th>
              <th className="text-left py-3 px-4 font-semibold">Date</th>
              <th className="text-left py-3 px-4 font-semibold">Meet</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr
                key={`${result.swimmerId}-${result.timeFormatted}-${index}`}
                className={`border-b hover:bg-muted/30 transition-colors ${
                  index < 3 ? "bg-gradient-to-r from-transparent" : ""
                } ${index === 0 ? "to-gold/5" : index === 1 ? "to-silver/5" : index === 2 ? "to-bronze/5" : ""}`}
              >
                <td className="py-3 px-4">
                  <RankBadge rank={index + 1} />
                </td>
                <td className="py-3 px-4">
                  <a href="#" className="font-medium text-primary hover:underline">
                    {result.swimmerName}
                  </a>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{result.age}</td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className="font-mono text-xs">
                    {result.club}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{result.lmsc}</td>
                <td className="py-3 px-4">
                  <span className="font-mono font-semibold">{result.timeFormatted}</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">{result.date}</td>
                <td className="py-3 px-4">
                  <a href="#" className="text-sm text-primary hover:underline flex items-center gap-1">
                    {result.meet}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <CardContent className="md:hidden p-4 space-y-3">
        {results.map((result, index) => (
          <div
            key={`${result.swimmerId}-${result.timeFormatted}-${index}`}
            className={`p-4 rounded-lg border ${
              index < 3 ? "bg-gradient-to-r from-transparent" : "bg-card"
            } ${index === 0 ? "to-gold/10 border-gold/30" : index === 1 ? "to-silver/10 border-silver/30" : index === 2 ? "to-bronze/10 border-bronze/30" : ""}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <RankBadge rank={index + 1} />
                <div>
                  <a href="#" className="font-semibold text-primary hover:underline">
                    {result.swimmerName}
                  </a>
                  <div className="text-sm text-muted-foreground">
                    Age {result.age} · {result.lmsc}
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                {result.club}
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-mono text-xl font-bold">{result.timeFormatted}</div>
                <div className="text-xs text-muted-foreground">{result.date}</div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs" asChild>
                <a href="#">
                  {result.meet}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gold/20 text-gold">
        <Medal className="h-5 w-5" />
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-silver/20 text-silver">
        <Medal className="h-5 w-5" />
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-bronze/20 text-bronze">
        <Medal className="h-5 w-5" />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-muted-foreground font-semibold text-sm">
      {rank}
    </div>
  )
}
