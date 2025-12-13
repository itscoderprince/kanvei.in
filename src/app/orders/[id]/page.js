"use client"
import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Header from "../../../components/shared/Header"
import Footer from "../../../components/shared/Footer"
import { useAuth } from "../../../contexts/AuthContext"
import { useSession } from "next-auth/react"
import Link from "next/link"
import {
  AiOutlineShopping,
  AiOutlineArrowLeft,
  AiOutlinePhone,
  AiOutlineMail,
  AiOutlineUser,
  AiOutlineDownload,
  AiOutlineEye
} from "react-icons/ai"
import {
  MdLocalShipping,
  MdDone,
  MdCancel,
  MdHourglassEmpty,
  MdDeliveryDining,
  MdSecurity,
  MdLocationOn,
  MdPayment,
  MdReceipt
} from "react-icons/md"

// Status Configuration with detailed styling
const ORDER_STATUSES = [
  { value: 'pending', label: 'Order Placed', icon: MdHourglassEmpty, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', step: 1 },
  { value: 'processing', label: 'Processing', icon: MdReceipt, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', step: 2 },
  { value: 'shipping', label: 'Shipped', icon: MdLocalShipping, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200', step: 3 },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: MdDeliveryDining, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', step: 4 },
  { value: 'delivered', label: 'Delivered', icon: MdDone, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', step: 5 },
  { value: 'cancelled', label: 'Cancelled', icon: MdCancel, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', step: 0 }
]

export default function OrderDetailPage({ params }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { data: session, status } = useSession()
  const { user: authUser, isAuthenticated: customAuth, token: authToken } = useAuth()

  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState(null)
  const [notFound, setNotFound] = useState(false)

  const currentUser = session?.user || authUser
  const isUserAuthenticated = (status === "authenticated") || customAuth

  // Auth Check
  useEffect(() => {
    if (status === "loading") return
    if (!isUserAuthenticated) { router.push('/login'); return }
    if (currentUser?.role === "admin") { router.push('/admindashboard'); return }
    setLoading(false)
  }, [status, isUserAuthenticated, currentUser, router])

  // Data Fetch
  useEffect(() => {
    if (!isUserAuthenticated || !currentUser || !resolvedParams.id) return

    const fetchOrder = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' }
        if (authToken && authToken !== 'nextauth_session') headers.Authorization = `Bearer ${authToken}`

        const response = await fetch(`/api/orders/${resolvedParams.id}`, { headers })
        const data = await response.json()

        if (data.success) {
          const userId = currentUser._id || currentUser.id
          if (data.order.userId === userId || data.order.customerEmail === currentUser.email) {
            setOrder(data.order)
          } else {
            setNotFound(true)
          }
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    if (!loading) fetchOrder()
  }, [isUserAuthenticated, currentUser, authToken, loading, resolvedParams.id])

  // Helpers
  const getStatusInfo = (status) => ORDER_STATUSES.find(s => s.value === status?.toLowerCase()) || ORDER_STATUSES[0]

  const formatDate = (date) => new Date(date).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price)

  const getOrderId = (order) => order?.orderId ? `#${order.orderId}` : `#${(order?._id || '').toString().slice(-8).toUpperCase()}`

  // Render Logic
  if (loading || status === "loading") return <LoadingState />
  if (notFound || !isUserAuthenticated) return <ErrorState isAuth={isUserAuthenticated} />
  if (!order) return null

  const statusInfo = getStatusInfo(order.status)
  const isCancelled = statusInfo.value === 'cancelled'

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Header />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Top Navigation & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Link href="/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#5A0117] transition-colors mb-1">
              <AiOutlineArrowLeft /> Back to List
            </Link>
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-bold" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                Order {getOrderId(order)}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700 shadow-sm transition-all">
            <AiOutlineDownload className="w-4 h-4" /> Invoice
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: Stepper & Products (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Status Stepper */}
            {!isCancelled && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="relative">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0"></div>
                  <div
                    className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#5A0117] to-[#8C6141] -translate-y-1/2 rounded-full z-0 transition-all duration-700"
                    style={{ width: `${((statusInfo.step - 1) / 4) * 100}%` }}
                  ></div>
                  <div className="relative z-10 flex justify-between w-full">
                    {[1, 2, 3, 4, 5].map((step) => {
                      const isActive = statusInfo.step >= step
                      const isCurrent = statusInfo.step === step
                      return (
                        <div key={step} className="flex flex-col items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isActive ? 'bg-[#5A0117] border-[#5A0117] text-white' : 'bg-white border-gray-200 text-gray-300'}`}>
                            {isActive ? <MdDone className="w-4 h-4" /> : <span className="text-xs">{step}</span>}
                          </div>
                          <span className={`text-[10px] sm:text-xs font-medium ${isActive ? 'text-[#5A0117]' : 'text-gray-400'} hidden sm:block`}>
                            {ORDER_STATUSES.find(s => s.step === step)?.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Product List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex justify-between items-center">
                <h2 className="font-bold text-lg" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
                  Items ({order.items?.length})
                </h2>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Details</span>
              </div>

              <div className="divide-y divide-gray-50">
                {order.items?.map((item, index) => {
                  const hasProductId = item.productId?._id
                  const productName = item.name || item.productId?.name
                  // Generate a mock SKU based on ID for professional look
                  const mockSku = item.productId?._id ? `SKU-${item.productId._id.slice(-6).toUpperCase()}` : 'N/A'

                  return (
                    <div key={index} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors group">
                      <div className="flex gap-4 sm:gap-6">
                        {/* Image */}
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0 relative">
                          {hasProductId && item.productId?.images?.[0] ? (
                            <img src={item.productId.images[0]} alt={productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><AiOutlineShopping className="w-8 h-8" /></div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h3 className="font-semibold text-gray-900 line-clamp-1" style={{ fontFamily: "Montserrat, sans-serif" }}>{productName}</h3>
                                <p className="text-xs text-gray-400 font-mono mt-0.5">{mockSku}</p>
                              </div>
                              <p className="font-bold text-lg" style={{ color: "#5A0117" }}>{formatPrice(item.price * item.quantity)}</p>
                            </div>

                            {/* Attributes Chips */}
                            <div className="flex flex-wrap gap-2 mt-3">
                              {item.itemType === 'productOption' && (
                                <>
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                    Size: {item.productId?.size}
                                  </span>
                                  <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                    Color: {item.productId?.color}
                                  </span>
                                </>
                              )}
                              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>

                          {/* Item Actions */}
                          {hasProductId && (
                            <div className="mt-3 flex gap-4">
                              <Link href={`/products/${item.productId?.slug || item.productId?._id}`} className="text-xs font-medium flex items-center gap-1 text-[#8C6141] hover:text-[#5A0117] transition-colors">
                                <AiOutlineEye /> View Product
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Info Sidebar (4 Cols) - Sticky */}
          <div className="lg:col-span-4 space-y-6">

            {/* Customer & Address Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-sm uppercase tracking-wide" style={{ color: "#5A0117" }}>Customer Details</h3>
              </div>

              <div className="p-5 space-y-6">
                {/* Contact Info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><AiOutlineUser className="w-5 h-5" /></div>
                  <div className="overflow-hidden">
                    <p className="font-semibold text-gray-900">{currentUser.name || 'Valued Customer'}</p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                      <AiOutlineMail className="flex-shrink-0" />
                      <span className="truncate">{currentUser.email}</span>
                    </div>
                  </div>
                </div>

                <hr className="border-dashed border-gray-200" />

                {/* Shipping Address */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><MdLocationOn className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm mb-1">Shipping Address</p>
                    <div className="text-sm text-gray-600 leading-relaxed">
                      <p className="font-medium text-gray-800">{order.shippingAddress?.name}</p>
                      <p>{order.shippingAddress?.address}</p>
                      <p>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                      <p>{order.shippingAddress?.pincode}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm font-medium text-[#5A0117] bg-[#5A0117]/5 px-2 py-1 rounded w-fit">
                      <AiOutlinePhone /> {order.shippingAddress?.phone}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-6">
              <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-bold text-sm uppercase tracking-wide" style={{ color: "#5A0117" }}>Payment Info</h3>
              </div>

              <div className="p-5">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{formatPrice(order.totalAmount)}</span> {/* Simplified for example */}
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-emerald-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax (Included)</span>
                    <span>{formatPrice(0)}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-gray-900">Total Paid</span>
                    <span className="font-bold text-xl" style={{ color: "#5A0117" }}>{formatPrice(order.totalAmount)}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      <MdPayment className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">{order.paymentMethod?.toUpperCase()}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-medium capitalize ${order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Sub-components for cleaner file structure
function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2" style={{ borderColor: "#5A0117" }}></div>
      </main>
    </div>
  )
}

function ErrorState({ isAuth }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <MdSecurity className="mx-auto h-16 w-16 opacity-20 mb-4" style={{ color: "#5A0117" }} />
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
            {!isAuth ? "Access Restricted" : "Order Not Found"}
          </h1>
          <Link
            href={!isAuth ? "/login" : "/orders"}
            className="inline-block px-6 py-2 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity mt-4"
            style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
          >
            {!isAuth ? "Login Now" : "View All Orders"}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}