import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { isValidElement } from "react"

export default function StatsCard({ title, value, icon: Icon, color = "#5A0117", href, trend }) {
  const CardContent = () => (
    <div className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {title}
          </p>
          <h3 className="text-3xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#1F2937" }}>
            {value}
          </h3>
          {trend && (
            <p className={`text-xs mt-2 font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div
          className="p-3 rounded-xl bg-opacity-10 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {isValidElement(Icon) ? (
            Icon
          ) : (typeof Icon === 'string' || typeof Icon === 'number') ? (
            Icon
          ) : Icon ? (
            <Icon size={24} />
          ) : null}
        </div>
      </div>

      {/* Decorative circle */}
      <div
        className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full opacity-5 pointer-events-none"
        style={{ backgroundColor: color }}
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="block group">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 h-full relative overflow-hidden">
          <CardContent />
          <div className="mt-4 flex items-center text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0" style={{ color: color }}>
            View Details <ArrowRight size={14} className="ml-1" />
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <CardContent />
    </div>
  )
}
