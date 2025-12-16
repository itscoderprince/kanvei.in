"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  FileText,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreVertical
} from "lucide-react"
import toast from "react-hot-toast"
import { useDebounce } from "@/hooks/useDebounce"

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 })
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  useEffect(() => {
    fetchBlogs()
  }, [debouncedSearch, statusFilter, pagination.page])

  const fetchBlogs = async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        page: pagination.page,
        limit: 10,
        search: debouncedSearch,
        status: statusFilter
      })

      const response = await fetch(`/api/blogs?${queryParams}`)
      const data = await response.json()

      if (data.success) {
        setBlogs(data.blogs)
        setPagination(data.pagination)
      } else {
        toast.error("Failed to fetch blogs")
      }
    } catch (error) {
      toast.error("Error loading data")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return

    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "DELETE"
      })
      const data = await response.json()

      if (data.success) {
        toast.success("Blog deleted successfully")
        fetchBlogs()
      } else {
        toast.error(data.error || "Failed to delete blog")
      }
    } catch (error) {
      toast.error("Error deleting blog")
    }
  }

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-[#5A0117]">Blog Management</h1>
          <p className="text-gray-500 mt-1">Create, edit, and manage your blog posts</p>
        </div>
        <Link
          href="/admindashboard/blogs/create"
          className="inline-flex items-center gap-2 bg-[#5A0117] text-white px-5 py-3 rounded-xl hover:bg-[#5A0117]/90 transition-all font-medium shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Plus size={20} /> Create blog
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search blogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#5A0117] focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <Filter size={16} className="text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm text-gray-700 cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="animate-spin text-[#5A0117]" size={32} />
          </div>
        ) : blogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#5A0117] text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold text-sm">Post Details</th>
                  <th className="px-6 py-4 font-semibold text-sm">Status</th>
                  <th className="px-6 py-4 font-semibold text-sm">Stats</th>
                  <th className="px-6 py-4 font-semibold text-sm">Date</th>
                  <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex gap-4 items-center">
                        {blog.heroImage ? (
                          <img src={blog.heroImage} alt={blog.title} className="w-16 h-12 object-cover rounded-lg border border-gray-200" />
                        ) : (
                          <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                            <FileText size={20} />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900 group-hover:text-[#5A0117] transition-colors line-clamp-1">{blog.title}</h3>
                          <p className="text-sm text-gray-500 line-clamp-1">{blog.subtitle || blog.description.substring(0, 40)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${blog.published
                        ? "bg-green-50 text-green-700 border-green-100"
                        : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}>
                        {blog.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-600 text-sm">
                        <Eye size={14} />
                        <span>{blog.views}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Calendar size={14} />
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admindashboard/blogs/edit/${blog._id}`}
                          className="p-2 text-gray-500 hover:text-[#5A0117] hover:bg-[#5A0117]/5 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog._id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-80 text-center p-8">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FileText size={40} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No blog posts found</h3>
            <p className="text-gray-500 max-w-sm mt-1 mb-6">Start creating content to engage with your audience and improve SEO.</p>
            <Link
              href="/admindashboard/blogs/create"
              className="inline-flex items-center gap-2 bg-[#5A0117] text-white px-5 py-2.5 rounded-xl hover:bg-[#5A0117]/90 transition-all font-medium"
            >
              <Plus size={18} /> Create First Post
            </Link>
          </div>
        )}

        {/* Pagination */}
        {blogs.length > 0 && pagination.pages > 1 && (
          <div className="border-t border-gray-100 p-4 bg-gray-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Showing page <span className="font-semibold text-gray-900">{pagination.page}</span> of <span className="font-semibold text-gray-900">{pagination.pages}</span> (Total: {pagination.total})
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page <= 1}
                className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page >= pagination.pages}
                className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
