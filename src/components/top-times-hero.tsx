import { Trophy } from "lucide-react"
import { Breadcrumb } from "./breadcrumb"

export function TopTimesHero() {
  return (
    <div>
      <Breadcrumb
        items={[{ label: "Home", href: "/" }, { label: "Events & Results", href: "#" }, { label: "Top Times" }]}
      />

      <div className="bg-gradient-to-br from-primary via-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-primary-foreground" />
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary-foreground">
                  Top Times Rankings
                </h1>
              </div>
              <p className="text-primary-foreground/80 max-w-2xl">
                Search the all-time rankings for any event and age group across all three pool courses. Select your
                criteria below to view the fastest times recorded.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">500K+</div>
                <div className="text-xs md:text-sm text-primary-foreground/70">Recorded Times</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">15K+</div>
                <div className="text-xs md:text-sm text-primary-foreground/70">Meets</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-foreground">100+</div>
                <div className="text-xs md:text-sm text-primary-foreground/70">Age Groups</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
