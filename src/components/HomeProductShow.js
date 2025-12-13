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
    const fetchProducts = async () => {
      try {
        setLoading(true)
        // Fetch exactly 20 products, sorted by name for consistency
        const response = await fetch('/api/products?limit=18&sortBy=name&page=1', {
          headers: {
            'Cache-Control': 'max-age=300', // Cache for 5 minutes
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.success && data.products) {
          // Ensure we have exactly 18 products or less
          const limitedProducts = data.products.slice(0, 18)
          setProducts(limitedProducts)
          console.log(`🏠 Home: Loaded ${limitedProducts.length} products for homepage`)
        } else {
          console.error('Home products API error:', data.error)
          setError(data.error || 'Failed to load products')
        }
      } catch (error) {
        console.error('Error fetching home products:', error)
        setError('Unable to load products. Please try refreshing the page.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (loading) {
    return (
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#5A0117] mb-2" style={{ fontFamily: "Sugar, serif" }}>
              Our Products
            </h2>
            <div className="w-24 h-1 bg-[#8C6141] rounded-full"></div>
          </div>

          {/* Desktop Skeleton */}
          <div className="hidden md:block">
            <ProductGridSkeleton itemsPerRow={6} rows={3} />
          </div>

          {/* Mobile Skeleton */}
          <div className="md:hidden">
            <MobileProductSkeleton count={6} />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
            Our Products
          </h2>
          <p className="text-lg text-[#8C6141]">
            {error}
          </p>
        </div>
      </section>
    )
  }

  // Show fallback when no products
  if (!loading && products.length === 0) {
    return (
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
            Our Products
          </h2>
          <div className="py-16">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-2xl font-bold mb-4 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
              Products Coming Soon
            </h3>
            <p className="text-lg mb-8 text-[#8C6141]" style={{ fontFamily: "Montserrat, sans-serif" }}>
              We are working hard to bring you amazing products. Check back soon!
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-3 border-2 rounded-full font-semibold transition-all hover:scale-105 border-[#5A0117] text-[#5A0117] hover:bg-[#5A0117] hover:text-white"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="w-full">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-[#5A0117] mb-3" style={{ fontFamily: "Sugar, serif" }}>
            Latest Collection
          </h2>
          <div className="w-24 h-1.5 bg-[#DBCCB7] rounded-full"></div>
          <p className="mt-4 text-gray-600 text-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Discover our handpicked selection of premium products, crafted for elegance and style.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
          {products.map((product) => (
            <div key={product._id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-16">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 px-10 py-4 border border-[#DBCCB7] rounded-full font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg bg-[#FDF8F3] text-[#5A0117] hover:bg-[#5A0117] hover:text-white hover:border-[#5A0117]"
            style={{
              fontFamily: "Sugar, serif"
            }}
          >
            <span>View All Products</span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
