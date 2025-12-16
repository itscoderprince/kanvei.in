"use client"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { useAuth } from "../../contexts/AuthContext"
import NavbarDrawer from "./NavbarDrawer"
import SearchBar from "./Search"
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  Heart,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,

  Settings,
  Loader2
} from "lucide-react"
import Drawer from "./Drawer"
import CartContent from "../cart/CartContent"
import WishlistContent from "../wishlist/WishlistContent"
import { useCart } from "../../contexts/CartContext"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isWishlistOpen, setIsWishlistOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)

  const { getCartItemsCount, getCartTotal, loading: cartLoading } = useCart()
  const { data: session, status } = useSession()
  const { user: authUser, isAuthenticated: customAuth, logout: customLogout } = useAuth()
  const router = useRouter()

  const currentUser = session?.user || authUser
  const isAuthenticated = status === "authenticated" || customAuth

  // Scroll Behavior: Sticky Header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleFeatureClick = (e, setOpenState, path) => {
    if (window.innerWidth < 768) {
      e.preventDefault()
      setOpenState(true)
    }
  }

  const handleLogout = async () => {
    try {
      setIsUserMenuOpen(false)
      if (customAuth) await customLogout()
      if (status === "authenticated") await signOut({ redirect: false })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 w-full ${isScrolled ? "bg-[#5A0117] shadow-lg py-2" : "bg-[#5A0117] py-4"
          }`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">

            {/* Left: Mobile Menu & Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsNavDrawerOpen(true)}
                className="md:hidden text-white hover:opacity-80 transition-opacity"
              >
                <Menu className="w-6 h-6" />
              </button>

              <Link href="/" className="flex items-center group relative z-50">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide transition-all group-hover:tracking-wider shadow-sm" style={{ fontFamily: "Sugar, serif" }}>
                  Kanvei
                </h1>
              </Link>
            </div>

            {/* Center: Desktop Navigation */}
            <nav className={`hidden md:flex items-center space-x-8 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
              {[
                { name: 'Home', href: '/' },
                { name: 'Shop', href: '/products' },
                { name: 'Jewellery', href: '/categories/jewellery' },
                { name: 'Stationery', href: '/categories/stationery' },
                { name: 'Cosmetics', href: '/categories/cosmetics' },
                { name: 'Electronic', href: '/categories/electronics' },
              ].map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white/90 text-sm font-medium hover:text-white transition-all relative group"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#DBCCB7] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}

              {/* Clothing Dropdown */}
              <div
                className="relative group py-2"
                onMouseEnter={() => setActiveDropdown('clothing')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center gap-1 text-white/90 text-sm font-medium hover:text-white transition-colors" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Clothing
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${activeDropdown === 'clothing' ? 'rotate-180' : ''}`} />
                </button>

                <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-4 w-56 transition-all duration-300 ${activeDropdown === 'clothing' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                  <div className="bg-white rounded-xl shadow-2xl overflow-hidden py-2 border border-white/20 backdrop-blur-md">
                    {[
                      { name: 'All Clothing', href: '/categories/clothing' },
                      { name: "Men's Wear", href: '/categories/clothing/mens-wear' },
                      { name: "Women's Wear", href: '/categories/clothing/womens-wear' },
                      { name: "Kids' Wear", href: '/categories/clothing/kids-wear' },
                    ].map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className="block px-5 py-3 text-sm text-gray-700 hover:bg-[#5A0117] hover:text-white transition-colors border-l-2 border-transparent hover:border-[#DBCCB7]"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>


            {/* Right: Search & Icons */}
            <div className="flex items-center gap-3 md:gap-4 lg:gap-6">

              {/* Desktop Search Bar (Visible on Large Screens) */}
              <div className="hidden lg:block w-72 xl:w-80">
                <SearchBar />
              </div>

              {/* Mobile/Tablet Search Toggle */}
              <div className="lg:hidden relative">
                <button
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="text-white hover:text-[#DBCCB7] hover:scale-110 transition-all p-2 rounded-full hover:bg-white/5"
                  aria-label="Search"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Mobile Search Overlay */}
                {isSearchOpen && (
                  <>
                    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40" onClick={() => setIsSearchOpen(false)} />
                    <div className="fixed top-20 left-4 right-4 z-50 max-w-md mx-auto animate-in fade-in slide-in-from-top-4 duration-300">
                      <SearchBar isMobile={true} onClose={() => setIsSearchOpen(false)} />
                    </div>
                  </>
                )}
              </div>

              {/* Action Icons */}
              <div className="flex items-center gap-2 md:gap-4">

                {/* Wishlist */}
                {isAuthenticated && currentUser?.role !== "admin" && (
                  <Link
                    href="/wishlist"
                    onClick={(e) => handleFeatureClick(e, setIsWishlistOpen, "/wishlist")}
                    className="text-white hover:text-[#DBCCB7] hover:scale-110 transition-all p-2 rounded-full hover:bg-white/5 hidden sm:block relative"
                  >
                    <Heart className="w-5 h-5 md:w-6 md:h-6" />
                  </Link>
                )}

                {/* Cart */}
                {currentUser?.role !== "admin" && (
                  <div className="relative group">
                    <button
                      onClick={(e) => {
                        if (isAuthenticated) {
                          handleFeatureClick(e, setIsCartOpen, "/cart")
                          if (window.innerWidth >= 768) router.push('/cart')
                        } else {
                          router.push(`/login?redirect=${encodeURIComponent('/cart')}`)
                        }
                      }}
                      className="text-white hover:text-[#DBCCB7] hover:scale-110 transition-all p-2 rounded-full hover:bg-white/5 block"
                    >
                      {cartLoading ? (
                        <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                      ) : (
                        <ShoppingBag className="w-5 h-5 md:w-6 md:h-6" />
                      )}
                      {getCartItemsCount() > 0 && (
                        <span className="absolute top-0 right-0 bg-[#DBCCB7] text-[#5A0117] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm animate-in zoom-in duration-300">
                          {getCartItemsCount()}
                        </span>
                      )}
                    </button>
                  </div>
                )}

                {/* Admin Dashboard */}
                {currentUser?.role === "admin" && (
                  <Link href="/admindashboard" className="text-white hover:text-[#DBCCB7] hover:scale-110 transition-all p-2 rounded-full hover:bg-white/5" title="Admin Dashboard">
                    <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6" />
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative hidden sm:block ml-2">
                  {isAuthenticated ? (
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="group flex items-center gap-2 outline-none"
                    >
                      <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#DBCCB7] to-[#C4B5A0] text-[#5A0117] flex items-center justify-center font-bold text-sm shadow-md border-2 border-transparent group-hover:border-white/50 transition-all">
                        {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </button>
                  ) : (
                    <Link
                      href="/login"
                      className="text-white text-sm font-semibold hover:text-[#5A0117] transition-all bg-white/10 hover:bg-[#DBCCB7] border border-white/30 px-5 py-2 rounded-full backdrop-blur-sm shadow-sm hover:shadow-md"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Login
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && isAuthenticated && (
                    <div className="absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 animate-in fade-in slide-in-from-top-4 duration-200 overflow-hidden ring-1 ring-black/5 z-50">
                      <div className="px-4 py-2 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white">
                        <p className="text-sm font-bold text-gray-900 truncate">{currentUser?.name}</p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{currentUser?.email}</p>
                      </div>

                      <div className="p-2 space-y-0.5">
                        {currentUser?.role === "admin" && (
                          <Link
                            href="/admindashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#5A0117]/5 hover:text-[#5A0117] rounded-xl transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4" />
                            Admin Dashboard
                          </Link>
                        )}
                        <Link
                          href="/profile"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#5A0117]/5 hover:text-[#5A0117] rounded-xl transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#5A0117]/5 hover:text-[#5A0117] rounded-xl transition-colors"
                        >
                          <ShoppingBag className="w-4 h-4" />
                          My Orders
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-[#5A0117]/5 hover:text-[#5A0117] rounded-xl transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Account Settings
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 p-2">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Drawers */}
      <NavbarDrawer isOpen={isNavDrawerOpen} onClose={() => setIsNavDrawerOpen(false)} />

      <Drawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title={`Shopping Cart (${getCartItemsCount()})`}
        footer={
          <div className="space-y-3">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>₹{getCartTotal().toLocaleString()}</p>
            </div>
            <p className="text-xs text-gray-500">Shipping and taxes calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="flex items-center justify-center rounded-lg border border-transparent bg-[#5A0117] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[#8C6141]"
              >
                View Cart
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="flex items-center justify-center rounded-lg border border-[#5A0117] bg-white px-4 py-2 text-sm font-medium text-[#5A0117] shadow-sm hover:bg-gray-50"
              >
                Checkout
              </Link>
            </div>
          </div>
        }
      >
        <CartContent isDrawer={true} onClose={() => setIsCartOpen(false)} />
      </Drawer>

      <Drawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        title="My Wishlist"
      >
        <WishlistContent isDrawer={true} onClose={() => setIsWishlistOpen(false)} />
      </Drawer>
    </>
  )
}
