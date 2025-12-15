"use client"
import { useState, useEffect } from "react"
import HeroCarousel from "../../components/HeroCarousel"
import HomeProductShow from "../../components/HomeProductShow"
import Link from "next/link"
import {
  Shirt,
  Gem,
  PenTool,
  Smartphone,
  Palette,
  Gift,
  LayoutGrid,
  ArrowRight,
  Sparkles,
  Globe,
  ShieldCheck,
  Truck,
  User,
  LogIn
} from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  // Static categories with Lucide icons
  const categoriesStatic = [
    { _id: "1", name: "Clothing", icon: Shirt, href: "/categories/clothing" },
    { _id: "2", name: "Jewellery", icon: Gem, href: "/categories/jewellery" },
    { _id: "3", name: "Stationery", icon: PenTool, href: "/categories/stationery" },
    { _id: "4", name: "Electronics", icon: Smartphone, href: "/categories/electronics" },
    { _id: "5", name: "Cosmetics", icon: Palette, href: "/categories/cosmetics" },
    { _id: "6", name: "Gifts", icon: Gift, href: "/categories/gifts" }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await fetch("/api/categories")
        const categoriesData = await categoriesRes.json()
        if (categoriesData.success) {
          setCategories(categoriesData.categories.slice(0, 6))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      {/* Hero Carousel Section */}
      <section className="relative">
        <HeroCarousel />
      </section>

      {/* Categories Section - Refined & Compact */}
      <section className="w-full py-6 md:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 hidden">
          </div>

          {/* Responsive Grid */}
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4 md:gap-6">
            {categoriesStatic.map((category, idx) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category._id}
                  href={category.href}
                  className="group flex flex-col items-center gap-3 md:gap-4 p-2 rounded-xl transition-all duration-300 hover:bg-gray-50/50 active:scale-95 animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-backwards"
                  style={{ fontFamily: "Montserrat, sans-serif", animationDelay: `${idx * 100}ms` }}
                >
                  <div
                    className="relative w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-white border border-[#5A0117]/10 shadow-[0_2px_10px_rgb(0,0,0,0.03)] group-hover:shadow-[0_10px_25px_rgba(90,1,23,0.15)] group-hover:bg-[#5A0117] group-hover:border-[#DBCCB7] group-hover:-translate-y-1 transition-all duration-500 ease-out"
                  >
                    <IconComponent
                      className="w-6 h-6 md:w-8 md:h-8 text-[#5A0117] group-hover:text-white group-hover:scale-105 transition-all duration-300 ease-in-out"
                      strokeWidth={1.2}
                    />
                  </div>
                  <span
                    className="text-[10px] md:text-xs font-semibold text-gray-600 group-hover:text-[#5A0117] uppercase tracking-wider text-center leading-tight transition-colors duration-300"
                  >
                    {category.name}
                  </span>
                </Link>
              )
            })}

            {/* View All */}
            <Link
              href="/categories"
              className="group flex flex-col items-center gap-3 md:gap-4 p-2 rounded-xl transition-all duration-300 hover:bg-gray-50/50 active:scale-95 animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-backwards"
              style={{ fontFamily: "Montserrat, sans-serif", animationDelay: "600ms" }}
            >
              <div
                className="relative w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-white border border-[#5A0117]/10 shadow-[0_2px_10px_rgb(0,0,0,0.03)] group-hover:shadow-[0_10px_25px_rgba(90,1,23,0.15)] group-hover:bg-[#5A0117] group-hover:border-[#DBCCB7] group-hover:-translate-y-1 transition-all duration-500 ease-out"
              >
                <LayoutGrid
                  className="w-6 h-6 md:w-8 md:h-8 text-[#5A0117] group-hover:text-white group-hover:scale-105 transition-all duration-300 ease-in-out"
                  strokeWidth={1.2}
                />
              </div>
              <span
                className="text-[10px] md:text-xs font-semibold text-gray-600 group-hover:text-[#5A0117] uppercase tracking-wider text-center leading-tight transition-colors duration-300"
              >
                View All
              </span>
            </Link>

            {/* Auth Dependent Button */}
            <Link
              href={isAuthenticated ? "/orders" : "/login"}
              className="group flex flex-col items-center gap-3 md:gap-4 p-2 rounded-xl transition-all duration-300 hover:bg-gray-50/50 active:scale-95 animate-in fade-in slide-in-from-bottom-5 duration-1000 fill-mode-backwards"
              style={{ fontFamily: "Montserrat, sans-serif", animationDelay: "700ms" }}
            >
              <div
                className="relative w-14 h-14 md:w-20 md:h-20 rounded-full flex items-center justify-center bg-white border border-[#5A0117]/10 shadow-[0_2px_10px_rgb(0,0,0,0.03)] group-hover:shadow-[0_10px_25px_rgba(90,1,23,0.15)] group-hover:bg-[#5A0117] group-hover:border-[#DBCCB7] group-hover:-translate-y-1 transition-all duration-500 ease-out"
              >
                {isAuthenticated ? (
                  <User
                    className="w-6 h-6 md:w-8 md:h-8 text-[#5A0117] group-hover:text-white group-hover:scale-105 transition-all duration-300 ease-in-out"
                    strokeWidth={1.2}
                  />
                ) : (
                  <LogIn
                    className="w-6 h-6 md:w-8 md:h-8 text-[#5A0117] group-hover:text-white group-hover:scale-105 transition-all duration-300 ease-in-out"
                    strokeWidth={1.2}
                  />
                )}
              </div>
              <span
                className="text-[10px] md:text-xs font-semibold text-gray-600 group-hover:text-[#5A0117] uppercase tracking-wider text-center leading-tight transition-colors duration-300"
              >
                {isAuthenticated ? "Orders" : "Login"}
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banner - Ultra Compact & Mobile Optimized */}
      <section className="w-full relative overflow-hidden bg-[#5A0117] py-6 md:py-10">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#8C6141]/40 via-[#5A0117] to-[#2b000a]"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern-bg.png')] mix-blend-overlay"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Content Container */}
          <div className="relative z-10 grid md:grid-cols-2 gap-6 md:gap-12 items-center">

            {/* Left Side: Text Content & Actions */}
            <div className="text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4 leading-[1.1]" style={{ fontFamily: "Sugar, serif" }}>
                  Elevate Your <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DBCCB7] to-[#FDF8F3]">Aesthetic</span>
                </h2>
                <p className="text-white/80 text-xs md:text-base font-light leading-relaxed max-w-xl mx-auto md:mx-0" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Experience the perfect blend of tradition and modernity. Get up to <span className="font-semibold text-[#DBCCB7]">50% OFF</span> on our curated premium selection.
                </p>
              </div>

              {/* Actions - Smaller Buttons for Compactness */}
              <div className="flex flex-row gap-3 justify-center md:justify-start">
                <Link
                  href="/products?sale=season"
                  className="group relative inline-flex justify-center items-center gap-2 bg-white text-[#5A0117] px-5 py-2.5 rounded-full font-bold text-xs md:text-sm tracking-wide transition-all duration-300 hover:bg-[#DBCCB7] hover:scale-105 shadow-[0_0_20px_rgba(219,204,183,0.3)]"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Shop The Look
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/categories"
                  className="inline-flex justify-center px-5 py-2.5 rounded-full font-bold text-xs md:text-sm text-white border border-white/30 hover:bg-white/10 transition-all duration-300 tracking-wide"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  View All
                </Link>
              </div>
            </div>

            {/* Right Side: Creative Image Grid - Responsive */}
            <div className="relative">
              {/* Mobile View: Simplified 2-image row */}
              <div className="flex md:hidden gap-2 justify-center mt-2">
                <div className="relative w-1/2 h-32 rounded-xl overflow-hidden shadow-md">
                  <Image src="/cloth2.webp" alt="Fashion" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                </div>
                <div className="relative w-1/2 h-32 rounded-xl overflow-hidden shadow-md">
                  <Image src="/jewelery.webp" alt="Jewellery" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                  {/* Mini Badge for Mobile */}
                  <div className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-sm px-2 py-1 rounded text-[10px] text-white font-bold border border-white/20">
                    50% OFF
                  </div>
                </div>
              </div>

              {/* Desktop View: Full Masonry Grid (Hidden on Mobile) */}
              <div className="hidden md:grid grid-cols-2 gap-3">
                <div className="space-y-3 pt-8">
                  <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg transform transition-transform hover:-translate-y-2 duration-500">
                    <Image src="/cloth2.webp" alt="Fashion" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
                  </div>
                  <div className="relative h-32 rounded-2xl overflow-hidden shadow-lg transform transition-transform hover:-translate-y-2 duration-500 delay-100">
                    <Image src="/jewelery.webp" alt="Jewellery" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="relative h-32 rounded-2xl overflow-hidden shadow-lg transform transition-transform hover:-translate-y-2 duration-500 delay-75">
                    <Image src="/cosmetic.webp" alt="Cosmetics" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
                  </div>
                  <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg transform transition-transform hover:-translate-y-2 duration-500 delay-150">
                    <Image src="/sationary.jpg" alt="Stationery" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
                  </div>
                </div>
                {/* Decorative floating badge - Desktop */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-full">
                  <div className="text-white font-bold text-center leading-none" style={{ fontFamily: "Sugar, serif" }}>
                    <span className="text-xl">50%</span>
                    <br />
                    <span className="text-[10px] tracking-widest uppercase">OFF</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Products Section */}
      <HomeProductShow />

      {/* About Section - Premium & Compact */}
      <section className="py-16 md:py-24 bg-[#FDF8F3] relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#DBCCB7]/10 -skew-x-12 translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* Text Content */}
            <div className="order-2 lg:order-1 space-y-8">
              <div className="space-y-4">
                <span className="text-[#8C6141] text-xs font-bold tracking-[0.2em] uppercase pl-1" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  Our Story
                </span>
                <h2 className="text-4xl md:text-6xl font-bold text-[#5A0117] leading-[1.1]" style={{ fontFamily: "Sugar, serif" }}>
                  Crafting Elegance <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8C6141] to-[#DBCCB7]">Since 2024</span>
                </h2>
                <p className="text-base text-gray-600 leading-relaxed max-w-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  At Kanvei, we don&apos;t just sell products; we curate lifestyles. From exquisite jewellery to premium stationery, every piece is chosen to elevate your everyday moments into something extraordinary.
                </p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-6">
                {[
                  { title: "Premium Quality", desc: "Handpicked excellence", icon: Gem },
                  { title: "Global Designs", desc: "Trendsetting styles", icon: Globe },
                  { title: "Secure Payment", desc: "100% Protected", icon: ShieldCheck },
                  { title: "Fast Delivery", desc: "Across the globe", icon: Truck }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-3 items-start group">
                    <div className="w-10 h-10 rounded-full bg-[#5A0117]/5 flex items-center justify-center group-hover:bg-[#5A0117] transition-colors duration-300">
                      {idx === 0 && <Sparkles className="w-5 h-5 text-[#5A0117] group-hover:text-white transition-colors" />}
                      {idx === 1 && <LayoutGrid className="w-5 h-5 text-[#5A0117] group-hover:text-white transition-colors" />}
                      {/* Note: Ideally import specific icons, using existing ones for now or fallback */}
                      {idx > 1 && <Sparkles className="w-5 h-5 text-[#5A0117] group-hover:text-white transition-colors" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#5A0117] text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>{feature.title}</h4>
                      <p className="text-xs text-gray-500">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-[#5A0117] font-bold border-b-2 border-[#5A0117]/20 hover:border-[#5A0117] pb-1 transition-all group"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Read Our Full Story
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            {/* Image Grid - Masonry Style */}
            <div className="order-1 lg:order-2 relative">
              <div className="grid grid-cols-2 gap-3 items-center">
                <div className="space-y-3 translate-y-8">
                  <div className="relative h-48 rounded-2xl overflow-hidden shadow-lg group">
                    <Image src="/2.jpg" alt="Collection 1" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-[#5A0117]/20 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg group">
                    <Image src="/3.jpg" alt="Collection 2" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg group">
                    <Image src="/4.jpg" alt="Collection 3" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="relative h-56 rounded-2xl overflow-hidden shadow-lg group">
                    <Image src="/lastimg.webp" alt="Collection 4" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#5A0117]/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 text-white font-bold text-lg" style={{ fontFamily: "Sugar, serif" }}>
                      Est. 2024
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] bg-[#DBCCB7]/20 rounded-full blur-3xl -z-10"></div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
