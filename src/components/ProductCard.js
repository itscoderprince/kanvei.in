"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useCart } from "../contexts/CartContext"
import { useWishlist } from "../contexts/WishlistContext"
import { useRouter } from "next/navigation"
import { ShoppingBag, Heart, Loader2 } from "lucide-react"
import { toast } from "react-hot-toast"

export default function ProductCard({ product }) {
  const { addToCart, isLoggedIn } = useCart()
  const { toggleWishlist, isInWishlist, isLoggedIn: wishlistLoggedIn } = useWishlist()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

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
    const toastId = toast.loading("Adding to cart...")

    try {
      await addToCart(product, 1)
      toast.success("Added to cart!", { id: toastId })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error("Failed to add to cart", { id: toastId })
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

  return (
    <Link href={`/products/${product.slug || product._id}`} className="group block h-full">
      <div className="relative h-full flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">

        {/* Image Container */}
        <div className="relative aspect-[6/7] w-full bg-gray-100">
          <Image
            src={product.images?.[0] || "/placeholder.svg?height=400&width=300&query=product"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />

          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-2 left-2 bg-[#5A0117] text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wide shadow-sm z-10">
              -{discount}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className="absolute top-2 right-2 p-1.5 md:p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-900 transition-all duration-300 hover:bg-[#5A0117] hover:text-white shadow-sm z-10"
          >
            <Heart
              className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isInWishlist(product._id) ? "fill-[#5A0117] text-[#5A0117] hover:text-white hover:fill-white" : "fill-none"}`}
            />
          </button>
        </div>

        {/* Product Info */}
        <div className="flex-1 flex flex-col p-2">
          <h3
            className="text-xs md:text-sm font-medium text-gray-800 line-clamp-2 min-h-[1.8em] group-hover:text-[#5A0117] transition-colors mb-2"
            style={{ fontFamily: "Montserrat, sans-serif" }}
          >
            {product.name}
          </h3>

          <div className="mt-auto flex items-end justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-lg font-bold text-[#5A0117]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.mrp > product.price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.mrp.toLocaleString('en-IN')}
                </span>
              )}
            </div>

            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0 || isAdding}
              className={`p-2 rounded-full transition-colors flex-shrink-0 ${product.stock <= 0
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-[#5A0117] text-white hover:bg-[#5A0117]/90 shadow-sm"}`}
              title={product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
            >
              {isAdding ? (
                <Loader2 className="w-[18px] h-[18px] animate-spin" />
              ) : (
                <ShoppingBag size={18} />
              )}
            </button>
          </div>
        </div>

      </div>
    </Link>
  )
}
