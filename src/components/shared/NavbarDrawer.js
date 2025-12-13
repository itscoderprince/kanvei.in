"use client"
import { useEffect } from "react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"
import { useRouter } from "next/navigation"
import { X, Home, ShoppingBag, ShoppingCart, Mail, User, LogOut, ChevronRight, LayoutDashboard } from "lucide-react"
import SearchBar from "./Search"

export default function NavbarDrawer({ isOpen, onClose }) {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()
  // ... existing logic ...


  const handleLogout = () => {
    logout()
    onClose()
  }

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose()
      }
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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300" onClick={onClose} />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-80 max-w-[90vw] z-50 transform transition-transform duration-300 ease-in-out bg-[#5A0117]/90 backdrop-blur-md ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full text-white">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white border-opacity-20">
            <Link
              href="/"
              className="text-2xl font-bold hover:opacity-80 transition-opacity flex items-center gap-2"
              style={{ fontFamily: "Sugar, serif" }}
              onClick={onClose}
            >
              Kanvei
            </Link>
            <button onClick={onClose} className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search removed as per user request */}

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <nav className="p-6">
              <div className="space-y-6">
                {/* Main Navigation */}
                {/* Top Level Navigation */}
                <div className="space-y-3">
                  <Link
                    href="/"
                    className="flex items-center gap-3 py-2 hover:opacity-80 transition-opacity font-medium"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    onClick={onClose}
                  >
                    <Home className="w-5 h-5" />
                    Home
                  </Link>
                  <Link
                    href="/products"
                    className="flex items-center gap-3 py-2 hover:opacity-80 transition-opacity font-medium"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    onClick={onClose}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Shop
                  </Link>
                </div>

                {/* Categories */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-3 opacity-70 pt-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    CATEGORIES
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/categories/jewellery"
                      className="block py-2 hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={onClose}
                    >
                      Jewellery
                    </Link>
                    <Link
                      href="/categories/stationery"
                      className="block py-2 hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={onClose}
                    >
                      Stationery
                    </Link>
                    <Link
                      href="/categories/cosmetics"
                      className="block py-2 hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={onClose}
                    >
                      Cosmetics
                    </Link>
                    <Link
                      href="/categories/electronics"
                      className="block py-2 hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={onClose}
                    >
                      Electronics
                    </Link>
                  </div>
                </div>

                {/* Clothing Section */}
                <div>
                  <h3
                    className="text-sm font-semibold mb-3 opacity-70"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    CLOTHING
                  </h3>
                  <div className="space-y-3">
                    <Link
                      href="/categories/clothing/mens-wear"
                      className="block py-2 hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={onClose}
                    >
                      Mens Wear
                    </Link>
                    <Link
                      href="/categories/clothing/womens-wear"
                      className="block py-2 hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={onClose}
                    >
                      Womens Wear
                    </Link>
                    <Link
                      href="/categories/clothing/kids-wear"
                      className="block py-2 hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={onClose}
                    >
                      Kids Wear
                    </Link>
                  </div>
                </div>

                {/* Other Links */}
                <div>
                  <Link
                    href="/contact"
                    className="block py-2 hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    onClick={onClose}
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          {/* User Section */}
          <div className="border-t border-white border-opacity-20 p-6">
            {isAuthenticated ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center gap-3 pb-4 border-b border-white border-opacity-20">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                    style={{ backgroundColor: "#8C6141" }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {user?.name}
                    </p>
                    <p className="text-sm opacity-70" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* User Menu */}
                <div className="space-y-3">
                  {user?.role === "admin" && (
                    <Link
                      href="/admindashboard"
                      className="block py-2 hover:opacity-80 transition-opacity"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={onClose}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="block py-2 hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    onClick={onClose}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/orders"
                    className="block py-2 hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    onClick={onClose}
                  >
                    My Orders
                  </Link>
                  <Link
                    href="/cart"
                    className="block py-2 hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    onClick={onClose}
                  >
                    My Cart
                  </Link>
                  <Link
                    href="/wishlist"
                    className="block py-2 hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                    onClick={onClose}
                  >
                    My Wishlist
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left py-2 hover:opacity-80 transition-opacity"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose()
                    router.push(`/login?redirect=${encodeURIComponent('/cart')}`)
                  }}
                  className="block w-full text-center py-3 px-4 rounded-lg border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10 transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  🛒 Cart (Login Required)
                </button>
                <Link
                  href="/login"
                  className="block w-full text-center py-3 px-4 rounded-lg border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10 transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  onClick={onClose}
                >
                  Login
                </Link>
                <button
                  onClick={() => {
                    onClose()
                    router.push(`/login?redirect=${encodeURIComponent('/wishlist')}`)
                  }}
                  className="block w-full text-center py-3 px-4 rounded-lg border border-white border-opacity-30 hover:bg-white hover:bg-opacity-10 transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  ❤️ Wishlist (Login Required)
                </button>
                <Link
                  href="/register"
                  className="block w-full text-center py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                  style={{ backgroundColor: "#8C6141", fontFamily: "Montserrat, sans-serif" }}
                  onClick={onClose}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
