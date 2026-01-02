import { ChevronRight } from "lucide-react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 text-sm">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="h-4 w-4 text-white/60" />}
              {item.href ? (
                <a href={item.href} className="hover:underline transition-colors">
                  {item.label}
                </a>
              ) : (
                <span className="text-white/90">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  )
}
