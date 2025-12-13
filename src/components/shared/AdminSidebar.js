"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Ticket,
  FileText,
  Users,
  Home,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react"
import { useAuth } from "../../contexts/AuthContext"

export default function AdminSidebar({ onLinkClick }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const pathname = usePathname()
  const { logout } = useAuth()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const menuItems = [
    { href: "/admindashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admindashboard/products", label: "Products", icon: Package },
    { href: "/admindashboard/categories", label: "Categories", icon: FolderTree },
    { href: "/admindashboard/orders", label: "Orders", icon: ShoppingCart },
    { href: "/admindashboard/coupons", label: "Coupons", icon: Ticket },
    { href: "/admindashboard/users", label: "Users", icon: Users },
    { href: "/admindashboard/blogs", label: "Blogs", icon: FileText },
  ]

  return (
    <div
      className={`${isCollapsed ? "w-20" : "w-64"} transition-all duration-300 h-screen sticky overflow-hidden top-0 flex flex-col shadow-xl z-50`}
      style={{ backgroundColor: "#5A0117" }}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!isCollapsed && (
          <h1 className="text-xl font-bold text-white tracking-wide" style={{ fontFamily: "Sugar, serif" }}>
            Kanvei<span className="text-[#8C6141] ml-2! font-light">Admin</span>
          </h1>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden ${isCollapsed ? 'no-scrollbar' : 'custom-scrollbar'}`}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => {
                if (isMobile && typeof onLinkClick === "function") onLinkClick()
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative ${isActive
                ? "bg-white/10 text-white"
                : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
            >
              <item.icon
                size={22}
                className={`flex-shrink-0 transition-colors ${isActive ? "text-[#D4A373]" : "group-hover:text-[#D4A373]"}`}
              />

              {!isCollapsed && (
                <span className="font-medium text-sm tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  {item.label}
                </span>
              )}

              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-colors group"
        >
          <Home size={20} className="group-hover:text-[#D4A373] transition-colors" />
          {!isCollapsed && (
            <span className="text-sm font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Back to Store
            </span>
          )}
        </Link>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-300/80 hover:text-red-300 hover:bg-red-900/20 transition-colors group"
        >
          <LogOut size={20} />
          {!isCollapsed && (
            <span className="text-sm font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
