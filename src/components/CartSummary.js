"use client"

import { useCart } from "../contexts/CartContext"
import { ArrowRight, Truck, Tag, ShieldCheck } from "lucide-react"

export default function CartSummary({ showCheckoutButton = true, onCheckout, appliedCoupon, finalTotal }) {
  const { items, getCartTotal } = useCart()

  const subtotal = getCartTotal()
  const shipping = 0 // Always free shipping
  const total = finalTotal ? parseFloat(finalTotal) : (subtotal + shipping)

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
      <h2 className="text-lg font-bold mb-6 pb-4 border-b border-gray-100 flex items-center gap-2" style={{ fontFamily: "Sugar, serif", color: "#1F2937" }}>
        Order Summary
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
          <span>Subtotal ({items.length} items)</span>
          <span className="font-medium">₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-sm text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
          <span className="flex items-center gap-1.5">
            Shipping
          </span>
          <span className="font-medium text-green-600">Free</span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-sm text-green-600 bg-green-50 p-2 rounded-lg" style={{ fontFamily: "Montserrat, sans-serif" }}>
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Coupon ({appliedCoupon.coupon.code})
            </span>
            <span className="font-medium">-₹{parseFloat(appliedCoupon.discount.discountAmount).toLocaleString()}</span>
          </div>
        )}

        <div className="border-t border-dashed border-gray-200 pt-4 mt-2">
          <div className="flex justify-between items-end">
            <span className="text-base font-semibold text-gray-800">Total Amount</span>
            <span className="text-2xl font-bold text-[#5A0117]" style={{ fontFamily: "Montserrat, sans-serif" }}>
              ₹{total.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-gray-400 text-right mt-1">Including all taxes</p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-center gap-1">
          <ShieldCheck className="w-5 h-5 text-[#8C6141]" />
          <span className="text-[10px] font-medium text-gray-600">Secure Payment</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 bg-gray-50 rounded-lg text-center gap-1">
          <Truck className="w-5 h-5 text-[#8C6141]" />
          <span className="text-[10px] font-medium text-gray-600">Free Shipping</span>
        </div>
      </div>

      {showCheckoutButton && (
        <button
          onClick={onCheckout}
          disabled={items.length === 0}
          className="w-full group py-4 bg-[#5A0117] text-white font-bold rounded-xl hover:bg-[#720e26] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#5A0117]/20 hover:shadow-[#5A0117]/40 transform hover:-translate-y-0.5"
          style={{ fontFamily: "Montserrat, sans-serif" }}
        >
          Checkout Securely
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  )
}
