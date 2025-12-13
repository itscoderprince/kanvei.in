"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import CartContent from "../../components/cart/CartContent"
import CartSummary from "../../components/CartSummary"
import { useCart } from "../../contexts/CartContext"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { useAuth } from "../../contexts/AuthContext"

export default function CartPage() {
  const { data: session, status } = useSession()
  const { loading: authLoading } = useAuth()
  const { items, clearCart, getCartItemsCount, isLoggedIn } = useCart()
  const [stockIssues, setStockIssues] = useState([])
  const router = useRouter()

  const isLoading = status === "loading" || authLoading

  useEffect(() => {
    const issues = items.filter(item => item.quantity > item.stock)
    setStockIssues(issues)
  }, [items])

  const handleCheckout = () => {
    if (stockIssues.length > 0) {
      alert('Please resolve stock issues before checkout')
      return
    }
    router.push("/checkout")
  }

  // Access Denied State (Not logged in)
  if (!isLoading && !isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              Access Restricted
            </h1>
            <p className="text-lg mb-6 text-[#8C6141]">Please login to access your cart.</p>
            <Link href="/login" className="inline-block px-6 py-2 bg-[#5A0117] text-white rounded-lg">
              Login
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Admin Restriction
  if (session?.user?.role === "admin") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#5A0117]">Admin Access Restricted</h1>
            <p className="text-[#8C6141] mt-2">Admins cannot shop.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-6 sm:py-10 px-4 sm:px-6 lg:px-8 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
              Shopping Cart
            </h1>
            <p className="mt-2 text-[#8C6141]">Review your items before checkout</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 flex-1">
            {/* Cart Content (Left Side) */}
            <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <CartContent />

              {/* Desktop Utilities (Clear Cart etc) */}
              {items.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-between items-center mt-auto">
                  <button onClick={clearCart} className="text-red-500 text-sm hover:underline">
                    Clear Cart
                  </button>
                  <Link href="/products" className="text-[#5A0117] font-medium hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              )}
            </div>

            {/* Cart Summary (Right Side - Sticky) */}
            {items.length > 0 && (
              <div className="lg:w-[380px] flex-shrink-0">
                <div className="sticky top-24">
                  <CartSummary onCheckout={handleCheckout} />
                  <p className="mt-4 text-center text-xs text-gray-400">
                    🔒 SSL Secured Checkout
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
