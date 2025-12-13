"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import { useAuth } from "../../contexts/AuthContext"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import Link from "next/link"
import {
  ShoppingBag,
  Calendar,
  Eye,
  Search,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Clock,
  Filter,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  MapPin
} from "lucide-react"

const ORDER_STATUSES = [
  { value: 'all', label: 'All Orders', icon: ShoppingBag, color: 'text-gray-600', bg: 'bg-gray-100', border: 'border-gray-200' },
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
  { value: 'processing', label: 'Processing', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { value: 'shipping', label: 'In Transit', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
  { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
]

export default function OrdersPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { user: authUser, isAuthenticated: customAuth, token: authToken } = useAuth()

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState('all')
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' })

  const currentUser = session?.user || authUser
  const isUserAuthenticated = (status === "authenticated") || customAuth

  // Authentication Check
  useEffect(() => {
    if (status === "loading") return
    if (!isUserAuthenticated) {
      router.push('/login')
      return
    }
    if (currentUser?.role === "admin") {
      router.push('/admindashboard')
      return
    }
    setLoading(false)
  }, [status, isUserAuthenticated, currentUser, router])

  // Fetch Orders
  useEffect(() => {
    if (!isUserAuthenticated || !currentUser) return

    const fetchOrders = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' }
        if (authToken && authToken !== 'nextauth_session') {
          headers.Authorization = `Bearer ${authToken}`
        }

        const userId = currentUser._id || currentUser.id
        const params = new URLSearchParams({ userId })

        if (statusFilter !== 'all') params.append('status', statusFilter)
        if (dateFilter !== 'all') {
          params.append('dateFilter', dateFilter)
          if (dateFilter === 'custom' && customDateRange.start && customDateRange.end) {
            params.append('startDate', customDateRange.start)
            params.append('endDate', customDateRange.end)
          }
        }

        const response = await fetch(`/api/orders?${params.toString()}`, { headers })
        const data = await response.json()

        if (data.success) {
          setOrders(data.orders || [])

          // Initial client-side filter
          let filtered = data.orders || []
          if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(order =>
              order._id.toString().toLowerCase().includes(query) ||
              order.items?.some(item => item.name?.toLowerCase().includes(query)) ||
              order.shippingAddress?.name?.toLowerCase().includes(query) ||
              order.shippingAddress?.city?.toLowerCase().includes(query)
            )
          }
          setFilteredOrders(filtered)
        } else {
          toast.error(data.error || 'Failed to fetch orders')
        }
      } catch (error) {
        console.error('Error fetching orders:', error)
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    if (!loading) fetchOrders()
  }, [isUserAuthenticated, currentUser, authToken, loading, statusFilter, dateFilter, customDateRange])

  // Search Filter Effect
  useEffect(() => {
    let filtered = [...orders]
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order =>
        order._id.toString().toLowerCase().includes(query) ||
        order.items?.some(item => item.name?.toLowerCase().includes(query)) ||
        order.shippingAddress?.name?.toLowerCase().includes(query) ||
        order.shippingAddress?.city?.toLowerCase().includes(query)
      )
    }
    setFilteredOrders(filtered)
  }, [orders, searchQuery])

  const getStatusInfo = (status) => {
    const statusInfo = ORDER_STATUSES.find(s =>
      s.value === status?.toLowerCase() || s.label.toLowerCase() === status?.toLowerCase()
    )
    return statusInfo || ORDER_STATUSES[1]
  }

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0
  }).format(price)

  const getOrderId = (order) => order.orderId ? `#${order.orderId}` : `#${order._id.toString().slice(-8).toUpperCase()}`

  // Loading State
  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#5A0117] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[#8C6141] font-medium animate-pulse">Loading your orders...</p>
          </div>
        </main>
      </div>
    )
  }

  // Not Authenticated
  if (!isUserAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat">
        <Header />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-gray-100">
            <div className="w-20 h-20 bg-[#5A0117]/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-[#5A0117]" />
            </div>
            <h1 className="text-2xl font-bold text-[#5A0117] mb-3 font-sugar">Access Restricted</h1>
            <p className="text-gray-500 mb-8">Please login to view your order history.</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-3 bg-[#5A0117] text-white rounded-xl font-medium hover:bg-[#4a0113] transition-all shadow-lg shadow-[#5A0117]/20"
            >
              Login Now
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat selection:bg-[#5A0117] selection:text-white">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-4xl font-bold text-[#5A0117] mb-2 font-sugar flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 md:w-10 md:h-10" />
                My Orders
              </h1>
              <p className="text-[#8C6141] text-lg">Track, return, or buy things again</p>
            </div>

            <div className="relative w-full md:w-auto min-w-[300px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search order ID, product..."
                className="pl-10 pr-4 py-3 w-full border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#5A0117]/20 focus:border-[#5A0117] transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar md:flex-wrap">
            {ORDER_STATUSES.map((status) => {
              const Icon = status.icon
              const isActive = statusFilter === status.value
              return (
                <button
                  key={status.value}
                  onClick={() => setStatusFilter(status.value)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all border
                    ${isActive
                      ? 'bg-[#5A0117] text-white border-[#5A0117] shadow-lg shadow-[#5A0117]/20'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-[#5A0117]/30 hover:bg-[#5A0117]/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{status.label}</span>
                </button>
              )
            })}
          </div>

          {/* Date Filter (Dropdown style for now, can be modernized) */}
          <div className="flex gap-4 mb-6">
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none bg-white pl-4 pr-10 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#5A0117]/20 cursor-pointer hover:border-gray-300"
              >
                <option value="all">All Time</option>
                <option value="last_30_days">Last 30 Days</option>
                <option value="last_3_months">Last 3 Months</option>
                <option value="last_year">Last Year</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Orders Grid */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-[#5A0117] mb-2 font-sugar">No orders found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {statusFilter === 'all'
                  ? "You haven't placed any orders yet. Check out our latest collection!"
                  : "We couldn't find any orders matching your filters."}
              </p>
              {statusFilter === 'all' && (
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-[#5A0117] text-white rounded-xl font-medium hover:bg-[#4a0113] transition-all shadow-lg shadow-[#5A0117]/20"
                >
                  Start Shopping <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status)
                const StatusIcon = statusInfo.icon

                return (
                  <div
                    key={order._id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
                  >
                    {/* Order Header / Ticket Stub */}
                    <div className="bg-gray-50/50 p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">

                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-[#5A0117] font-sugar text-lg">{getOrderId(order)}</h3>
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border}`}>
                              {statusInfo.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-gray-500 font-medium uppercase tracking-wide">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {formatDate(order.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="w-3 h-3" /> {order.paymentMethod}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#5A0117]">{formatPrice(order.totalAmount)}</p>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Amount</p>
                      </div>
                    </div>

                    {/* Order Content */}
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-8">

                        {/* Items List */}
                        <div className="flex-1 space-y-4">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex gap-4 group">
                              {/* Image */}
                              <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                                {item.productId?.images?.[0] ? (
                                  <img
                                    src={item.productId.images[0]}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                    <ShoppingBag className="w-8 h-8" />
                                  </div>
                                )}
                              </div>

                              {/* Details */}
                              <div>
                                <h4 className="font-bold text-[#5A0117] line-clamp-1">{item.name}</h4>
                                <p className="text-sm text-gray-500 mb-1">
                                  Size: {item.size || item.productId?.size || 'N/A'} • Color: {item.color || item.productId?.color || 'N/A'}
                                </p>
                                <p className="text-sm font-medium text-[#8C6141]">
                                  {item.quantity} x {formatPrice(item.price)}
                                </p>
                              </div>
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <p className="text-sm text-gray-400 italic pl-1">
                              + {order.items.length - 3} more items...
                            </p>
                          )}
                        </div>

                        {/* Order Actions & Address */}
                        <div className="lg:w-1/3 lg:border-l lg:pl-8 border-gray-100 flex flex-col justify-between">
                          <div>
                            <h5 className="font-bold text-[#5A0117] mb-3 flex items-center gap-2 text-sm uppercase tracking-wide">
                              <MapPin className="w-4 h-4" /> Shipping To:
                            </h5>
                            <address className="not-italic text-sm text-gray-600 leading-relaxed mb-6">
                              <span className="font-medium text-[#5A0117] block mb-1">{order.shippingAddress?.name}</span>
                              {order.shippingAddress?.address}<br />
                              {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
                            </address>
                          </div>

                          <Link
                            href={`/orders/${order._id}`}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#5A0117] text-[#5A0117] rounded-xl font-bold hover:bg-[#5A0117] hover:text-white transition-all group"
                          >
                            View Details <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Link>
                        </div>

                      </div>
                    </div>

                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
