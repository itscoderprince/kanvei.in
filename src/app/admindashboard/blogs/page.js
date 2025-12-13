"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import AdminLayout from "../../../components/shared/AdminLayout"
import ProtectedRoute from "../../../components/ProtectedRoute"
import { useNotification } from "../../../contexts/NotificationContext"
import {
  Edit,
  Plus,
  Trash2,
  Search,
  Filter,
  ArrowUpDown,
  FileText,
  Activity,
  MoreHorizontal,
  Eye,
  Calendar,
  Clock
} from "lucide-react"

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    fetchBlogs()
  }, [filterStatus, sortBy, searchTerm])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()

      if (filterStatus !== "all") {
        params.append("published", filterStatus === "published" ? "true" : "false")
      }
      if (searchTerm) {
        params.append("search", searchTerm)
      }
      params.append("sort", sortBy)

      const response = await fetch(`/api/blogs?${params}`)
      const data = await response.json()
      setBlogs(data.blogs || [])
    } catch (error) {
      console.error("Error fetching blogs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this blog?")) return

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        const result = await response.json()
        setBlogs(blogs.filter((blog) => blog._id !== id))
        showSuccess(`🗑️ Blog deleted successfully! ${result.imageDeleted ? 'Image also removed from cloud storage.' : ''}`)
      } else {
        const error = await response.json()
        showError(`❌ Failed to delete blog: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error deleting blog:", error)
      showError("❌ Failed to delete blog. Please try again.")
    }
  }

  const togglePublished = async (id, currentStatus) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ published: !currentStatus }),
      })

      if (response.ok) {
        fetchBlogs()
        const newStatus = !currentStatus
        showSuccess(`✅ Blog ${newStatus ? 'published' : 'unpublished'} successfully!`)
      } else {
        const error = await response.json()
        showError(`❌ Failed to update blog status: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      console.error("Error updating blog:", error)
      showError("❌ Failed to update blog status. Please try again.")
    }
  }

  return (
    <ProtectedRoute adminOnly={true}>
      <AdminLayout>
        <div className="p-6 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold font-serif text-[#5A0117]">
                Blog Management
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your blog posts, publication status, and content.
              </p>
            </div>
            <Link
              href="/admindashboard/blogs/new"
              className="inline-flex items-center justify-center gap-2 bg-[#5A0117] text-white px-5 py-2.5 rounded-xl hover:bg-[#5A0117]/90 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus size={20} />
              <span className="font-medium">Create New Blog</span>
            </Link>
          </div>

          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 sticky top-4 z-10 backdrop-blur-xl bg-white/95">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A0117] focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                />
              </div>

              {/* Status Filter */}
              <div className="relative group">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" size={18} />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A0117] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Drafts</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ArrowUpDown size={14} />
                </div>
              </div>

              {/* Sort */}
              <div className="relative group">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" size={18} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A0117] focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title A-Z</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                  <ArrowUpDown size={14} />
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {loading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#5A0117] border-t-transparent" />
                <p className="text-gray-500 font-medium">Loading your articles...</p>
              </div>
            ) : blogs.length === 0 ? (
              <div className="p-16 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FileText size={32} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">No blogs found</h3>
                <p className="text-gray-500 max-w-xs mx-auto mb-6">
                  {searchTerm
                    ? "Try adjusting your search or filters to find what you're looking for."
                    : "Get started by creating your first blog post to engage your audience."
                  }
                </p>
                <Link
                  href="/admindashboard/blogs/new"
                  className="inline-flex items-center gap-2 bg-[#5A0117] text-white px-6 py-2.5 rounded-xl hover:bg-[#5A0117]/90 transition-all font-medium"
                >
                  <Plus size={18} /> Create Post
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#5A0117]/5 border-b border-[#5A0117]/10 text-left">
                      <th className="px-6 py-4 text-xs font-bold text-[#5A0117] uppercase tracking-wider">Article Details</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#5A0117] uppercase tracking-wider">Author</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#5A0117] uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#5A0117] uppercase tracking-wider">Published Date</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#5A0117] uppercase tracking-wider">Read Time</th>
                      <th className="px-6 py-4 text-xs font-bold text-[#5A0117] uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {blogs.map((blog) => (
                      <tr key={blog._id} className="group hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 max-w-md">
                          <div className="flex items-start gap-4">
                            {blog.heroImage ? (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100">
                                <img src={blog.heroImage} alt="" className="w-full h-full object-cover" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-gray-400">
                                <FileText size={20} />
                              </div>
                            )}
                            <div>
                              <div className="font-semibold text-gray-900 group-hover:text-[#5A0117] transition-colors mb-0.5 line-clamp-1">
                                {blog.title}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">{blog.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-700">{blog.author || "Anonymous"}</div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => togglePublished(blog._id, blog.published)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${blog.published
                                ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${blog.published ? "bg-green-500" : "bg-yellow-500"}`} />
                            {blog.published ? "Published" : "Draft"}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gray-400" />
                            {new Date(blog.createdAt).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center gap-2">
                            <Activity size={14} className="text-gray-400" />
                            {blog.readTime ? `${blog.readTime} min read` : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`/admindashboard/blogs/edit/${blog._id}`}
                              className="p-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-[#5A0117] hover:border-[#5A0117]/30 transition-all shadow-sm"
                              title="Edit Blog"
                            >
                              <Edit size={16} />
                            </Link>
                            <button
                              onClick={() => handleDelete(blog._id)}
                              className="p-2 text-red-600 bg-white border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all shadow-sm"
                              title="Delete Blog"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
