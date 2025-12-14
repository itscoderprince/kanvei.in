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
  Sparkles
} from "lucide-react"

export default function HomePage() {
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
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-4 md:gap-8">
            {categoriesStatic.map((category) => {
              const IconComponent = category.icon
              return (
                <Link
                  key={category._id}
                  href={category.href}
                  className="group flex flex-col items-center gap-3"
                >
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-[#FDF8F3] border border-[#DBCCB7]/30 shadow-sm group-hover:shadow-md group-hover:bg-[#5A0117] group-hover:border-[#5A0117] transition-all duration-300"
                  >
                    <IconComponent
                      className="w-6 h-6 md:w-7 md:h-7 text-[#5A0117] group-hover:text-white transition-colors duration-300"
                      strokeWidth={1.5}
                    />
                  </div>
                  <span
                    className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-[#5A0117] transition-colors"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {category.name}
                  </span>
                </Link>
              )
            })}

            {/* View All */}
            <Link
              href="/categories"
              className="group flex flex-col items-center gap-3"
            >
              <div
                className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center bg-[#FDF8F3] border border-[#DBCCB7]/30 shadow-sm group-hover:shadow-md group-hover:bg-[#5A0117] group-hover:border-[#5A0117] transition-all duration-300"
              >
                <LayoutGrid
                  className="w-6 h-6 md:w-7 md:h-7 text-[#5A0117] group-hover:text-white transition-colors duration-300"
                  strokeWidth={1.5}
                />
              </div>
              <span
                className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-[#5A0117] transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                View All
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
                  <img src="/cloth2.webp" alt="Fashion" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                </div>
                <div className="relative w-1/2 h-32 rounded-xl overflow-hidden shadow-md">
                  <img src="/jewelery.webp" alt="Jewellery" className="w-full h-full object-cover" />
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
                    <img src="/cloth2.webp" alt="Fashion" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
                  </div>
                  <div className="relative h-32 rounded-2xl overflow-hidden shadow-lg transform transition-transform hover:-translate-y-2 duration-500 delay-100">
                    <img src="/jewelery.webp" alt="Jewellery" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="relative h-32 rounded-2xl overflow-hidden shadow-lg transform transition-transform hover:-translate-y-2 duration-500 delay-75">
                    <img src="/cosmetic.webp" alt="Cosmetics" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 mix-blend-multiply" />
                  </div>
                  <div className="relative h-40 rounded-2xl overflow-hidden shadow-lg transform transition-transform hover:-translate-y-2 duration-500 delay-150">
                    <img src="/sationary.jpg" alt="Stationery" className="w-full h-full object-cover" />
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

      {/* About Section - Polished */}
      <section className="py-16 md:py-24 bg-[#FDF8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full bg-[#5A0117]/10 text-[#5A0117] text-sm font-semibold tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                OUR STORY
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-[#5A0117] leading-tight" style={{ fontFamily: "Sugar, serif" }}>
                Crafting Elegance for Every Occasion
              </h2>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
                At Kanvei, we curate an exceptional collection spanning Stationery, Jewellery, Fashion, Cosmetics, and Electronics. Our carefully selected products represent the finest in quality, style, and craftsmanship across diverse categories.
              </p>
              <div className="pt-4">
                <Link
                  href="/about"
                  className="inline-flex items-center text-[#5A0117] font-semibold hover:text-[#8C6141] transition-colors group"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Read Our Full Story
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>

            <div className="order-1 lg:order-2 relative">
              <div className="relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-[#5A0117]/10 mix-blend-multiply z-10 transition-opacity hover:opacity-0 duration-500"></div>
                <img
                  src="lastimg.webp"
                  alt="KANVEI Product Collection"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              {/* Decorative Element */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-[#DBCCB7] rounded-full opacity-50 blur-2xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#5A0117] rounded-full opacity-20 blur-2xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
