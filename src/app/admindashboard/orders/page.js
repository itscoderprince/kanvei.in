"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../../../components/shared/AdminLayout"
import toast from "react-hot-toast"
import { useNotification } from "../../../contexts/NotificationContext"
import {
  Eye,
  Calendar,
  User,
  Phone,
  X,
  Store,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  CreditCard,
  Banknote,
  Search,
  Filter,
  ChevronDown
} from "lucide-react"

export default function AdminOrders() {

  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [customDateRange, setCustomDateRange] = useState({ start: "", end: "" })
  const [customerSearch, setCustomerSearch] = useState("")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [updating, setUpdating] = useState(false)

  // Reuse modal states if they were separate before, but simpler to just show details in one main modal for now or keep logic if needed.
  // The previous implementation had multiple modals (Address, Payment, etc.), simplified here to one main details modal/view to be "modern and user friendly" unless complexity demands separation.
  // I will keep the main modal logic but clean up the UI.

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders")
      const data = await res.json()
      if (data.success) {
        setOrders(data.orders)
      } else {
        console.error('Error fetching orders:', data.error)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  // ... (Keep existing filtering logic helper functions) ...
  const isDateInRange = (orderDate, dateFilter, customRange) => {
    const now = new Date()
    const orderDateObj = new Date(orderDate)

    switch (dateFilter) {
      case "today": return orderDateObj.toDateString() === now.toDateString()
      case "yesterday":
        const yesterday = new Date(now)
        yesterday.setDate(yesterday.getDate() - 1)
        return orderDateObj.toDateString() === yesterday.toDateString()
      case "last_7_days":
        const last7Days = new Date(now)
        last7Days.setDate(last7Days.getDate() - 7)
        return orderDateObj >= last7Days && orderDateObj <= now
      case "last_30_days":
        const last30Days = new Date(now)
        last30Days.setDate(last30Days.getDate() - 30)
        return orderDateObj >= last30Days && orderDateObj <= now
      // ... add other cases if needed
      case "custom":
        if (!customRange.start || !customRange.end) return true
        const startDate = new Date(customRange.start)
        const endDate = new Date(customRange.end)
        endDate.setHours(23, 59, 59, 999)
        return orderDateObj >= startDate && orderDateObj <= endDate
      default: return true
    }
  }

  const getOrderId = (order) => {
    if (order?.orderId) return `#${order.orderId}`
    const mongoId = order?._id || order
    return `#${mongoId.toString().slice(-8).toUpperCase()}`
  }

  const matchesCustomerSearch = (order, searchTerm) => {
    if (!searchTerm.trim()) return true
    const search = searchTerm.toLowerCase().trim()
    const orderIdDisplay = getOrderId(order).toLowerCase()
    const customerName = (order.shippingAddress?.name || order.userId?.name || '').toLowerCase()
    const customerEmail = (order.userId?.email || order.customerEmail || '').toLowerCase()
    const customerPhone = (order.shippingAddress?.phone || '').toLowerCase()
    return orderIdDisplay.includes(search) || customerName.includes(search) || customerEmail.includes(search) || customerPhone.includes(search)
  }

  const filteredOrders = orders.filter((order) => {
    if (filter !== "all" && order.status !== filter) return false
    if (dateFilter !== "all" && !isDateInRange(order.createdAt, dateFilter, customDateRange)) return false
    if (!matchesCustomerSearch(order, customerSearch)) return false
    return true
  })

  // Styling Helpers
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200"
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "cancelled": return "bg-red-100 text-red-700 border-red-200"
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200"
      case "shipping": return "bg-purple-100 text-purple-700 border-purple-200"
      case "out_for_delivery": return "bg-indigo-100 text-indigo-700 border-indigo-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return <CheckCircle size={14} className="mr-1.5" />
      case "pending": return <Clock size={14} className="mr-1.5" />
      case "cancelled": return <XCircle size={14} className="mr-1.5" />
      case "shipping": return <Truck size={14} className="mr-1.5" />
      default: return <Clock size={14} className="mr-1.5" />
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdating(true)
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      const data = await res.json()
      if (data.success) {
        await fetchOrders()
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }
        toast.success(`Order status updated to '${newStatus.replace('_', ' ')}'`)
      } else {
        toast.error(`Failed: ${data.error}`)
      }
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error('Network error')
    } finally {
      setUpdating(false)
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900" style={{ fontFamily: "Sugar, serif" }}>
              Orders Management
            </h1>
            <p className="mt-1 text-sm text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Track and manage customer orders
            </p>
          </div>
          <div className="flex gap-2">
            {/* Could put export button here */}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-2 mb-4 text-[#5A0117]">
            <Filter size={18} />
            <h3 className="font-semibold" style={{ fontFamily: "Sugar, serif" }}>Filters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A0117]/20 focus:border-[#5A0117] appearance-none"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipping">Shipping</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A0117]/20 focus:border-[#5A0117] appearance-none"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="last_7_days">Last 7 Days</option>
                <option value="last_30_days">Last 30 Days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                placeholder="Search Order ID, name, email or phone..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A0117]/20 focus:border-[#5A0117]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              />
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30">
            <span className="text-sm font-medium text-gray-600">
              Showing {filteredOrders.length} orders
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td colSpan="7" className="px-6 py-4">
                        <div className="h-10 bg-gray-50 rounded animate-pulse w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm font-medium text-gray-700">
                        {getOrderId(order)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(order.createdAt).toLocaleDateString('en-IN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="font-medium text-gray-900">{order.shippingAddress?.name || order.userId?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{order.shippingAddress?.phone}</div>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#5A0117]">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {order.paymentMethod === 'cod' ? <Banknote size={16} /> : <CreditCard size={16} />}
                          <span className="capitalize">{order.paymentMethod}</span>
                          <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                            order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {order.paymentStatus || 'pending'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status?.replace('_', ' ')}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                          >
                            View
                          </button>
                          {/* Short inline status update */}
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                            disabled={updating}
                            className="text-xs border-gray-200 rounded py-1 pl-2 pr-6 bg-white focus:ring-[#5A0117] focus:border-[#5A0117]"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipping">Shipping</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                      No orders matching your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900" style={{ fontFamily: "Sugar, serif" }}>
                    Order Details
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">{getOrderId(selectedOrder)} • {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Grid of details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Customer & Shipping</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                        <MapPin className="text-gray-400 shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="font-medium text-gray-900">{selectedOrder.shippingAddress?.name}</p>
                          <p className="text-gray-600">{selectedOrder.shippingAddress?.addressLine1}</p>
                          {selectedOrder.shippingAddress?.addressLine2 && <p className="text-gray-600">{selectedOrder.shippingAddress?.addressLine2}</p>}
                          <p className="text-gray-600">
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                          </p>
                          <p className="text-gray-600 mt-1">{selectedOrder.shippingAddress?.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">₹{selectedOrder.totalAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method</span>
                        <span className="capitalize">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Status</span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 border-b pb-2 mb-4">Ordered Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                        <div className="w-12 h-12 bg-white rounded-md border flex items-center justify-center text-gray-300">
                          <Store size={20} />
                          {/* Actually display image if available in item data, assume name/qty only for now as per schema viewed earlier */}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                        </div>
                        <div className="text-right font-medium text-gray-900">
                          ₹{item.price * item.quantity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
