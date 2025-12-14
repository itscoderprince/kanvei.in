"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { X, ArrowRight, User as UserIcon, LogOut, LayoutDashboard, ShoppingBag, Heart, Package } from "lucide-react"

export default function NavbarDrawer({ isOpen, onClose }) {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState(null)

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
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/products" },
    {
      label: "Collections",
      children: [
        { label: "Clothing", href: "/categories/clothing" },
        { label: "Jewellery", href: "/categories/jewellery" },
        { label: "Stationery", href: "/categories/stationery" },
        { label: "Cosmetics", href: "/categories/cosmetics" },
        { label: "Electronics", href: "/categories/electronics" },
      ]
    },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <div className="fixed inset-0 z-[100]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div
        className="absolute top-0 right-0 h-full w-full sm:w-[500px] bg-[#5A0117] flex flex-col shadow-2xl transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ animation: 'slideIn 0.5s cubic-bezier(0.32,0.72,0,1) forwards' }}
      >
        {/* Decorative Background Element */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8C6141] opacity-10 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#DBCCB7] opacity-5 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col h-full overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-white/10">
            <span className="text-white text-3xl font-bold tracking-tight" style={{ fontFamily: "Sugar, serif" }}>
              Menu
            </span>
            <button
              onClick={onClose}
              className="group p-2 rounded-full border border-white/20 hover:bg-white hover:text-[#5A0117] text-white transition-all duration-300"
            >
              <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
            </button>
          </div>

          {/* Main Navigation */}
          <div className="flex-1 overflow-y-auto px-8 py-8 space-y-2">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className="group border-b border-white/5 last:border-0 pb-2"
                style={{
                  animation: `fadeInUp 0.5s ease-out forwards ${index * 0.1}s`,
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
              >
                {item.children ? (
                  <div className="space-y-4 py-4">
                    <div className="text-[#DBCCB7] text-sm font-bold tracking-[0.2em] uppercase mb-4" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {item.label}
                    </div>
                    <div className="grid grid-cols-1 gap-1 pl-4 border-l border-white/10">
                      {item.children.map((child, childIndex) => (
                        <Link
                          key={childIndex}
                          href={child.href}
                          onClick={onClose}
                          className="text-2xl text-white/70 hover:text-white hover:translate-x-2 transition-all duration-300 py-1 block"
                          style={{ fontFamily: "Sugar, serif" }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-4 text-4xl sm:text-5xl text-white font-bold hover:text-[#DBCCB7] transition-colors duration-300 group-hover:pl-4 transition-all"
                    style={{ fontFamily: "Sugar, serif" }}
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-6 h-6 opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Footer / User Section */}
          <div className="bg-black/20 backdrop-blur-md border-t border-white/10 p-8">
            {isAuthenticated ? (
              <div className="space-y-6 animate-in slide-in-from-bottom duration-500 delay-300 fill-mode-forwards">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#DBCCB7] flex items-center justify-center text-[#5A0117] font-bold text-xl shadow-lg ring-2 ring-white/10">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {user?.name}
                    </h4>
                    <p className="text-white/50 text-sm">{user?.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {user?.role === "admin" && (
                    <Link
                      href="/admindashboard"
                      onClick={onClose}
                      className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-all border border-white/5"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="text-sm font-medium">Admin Dashboard</span>
                    </Link>
                  )}
                  <Link href="/profile" onClick={onClose} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/5 hover:border-white/20">
                    <UserIcon className="w-5 h-5" />
                    <span className="text-xs">Profile</span>
                  </Link>
                  <Link href="/orders" onClick={onClose} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/5 hover:border-white/20">
                    <Package className="w-5 h-5" />
                    <span className="text-xs">Orders</span>
                  </Link>
                  <Link href="/wishlist" onClick={onClose} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all border border-white/5 hover:border-white/20">
                    <Heart className="w-5 h-5" />
                    <span className="text-xs">Wishlist</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[#5A0117] hover:bg-red-900 text-white transition-all border border-white/10"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-xs">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 animate-in slide-in-from-bottom duration-500 delay-300">
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-4 bg-white text-[#5A0117] font-bold rounded-xl hover:bg-[#DBCCB7] hover:scale-[1.02] transition-all duration-300 shadow-lg"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Sign In
                </Link>
                <div className="text-center">
                  <span className="text-white/50 text-sm">New to Kanvei? </span>
                  <Link href="/register" onClick={onClose} className="text-[#DBCCB7] font-semibold hover:underline">
                    Create Account
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global Styles for Animations */}
        <style jsx global>{`
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  )
}
