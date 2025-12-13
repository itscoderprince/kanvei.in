import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "../../../components/ProductCard"
import ProductFilters from "../../../components/ProductFilters"
import { Filter, SlidersHorizontal, ArrowUpDown, X } from "lucide-react"

// Simple Skeleton Loader for Grid
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="animate-pulse flex flex-col h-full">
          <div className="bg-gray-200 aspect-[6/7] rounded-lg w-full mb-2"></div>
          <div className="space-y-1">
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ProductPage() {
  const searchParams = useSearchParams()

  // State
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Filter State
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    priceRange: { min: 0, max: 10000 },
    inStock: false,
    sortBy: "newest"
  })

  // Pagination State
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0
  })

  // Initial Data Fetch
  useEffect(() => {
    fetchCategories()
  }, [])

  // Sync URL Params
  useEffect(() => {
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    if (search || category) {
      setFilters(prev => ({
        ...prev,
        search: search || "",
        category: category || ""
      }))
    }
  }, [searchParams])

  // Fetch Products when Filters Change
  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.currentPage])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Failed to fetch categories", error)
    }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      // Build Query String
      const params = new URLSearchParams({
        page: pagination.currentPage,
        limit: 12,
        sortBy: filters.sortBy,
        priceMin: filters.priceRange.min,
        priceMax: filters.priceRange.max,
      })

      if (filters.search) params.append('search', filters.search)
      if (filters.category) params.append('category', filters.category)
      if (filters.inStock) params.append('inStock', 'true')

      const res = await fetch(`/api/products?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        setProducts(data.products)
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination.totalPages,
          totalProducts: data.pagination.totalCount
        }))
      }
    } catch (error) {
      console.error("Failed to fetch products", error)
    } finally {
      setLoading(false)
    }
  }

  // Helper to remove a single filter from Active Chips
  const removeFilter = (key) => {
    if (key === 'priceRange') {
      setFilters(prev => ({ ...prev, priceRange: { min: 0, max: 10000 } }))
    } else if (key === 'inStock') {
      setFilters(prev => ({ ...prev, inStock: false }))
    } else {
      setFilters(prev => ({ ...prev, [key]: "" }))
    }
  }

  // Calculate active filter count for mobile badge
  const activeFilterCount = [
    filters.category,
    filters.search,
    filters.inStock ? 'stock' : null,
    (filters.priceRange.min > 0 || filters.priceRange.max < 10000) ? 'price' : null
  ].filter(Boolean).length;

  return (
    <div className="flex flex-col bg-white">
      {/* Minimal Header */}
      <div className="pt-4 px-4 sm:px-6 lg:px-8">
        <h1 className="text-xl font-bold text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Our Collection
        </h1>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters - Desktop & Mobile Drawer */}
          <ProductFilters
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            showMobile={showMobileFilters}
            onCloseMobile={() => setShowMobileFilters(false)}
          />

          {/* Main Content */}
          <div className="flex-1">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-4">
              <p className="text-gray-500 text-sm">
                Showing <span className="font-semibold text-gray-900">{products.length}</span> of <span className="font-semibold text-gray-900">{pagination.totalProducts}</span> products
              </p>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-[#5A0117] transition-colors"
                >
                  <div className="relative">
                    <SlidersHorizontal className="w-4 h-4" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#5A0117] rounded-full"></span>
                    )}
                  </div>
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 hidden sm:inline">Sort by:</span>
                  <div className="relative group">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                      className="appearance-none bg-transparent pl-2 pr-8 py-1 text-sm font-medium text-gray-900 focus:outline-none cursor-pointer hover:text-[#5A0117] transition-colors"
                    >
                      <option value="newest">Newest</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="name_asc">Name: A-Z</option>
                    </select>
                    <ArrowUpDown className="absolute right-0 top-1.5 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Active Filter Chips - Feature Addition */}
            {(filters.category || filters.search || filters.inStock || filters.priceRange.min > 0 || filters.priceRange.max < 10000) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.search && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-700">
                    Search: {filters.search}
                    <button onClick={() => removeFilter('search')}><X className="w-3 h-3 hover:text-[#5A0117]" /></button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-700">
                    {filters.category}
                    <button onClick={() => removeFilter('category')}><X className="w-3 h-3 hover:text-[#5A0117]" /></button>
                  </span>
                )}
                {filters.inStock && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-700">
                    In Stock
                    <button onClick={() => removeFilter('inStock')}><X className="w-3 h-3 hover:text-[#5A0117]" /></button>
                  </span>
                )}
                {(filters.priceRange.min > 0 || filters.priceRange.max < 10000) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-700">
                    Price: ₹{filters.priceRange.min} - ₹{filters.priceRange.max}
                    <button onClick={() => removeFilter('priceRange')}><X className="w-3 h-3 hover:text-[#5A0117]" /></button>
                  </span>
                )}
                <button
                  onClick={() => setFilters({ search: "", category: "", priceRange: { min: 0, max: 10000 }, inStock: false, sortBy: "newest" })}
                  className="text-xs text-[#5A0117] underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Product Grid */}
            {loading ? (
              <ProductGridSkeleton />
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Filter className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">
                  We couldn't find any products matching your filters. Try adjusting your search or price range.
                </p>
                <button
                  onClick={() => setFilters({
                    search: "",
                    category: "",
                    priceRange: { min: 0, max: 10000 },
                    inStock: false,
                    sortBy: "newest"
                  })}
                  className="mt-6 px-6 py-2 bg-[#5A0117] text-white rounded-full text-sm font-medium hover:bg-[#4a0113] transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: i + 1 }))}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${pagination.currentPage === i + 1
                      ? "bg-[#5A0117] text-white shadow-md"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-[#5A0117] hover:text-[#5A0117]"
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}