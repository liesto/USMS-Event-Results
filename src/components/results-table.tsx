import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SwimResult } from "@/lib/swimmer-data"

interface ResultsTableProps {
  results: SwimResult[]
  groupedResults: Record<string, SwimResult[]> | null
  viewMode: "all" | "grouped"
}

function PlaceBadge({ place }: { place: number }) {
  if (place === 1) {
    return <Badge className="bg-gold/20 text-gold border-gold/30 hover:bg-gold/30 font-semibold">🥇 1st</Badge>
  }
  if (place === 2) {
    return <Badge className="bg-silver/20 text-silver border-silver/30 hover:bg-silver/30 font-semibold">🥈 2nd</Badge>
  }
  if (place === 3) {
    return <Badge className="bg-bronze/20 text-bronze border-bronze/30 hover:bg-bronze/30 font-semibold">🥉 3rd</Badge>
  }
  return <span className="text-muted-foreground text-sm font-medium">{place}</span>
}

function ResultRow({ result }: { result: SwimResult }) {
  const formattedDate = new Date(result.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <tr className="border-b border-border/50 hover:bg-muted/50 transition-colors">
      <td className="py-4 px-4">
        <span className="text-sm text-muted-foreground">{formattedDate}</span>
      </td>
      <td className="py-4 px-4">
        <a href="#" className="text-primary hover:underline font-medium">
          {result.meet}
        </a>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-foreground">{result.age}</span>
      </td>
      <td className="py-4 px-4">
        <Badge variant="outline" className="font-mono text-xs">
          {result.club}
        </Badge>
      </td>
      <td className="py-4 px-4">
        <span className="font-medium text-foreground">{result.event}</span>
      </td>
      <td className="py-4 px-4">
        <span className="text-sm text-muted-foreground font-mono">
          H{result.heat} / L{result.lane}
        </span>
      </td>
      <td className="py-4 px-4">
        <span className="font-mono font-semibold text-foreground">{result.time}</span>
      </td>
      <td className="py-4 px-4">
        <PlaceBadge place={result.place} />
      </td>
    </tr>
  )
}

function MobileResultCard({ result }: { result: SwimResult }) {
  const formattedDate = new Date(result.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="bg-card rounded-xl p-4 border border-border/50 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <a href="#" className="text-primary hover:underline font-semibold">
            {result.meet}
          </a>
          <p className="text-sm text-muted-foreground mt-0.5">{formattedDate}</p>
        </div>
        <PlaceBadge place={result.place} />
      </div>
      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold text-lg text-foreground">{result.event}</span>
        <Badge variant="outline" className="font-mono text-xs">
          {result.club}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4 text-muted-foreground">
          <span>Age {result.age}</span>
          <span>
            H{result.heat}/L{result.lane}
          </span>
        </div>
        <span className="font-mono font-bold text-lg text-foreground">{result.time}</span>
      </div>
    </div>
  )
}

function ResultsSection({
  title,
  results,
}: {
  title?: string
  results: SwimResult[]
}) {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      {title && (
        <CardHeader className="bg-muted/50 border-b border-border/50 py-4">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent className="p-0">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Meet</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Age</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Club</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Event</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Heat/Lane</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Time</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Place</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <ResultRow key={`${result.meet}-${result.event}-${idx}`} result={result} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden p-4 space-y-3">
          {results.map((result, idx) => (
            <MobileResultCard key={`${result.meet}-${result.event}-${idx}`} result={result} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function ResultsTable({ results, groupedResults, viewMode }: ResultsTableProps) {
  if (results.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="py-16 text-center">
          <div className="text-muted-foreground">
            <p className="text-lg font-medium">No results found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (viewMode === "grouped" && groupedResults) {
    return (
      <div className="space-y-6">
        {Object.entries(groupedResults).map(([groupName, groupResults]) => (
          <ResultsSection
            key={groupName}
            title={`${groupName} (${groupResults.length} results)`}
            results={groupResults}
          />
        ))}
      </div>
    )
  }

  return <ResultsSection results={results} />
}
