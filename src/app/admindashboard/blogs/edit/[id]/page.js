"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import BlogForm from "@/components/admin/BlogForm"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"

export default function EditBlogPage() {
  const router = useRouter()
  const params = useParams()
  const { id } = params

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchBlog = useCallback(async () => {
    try {
      const response = await fetch(`/api/blogs/${id}`)
      const data = await response.json()
      if (data.success) {
        setBlog(data.blog)
      } else {
        toast.error("Failed to fetch blog details")
        router.push("/admindashboard/blogs")
      }
    } catch (error) {
      toast.error("Error loading blog")
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchBlog()
  }, [fetchBlog])

  const handleSubmit = async (data) => {
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Blog updated successfully!")
        router.push("/admindashboard/blogs")
      } else {
        toast.error(result.error || "Failed to update blog")
      }
    } catch (error) {
      console.error("Update Blog Error:", error)
      toast.error("An error occurred while updating the blog")
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#5A0117]" size={40} />
      </div>
    )
  }

  return (
    <BlogForm
      blog={blog}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/admindashboard/blogs")}
    />
  )
}
