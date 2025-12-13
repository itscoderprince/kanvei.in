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
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
              Shop by Category
            </h2>
            <div className="w-16 h-1 bg-[#8C6141] mx-auto mt-2 rounded-full"></div>
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

      {/* Promotional Banner - Full Width Editorial Style */}
      <section className="w-full relative overflow-hidden bg-[#5A0117] py-16 md:py-24">
        {/* Abstract Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#8C6141]/40 via-[#5A0117] to-[#2b000a]"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('/pattern-bg.png')] mix-blend-overlay"></div>

        {/* Large Background Typography (Decor) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full overflow-hidden opacity-5 pointer-events-none select-none">
          <div className="whitespace-nowrap text-[10rem] md:text-[15rem] font-bold text-white leading-none animate-marquee" style={{ fontFamily: "Sugar, serif" }}>
            EXCLUSIVE COLLECTION • LIMITED EDITION • PREMIUM QUALITY •
          </div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#DBCCB7] text-xs md:text-sm font-medium tracking-[0.2em] backdrop-blur-sm border border-white/10 mb-8 animate-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-4 h-4" />
            <span>SEASONAL OFFER</span>
            <Sparkles className="w-4 h-4" />
          </div>

          <h2 className="text-4xl md:text-7xl lg:text-8xl font-bold text-white mb-6 md:mb-8 tracking-tight" style={{ fontFamily: "Sugar, serif" }}>
            Elevate Your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DBCCB7] to-[#FDF8F3]">Aesthetic</span>
          </h2>

          <p className="text-base md:text-2xl text-white/80 mb-8 md:mb-10 max-w-2xl mx-auto font-light leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Experience the perfect blend of tradition and modernity. <br className="hidden md:block" />
            Get up to <span className="font-semibold text-[#DBCCB7]">50% OFF</span> on our curated premium selection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products?sale=season"
              className="group relative inline-flex items-center gap-3 bg-white text-[#5A0117] px-8 py-3 md:px-10 md:py-4 rounded-full font-semibold text-base md:text-lg transition-all duration-300 hover:bg-[#DBCCB7] hover:scale-105 shadow-[0_0_40px_rgba(219,204,183,0.3)] hover:shadow-[0_0_60px_rgba(219,204,183,0.5)]"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Shop The Look
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/categories"
              className="px-8 py-3 md:px-10 md:py-4 rounded-full font-semibold text-base md:text-lg text-white border border-white/30 hover:bg-white/10 transition-all duration-300"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Explore Categories
            </Link>
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
