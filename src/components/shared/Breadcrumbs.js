"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

export default function Breadcrumbs() {
    const pathname = usePathname()

    // Remove query strings and trailing slashes
    const pathWithoutQuery = pathname.split('?')[0]
    const pathSegments = pathWithoutQuery.split('/').filter(segment => segment !== '')

    // Generate breadcrumb items
    const breadcrumbs = pathSegments.map((segment, index) => {
        // Build path for this segment
        const href = `/${pathSegments.slice(0, index + 1).join('/')}`

        // Format label (capitalize, remove hyphens)
        const label = segment
            .replace(/-/g, ' ')
            .replace(/%20/g, ' ')
            .replace(/\b\w/g, c => c.toUpperCase())

        return { label, href }
    })

    // Don't render on home page (though this component shouldn't be there anyway)
    if (pathSegments.length === 0) return null

    return (
        <div className="bg-[#FDF8F3] border-b border-[#DBCCB7]/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <nav className="flex" aria-label="Breadcrumb">
                    <ol className="flex items-center space-x-2">
                        <li>
                            <div>
                                <Link href="/" className="text-gray-400 hover:text-[#5A0117] transition-colors">
                                    <Home className="h-4 w-4" aria-hidden="true" />
                                    <span className="sr-only">Home</span>
                                </Link>
                            </div>
                        </li>

                        {breadcrumbs.map((crumb, index) => {
                            const isLast = index === breadcrumbs.length - 1

                            return (
                                <li key={crumb.href}>
                                    <div className="flex items-center">
                                        <ChevronRight className="h-4 w-4 text-gray-300 flex-shrink-0" aria-hidden="true" />
                                        {isLast ? (
                                            <span
                                                className="ml-2 text-xs md:text-sm font-medium text-[#5A0117]"
                                                aria-current="page"
                                                style={{ fontFamily: "Montserrat, sans-serif" }}
                                            >
                                                {crumb.label}
                                            </span>
                                        ) : (
                                            <Link
                                                href={crumb.href}
                                                className="ml-2 text-xs md:text-sm font-medium text-gray-500 hover:text-[#5A0117] transition-colors"
                                                style={{ fontFamily: "Montserrat, sans-serif" }}
                                            >
                                                {crumb.label}
                                            </Link>
                                        )}
                                    </div>
                                </li>
                            )
                        })}
                    </ol>
                </nav>
            </div>
        </div>
    )
}
