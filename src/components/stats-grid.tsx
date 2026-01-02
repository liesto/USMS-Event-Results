import { TrendingUp, Trophy, Medal, Calendar, Timer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { SwimStats } from "@/lib/swimmer-data"

interface StatsGridProps {
  stats: SwimStats
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statCards = [
    {
      label: "Total Swims",
      value: stats.totalSwims,
      subtitle: "Recorded results",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Podium Finishes",
      value: stats.podiumFinishes,
      subtitle: "Top 3 placements",
      icon: Trophy,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      label: "First Place",
      value: stats.firstPlace,
      subtitle: "Gold medals",
      icon: Medal,
      color: "text-gold",
      bgColor: "bg-gold/10",
    },
    {
      label: "Meets Attended",
      value: stats.uniqueMeets,
      subtitle: "Competitions",
      icon: Calendar,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {statCards.map((stat) => (
        <Card key={stat.label} className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <p className="text-2xl lg:text-3xl font-bold mt-1 text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Best Time Highlight */}
      {stats.bestTime && (
        <Card className="col-span-2 lg:col-span-4 border-0 shadow-sm bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Timer className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Personal Best Highlight</p>
                  <p className="text-lg lg:text-xl font-bold text-foreground">
                    {stats.bestTime.event} — {stats.bestTime.time}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Meet:</span>{" "}
                  <span className="font-medium text-foreground">{stats.bestTime.meet}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date:</span>{" "}
                  <span className="font-medium text-foreground">{stats.bestTime.date}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
