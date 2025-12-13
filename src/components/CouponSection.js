"use client"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { formatPriceDisplay } from "../lib/utils/priceUtils"
import { Tag, Check, X, ArrowRight, Ticket } from "lucide-react"

export default function CouponSection({ cartItems, orderAmount, onCouponApply, onCouponRemove, appliedCoupon }) {
  const { data: session } = useSession()
  const [couponCode, setCouponCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Please enter a coupon code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: couponCode.trim(),
          orderAmount,
          cartItems,
          userId: session?.user?.id
        }),
      })

      const data = await response.json()

      if (data.success) {
        onCouponApply({
          coupon: data.coupon,
          discount: data.discount
        })
        setCouponCode("")
        setError("")
      } else {
        setError(data.error || "Invalid coupon code")
      }
    } catch (error) {
      console.error("Error applying coupon:", error)
      setError("Error applying coupon. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveCoupon = () => {
    onCouponRemove()
    setCouponCode("")
    setError("")
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleApplyCoupon()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-pink-50 rounded-lg">
          <Ticket className="w-5 h-5 text-[#5A0117]" />
        </div>
        <h3 className="text-lg font-bold text-[#1F2937]" style={{ fontFamily: "Sugar, serif" }}>
          Apply Coupon
        </h3>
      </div>

      {appliedCoupon ? (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 relative overflow-hidden">

            {/* Decorative Circles */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-green-100 rounded-full opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-100 rounded-full opacity-50"></div>

            <div className="relative flex justify-between items-start z-10">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-green-700 uppercase tracking-wide">Applied Successfully</span>
                </div>

                <h4 className="text-xl font-bold text-green-800 tracking-tight" style={{ fontFamily: "Sugar, serif" }}>
                  {appliedCoupon.coupon.code}
                </h4>
                <p className="text-sm text-green-600 mt-0.5 font-medium">
                  {appliedCoupon.coupon.description}
                </p>
              </div>

              <button
                onClick={handleRemoveCoupon}
                className="p-1.5 hover:bg-white/50 rounded-lg text-red-500 hover:text-red-700 transition-colors"
                title="Remove Coupon"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-green-200/50 flex justify-between items-end relative z-10">
              <span className="text-xs text-green-600 font-medium">Total Savings</span>
              <span className="text-lg font-bold text-green-700">
                -{formatPriceDisplay(appliedCoupon.discount.discountAmount)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex sm:flex-row flex-col gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Tag className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={couponCode}
                onChange={(e) => {
                  setCouponCode(e.target.value.toUpperCase())
                  if (error) setError("")
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter coupon code (e.g. SAVE20)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#5A0117] focus:ring-1 focus:ring-[#5A0117] transition-all"
                style={{ fontFamily: "Montserrat, sans-serif" }}
                disabled={loading}
                maxLength="20"
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              disabled={loading || !couponCode.trim()}
              className="px-6 py-3 bg-[#1F2937] text-white font-semibold rounded-xl hover:bg-[#5A0117] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {loading ? "checking..." : "Apply"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-2.5 rounded-lg border border-red-100 animate-in slide-in-from-top-1">
              <X className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">Tip:</span> Check our main page banner or subscribe to our newsletter for exclusive discount codes!
          </div>
        </div>
      )}
    </div>
  )
}
