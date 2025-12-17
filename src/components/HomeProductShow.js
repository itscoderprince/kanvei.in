"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import ProductCard from "./ProductCard"
import { ProductGridSkeleton, MobileProductSkeleton } from "./ProductSkeleton"
import { ArrowRight } from "lucide-react"

export default function HomeProductShow() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 3

    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/products?limit=12&sortBy=name&page=1')

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.products) {
          setProducts(data.products.slice(0, 12))
        } else {
          // If response is success: false, treat as error to trigger retry
          throw new Error(data.error || 'Failed to load products')
        }
      } catch (error) {
        console.error(`Attempt ${attempts + 1} failed:`, error)
        attempts++
        if (attempts < maxAttempts) {
          // Retry after 1.5 second
          console.log(`🔄 Retrying product fetch (Attempt ${attempts + 1}/${maxAttempts})...`)
          setTimeout(fetchProducts, 1500)
        } else {
          setError('Unable to load products.')
        }
      } finally {
        if (attempts === 0 || attempts >= maxAttempts) {
          setLoading(false)
        }
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="w-full py-12 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden transition-all duration-500">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none bg-[url('/pattern-bg.png')] mix-blend-multiply"></div>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-10">
            <h2 className="text-3xl md:text-5xl font-bold text-[#5A0117] mb-3" style={{ fontFamily: "Sugar, serif" }}>
              Latest Collection
            </h2>
            <div className="w-16 h-1 bg-[#DBCCB7]/50 rounded-full animate-pulse"></div>
          </div>
          <div className="hidden md:block">
            <ProductGridSkeleton itemsPerRow={6} rows={2} />
          </div>
          <div className="md:hidden">
            <MobileProductSkeleton count={4} />
          </div>
        </div>
      </section>
    )
  }

  if (error) return null

  if (!loading && products.length === 0) return null

  return (
    <section className="w-full py-12 md:py-20 bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none bg-[url('/pattern-bg.png')] mix-blend-multiply"></div>

      <style jsx global>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-up {
            animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
       `}</style>

      <div className="w-full px-4 md:px-6 relative z-10 animate-fade-up">

        {/* Header - Premium & Compact */}
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <div className="flex items-center gap-4 mb-4 opacity-60">
            <div className="h-px w-8 bg-[#8C6141]"></div>
            <span className="text-[#8C6141] text-xs font-bold tracking-[0.3em] uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Handpicked For You
            </span>
            <div className="h-px w-8 bg-[#8C6141]"></div>
          </div>
          <h2 className="text-4xl md:text-7xl font-bold text-[#5A0117] relative inline-block" style={{ fontFamily: "Sugar, serif" }}>
            Latest Collection
            <span className="absolute -bottom-2 md:-bottom-4 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-[#DBCCB7] to-transparent opacity-50"></span>
          </h2>
        </div>

        {/* Products Grid - Compact & Responsive */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:gap-x-6 lg:gap-y-12">
          {products.map((product, index) => (
            <div key={product._id} className="h-full" style={{ animationDelay: `${index * 50}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button - Premium Pill */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 px-10 py-3.5 bg-[#5A0117] text-white rounded-full font-bold text-sm md:text-base tracking-wide transition-all duration-300 hover:bg-[#8C6141] hover:scale-105 shadow-[0_10px_30px_-10px_rgba(90,1,23,0.3)]"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
