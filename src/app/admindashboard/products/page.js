"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "../../../components/shared/AdminLayout"
import ProductForm from "../../../components/admin/ProductForm"
import { useNotification } from "../../../contexts/NotificationContext"
import {
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MoreVertical,
  Package,
  Image as ImageIcon,
  ChevronDown,
  X
} from "lucide-react"

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })
  const [dateFilterType, setDateFilterType] = useState("") // preset or custom
  const { showNotification } = useNotification()
  const router = useRouter()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const filterProducts = useCallback(() => {
    let filtered = [...allProducts]

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(product => {
        const productDate = new Date(product.createdAt)
        const startDate = dateRange.start ? new Date(dateRange.start) : null
        const endDate = dateRange.end ? new Date(dateRange.end) : null

        if (startDate && endDate) {
          return productDate >= startDate && productDate <= endDate
        } else if (startDate) {
          return productDate >= startDate
        } else if (endDate) {
          return productDate <= endDate
        }
        return true
      })
    }

    setProducts(filtered)
  }, [searchTerm, selectedCategory, dateRange, allProducts])

  useEffect(() => {
    filterProducts()
  }, [filterProducts])

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setDateRange({ start: "", end: "" })
    setDateFilterType("")
  }

  const handlePresetDateFilter = (filterType) => {
    const today = new Date()
    const formatDate = (date) => date.toISOString().split('T')[0]

    let startDate = null
    let endDate = formatDate(today)

    switch (filterType) {
      case '1week': startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); break
      case '2weeks': startDate = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000); break
      case '1month': startDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); break
      case '6months': startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()); break
      case '1year': startDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate()); break
      case 'custom':
        setDateRange({ start: "", end: "" })
        setDateFilterType('custom')
        return
      default:
        setDateRange({ start: "", end: "" })
        setDateFilterType("")
        return
    }

    if (startDate) {
      setDateRange({ start: formatDate(startDate), end: endDate })
    }
    setDateFilterType(filterType)
  }

  const handleSubmit = async (formData) => {
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products"
      const method = editingProduct ? "PUT" : "POST"
      const token = typeof window !== 'undefined' ? localStorage.getItem('kanvei-token') : null

      if (editingProduct && formData.removedImages) {
        formData.removedImages = formData.removedImages
      }

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (data.success) {
        await fetchProducts()
        setShowForm(false)
        setEditingProduct(null)
        showNotification(
          editingProduct ? "Product updated successfully!" : "Product created successfully!",
          "success"
        )
      } else {
        showNotification("Error: " + data.error, "error")
      }
    } catch (error) {
      console.error("Error submitting product:", error)
      showNotification("Error submitting product", "error")
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('kanvei-token') : null
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
      const data = await res.json()
      if (data.success) {
        await fetchProducts()
        showNotification("Product deleted successfully!", "success")
      } else {
        showNotification("Error: " + data.error, "error")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      showNotification("Error deleting product", "error")
    }
  }

  const handleEdit = async (product) => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('kanvei-token') : null
      const res = await fetch(`/api/products/${product._id}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })

      const data = await res.json()
      if (data.success) {
        setEditingProduct(data.product)
        setShowForm(true)
      } else {
        showNotification("Error fetching product details", "error")
      }
    } catch (error) {
      console.error("Error fetching product for edit:", error)
      showNotification("Error loading product details", "error")
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProduct(null)
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900" style={{ fontFamily: "Sugar, serif" }}>
              Products
            </h1>
            <p className="mt-1 text-sm text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Manage your store&apos;s product inventory
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#5A0117] hover:bg-[#4a0113] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A0117] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <Plus size={18} className="mr-2" />
              Add Product
            </button>
          )}
        </div>

        {/* Content Area */}
        {showForm ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <ProductForm product={editingProduct} onSubmit={handleSubmit} onCancel={handleCancel} />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-2 mb-4 text-[#5A0117]">
                <Filter size={18} />
                <h3 className="font-semibold" style={{ fontFamily: "Sugar, serif" }}>Filters</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A0117]/20 focus:border-[#5A0117]"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  />
                </div>

                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A0117]/20 focus:border-[#5A0117] appearance-none"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>

                <div className="relative">
                  <select
                    value={dateFilterType}
                    onChange={(e) => handlePresetDateFilter(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#5A0117]/20 focus:border-[#5A0117] appearance-none"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <option value="">Sort by Date</option>
                    <option value="1week">Last 1 Week</option>
                    <option value="1month">Last 1 Month</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>

                {(searchTerm || selectedCategory || dateFilterType) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2.5 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={16} /> Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                <span className="text-sm font-medium text-gray-600">
                  Showing {products.length} of {allProducts.length} products
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50/50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">Image</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          <td colSpan="6" className="px-6 py-4">
                            <div className="h-10 bg-gray-50 rounded animate-pulse w-full"></div>
                          </td>
                        </tr>
                      ))
                    ) : products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
                              {product.images?.[0] ? (
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                  <ImageIcon size={20} />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-gray-900 line-clamp-1">{product.name}</span>
                              {product.featured && (
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#8C6141]/10 text-[#8C6141] w-fit mt-1">
                                  Featured
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {product.category}
                          </td>
                          <td className="px-6 py-4 font-medium text-[#5A0117]">
                            ₹{product.price}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.stock > 10 ? 'bg-green-50 text-green-700' :
                              product.stock > 0 ? 'bg-yellow-50 text-yellow-700' :
                                'bg-red-50 text-red-700'
                              }`}>
                              {product.stock} in stock
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 text-gray-400">
                              <button
                                onClick={() => handleEdit(product)}
                                className="p-2 hover:bg-[#8C6141]/10 hover:text-[#8C6141] rounded-lg transition-colors"
                                title="Edit"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400">
                            <Package size={48} className="mb-4 text-gray-200" />
                            <p className="text-lg font-medium text-gray-900">No products found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
