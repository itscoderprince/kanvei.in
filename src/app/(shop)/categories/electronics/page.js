"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProductCard from "../../../../components/ProductCard"
import ProductSkeleton from "../../../../components/ProductSkeleton"
import ProductFilters from "../../../../components/ProductFilters"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade, Parallax } from 'swiper/modules'
import Image from "next/image"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { useRef } from "react"

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

function ElectronicsPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const progressCircle = useRef(null);
  const progressContent = useRef(null);

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

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current) {
      progressCircle.current.style.setProperty('--progress', String(1 - progress));
    }
    if (progressContent.current) {
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  const slides = [
    {
      id: "electronics-1",
      desktopImage: "/electronics.png",
      mobileImage: "/electronics.png",
      alt: "Premium Electronics Collection"
    },
    {
      id: "electronics-2",
      desktopImage: "/4.jpg",
      mobileImage: "/m4.png",
      alt: "Smart Gadgets & Devices"
    },
    {
      id: "electronics-3",
      desktopImage: "/lastimg.webp",
      mobileImage: "/lastimg.webp",
      alt: "Audio & Technology"
    },
  ]

  // Initialize filters from URL on mount
  useEffect(() => {
    const search = searchParams.get('search')
    if (search) {
      setFilters(prev => ({ ...prev, search }))
    }
  }, [searchParams])

  // Fetch Products
  const fetchProducts = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const queryParams = new URLSearchParams()
      queryParams.append('category', 'electronics')
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
  }, [filters, sortBy, page, products.length])

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

  // Categories list for the Filter Component
  const filterCategories = [
    { _id: 'clothing', name: 'Clothing' },
    { _id: 'electronics', name: 'Electronics' },
    { _id: 'shoes', name: 'Shoes' },
    { _id: 'cosmetics', name: 'Cosmetics' },
    { _id: 'gifts', name: 'Gifts' },
    { _id: 'jewellery', name: 'Jewellery' },
    { _id: 'stationery', name: 'Stationery' },
  ]

  return (
    <div className="flex flex-col bg-white">

      {/* Electronics Carousel */}
      <div className="relative w-full h-[240px] md:h-[60vh] group overflow-hidden bg-black">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          speed={1500}
          parallax={true}
          effect="fade"
          autoplay={{
            delay: 6000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={{
            prevEl: '.custom-prev',
            nextEl: '.custom-next',
          }}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          modules={[Autoplay, Pagination, Navigation, Parallax, EffectFade]}
          className="w-full h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0 w-full h-full" data-swiper-parallax="-20%">
                {/* Desktop Image */}
                <div className="hidden md:block w-full h-full relative">
                  <Image
                    src={slide.desktopImage}
                    alt={slide.alt}
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                  />
                </div>
                {/* Mobile Image */}
                <div className="block md:hidden w-full h-full relative">
                  <Image
                    src={slide.mobileImage}
                    alt={slide.alt}
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* Navigation UI - Desktop Only */}
          <div className="hidden md:flex absolute bottom-10 right-10 z-20 items-center gap-6">
            <div className="flex gap-2">
              <button className="custom-prev w-12 h-12 flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button className="custom-next w-12 h-12 flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all rounded-full cursor-pointer">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Autoplay Progress Circle */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                <circle
                  cx="24" cy="24" r="20"
                  className="stroke-white/10 fill-none"
                  strokeWidth="2"
                />
                <circle
                  ref={progressCircle}
                  cx="24" cy="24" r="20"
                  className="stroke-white fill-none"
                  strokeWidth="2"
                  strokeDasharray="125.6"
                  strokeDashoffset="calc(125.6px * (1 - var(--progress)))"
                />
              </svg>
              <span ref={progressContent} className="absolute text-[10px] font-bold text-white"></span>
            </div>
          </div>

          <style jsx global>{`
            .swiper-pagination-bullet {
              width: 24px;
              height: 3px;
              background: white;
              opacity: 0.5;
              border-radius: 2px;
              transition: all 0.3s;
            }
            .swiper-pagination-bullet-active {
              width: 32px;
              background: white;
              opacity: 1;
            }
            @media (min-width: 768px) {
              .swiper-pagination {
                display: none;
              }
            }
          `}</style>
        </Swiper>
      </div>

      <main className="flex-1">
        {/* Main Content with Sidebar */}
        <section className="py-8 w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">

            {/* Mobile Filter Overlay */}
            <div className="">
              <ProductFilters
                filters={filters}
                setFilters={setFilters}
                categories={filterCategories}
                showMobile={showMobileFilters}
                onCloseMobile={() => setShowMobileFilters(false)}
                hideCategories={true}
              />
            </div>

            {/* Product Grid Content */}
            <div className="flex-1">
              {/* Top Toolbar (Sort & Filter Trigger) */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="text-gray-600 font-medium font-['Montserrat']">
                  {loading ? 'Loading...' : `Showing ${products.length} of ${totalProducts} Products`}
                </div>

                <div className="flex items-center gap-3">
                  {/* Filter Trigger */}
                  <button
                    onClick={() => setShowMobileFilters(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 bg-white transition-colors"
                  >
                    <span style={{ fontFamily: "Montserrat, sans-serif" }}>Filters</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16m-7 6h7" /></svg>
                  </button>

                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#5A0117] bg-white cursor-pointer"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                  </select>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                  <ProductSkeleton count={10} />
                </div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search criteria.</p>
                  <button
                    onClick={() => setFilters({ category: "", priceRange: { min: 0, max: 10000 }, rating: null, inStock: false, search: "" })}
                    className="mt-4 px-6 py-2 bg-[#5A0117] text-white rounded-lg hover:bg-[#4a0113] transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Load More */}
              {hasMore && !loading && products.length > 0 && (
                <div className="mt-12 text-center">
                  <button
                    onClick={loadMoreProducts}
                    disabled={loadingMore}
                    className="px-8 py-3 border-2 border-[#5A0117] text-[#5A0117] font-bold rounded-full hover:bg-[#5A0117] hover:text-white transition-all duration-300 disabled:opacity-50"
                    style={{ fontFamily: 'Sugar, serif' }}
                  >
                    {loadingMore ? 'Loading...' : 'Load More Products'}
                  </button>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>

    </div >
  )
}

// Loading component for Suspense fallback
function ElectronicsPageLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="h-80 bg-gray-200 animate-pulse"></div>
      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8">
          <div className="hidden lg:block w-72 h-screen bg-gray-100 animate-pulse rounded-xl"></div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[6/7] bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function ElectronicsPage() {
  return (
    <Suspense fallback={<ElectronicsPageLoading />}>
      <ElectronicsPageContent />
    </Suspense>
  )
}
