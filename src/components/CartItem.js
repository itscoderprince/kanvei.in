"use client"

import Image from "next/image"
import Link from "next/link"
import { useCart } from "../contexts/CartContext"
import { toast } from "react-hot-toast"
import { Minus, Plus, Trash2, Tag } from "lucide-react"

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart()


  // Smart routing
  const getProductUrl = () => {
    if (item.isOption && item.productOptionId) {
      return `/products/option/${item.productOptionId}`
    } else if (item.slug) {
      return `/products/${item.slug}`
    } else {
      return `/products/${item._id}`
    }
  }

  const productUrl = getProductUrl()
  const displayName = item.name || 'Product'

  return (
    <div className="group bg-white rounded-xl border border-gray-100 p-4 hover:border-[#DBCCB7] transition-all duration-300 hover:shadow-sm">
      <div className="flex gap-4 sm:gap-6">
        {/* Product Image */}
        <Link href={productUrl} className="block flex-shrink-0">
          <div className="w-20 h-20 sm:w-28 sm:h-28 relative rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
            {item.image && item.image.trim() !== '' ? (
              <Image
                src={item.image}
                alt={displayName}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { e.target.src = '/placeholder.svg' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <span className="text-xs">No Image</span>
              </div>
            )}
          </div>
        </Link>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* Top Row: Name & Price */}
          <div className="flex justify-between items-start gap-2">
            <div>
              <Link href={productUrl}>
                <h3 className="text-base sm:text-lg font-bold text-[#1F2937] hover:text-[#5A0117] transition-colors line-clamp-2" style={{ fontFamily: "Sugar, serif" }}>
                  {displayName}
                </h3>
              </Link>

              {/* Product Attributes (Size/Color if any) */}
              <div className="flex flex-wrap gap-2 mt-1">
                {item.size && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    Size: {item.size}
                  </span>
                )}
                {item.color && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                    Color: {item.color}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-[#5A0117]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                ₹{item.price?.toLocaleString() || '0'}
              </p>
              {item.mrp && item.mrp > item.price && (
                <div className="flex flex-col items-end">
                  <span className="text-xs text-gray-400 line-through">
                    ₹{item.mrp.toLocaleString()}
                  </span>
                  <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {Math.round(((item.mrp - item.price) / item.mrp) * 100)}% OFF
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row: Quantity & Remove */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
              <button
                onClick={() => updateQuantity(item._id, item.quantity - 1, { showNotification: false })}
                className="p-2 hover:text-[#5A0117] transition-colors disabled:opacity-30"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center font-semibold text-sm text-gray-700">
                {item.quantity}
              </span>
              <button
                onClick={() => {
                  const availableStock = item.stock || 999
                  const newQuantity = Math.min(availableStock, item.quantity + 1)

                  // Optimistic update (silent)
                  updateQuantity(item._id, newQuantity, { showNotification: false })

                  // Debounced toast
                  if (window.quantityToastTimeout) clearTimeout(window.quantityToastTimeout)
                  window.quantityToastTimeout = setTimeout(() => {
                    toast.success("Quantity updated")
                  }, 800)
                }}
                disabled={item.quantity >= (item.stock || 999)}
                className="p-2 hover:text-[#5A0117] transition-colors disabled:opacity-30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item._id)}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-red-600 transition-colors group/remove"
            >
              <Trash2 className="w-4 h-4 group-hover/remove:scale-110 transition-transform" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        </div>
      </div>
    </div >
  )
}
