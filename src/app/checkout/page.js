"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { User, Mail, Phone, CreditCard, Banknote, ShieldCheck, Truck, Lock } from "lucide-react"
import toast from "react-hot-toast"

import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import CartSummary from "../../components/CartSummary"
import RazorpayButton from "../../components/RazorpayButton"
import AddressSelector from "../../components/AddressSelector"
import CouponSection from "../../components/CouponSection"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import { useSession } from "next-auth/react"
import { useNotification } from "../../contexts/NotificationContext"

export default function CheckoutPage() {
  const { items, getCartTotal, clearCart } = useCart()
  const { data: session } = useSession()
  const { user: authUser, isAuthenticated: customAuth, token: authToken } = useAuth()
  const { showNotification } = useNotification() // Preserved but unused, keeping for compatibility
  const router = useRouter()

  const [loading, setLoading] = useState(false)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [scriptLoadTimeout, setScriptLoadTimeout] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [showManualForm, setShowManualForm] = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const currentUser = session?.user || authUser
  const isUserAuthenticated = (session?.status === "authenticated") || customAuth

  const [formData, setFormData] = useState({
    // Customer Information
    name: "",
    email: "",
    phone: "",
    // Manual Address (fallback)
    address: "",
    city: "",
    state: "",
    pincode: "",
    // Payment Information
    paymentMethod: "cod",
  })

  // Check if Razorpay script is already loaded or set timeout
  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      setRazorpayLoaded(true)
      return
    }

    const timeout = setTimeout(() => {
      if (!razorpayLoaded) {
        setScriptLoadTimeout(true)
        if (typeof window !== 'undefined' && window.Razorpay) {
          setRazorpayLoaded(true)
          setScriptLoadTimeout(false)
        }
      }
    }, 5000)

    return () => clearTimeout(timeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Load user profile data for authenticated users
  useEffect(() => {
    if (!isUserAuthenticated || !currentUser) return

    const fetchUserProfile = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' }
        if (authToken && authToken !== 'nextauth_session') {
          headers.Authorization = `Bearer ${authToken}`
        }

        const response = await fetch('/api/user/profile', { headers })
        const data = await response.json()

        if (data.success) {
          setFormData(prev => ({
            ...prev,
            name: data.user.name || "",
            email: data.user.email || "",
            phone: data.user.phone || ""
          }))
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    fetchUserProfile()
  }, [isUserAuthenticated, currentUser, authToken])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const calculateTotal = () => {
    const subtotal = getCartTotal()
    const shipping = 0 // Always free shipping
    return subtotal + shipping
  }

  const getFinalTotal = () => {
    if (appliedCoupon) {
      return appliedCoupon.discount.finalAmount
    }
    return calculateTotal()
  }

  const handleCouponApply = (couponData) => {
    setAppliedCoupon(couponData)
    toast.success(`🎉 Coupon ${couponData.coupon.code} applied! You saved ₹${couponData.discount.discountAmount}`)
  }

  const handleCouponRemove = () => {
    setAppliedCoupon(null)
    toast.success('Coupon removed')
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
    setShowManualForm(false)
  }

  const handleManualFormToggle = (show) => {
    setShowManualForm(show)
    if (show) {
      setSelectedAddress(null)
    }
  }

  const getShippingAddress = () => {
    if (selectedAddress) {
      return {
        name: formData.name,
        address: selectedAddress.street || '',
        city: selectedAddress.city,
        state: selectedAddress.state || '',
        pincode: selectedAddress.pinCode || '',
        phone: formData.phone,
        addressId: selectedAddress._id
      }
    } else {
      return {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        phone: formData.phone
      }
    }
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Full name is required')
      return false
    }
    if (!formData.email.trim()) {
      toast.error('Email is required')
      return false
    }
    if (!formData.phone.trim()) {
      toast.error('📞 Mobile number is mandatory for delivery contact.')
      return false
    }

    const phoneRegex = /^[+]?[0-9]{10,15}$/
    if (!phoneRegex.test(formData.phone.replace(/\s+/g, ''))) {
      toast.error('Please enter a valid mobile number')
      return false
    }

    if (selectedAddress) {
      return true
    } else if (showManualForm) {
      if (!formData.address.trim() || !formData.city.trim() || !formData.state.trim() || !formData.pincode.trim()) {
        toast.error('All address fields are required')
        return false
      }
      return true
    } else {
      toast.error('Please select an address or enter address manually')
      return false
    }
  }

  // Helper to map cart items consistently and filter invalid ones
  const getCartItems = () => {
    console.log('🛒 CHECKOUT DEBUG - RAW CONTEXT ITEMS:', items)
    return items.map((item, index) => {
      console.log(`🔍 DEBUG ITEM [${index}]:`, item)
      // For product options (from cart with isOption: true)
      if (item.isOption && item.productOptionId) {
        return {
          productId: item.productOption?._id || item.productOptionId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          itemType: 'productOption',
          size: item.size,
          color: item.color
        }
      }
      // For main products
      const pid = item.product?._id || (typeof item.product === 'string' ? item.product : null) || item.productId

      return {
        productId: pid,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        itemType: 'product'
      }
    }).filter(item => {
      const isValid = !!item.productId
      if (!isValid) console.warn('⚠️ FILTERED OUT INVALID ITEM:', item)
      return isValid
    }) // CRITICAL: Filter out items with undefined productId
  }

  // Required for Razorpay button prop compatibility
  const getOrderData = () => ({
    customerEmail: formData.email,
    userId: currentUser?._id || currentUser?.id,
    shippingAddress: getShippingAddress(),
  })

  const handleCODOrder = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    const validItems = getCartItems()
    if (validItems.length === 0) {
      toast.error('Your cart contains unavailable items. Please refresh.')
      return
    }

    setLoading(true)

    try {
      const orderData = {
        items: validItems,
        totalAmount: getFinalTotal(),
        originalAmount: appliedCoupon ? calculateTotal() : null,
        discountAmount: appliedCoupon ? appliedCoupon.discount.discountAmount : 0,
        couponCode: appliedCoupon ? appliedCoupon.coupon.code : null,
        couponId: appliedCoupon ? appliedCoupon.coupon._id : null,
        customerEmail: formData.email,
        userId: currentUser?._id || currentUser?.id,
        shippingAddress: getShippingAddress(),
        paymentMethod: "cod",
        paymentStatus: "pending",
        status: "pending",
      }

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      const data = await response.json()

      if (data.success) {
        clearCart({ showNotification: false })
        toast.success('🎉 Order placed successfully! You will pay on delivery.')
        router.push(`/order-confirmation?orderId=${data.orderId}`)
      } else {
        toast.error('❌ Error placing order: ' + data.error)
      }
    } catch (error) {
      console.error("Error placing order:", error)
      toast.error('❌ Error placing order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRazorpaySuccess = (orderId) => {
    clearCart({ showNotification: false })
    toast.success('💳 Payment successful! Your order has been confirmed.')
    router.push(`/order-confirmation?orderId=${orderId}`)
  }

  const handleRazorpayError = (error) => {
    toast.error('💳 Payment failed: ' + error)
  }

  const validCartItems = items // The cart context items, used for UI display check

  if (!loading && items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="bg-white p-8 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Truck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold mb-3" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
              Your cart is empty
            </h1>
            <p className="text-gray-500 mb-8" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Looks like you haven&apos;t added anything yet.
            </p>
            <button
              onClick={() => router.push("/products")}
              className="w-full py-3.5 text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
            >
              Start Shopping
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          setRazorpayLoaded(true)
          setScriptLoadTimeout(false)
        }}
        onError={() => {
          console.error('Failed to load Razorpay script')
          setScriptLoadTimeout(true)
        }}
        strategy="lazyOnload"
      />

      <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
        <Header />

        <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">

            {/* Page Header */}
            <div className="mb-4 flex items-end justify-between border-b border-gray-200 pb-6">
              <div>
                <h1 className="text-3xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                  Secure Checkout
                </h1>
                <p className="mt-2 text-sm text-gray-600 flex items-center gap-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  <Lock className="w-4 h-4 text-green-600" />
                  Your transaction is secured with SSL encryption
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

              {/* Left Column - Checkout Form */}
              <div className="lg:col-span-8 space-y-8">
                <form onSubmit={handleCODOrder} className="space-y-8">

                  {/* 1. Customer Information */}
                  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#5A0117] text-white flex items-center justify-center font-bold text-sm">1</div>
                      <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "Sugar, serif" }}>
                        Contact Information
                      </h2>
                    </div>

                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#5A0117]/20 focus:outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
                            placeholder="John Doe"
                          />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#5A0117]/20 focus:outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>

                      <div className="md:col-span-2 group">
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mobile Number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 w-4 h-4 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" />
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-[#5A0117]/20 focus:outline-none transition-all placeholder-gray-400 font-medium text-gray-800"
                            placeholder="+91 98765 43210"
                          />
                        </div>
                        <p className="mt-2 text-xs text-amber-700 flex items-center gap-1.5 font-medium bg-amber-50 inline-block px-2 py-1 rounded-md">
                          Details for order updates and delivery coordination.
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* 2. Shipping Address */}
                  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#5A0117] text-white flex items-center justify-center font-bold text-sm">2</div>
                      <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "Sugar, serif" }}>
                        Delivery Address
                      </h2>
                    </div>

                    <div className="p-4">
                      <AddressSelector
                        selectedAddress={selectedAddress}
                        onAddressSelect={handleAddressSelect}
                        onManualAddress={handleManualFormToggle}
                        showManualForm={showManualForm}
                        manualFormData={formData}
                        onManualFormChange={handleInputChange}
                      />
                    </div>
                  </section>

                  {/* 3. Payment Method */}
                  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#5A0117] text-white flex items-center justify-center font-bold text-sm">3</div>
                      <h2 className="text-lg font-bold text-gray-900" style={{ fontFamily: "Sugar, serif" }}>
                        Payment Method
                      </h2>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* COD Card */}
                        <label className={`
                          relative flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${formData.paymentMethod === 'cod'
                            ? 'border-[#5A0117] bg-red-50/30 ring-1 ring-[#5A0117]/20'
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}
                        `}>
                          <div className="flex items-center h-5 mt-1">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="cod"
                              checked={formData.paymentMethod === 'cod'}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-[#5A0117] border-gray-300 focus:ring-[#5A0117]"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Banknote className={`w-5 h-5 ${formData.paymentMethod === 'cod' ? 'text-[#5A0117]' : 'text-gray-400'}`} />
                              <span className="font-bold text-gray-900">Cash on Delivery</span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              Pay in cash when your order arrives at your doorstep.
                            </p>
                          </div>
                        </label>

                        {/* Online Payment Card */}
                        <label className={`
                          relative flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${formData.paymentMethod === 'razorpay'
                            ? 'border-[#5A0117] bg-red-50/30 ring-1 ring-[#5A0117]/20'
                            : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'}
                        `}>
                          <div className="flex items-center h-5 mt-1">
                            <input
                              type="radio"
                              name="paymentMethod"
                              value="razorpay"
                              checked={formData.paymentMethod === 'razorpay'}
                              onChange={handleInputChange}
                              className="w-5 h-5 text-[#5A0117] border-gray-300 focus:ring-[#5A0117]"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CreditCard className={`w-5 h-5 ${formData.paymentMethod === 'razorpay' ? 'text-[#5A0117]' : 'text-gray-400'}`} />
                              <span className="font-bold text-gray-900">Pay Online</span>
                            </div>
                            <p className="text-sm text-gray-500 leading-relaxed">
                              Cards, UPI, Netbanking. Secure & Fast.
                            </p>
                            <div className="mt-2 flex gap-2">
                              {/* Small badges for visual trust */}
                              <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200" />
                              <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200" />
                              <div className="h-6 w-10 bg-gray-100 rounded border border-gray-200" />
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Submit Section */}
                    <div className="p-4 bg-gray-50/50 border-t border-gray-100">
                      {formData.paymentMethod === "cod" ? (
                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full py-4 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                          style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              Place Order (COD)
                              <span className="bg-white/20 px-2 py-0.5 rounded text-sm">₹{getFinalTotal().toLocaleString()}</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="w-full">
                          {razorpayLoaded ? (
                            <RazorpayButton
                              cartItems={getCartItems()}
                              orderData={{
                                ...getOrderData(),
                                totalAmount: getFinalTotal(),
                                originalAmount: appliedCoupon ? calculateTotal() : null,
                                discountAmount: appliedCoupon ? appliedCoupon.discount.discountAmount : 0,
                                couponCode: appliedCoupon ? appliedCoupon.coupon.code : null,
                                couponId: appliedCoupon ? appliedCoupon.coupon._id : null
                              }}
                              appliedCoupon={appliedCoupon}
                              finalAmount={getFinalTotal()}
                              onSuccess={handleRazorpaySuccess}
                              onError={handleRazorpayError}
                            />
                          ) : scriptLoadTimeout ? (
                            <div className="space-y-3">
                              <button
                                type="button"
                                onClick={() => {
                                  if (typeof window !== 'undefined' && window.Razorpay) {
                                    setRazorpayLoaded(true)
                                    setScriptLoadTimeout(false)
                                  } else {
                                    toast.error('Payment gateway failed to load. Please refresh the page or use COD.')
                                  }
                                }}
                                className="w-full py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors"
                              >
                                🔄 Retry Connection
                              </button>
                              <p className="text-center text-sm text-amber-800">
                                Network issue detected. Please retry or switch to COD.
                              </p>
                            </div>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="w-full py-4 bg-gray-800 text-white font-bold rounded-xl opacity-80 cursor-wait"
                            >
                              Loading Secure Gateway...
                            </button>
                          )}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium">
                        <ShieldCheck className="w-4 h-4 text-green-600" />
                        Guaranteed Safe & Secure Checkout
                      </div>
                    </div>
                  </section>
                </form>
              </div>

              {/* Right Column - Summary & Coupons */}
              <div className="lg:col-span-4 space-y-6">
                <div className="sticky top-24 space-y-6">
                  <CouponSection
                    cartItems={getCartItems()}
                    orderAmount={calculateTotal()}
                    onCouponApply={handleCouponApply}
                    onCouponRemove={handleCouponRemove}
                    appliedCoupon={appliedCoupon}
                  />

                  <CartSummary
                    showCheckoutButton={false}
                    appliedCoupon={appliedCoupon}
                    finalTotal={getFinalTotal()}
                  />

                  {/* Trust Badges - Desktop only */}
                  <div className="hidden lg:grid grid-cols-3 gap-2">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center gap-1">
                      <ShieldCheck className="w-6 h-6 text-[#5A0117]" />
                      <span className="text-[10px] font-bold text-gray-600">Secure Payment</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center gap-1">
                      <Truck className="w-6 h-6 text-[#5A0117]" />
                      <span className="text-[10px] font-bold text-gray-600">Fast Delivery</span>
                    </div>
                    <div className="bg-white p-3 rounded-xl border border-gray-100 flex flex-col items-center justify-center text-center gap-1">
                      <Lock className="w-6 h-6 text-[#5A0117]" />
                      <span className="text-[10px] font-bold text-gray-600">Data Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}