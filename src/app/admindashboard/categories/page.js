"use client"
import { useState, useEffect } from "react"
import AdminLayout from "../../../components/shared/AdminLayout"
import toast from "react-hot-toast"
import CategoryForm from "../../../components/admin/CategoryForm"
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  Folder,
  FileText,
  ImageIcon
} from "lucide-react"

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories?withHierarchy=true")
      const data = await res.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const url = editingCategory ? `/api/categories/${editingCategory._id}` : "/api/categories"
      const method = editingCategory ? "PUT" : "POST"
      const token = typeof window !== 'undefined' ? localStorage.getItem('kanvei-token') : null

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
        await fetchCategories()
        setShowForm(false)
        setEditingCategory(null)
        setShowForm(false)
        setEditingCategory(null)
        if (editingCategory) {
          toast.success("Category updated successfully!")
        } else {
          toast.success("Category created successfully!")
        }
      } else {
        toast.error(data.error || "Failed to save category")
      }
    } catch (error) {
      console.error("Error submitting category:", error)
      toast.error("Error submitting category")
    }
  }

  const handleDelete = async (categoryId) => {
    if (!confirm("Are you sure you want to delete this category? This will also delete all its subcategories and related products.")) return

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('kanvei-token') : null

      const res = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      })
      const data = await res.json()
      if (data.success) {
        await fetchCategories()
        await fetchCategories()
        toast.success(`Category and ${data.deletedProducts} products deleted successfully!`)
      } else {
        toast.error(data.error || "Failed to delete category")
      }
    } catch (error) {
      console.error("Error deleting category:", error)
      toast.error("Error deleting category")
    }
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCategory(null)
  }

  const countTree = (nodes = []) => nodes.reduce((sum, n) => sum + 1 + countTree(n.subcategories || []), 0)
  const totalCategories = countTree(categories)

  const CategoryNode = ({ node, parentName, level = 0 }) => {
    const [expanded, setExpanded] = useState(true) // Default expanded for better visibility
    const hasChildren = (node.subcategories && node.subcategories.length > 0)

    // Indentation based on recursion level
    const paddingLeft = level * 24

    return (
      <div className="group">
        <div
          className={`
            flex items-center justify-between p-4 rounded-xl border border-transparent 
            hover:bg-gray-50 hover:border-gray-100 transition-all duration-200
            ${level === 0 ? 'bg-white shadow-sm border-gray-100 mb-2' : 'border-l-2 border-l-gray-100 ml-4 pl-4 border-y-0 border-r-0 rounded-none'}
          `}
        >
          <div className="flex items-center gap-4 flex-1">
            {/* Expand Toggle or Spacer */}
            <div className="w-6 flex justify-center flex-shrink-0">
              {hasChildren ? (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="p-1 rounded-md hover:bg-gray-200 text-gray-500 transition-colors"
                >
                  {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <span className="w-4" />
              )}
            </div>

            {/* Icon/Image */}
            <div className="relative">
              {node.image ? (
                <img
                  src={node.image}
                  alt={node.name}
                  className="w-10 h-10 object-cover rounded-lg border border-gray-100 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 bg-[#5A0117]/5 rounded-lg flex items-center justify-center text-[#5A0117]">
                  {parentName ? <FileText size={20} /> : <Folder size={20} />}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate" style={{ fontFamily: "Sugar, serif" }}>
                {node.name}
              </h3>
              <p className="text-xs text-gray-500 truncate mt-0.5" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {level === 0 ?
                  `${node.subcategories?.length || 0} subcategories` :
                  node.description || `Subcategory of ${parentName}`
                }
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleEdit(node)}
              className="p-2 text-gray-400 hover:text-[#8C6141] hover:bg-[#8C6141]/10 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => handleDelete(node._id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Recursive Children */}
        {hasChildren && expanded && (
          <div className="relative">
            {/* Guide Line */}
            {level === 0 && (
              <div className="absolute left-[38px] top-0 bottom-4 w-px bg-gray-100" />
            )}
            <div className="space-y-1">
              {node.subcategories.map((child) => (
                <CategoryNode key={child._id} node={child} parentName={node.name} level={level + 1} />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900" style={{ fontFamily: "Sugar, serif" }}>
              Categories
            </h1>
            <p className="mt-1 text-sm text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Organize your products with categories and subcategories
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#5A0117] hover:bg-[#4a0113] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A0117] transition-colors"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <Plus size={18} className="mr-2" />
              Add Category
            </button>
          )}
        </div>

        {/* Content */}
        {showForm ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <CategoryForm category={editingCategory} onSubmit={handleSubmit} onCancel={handleCancel} />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/30 flex items-center gap-2">
              <FolderTree size={18} className="text-[#5A0117]" />
              <h2 className="text-sm font-semibold text-gray-700">Category Structure ({totalCategories})</h2>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              ) : categories.length > 0 ? (
                <div className="space-y-2">
                  {categories.map((category) => (
                    <CategoryNode key={category._id} node={category} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <FolderTree size={48} className="mx-auto mb-4 text-gray-200" />
                  <p className="font-medium text-gray-900">No categories found</p>
                  <p className="text-sm mt-1">Create your first category to get started</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
