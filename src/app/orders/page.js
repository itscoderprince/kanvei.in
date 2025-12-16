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
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  ArrowRight,
  Search,
  ChevronRight
} from "lucide-react"

const ORDER_STATUSES = {
  'pending': { label: 'Pending', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  'processing': { label: 'Processing', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
  'shipping': { label: 'In Transit', icon: Truck, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  'out_for_delivery': { label: 'Out for Delivery', icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' },
  'delivered': { label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  'cancelled': { label: 'Cancelled', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' }
}

export default function OrdersPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const { user: authUser, isAuthenticated: customAuth, token: authToken } = useAuth()

  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState([])

  const currentUser = session?.user || authUser
  const isUserAuthenticated = (status === "authenticated") || customAuth

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

  useEffect(() => {
    if (!isUserAuthenticated || !currentUser) return

    const fetchOrders = async () => {
      try {
        const headers = { 'Content-Type': 'application/json' }
        if (authToken && authToken !== 'nextauth_session') {
          headers.Authorization = `Bearer ${authToken}`
        }

        const userId = currentUser._id || currentUser.id
        const response = await fetch(`/api/orders?userId=${userId}`, { headers })
        const data = await response.json()

        if (data.success) {
          setOrders(data.orders || [])
        } else {
          toast.error('Failed to fetch orders')
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    if (!loading) fetchOrders()
  }, [isUserAuthenticated, currentUser, authToken, loading])

  const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })

  const formatPrice = (price) => new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', minimumFractionDigits: 0
  }).format(price)

  const getOrderId = (order) => order.orderId ? `#${order.orderId}` : `#${order._id.toString().slice(-8).toUpperCase()}`

  if (loading || status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#5A0117] border-t-transparent rounded-full animate-spin"></div>
        </main>
      </div>
    )
  }

  if (!isUserAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-montserrat">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">

          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-[#5A0117] font-sugar">My Orders</h1>
            <Link href="/products" className="text-sm font-medium text-gray-600 hover:text-[#5A0117] transition-colors">
              Continue Shopping &rarr;
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Looks like you haven&apos;t placed any orders.</p>
              <Link
                href="/products"
                className="inline-block px-6 py-2.5 bg-[#5A0117] text-white rounded-lg font-medium hover:bg-[#4a0113] transition-all"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusData = ORDER_STATUSES[order.status] || ORDER_STATUSES['pending']
                const StatusIcon = statusData.icon

                return (
                  <Link
                    href={`/orders/${order._id}`}
                    key={order._id}
                    className="block group"
                  >
                    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all hover:border-[#5A0117]/30">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                        {/* Left: Order Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-bold text-lg text-gray-900">{getOrderId(order)}</span>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusData.bg} ${statusData.color}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {statusData.label}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{formatDate(order.createdAt)}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span>{order.items?.length || 0} items</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                            <span className="font-medium text-gray-900">{formatPrice(order.totalAmount)}</span>
                          </div>
                        </div>

                        {/* Right: Arrow */}
                        <div className="flex items-center text-[#5A0117] font-medium text-sm group-hover:translate-x-1 transition-transform">
                          View Details <ChevronRight className="w-4 h-4 ml-1" />
                        </div>

                      </div>
                    </div>
                  </Link>
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
