"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useWishlist } from "../../contexts/WishlistContext"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import { Heart, ShoppingBag, Trash2, ShoppingCart, ArrowRight, X } from "lucide-react"
import toast from "react-hot-toast"

// Internal Component for Individual Wishlist Item
const WishlistItem = ({ item, isDrawer, onRemove, onMoveToCart }) => {
    const { productId: product } = item
    if (!product) return null

    // Drawer View (Compact Horizontal)
    if (isDrawer) {
        return (
            <div className="group flex gap-4 p-3 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300">
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                        src={product.images?.[0]?.url || "/placeholder.jpg"}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                        <h4 className="font-semibold text-gray-900 truncate pr-4" style={{ fontFamily: "Sugar, serif" }}>
                            {product.name}
                        </h4>
                        <p className="text-sm text-[#5A0117] font-bold mt-1">
                            ₹{product.price?.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                        <button
                            onClick={() => onMoveToCart(item)}
                            className="text-xs font-medium text-white bg-[#5A0117] px-3 py-1.5 rounded-full hover:bg-[#8C6141] transition-colors flex items-center gap-1"
                        >
                            <ShoppingCart className="w-3 h-3" /> Add
                        </button>
                        <button
                            onClick={() => onRemove(product._id)}
                            className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                        >
                            <Trash2 className="w-3 h-3" /> Remove
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    // Desktop View (Polished Card)
    return (
        <div className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-[#DBCCB7]/50 transition-all duration-300 flex flex-col h-full">
            {/* Remove Button (Generic) */}
            <button
                onClick={() => onRemove(product._id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                title="Remove from wishlist"
            >
                <X className="w-4 h-4" />
            </button>

            {/* Image */}
            <div className="relative aspect-[4/5] bg-gray-50 overflow-hidden">
                <Image
                    src={product.images?.[0]?.url || "/placeholder.jpg"}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />

                {/* Overlay Action */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent">
                    <button
                        onClick={() => onMoveToCart(item)}
                        className="w-full py-3 bg-white text-[#5A0117] font-semibold rounded-xl hover:bg-[#DBCCB7] transition-colors flex items-center justify-center gap-2 shadow-lg"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Move to Cart
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                    <p className="text-xs font-medium text-[#8C6141] uppercase tracking-wider mb-1">
                        {product.category?.name || "Accessory"}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#5A0117] transition-colors" style={{ fontFamily: "Sugar, serif" }}>
                        <Link href={`/products/${product._id}`}>
                            {product.name}
                        </Link>
                    </h3>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                    <div>
                        <p className="text-xs text-gray-500 line-through">
                            ₹{(product.price * 1.2).toLocaleString()}
                        </p>
                        <p className="text-xl font-bold text-[#5A0117]">
                            ₹{product.price?.toLocaleString()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function WishlistContent({ isDrawer = false, onClose }) {
    const { user, isAuthenticated } = useAuth()
    const {
        wishlist: contextWishlist = [],
        fetchWishlist,
        loading: wishlistLoading,
        removeFromWishlist
    } = useWishlist()
    const { addToCart } = useCart()

    // Recommendation State
    const [recommended, setRecommended] = useState([])
    const [recLoading, setRecLoading] = useState(false)

    // Note: Context already handles initial fetching on login, 
    // so we don't need to re-fetch on mount unless specifically needed.

    // Fetch recommendations when wishlist is empty
    useEffect(() => {
        const fetchRecommendations = async () => {
            // Only fetch if wishlist is empty and we are authenticated
            if (isAuthenticated && contextWishlist.length === 0) {
                setRecLoading(true)
                try {
                    // Fetch random products or just latest
                    const res = await fetch('/api/products?limit=4&sortBy=newest')
                    const data = await res.json()
                    if (data.success) {
                        setRecommended(data.products || [])
                    }
                } catch (err) {
                    console.error("Failed to load recommendations", err)
                } finally {
                    setRecLoading(false)
                }
            }
        }

        fetchRecommendations()
    }, [contextWishlist.length, isAuthenticated])

    const handleRemove = async (productId) => {
        try {
            await removeFromWishlist(productId)
            toast.success("Removed from wishlist")
            fetchWishlist()
        } catch (error) {
            console.error(error)
            toast.error("Failed to remove item")
        }
    }

    const handleMoveToCart = async (item) => {
        try {
            await addToCart(item.productId, 1)
            await removeFromWishlist(item.productId._id)
            toast.success("Moved to cart!")
            fetchWishlist()
            if (onClose) onClose() // Close drawer if applicable
        } catch (error) {
            console.error(error)
            toast.error("Failed to move to cart")
        }
    }

    if (!isAuthenticated) {
        return (
            <div className={`flex flex-col items-center justify-center text-center px-4 ${isDrawer ? 'h-[60vh]' : 'py-20'}`}>
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <Heart className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-[#5A0117] mb-2" style={{ fontFamily: "Sugar, serif" }}>
                    Login Required
                </h3>
                <p className="text-gray-500 text-sm mb-6 max-w-xs mx-auto">
                    Please login to view and save items to your wishlist.
                </p>
                <Link
                    href="/login"
                    onClick={onClose}
                    className="px-8 py-3 bg-[#5A0117] text-white rounded-xl font-medium hover:bg-[#8C6141] transition-all hover:shadow-lg shadow-[#5A0117]/20"
                >
                    Login Now
                </Link>
            </div>
        )
    }

    if (wishlistLoading) {
        return (
            <div className={isDrawer ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"}>
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`bg-white border border-gray-100 rounded-2xl p-4 ${isDrawer ? 'flex gap-4' : ''}`}>
                        <div className={`bg-gray-100 rounded-lg animate-pulse ${isDrawer ? 'w-20 h-20' : 'w-full aspect-[4/5] mb-4'}`} />
                        <div className="flex-1 space-y-3">
                            <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                            <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    if (contextWishlist.length === 0) {
        return (
            <div className={`flex flex-col items-center justify-center text-center px-4 ${isDrawer ? 'h-[60vh]' : 'py-20'}`}>
                <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-[#FDF8F3] rounded-full animate-ping opacity-75"></div>
                    <div className="relative w-24 h-24 bg-[#FDF8F3] rounded-full flex items-center justify-center">
                        <Heart className="w-10 h-10 text-[#DBCCB7]" />
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-[#5A0117] mb-2" style={{ fontFamily: "Sugar, serif" }}>
                    Your wishlist is empty
                </h3>
                <p className="text-gray-500 max-w-[280px] mx-auto text-sm mb-8 leading-relaxed">
                    Looks like you haven't found your favorites yet. Explore our collection to find something you love.
                </p>
                <Link
                    href="/products"
                    onClick={onClose}
                    className="group px-8 py-3 bg-[#5A0117] text-white rounded-full font-medium hover:bg-[#8C6141] transition-all hover:shadow-lg shadow-[#5A0117]/20 flex items-center gap-2"
                >
                    Start Shopping
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        )
    }

    return (
        <div className={isDrawer ? "space-y-4" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"}>
            {contextWishlist
                .filter((item) => item?.productId)
                .map((item) => (
                    <WishlistItem
                        key={item._id}
                        item={item}
                        isDrawer={isDrawer}
                        onRemove={handleRemove}
                        onMoveToCart={handleMoveToCart}
                    />
                ))}

            {!isDrawer && contextWishlist.length > 0 && (
                <div className="flex items-center justify-center p-6 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[#DBCCB7] hover:bg-[#FDF8F3] transition-colors group cursor-pointer">
                    <Link href="/products" className="text-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                            <ArrowRight className="w-5 h-5 text-[#5A0117]" />
                        </div>
                        <p className="font-semibold text-gray-900 group-hover:text-[#5A0117]">Discover More</p>
                        <p className="text-xs text-gray-500">Continue shopping</p>
                    </Link>
                </div>
            )}
        </div>
    )
}
