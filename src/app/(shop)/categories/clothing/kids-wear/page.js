"use client"

import { useState, useEffect, Suspense, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProductCard from "../../../../../components/ProductCard"
import ProductSkeleton from "../../../../../components/ProductSkeleton"
import ProductFilters from "../../../../../components/ProductFilters"
import EmptyProductState from "../../../../../components/EmptyProductState"
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade, Parallax } from 'swiper/modules'
import Image from "next/image"
import { ArrowRight, ArrowLeft } from "lucide-react"

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

function KidsWearPageContent() {
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
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalProducts, setTotalProducts] = useState(0)
  const itemsPerPage = 10
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
    { id: "kids-1", desktopImage: "/2.jpg", mobileImage: "/m6.png", alt: "Kids Fashion" },
    { id: "kids-2", desktopImage: "/lastimg.webp", mobileImage: "/lastimg.webp", alt: "Kids Wear" },
    { id: "kids-3", desktopImage: "/cloth2.webp", mobileImage: "/cloth2.webp", alt: "Kids Style" },
  ]

  useEffect(() => {
    const search = searchParams.get('search')
    if (search) setFilters(prev => ({ ...prev, search }))
  }, [searchParams])

  const fetchProducts = useCallback(async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true)
      else setLoading(true)

      const queryParams = new URLSearchParams()
      queryParams.append('category', 'clothing')
      queryParams.append('subcategory', 'kids-wear')
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
      }
    } catch (err) {
      console.error("Error fetching products:", err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [filters, sortBy, page, products.length])

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(false), 500)
    return () => clearTimeout(timer)
  }, [fetchProducts])

  const loadMoreProducts = () => {
    if (!loadingMore && hasMore) fetchProducts(true)
  }

  const filterCategories = [
    { _id: 'clothing', name: 'Clothing' },
    { _id: 'electronics', name: 'Electronics' },
    { _id: 'cosmetics', name: 'Cosmetics' },
    { _id: 'jewellery', name: 'Jewellery' },
    { _id: 'stationery', name: 'Stationery' },
  ]

  return (
    <div className="flex flex-col bg-white">
      <div className="relative w-full h-[240px] md:h-[60vh] group overflow-hidden bg-black">
        <Swiper
          spaceBetween={0}
          centeredSlides={true}
          speed={1500}
          parallax={true}
          effect="fade"
          autoplay={{ delay: 6000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation={{ prevEl: '.custom-prev', nextEl: '.custom-next' }}
          onAutoplayTimeLeft={onAutoplayTimeLeft}
          modules={[Autoplay, Pagination, Navigation, Parallax, EffectFade]}
          className="w-full h-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id} className="relative w-full h-full overflow-hidden">
              <div className="absolute inset-0 w-full h-full" data-swiper-parallax="-20%">
                <div className="hidden md:block w-full h-full relative">
                  <Image src={slide.desktopImage} alt={slide.alt} fill className="object-cover object-center" priority quality={90} />
                </div>
                <div className="block md:hidden w-full h-full relative">
                  <Image src={slide.mobileImage} alt={slide.alt} fill className="object-cover object-center" priority quality={90} />
                </div>
              </div>
            </SwiperSlide>
          ))}

          <div className="hidden md:flex absolute bottom-10 right-10 z-20 items-center gap-6">
            <div className="flex gap-2">
              <button className="custom-prev w-12 h-12 flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all rounded-full cursor-pointer">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button className="custom-next w-12 h-12 flex items-center justify-center border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all rounded-full cursor-pointer">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" className="stroke-white/10 fill-none" strokeWidth="2" />
                <circle ref={progressCircle} cx="24" cy="24" r="20" className="stroke-white fill-none" strokeWidth="2" strokeDasharray="125.6" strokeDashoffset="calc(125.6px * (1 - var(--progress)))" />
              </svg>
              <span ref={progressContent} className="absolute text-[10px] font-bold text-white"></span>
            </div>
          </div>

          <style jsx global>{`
            .swiper-pagination-bullet { width: 24px; height: 3px; background: white; opacity: 0.5; border-radius: 2px; transition: all 0.3s; }
            .swiper-pagination-bullet-active { width: 32px; background: white; opacity: 1; }
            @media (min-width: 768px) { .swiper-pagination { display: none; } }
          `}</style>
        </Swiper>
      </div>

      <main className="flex-1">
        <section className="py-8 w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="">
              <ProductFilters filters={filters} setFilters={setFilters} categories={filterCategories} showMobile={showMobileFilters} onCloseMobile={() => setShowMobileFilters(false)} hideCategories={true} />
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="text-gray-600 font-medium font-['Montserrat']">
                  {loading ? 'Loading...' : `Showing ${products.length} of ${totalProducts} Products`}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setShowMobileFilters(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 bg-white transition-colors">
                    <span style={{ fontFamily: "Montserrat, sans-serif" }}>Filters</span>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16m-7 6h7" /></svg>
                  </button>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#5A0117] bg-white cursor-pointer" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name: A-Z</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8"><ProductSkeleton count={10} /></div>
              ) : products.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-8">
                  {products.map((product) => (<ProductCard key={product._id} product={product} />))}
                </div>
              ) : (
                <EmptyProductState
                  onClearFilters={() => setFilters({ category: "", priceRange: { min: 0, max: 10000 }, rating: null, inStock: false, search: "" })}
                />
              )}

              {hasMore && !loading && products.length > 0 && (
                <div className="mt-12 text-center">
                  <button onClick={loadMoreProducts} disabled={loadingMore} className="px-8 py-3 border-2 border-[#5A0117] text-[#5A0117] font-bold rounded-full hover:bg-[#5A0117] hover:text-white transition-all duration-300 disabled:opacity-50" style={{ fontFamily: 'Sugar, serif' }}>
                    {loadingMore ? 'Loading...' : 'Load More Products'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function KidsWearPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5A0117]"></div></div>}>
      <KidsWearPageContent />
    </Suspense>
  )
}
