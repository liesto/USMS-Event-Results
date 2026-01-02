import type { SwimmerData, SwimStats } from "@/lib/swimmer-data"
import { Breadcrumb } from "./breadcrumb"

interface SwimmerHeroProps {
  swimmer: SwimmerData
  stats: SwimStats
}

export function SwimmerHero({ swimmer, stats }: SwimmerHeroProps) {
  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Events & Results", href: "#" },
          { label: "Event Results Database", href: "#" },
          { label: "Individual Results" },
        ]}
      />

      <div className="bg-gradient-to-br from-primary via-primary to-secondary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          {/* Swimmer Info */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-balance">{swimmer.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-3 text-primary-foreground/80">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-sm font-medium">
                  {swimmer.club}
                </span>
                <span className="text-sm">{swimmer.location}</span>
                <span className="hidden sm:inline text-primary-foreground/50">•</span>
                <span className="text-sm">Member since {swimmer.memberSince}</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-6 lg:gap-8">
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold">{stats.totalSwims}</div>
                <div className="text-xs lg:text-sm text-primary-foreground/70 mt-1">Recorded Swims</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold">{stats.firstPlace}</div>
                <div className="text-xs lg:text-sm text-primary-foreground/70 mt-1">First Places</div>
              </div>
              <div className="text-center">
                <div className="text-3xl lg:text-4xl font-bold">{stats.uniqueMeets}</div>
                <div className="text-xs lg:text-sm text-primary-foreground/70 mt-1">Meets</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
