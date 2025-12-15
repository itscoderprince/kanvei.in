"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "../contexts/CartContext"
import { useWishlist } from "../contexts/WishlistContext"
import { useRouter } from "next/navigation"
import { ShoppingBag, Heart, Loader2, Check } from "lucide-react"
import { toast } from "react-hot-toast"

export default function ProductCard({ product }) {
  const { addToCart, isLoggedIn } = useCart()
  const { toggleWishlist, isInWishlist, isLoggedIn: wishlistLoggedIn } = useWishlist()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isLoggedIn) {
      toast.error("Please login to add items to cart")
      router.push('/login?redirect=/products')
      return
    }

    if (product.stock <= 0) return

    setIsAdding(true)
    // const toastId = toast.loading("Adding to cart...") 
    // Commented out toast to rely on button feedback for cleaner UX

    try {
      await addToCart(product, 1)
      toast.success("Added to cart!")
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error("Failed to add to cart")
    } finally {
      setIsAdding(false)
    }
  }

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!wishlistLoggedIn) {
      toast.error("Please login to use wishlist")
      router.push('/login?redirect=/products')
      return
    }

    if (isInWishlist(product._id)) {
      await toggleWishlist(product)
      toast.success("Removed from wishlist")
    } else {
      await toggleWishlist(product)
      toast.success("Added to wishlist")
    }
  }

  // Calculate discount percentage
  const discount = product.mrp && product.price < product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0

  // Logic for secondary image
  const primaryImage = product.images?.[0] || "/placeholder.svg?height=400&width=300&query=product"
  const secondaryImage = product.images?.[1] || primaryImage
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <Link href={`/products/${product.slug || product._id}`} className="group block h-full select-none cursor-pointer">
      <div className="relative h-full flex flex-col">

        {/* Image Container - Ultra Clean with Smooth Load */}
        <div className={`relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-[#FDF8F3] shadow-sm transition-shadow duration-300 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] ${!imgLoaded ? 'animate-pulse' : ''}`}>

          {/* Primary Image */}
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ease-in-out ${imgLoaded ? 'opacity-100' : 'opacity-0'} ${secondaryImage !== primaryImage ? "group-hover:opacity-0" : "group-hover:scale-110"}`}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 16vw, 16vw"
            onLoad={() => setImgLoaded(true)}
          />

          {/* Secondary Image (Swap on Hover) */}
          {secondaryImage !== primaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate`}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 16vw, 16vw"
            />
          )}

          {/* Overlay Gradient on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#5A0117]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges Container - Sticky Left */}
          <div className="absolute top-0 left-0 flex flex-col gap-0 z-10">
            {/* Discount Badge */}
            {discount > 0 && (
              <div className="bg-[#5A0117] text-white text-[10px] font-bold px-3 py-1.5 rounded-br-xl shadow-sm z-20">
                -{discount}%
              </div>
            )}
            {/* Low Stock Badge */}
            {product.stock > 0 && product.stock < 10 && (
              <div className="bg-[#DBCCB7]/90 backdrop-blur-sm text-[#5A0117] text-[9px] font-bold px-3 py-1 rounded-br-lg shadow-sm uppercase tracking-wider mt-0.5">
                Low Stock
              </div>
            )}
            {/* Out of Stock Badge */}
            {product.stock <= 0 && (
              <div className="bg-gray-900 text-white text-[9px] font-bold px-3 py-1 rounded-br-lg shadow-sm uppercase tracking-wider">
                Sold Out
              </div>
            )}
          </div>

          {/* Wishlist Button - Floating Glass */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-2.5 rounded-full bg-white/70 backdrop-blur-md text-gray-900 transition-all duration-300 hover:bg-[#5A0117] hover:text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 z-20 hover:scale-110 active:scale-90 border border-white/20 shadow-sm"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${isInWishlist(product._id) ? "fill-[#5A0117] text-[#5A0117] group-hover:text-white group-hover:fill-white" : "fill-none"}`}
            />
          </button>

          {/* Quick Add Button - Appears on Hover (Desktop) */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0 || isAdding}
            className={`hidden md:flex items-center justify-center absolute bottom-4 right-4 w-11 h-11 rounded-full bg-white text-[#5A0117] shadow-[0_4px_20px_rgb(0,0,0,0.15)] translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) z-20 hover:bg-[#5A0117] hover:text-white hover:scale-110 active:scale-95 ${added ? '!bg-green-600 !text-white' : ''}`}
            title="Add to Cart"
          >
            {isAdding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : added ? (
              <Check className="w-5 h-5" />
            ) : (
              <ShoppingBag size={20} strokeWidth={1.5} />
            )}
          </button>
        </div>

        {/* Product Info - Minimalist & Detailed */}
        <div className="mt-3.5 space-y-1.5 px-1">
          {/* Kanvei Verified Badge */}
          <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 border border-blue-100 w-fit">
            <div className="relative w-3 h-3">
              <Image src="/kanvei-verified.jpg" alt="Verified" fill className="object-contain" />
            </div>
            <span className="text-[9px] uppercase font-bold text-blue-800 tracking-wide" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Kanvei Verified
            </span>
          </div>

          <h3
            className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-[#5A0117] transition-colors"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {product.name}
          </h3>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-[#5A0117]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-gray-400 line-through decoration-red-500/50">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            {/* Mobile Add to Cart - Glassmorphic Pill */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isAdding}
              className={`md:hidden p-2.5 rounded-full transition-all duration-300 active:scale-90 shadow-sm ${added ? 'bg-green-600 text-white' : 'bg-[#FDF8F3] text-[#5A0117] border border-[#DBCCB7]/30 hover:bg-[#5A0117] hover:text-white'}`}
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : added ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingBag size={18} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>

      </div>
    </Link>
  )
}
