"use client"
import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"

import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import SimilarProducts from "./SimilarProducts"
import {
  Heart,
  Share2,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Gem,
  Headphones
} from "lucide-react"

// Accordion Component for Specs/Description
function AccordionItem({ title, isOpen, onClick, children }) {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-base font-medium text-gray-900 group-hover:text-[#5A0117] transition-colors" style={{ fontFamily: "Sugar, serif" }}>
          {title}
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100 mb-4" : "max-h-0 opacity-0"
          }`}
      >
        <div className="text-sm text-gray-600 leading-relaxed font-light">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailClient({ product: initialProduct }) {
  const router = useRouter()
  const params = useParams()
  const [product, setProduct] = useState(initialProduct)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState({ average: 0, count: 0 })
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Accordion Sates
  const [openSections, setOpenSections] = useState({
    description: true,
    specs: false,
    shipping: false
  })

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const imageContainerRef = useRef(null)

  const { addToCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  // --- EXISTING DATA FETCHING LOGIC ---
  useEffect(() => {
    const incrementViews = async () => {
      try {
        if (!params.id) return
        const res = await fetch(`/api/products/${params.id}/views`, { method: 'POST' })
        const data = await res.json()
        if (data?.success) setProduct((prev) => prev ? { ...prev, views: data.views } : prev)
      } catch (err) { console.error('Error incrementing views:', err) }
    }
    incrementViews()
  }, [params.id])

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`/api/reviews/${params.id}`)
        const data = await res.json()
        if (data.success) {
          setReviews(data.reviews)
          setRating(data.rating)
        }
      } catch (error) { console.error("Error fetching reviews:", error) }
    }
    if (params.id) fetchReviews()
  }, [params.id])

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedOptions]);

  // --- HELPER CALCULATIONS ---
  const handleOptionSelect = (optionType, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: prev[optionType]?.id === option.id ? null : option
    }))
    setQuantity(1)
  }

  const getCurrentImages = () => {
    const selectedOptionValues = Object.values(selectedOptions).filter(Boolean)
    const optionImage = selectedOptionValues.find(opt => opt.images?.length > 0)
    return optionImage?.images || product?.images || []
  }

  const getCurrentPrice = () => {
    const selectedOptionValues = Object.values(selectedOptions).filter(Boolean)
    let price = product?.price || 0
    selectedOptionValues.forEach(opt => {
      if (opt.priceModifier) price += opt.priceModifier
      else if (opt.price) price = opt.price
    })
    return price
  }

  const getCurrentStock = () => {
    const selectedOptionValues = Object.values(selectedOptions).filter(Boolean)
    if (selectedOptionValues.length > 0) {
      return Math.min(...selectedOptionValues.map(opt => opt.stock || 0))
    }
    return product?.stock || 0
  }

  const currentPrice = getCurrentPrice()
  const currentImages = getCurrentImages()
  const currentStock = getCurrentStock()
  const isOutOfStock = currentStock <= 0

  // --- ACTIONS ---
  const handleAddToCart = async () => {
    if (!isAuthenticated || !user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }

    if (isOutOfStock) return

    const selectedOptionValues = Object.values(selectedOptions).filter(Boolean)
    let selectedOption = null

    if (selectedOptionValues.length > 0) {
      const combinedOption = selectedOptionValues.reduce((acc, opt) => ({ ...acc, ...opt }), {})
      selectedOption = { ...combinedOption, price: currentPrice, stock: currentStock }
    }

    const success = await addToCart(product, quantity, selectedOption);
    if (success) {
      toast.success(`Added to cart! 🛍️`)
      setQuantity(1)
    }
  }

  const handleBuyNow = async () => {
    await handleAddToCart()
    router.push('/checkout')
  }

  const handleWishlistToggle = async () => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)
      return
    }
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, productId: product._id }),
      })
      const data = await res.json()
      if (data.success) {
        setIsInWishlist(data.action === "added")
        toast.success(data.action === "added" ? "Added to wishlist ❤️" : "Removed from wishlist")
      }
    } catch (error) {
      toast.error("Failed to update wishlist")
    }
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      toast.success("Link copied to clipboard! 🔗")
    } catch (e) {
      toast.error("Failed to copy link")
    }
  }

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setMousePosition({ x, y })
  }

  if (!product) return null

  return (
    <div className="bg-white flex flex-col font-sans">

      {/* Product Content Wrapper */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-2 pb-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">

          {/* --- LEFT: GALLERY SECTION (Now Span 6 for smaller image appearance) --- */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Image Stage */}
            <div
              ref={imageContainerRef}
              className="relative w-full h-[380px] sm:h-[450px] md:h-[450px] bg-[#f8f8f8] rounded-2xl overflow-hidden cursor-zoom-in group border border-gray-100 shadow-sm"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseMove={handleMouseMove}
            >
              <Image
                src={currentImages[activeImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-contain mix-blend-multiply transition-transform duration-300"
                style={{
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  transform: isHovered ? 'scale(2)' : 'scale(1)'
                }}
                priority
              />

              {/* Badges/Overlays */}
              <div className="absolute top-4 left-4 flex gap-2 z-10">
                {product.mrp > currentPrice && (
                  <span className="bg-[#5A0117] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md backdrop-blur-sm">
                    {Math.round(((product.mrp - currentPrice) / product.mrp) * 100)}% OFF
                  </span>
                )}
                {isOutOfStock && (
                  <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                    SOLD OUT
                  </span>
                )}
              </div>

              {/* Action Buttons Overlay */}
              <div className="absolute top-4 right-4 flex flex-col gap-3 z-10 transition-transform duration-300">
                <button
                  onClick={handleWishlistToggle}
                  className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95 ${isInWishlist ? "bg-red-50 text-red-500" : "bg-white text-gray-700 hover:text-[#5A0117]"
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleShare}
                  className="w-11 h-11 rounded-full bg-white text-gray-700 flex items-center justify-center shadow-md hover:text-[#5A0117] transition-all active:scale-95"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Arrows */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === 0 ? currentImages.length - 1 : prev - 1) }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-105"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => prev === currentImages.length - 1 ? 0 : prev + 1) }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-md hover:bg-white text-gray-800 opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-105"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails Grid */}
            {currentImages.length > 1 && (
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
                {currentImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeImageIndex === idx
                      ? "border-[#5A0117] ring-1 ring-[#5A0117]/20"
                      : "border-transparent opacity-70 hover:opacity-100 hover:border-gray-200"
                      }`}
                  >
                    <Image src={img} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* --- RIGHT: PRODUCT INFO (Span 6) --- */}
          <div className="lg:col-span-6 relative">
            <div className="sticky top-24 space-y-6">

              {/* Header Info */}
              <div className="border-b border-gray-100 pb-5">
                {product.brand && (
                  <p className="text-[#8C6141] font-semibold tracking-wider text-xs mb-2 uppercase" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {product.brand}
                  </p>
                )}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#5A0117] leading-tight mb-3" style={{ fontFamily: "Sugar, serif" }}>
                  {product.name}
                </h1>

                {/* Kanvei Verified Badge */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 w-fit">
                  <div className="relative w-5 h-5">
                    <Image src="/kanvei-verified.jpg" alt="Verified" fill className="object-contain" />
                  </div>
                  <span className="text-xs uppercase font-bold text-blue-800 tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Kanvei Verified Product
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    ₹{currentPrice.toLocaleString()}
                  </span>
                  {product.mrp > currentPrice && (
                    <span className="text-base text-gray-400 line-through font-medium">₹{product.mrp.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-light">
                  Inclusive of all taxes. Free shipping on orders over ₹999.
                </p>
              </div>

              {/* Options (If Applicable) */}
              {/* Placeholder for complex options logic - keeping simple for now */}

              {/* Add to Cart Actions */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-4">
                  {/* Quantity */}
                  <div className="flex items-center border border-gray-300 rounded-full h-12 w-32 justify-between px-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-gray-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Stock Status */}
                  <div className="text-sm">
                    {isOutOfStock ? (
                      <span className="text-red-600 font-medium">Out of stock</span>
                    ) : currentStock < 5 ? (
                      <span className="text-amber-600 font-medium">Only {currentStock} left!</span>
                    ) : (
                      <span className="text-green-600 font-medium flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-600"></span> In Stock
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="flex-1 bg-gray-900 text-white h-12 rounded-full text-sm sm:text-base font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    disabled={isOutOfStock}
                    className="flex-1 bg-[#5A0117] text-white h-12 rounded-full text-sm sm:text-base font-semibold hover:bg-[#4a0113] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#5A0117]/20"
                  >
                    <Zap className="w-4 h-4" />
                    Buy Now
                  </button>
                </div>
              </div>

              {/* Value Props */}
              <div className="flex justify-between py-6 border-b border-gray-100">
                <div className="text-center group">
                  <div className="w-10 h-10 mx-auto bg-amber-50 rounded-full flex items-center justify-center text-amber-700 mb-2 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Authentic</p>
                </div>
                <div className="text-center group">
                  <div className="w-10 h-10 mx-auto bg-blue-50 rounded-full flex items-center justify-center text-blue-700 mb-2 group-hover:scale-110 transition-transform">
                    <Truck className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Fast Delivery</p>
                </div>
                <div className="text-center group">
                  <div className="w-10 h-10 mx-auto bg-green-50 rounded-full flex items-center justify-center text-green-700 mb-2 group-hover:scale-110 transition-transform">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Returns</p>
                </div>
                <div className="text-center group">
                  <div className="w-10 h-10 mx-auto bg-purple-50 rounded-full flex items-center justify-center text-purple-700 mb-2 group-hover:scale-110 transition-transform">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">24/7 Support</p>
                </div>
                <div className="text-center group">
                  <div className="w-10 h-10 mx-auto bg-red-50 rounded-full flex items-center justify-center text-red-700 mb-2 group-hover:scale-110 transition-transform">
                    <Gem className="w-5 h-5" />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Quality Products</p>
                </div>
              </div>

              {/* Details Accordions */}
              <div className="space-y-1">
                <AccordionItem
                  title="Description"
                  isOpen={openSections.description}
                  onClick={() => toggleSection('description')}
                >
                  <div className="prose prose-sm max-w-none text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }}></div>
                </AccordionItem>

                <AccordionItem
                  title="Specifications"
                  isOpen={openSections.specs}
                  onClick={() => toggleSection('specs')}
                >
                  {/* Default specs table derived from product data */}
                  <div className="space-y-2">
                    {product.brand && (
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="font-medium text-gray-900">Brand</span>
                        <span className="text-gray-600">{product.brand}</span>
                      </div>
                    )}
                    {product.weight && (
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="font-medium text-gray-900">Weight</span>
                        <span className="text-gray-600">{product.weight}</span>
                      </div>
                    )}
                    {product.dimensions && (
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="font-medium text-gray-900">Dimensions</span>
                        <span className="text-gray-600">{product.dimensions}</span>
                      </div>
                    )}
                    {(product.attributes || []).map((attr, idx) => (
                      <div key={idx} className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="font-medium text-gray-900">{attr.name}</span>
                        <span className="text-gray-600">{attr.value || "Standard"}</span>
                      </div>
                    ))}
                    {(!product.attributes || product.attributes.length === 0) && !product.weight && (
                      <p className="text-gray-400 italic">No detailed specifications available.</p>
                    )}
                  </div>
                </AccordionItem>

                <AccordionItem
                  title="Delivery & Returns"
                  isOpen={openSections.shipping}
                  onClick={() => toggleSection('shipping')}
                >
                  <p>
                    Free standard shipping on all orders over ₹999. Orders are typically processed within 1-2 business days.
                    We accept returns within 7 days of delivery for a full refund or exchange, provided the item is unused and in original packaging.
                  </p>
                </AccordionItem>
              </div>

            </div>
          </div>
        </div>

        {/* --- SIMILAR PRODUCTS SECTION --- */}
        {product.category && (
          <div className="mt-20 border-t border-gray-100 pt-10">
            <SimilarProducts categoryId={product.category} currentProductId={product._id} />
          </div>
        )}

      </div>
    </div>
  )
}
