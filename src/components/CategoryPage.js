"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link" // Added for breadcrumb feeling
import ProductCard from "./ProductCard"
import ProductSkeleton from "./ProductSkeleton"
import SectionHeader from "./shared/SectionHeader"
import ProductFilters from "./ProductFilters"

function CategoryPageContent({ categoryName, displayName = "", description = "", icon = "", subcategories }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  // --- STATE MANAGEMENT (Kept exactly as is) ---
  const [filters, setFilters] = useState({
    category: "",
    priceRange: { min: 0, max: 10000 },
    rating: null,
    inStock: false,
    search: ""
  })

  const [sortBy, setSortBy] = useState("newest")
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Pagination State
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)
  const itemsPerPage = 10

  // Mobile Filter State
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Initialize filters
  useEffect(() => {
    const search = searchParams.get('search')
    if (search) {
      setFilters(prev => ({ ...prev, search }))
    }
  }, [searchParams])

  // --- FETCH LOGIC (Kept exactly as is) ---
  const fetchProducts = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const queryParams = new URLSearchParams()
      queryParams.append('category', categoryName.toLowerCase())
      queryParams.append('page', isLoadMore ? page + 1 : 1)
      queryParams.append('limit', itemsPerPage)

      if (filters.search) queryParams.append('search', filters.search)
      if (filters.inStock) queryParams.append('inStock', 'true')
      if (filters.priceRange.min > 0) queryParams.append('minPrice', filters.priceRange.min)
      if (filters.priceRange.max < 10000) queryParams.append('maxPrice', filters.priceRange.max)
      if (sortBy) queryParams.append('sort', sortBy)

      const res = await fetch(`/api/products?${queryParams.toString()}`)
      const data = await res.json()

      if (data.success) {
        if (isLoadMore) {
          setProducts(prev => [...prev, ...data.products])
          setPage(prev => prev + 1)
        } else {
          setProducts(data.products)
          setPage(1)
        }
        setTotalProducts(data.total || 0)
        setHasMore(products.length + data.products.length < (data.total || 0))
      } else {
        console.warn("API failed, using fallback or empty list")
        setProducts(prev => isLoadMore ? prev : [])
      }
    } catch (err) {
      console.error("Error fetching products:", err)
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [filters, sortBy, categoryName, page, products.length])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) {
      fetchProducts(true)
    }
  }

  const filterCategories = [
    { _id: 'clothing', name: 'Clothing' },
    { _id: 'electronics', name: 'Electronics' },
    { _id: 'shoes', name: 'Shoes' },
    { _id: 'cosmetics', name: 'Cosmetics' },
    { _id: 'gifts', name: 'Gifts' },
    { _id: 'jewellery', name: 'Jewellery' },
    { _id: 'stationery', name: 'Stationery' },
  ]

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-gray-50/50">

      {/* 1. Slim Professional Header & Breadcrumb */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

            {/* Left: Breadcrumb & Title */}
            <div>
              <div className="flex items-center text-xs text-gray-500 mb-1 font-['Montserrat']">
                <Link href="/" className="hover:text-[#5A0117] transition-colors">Home</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium capitalize">{displayName || categoryName}</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2" style={{ fontFamily: "Sugar, serif" }}>
                {displayName} <span className="text-sm font-normal text-gray-400 font-sans self-end mb-1">({totalProducts} items)</span>
              </h1>
            </div>

            {/* Right: Mobile Filter Toggle & Sort (Desktop) */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16m-7 6h7" /></svg>
                Filters
              </button>

              {/* Sort Dropdown - Styled cleaner */}
              <div className="relative group">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
                </div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] cursor-pointer hover:border-gray-300 transition-colors font-['Montserrat']"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Subcategories - Modern Chips Look */}
          {subcategories && subcategories.length > 0 && (
            <div className="mt-6 border-t border-dashed border-gray-200 pt-4">
              <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3">
                {subcategories.map((sub, idx) => (
                  <div key={idx} className="shrink-0 transition-transform hover:-translate-y-0.5 duration-200">
                    {/* Assuming sub is a component or link, wrapped in a styled div */}
                    <div className="bg-gray-50 hover:bg-[#5A0117]/5 border border-gray-100 hover:border-[#5A0117]/20 rounded-full px-1 py-0.5">
                      {sub}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Layout: Sidebar + Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar (Desktop Sticky) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                filters={filters}
                setFilters={setFilters}
                categories={filterCategories}
                showMobile={false} // Always show on desktop
                hideCategories={true}
              />
            </div>
          </aside>

          {/* Mobile Filter Drawer Logic */}
          {/* Note: If ProductFilters has its own Modal/Drawer logic inside based on 'showMobile', this will trigger it */}
          {showMobileFilters && (
            <div className="lg:hidden">
              <ProductFilters
                filters={filters}
                setFilters={setFilters}
                categories={filterCategories}
                showMobile={showMobileFilters}
                onCloseMobile={() => setShowMobileFilters(false)}
                hideCategories={true}
              />
            </div>
          )}

          {/* Product Grid Area */}
          <div className="flex-1 min-h-[500px]">

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                <ProductSkeleton count={8} />
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-16 flex justify-center">
                    <button
                      onClick={loadMoreProducts}
                      disabled={loadingMore}
                      className="group relative px-8 py-3 bg-white border border-[#5A0117] text-[#5A0117] text-sm font-bold tracking-wider uppercase rounded-full overflow-hidden transition-all hover:bg-[#5A0117] hover:text-white focus:ring-4 focus:ring-[#5A0117]/20 disabled:opacity-50"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        {loadingMore && (
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        )}
                        {loadingMore ? 'Loading...' : 'Load More'}
                      </span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border border-dashed border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1 font-['Montserrat']">No products found</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-6 text-sm">We couldn't find matches for your current filters. Try adjusting your search or range.</p>
                <button
                  onClick={() => setFilters({ category: "", priceRange: { min: 0, max: 10000 }, rating: null, inStock: false, search: "" })}
                  className="px-6 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// --- LOADING STATE (Suspense Fallback) ---
function CategoryPageLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-20 bg-white border-b border-gray-100"></div>
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        <div className="hidden lg:block w-64 h-[600px] bg-white rounded-xl animate-pulse"></div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[5/7] bg-white rounded-xl animate-pulse border border-gray-100"></div>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- EXPORT ---
export default function CategoryPage(props) {
  return (
    <Suspense fallback={<CategoryPageLoading />}>
      <CategoryPageContent {...props} />
    </Suspense>
  )
}