import { Search, User, Menu, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const navItems = [
    { label: "Training", href: "#" },
    { label: "Events", href: "#", active: true },
    { label: "Club Finder", href: "#" },
    { label: "Workout Library", href: "#" },
    { label: "About Us", href: "#" },
  ]

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <svg className="w-12 h-12" viewBox="0 0 180 60" fill="none">
              {/* Swimmer icon with waves */}
              <path
                d="M30 15C35 12 40 11 45 13C50 15 52 20 50 25C48 30 43 32 38 30"
                stroke="#0066B2"
                strokeWidth="2.5"
                fill="#0066B2"
              />
              <path d="M15 28C20 26 25 26 30 28C35 30 40 32 45 32" stroke="#0066B2" strokeWidth="2" fill="none" />
              <path d="M15 35C20 33 25 33 30 35C35 37 40 39 45 39" stroke="#0066B2" strokeWidth="2" fill="none" />
              <path d="M15 42C20 40 25 40 30 42C35 44 40 46 45 46" stroke="#0066B2" strokeWidth="2" fill="none" />
              <ellipse cx="45" cy="20" rx="3" ry="2.5" fill="#0066B2" />
            </svg>
            <div className="hidden sm:block">
              <div className="text-xl font-bold leading-tight text-[#C8102E] tracking-tight">U.S. MASTERS</div>
              <div className="text-sm font-bold tracking-[0.15em] text-[#0066B2] -mt-0.5">SWIMMING</div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-1 ${
                  item.active ? "text-[#0066B2]" : "text-gray-700 hover:text-[#0066B2]"
                }`}
              >
                {(item.label === "Training" || item.label === "Events" || item.label === "About Us") && (
                  <ChevronRight className="h-4 w-4 rotate-90" />
                )}
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button size="sm" className="hidden sm:flex bg-[#0066B2] hover:bg-[#004c8c] text-white font-semibold px-6">
              Join
            </Button>
            <Button variant="ghost" size="icon" className="text-[#0066B2] hover:bg-gray-100">
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
            <div className="flex flex-col items-center">
              <Button variant="ghost" size="icon" className="text-[#0066B2] hover:bg-gray-100 h-8 w-8">
                <User className="h-5 w-5" />
                <span className="sr-only">Log In</span>
              </Button>
              <span className="text-[10px] text-[#0066B2] font-medium -mt-1">LOG IN</span>
            </div>
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-[#0066B2] hover:bg-gray-100">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <nav className="flex flex-col gap-2 mt-8">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        item.active ? "bg-blue-50 text-[#0066B2]" : "hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </a>
                  ))}
                  <Button className="mt-4 w-full bg-[#0066B2] hover:bg-[#004c8c]">Join USMS</Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
