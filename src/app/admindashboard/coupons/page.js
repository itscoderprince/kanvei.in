"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "../../../components/shared/AdminLayout"
import CouponForm from "../../../components/admin/CouponForm"
import { useNotification } from "../../../contexts/NotificationContext"
import {
  Ticket,
  Plus,
  Calendar,
  Percent,
  IndianRupee,
  Trash2,
  Edit2,
  Power,
  Copy
} from "lucide-react"

export default function AdminCoupons() {
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const { showNotification } = useNotification()
  const router = useRouter()

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/coupons/admin")
      const data = await res.json()
      if (data.success) {
        setCoupons(data.coupons)
      }
    } catch (error) {
      console.error("Error fetching coupons:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const url = editingCoupon ? `/api/coupons/${editingCoupon._id}` : "/api/coupons/admin"
      const method = editingCoupon ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success) {
        await fetchCoupons()
        setShowForm(false)
        setEditingCoupon(null)
        showNotification(editingCoupon ? "Coupon updated!" : "Coupon created!", "success")
      } else {
        showNotification("Error: " + data.error, "error")
      }
    } catch (error) {
      console.error("Error submitting coupon:", error)
      showNotification("Error submitting coupon", "error")
    }
  }

  const handleDelete = async (couponId) => {
    if (!confirm("Delete this coupon?")) return
    try {
      const res = await fetch(`/api/coupons/${couponId}`, { method: "DELETE" })
      const data = await res.json()
      if (data.success) {
        await fetchCoupons()
        showNotification("Coupon deleted!", "success")
      } else {
        showNotification("Error: " + data.error, "error")
      }
    } catch (error) {
      console.error("Error deleting coupon:", error)
      showNotification("Error deleting coupon", "error")
    }
  }

  const handleToggleStatus = async (coupon) => {
    try {
      const res = await fetch(`/api/coupons/${coupon._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      })
      const data = await res.json()
      if (data.success) {
        await fetchCoupons()
        showNotification(`Coupon ${coupon.isActive ? 'deactivated' : 'activated'}!`, "success")
      } else {
        showNotification("Error: " + data.error, "error")
      }
    } catch (error) {
      showNotification("Error updating status", "error")
    }
  }

  const handleEdit = (coupon) => { setEditingCoupon(coupon); setShowForm(true); }
  const handleCancel = () => { setShowForm(false); setEditingCoupon(null); }
  const isExpired = (coupon) => new Date() > new Date(coupon.validTo)
  const isNotYetActive = (coupon) => new Date() < new Date(coupon.validFrom)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900" style={{ fontFamily: "Sugar, serif" }}>
              Coupons
            </h1>
            <p className="mt-1 text-sm text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Create and manage discount codes
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#5A0117] hover:bg-[#4a0113] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <Plus size={18} className="mr-2" />
              Add Coupon
            </button>
          )}
        </div>

        {/* Content */}
        {showForm ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <CouponForm coupon={editingCoupon} onSubmit={handleSubmit} onCancel={handleCancel} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [...Array(3)].map((_, i) => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>)
            ) : coupons.length > 0 ? (
              coupons.map((coupon) => {
                const active = coupon.isActive && !isExpired(coupon) && !isNotYetActive(coupon)
                const statusColor = active ? 'border-green-200 bg-green-50' : !coupon.isActive ? 'border-gray-200 bg-gray-50' : 'border-red-200 bg-red-50'
                const textColor = active ? 'text-green-700' : 'text-gray-500'

                return (
                  <div key={coupon._id} className={`rounded-xl border-2 p-5 relative overflow-hidden group transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${statusColor}`}>
                    {/* Ticket Dotted Line Effect or visuals */}
                    <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/30 skew-x-12 translate-x-4"></div>

                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-white px-3 py-1 rounded font-mono font-bold text-lg border border-gray-200 shadow-sm flex items-center gap-2">
                        {coupon.code}
                        <button className="text-gray-400 hover:text-gray-600" onClick={() => { navigator.clipboard.writeText(coupon.code); showNotification("Copied!", "success") }}>
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className={`text-xs font-bold px-2 py-1 rounded uppercase ${active ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                        {coupon.isActive ? (isExpired(coupon) ? 'Expired' : isNotYetActive(coupon) ? 'Scheduled' : 'Active') : 'Inactive'}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 h-10">{coupon.description}</p>

                    <div className="space-y-2 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        {coupon.discountType === 'percentage' ? <Percent size={16} className="text-[#5A0117]" /> : <IndianRupee size={16} className="text-[#5A0117]" />}
                        <span className="font-semibold text-gray-900">{coupon.discountValue}{coupon.discountType === 'percentage' ? '%' : ' OFF'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-[#8C6141]" />
                        <span>{new Date(coupon.validFrom).toLocaleDateString()} - {new Date(coupon.validTo).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200/50">
                      <button onClick={() => handleToggleStatus(coupon)} className={`p-2 rounded-lg transition-colors ${coupon.isActive ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`} title={coupon.isActive ? "Deactivate" : "Activate"}>
                        <Power size={18} />
                      </button>
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(coupon)} className="p-2 bg-white text-gray-600 border border-gray-200 rounded-lg hover:text-[#5A0117] hover:border-[#5A0117] transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(coupon._id)} className="p-2 bg-white text-gray-600 border border-gray-200 rounded-lg hover:text-red-500 hover:border-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="col-span-full py-12 text-center text-gray-400">
                <Ticket size={48} className="mx-auto mb-4 text-gray-200" />
                <p className="font-medium text-gray-900">No coupons found</p>
                <p className="text-sm mt-1">Create discount codes to boost sales</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
