"use client"
import { useRouter } from "next/navigation"
import BlogForm from "@/components/admin/BlogForm"
import toast from "react-hot-toast"

export default function CreateBlogPage() {
    const router = useRouter()

    const handleSubmit = async (data) => {
        try {
            const response = await fetch("/api/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            const result = await response.json()

            if (result.success) {
                toast.success("Blog post created successfully!")
                router.push("/admindashboard/blogs")
            } else {
                toast.error(result.error || "Failed to create blog post")
            }
        } catch (error) {
            console.error("Create Blog Error:", error)
            toast.error("An error occurred while creating the blog post")
        }
    }

    return (
        <BlogForm
            onSubmit={handleSubmit}
            onCancel={() => router.push("/admindashboard/blogs")}
        />
    )
}
