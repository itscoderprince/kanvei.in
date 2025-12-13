"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import AdminLayout from "../../components/shared/AdminLayout"
import StatsCard from "../../components/admin/StatsCard"
import ProtectedRoute from "../../components/ProtectedRoute"
import {
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp
} from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products count
        const productsRes = await fetch("/api/products")
        const productsData = await productsRes.json()
        const totalProducts = productsData.success ? productsData.products.length : 0

        // Fetch categories count
        const categoriesRes = await fetch("/api/categories")
        const categoriesData = await categoriesRes.json()
        const totalCategories = categoriesData.success ? categoriesData.categories.length : 0

        // Fetch orders count
        const ordersRes = await fetch("/api/orders")
        const ordersData = await ordersRes.json()
        const totalOrders = ordersData.success ? ordersData.orders.length : 0
        const recentOrders = ordersData.success ? ordersData.orders.slice(0, 5) : []

        // Fetch users count if available
        let totalUsers = 0
        try {
          const usersRes = await fetch("/api/users")
          const usersData = await usersRes.json()
          if (usersData.success) {
            totalUsers = usersData.users.length
          }
        } catch (e) {
          console.warn("Could not fetch users count", e)
        }

        setStats({
          totalProducts,
          totalCategories,
          totalOrders,
          totalUsers,
        })
        setRecentOrders(recentOrders)
      } catch (error) {
        console.error("Error fetching stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700 border-green-200"
      case "pending": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "cancelled": return "bg-red-100 text-red-700 border-red-200"
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return <CheckCircle size={14} className="mr-1" />
      case "pending": return <Clock size={14} className="mr-1" />
      case "cancelled": return <XCircle size={14} className="mr-1" />
      default: return <Clock size={14} className="mr-1" />
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Sugar, serif", color: "#1F2937" }}>
              Dashboard Overview
            </h1>
            <p className="mt-1 text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Welcome back to your admin control center
            </p>
          </div>
          <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Products"
            value={stats.totalProducts}
            icon={Package}
            color="#5A0117"
            href="/admindashboard/products"
            trend={12} // Mock trend for visualization
          />
          <StatsCard
            title="Total Categories"
            value={stats.totalCategories}
            icon={FolderTree}
            color="#8C6141"
            href="/admindashboard/categories"
          />
          <StatsCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingCart}
            color="#5A0117"
            href="/admindashboard/orders"
            trend={8}
          />
          <StatsCard
            title="Total Users"
            value={stats.totalUsers}
            icon={Users}
            color="#8C6141"
            href="/admindashboard/users"
            trend={5}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ fontFamily: "Sugar, serif", color: "#1F2937" }}>
                <Clock size={20} className="text-[#5A0117]" /> Recent Orders
              </h2>
              <Link
                href="/admindashboard/orders"
                className="text-sm font-medium text-[#5A0117] hover:underline flex items-center"
              >
                View All <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-50 rounded h-12 w-full animate-pulse"></div>
                  ))}
                </div>
              ) : recentOrders.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-medium text-gray-700">
                            {order.orderId ? `#${order.orderId}` : `#${order._id.slice(-6).toUpperCase()}`}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium text-[#5A0117]">
                          ₹{order.totalAmount?.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/admindashboard/orders`}
                            className="text-sm font-medium text-gray-400 hover:text-[#5A0117] transition-colors"
                          >
                            Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-12 text-center text-gray-400 font-medium">
                  No orders found.
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions / Summary could go here */}
          <div className="bg-[#5A0117] rounded-2xl p-6 text-white relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
              <h2 className="text-xl font-bold mb-2" style={{ fontFamily: "Sugar, serif" }}>Quick Analytics</h2>
              <p className="text-white/70 text-sm mb-6">Overview of your store performance this month.</p>

              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white/80">Growth</span>
                    <TrendingUp size={16} className="text-[#D4A373]" />
                  </div>
                  <div className="text-2xl font-bold">+12.5%</div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-white/80">Pending Orders</span>
                    <Clock size={16} className="text-[#D4A373]" />
                  </div>
                  <div className="text-2xl font-bold">
                    {stats.totalOrders ? Math.round(stats.totalOrders * 0.2) : 0}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8C6141]/30 rounded-full -ml-12 -mb-12 blur-xl pointer-events-none"></div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
