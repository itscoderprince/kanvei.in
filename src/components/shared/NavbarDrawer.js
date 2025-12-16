"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"
import {
  X,
  ChevronRight,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Package,
  Home,
  Menu,
  Search,
  Settings,
  Gem,
  PenTool,
  Palette,
  Shirt,
  Smartphone
} from "lucide-react"

export default function NavbarDrawer({ isOpen, onClose }) {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  // Track expanded state for nested menus
  const [expandedCategory, setExpandedCategory] = useState(null)

  const handleLogout = () => {
    logout()
    onClose()
  }

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const menuItems = [
    { label: "Home", href: "/", icon: Home },
    { label: "Shop", href: "/products", icon: ShoppingBag },
    {
      label: "Clothing",
      icon: Shirt,
      children: [
        { label: "All Clothing", href: "/categories/clothing" },
        { label: "Mens Wear", href: "/categories/clothing/mens-wear" },
        { label: "Womens Wear", href: "/categories/clothing/womens-wear" },
        { label: "Kids Wear", href: "/categories/clothing/kids-wear" },
      ]
    },
    { label: "Electronics", href: "/categories/electronics", icon: Smartphone },
    { label: "Jewellery", href: "/categories/jewellery", icon: Gem },
    { label: "Stationery", href: "/categories/stationery", icon: PenTool },
    { label: "Cosmetics", href: "/categories/cosmetics", icon: Palette },
    { label: "About", href: "/about", icon: UserIcon },
    { label: "Contact", href: "/contact", icon: Settings },
  ]

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel - sliding from LEFT */}
      <div
        className="absolute top-0 left-0 h-full w-[280px] sm:w-[320px] bg-[#5A0117]/95 backdrop-blur-xl border-r border-white/10 flex flex-col shadow-2xl overflow-hidden"
        style={{ animation: 'slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
      >
        {/* Subtle Gradient Noise/Texture */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />

        {/* Header Section */}
        <div className="relative flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
          <Link href="/" onClick={onClose} className="flex items-center gap-2 group">
            <span className="text-2xl font-bold text-white tracking-tight" style={{ fontFamily: "Sugar, serif" }}>
              Kanvei
            </span>
          </Link>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto py-4 px-4 space-y-1 scrollbar-hide">
          {menuItems.map((item, index) => {
            const Icon = item.icon
            const isExpanded = expandedCategory === item.label

            return (
              <div key={index} className="overflow-hidden">
                {item.children ? (
                  // Collapsible Menu Item
                  <div className="flex flex-col">
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : item.label)}
                      className={`flex items-center justify-between w-full p-3 rounded-lg transition-all duration-200 group ${isExpanded ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5 hover:text-white'}`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-medium tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.label}</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Nested Items */}
                    <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="pl-11 pr-2 space-y-1 pb-2">
                          {item.children.map((child, cIdx) => (
                            <Link
                              key={cIdx}
                              href={child.href}
                              onClick={onClose}
                              className="block py-2 text-sm text-white/60 hover:text-[#DBCCB7] hover:translate-x-1 transition-all duration-200 border-l border-white/10 pl-3 hover:border-[#DBCCB7]"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Standard Link
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 p-3 rounded-lg text-white/80 hover:bg-white/5 hover:text-white transition-all duration-200 group"
                  >
                    <Icon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-medium tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>{item.label}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer / User Profile Section */}
        <div className="mt-auto border-t border-white/10 bg-black/10 p-6 pb-10 shrink-0">
          {isAuthenticated ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 px-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#DBCCB7] to-[#BFA588] flex items-center justify-center text-[#5A0117] font-bold text-sm shadow-md">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate" style={{ fontFamily: "Montserrat, sans-serif" }}>{user?.name}</p>
                  <p className="text-xs text-white/50 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link href="/profile" onClick={onClose} className="flex items-center justify-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 text-xs text-white transition-colors border border-white/5">
                  <UserIcon className="w-3.5 h-3.5" />
                  Profile
                </Link>
                <Link href="/wishlist" onClick={onClose} className="flex items-center justify-center gap-2 p-2 rounded-md bg-white/5 hover:bg-white/10 text-xs text-white transition-colors border border-white/5">
                  <Heart className="w-3.5 h-3.5" />
                  Wishlist
                </Link>
                <button
                  onClick={handleLogout}
                  className="col-span-2 flex items-center justify-center gap-2 p-2 rounded-md bg-[#5A0117] hover:bg-red-900/80 text-xs text-white border border-white/10 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Log Out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center w-full p-2.5 rounded-lg bg-white text-[#5A0117] font-semibold text-sm hover:bg-[#DBCCB7] transition-colors shadow-lg"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Log In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center w-full p-2.5 rounded-lg bg-white/5 text-white font-medium text-sm hover:bg-white/10 border border-white/10 transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Create Account
              </Link>
            </div>
          )}
        </div>

        {/* Animation Styles */}
        <style jsx global>{`
          @keyframes slideInLeft {
            from { transform: translateX(-100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  )
}
