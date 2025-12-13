"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useCart } from "../../contexts/CartContext"
import CartItem from "../CartItem"
import { ShoppingBag, ArrowRight, Tag, Sparkles } from "lucide-react"

export default function CartContent({ isDrawer = false, onClose }) {
    const { items, clearCart, getCartTotal, getCartItemsCount } = useCart()
    const [couponCode, setCouponCode] = useState("")
    const [stockIssues, setStockIssues] = useState([])

    // Check for stock issues
    useEffect(() => {
        const issues = items.filter(item => item.quantity > item.stock)
        setStockIssues(issues)
    }, [items])

    if (items.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-20 h-20 bg-[#FDF8F3] rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-[#DBCCB7]" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-[#5A0117] mb-2" style={{ fontFamily: "Sugar, serif" }}>
                        Your cart is empty
                    </h3>
                    <p className="text-gray-500 max-w-[250px] mx-auto text-sm">
                        Looks like you haven't added any items yet. Explore our collection to find something you love.
                    </p>
                </div>
                <Link
                    href="/products"
                    onClick={onClose}
                    className="px-8 py-3 bg-[#5A0117] text-white rounded-full font-medium hover:bg-[#8C6141] transition-colors flex items-center gap-2"
                >
                    Start Shopping
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Stock Alerts */}
            {stockIssues.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-red-800">Review Stock Issues</p>
                            <p className="text-xs text-red-600 mt-1">
                                Some items in your cart have exceeded available stock. Please adjust quantities.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Cart Items */}
            <div className="space-y-4">
                {items.map((item) => (
                    <CartItem key={item._id} item={item} compact={isDrawer} />
                ))}
            </div>

            {/* Coupon Section (New Feature) */}
            <div className="pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
                    Have a coupon?
                </label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter code"
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117]"
                        />
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-[#5A0117] bg-[#5A0117]/10 rounded-lg hover:bg-[#5A0117]/20 transition-colors">
                        Apply
                    </button>
                </div>
            </div>

            {/* Recommended (Cross-sell) - Simplified for Drawer */}
            <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-[#DBCCB7]" />
                    <h4 className="text-sm font-bold text-[#5A0117]">You Might Also Like</h4>
                </div>
                <div className="p-3 bg-[#FDF8F3] rounded-xl border border-[#DBCCB7]/20 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-xs text-gray-300">
                        Img
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">Premium Gift Box</p>
                        <p className="text-xs text-[#8C6141]">₹499</p>
                    </div>
                    <button className="p-2 bg-white rounded-full shadow-sm hover:text-[#5A0117] text-gray-400">
                        <ShoppingBag className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Summary Logic is handled by the parent (Drawer Footer or Page Sidebar) */}
        </div>
    )
}
