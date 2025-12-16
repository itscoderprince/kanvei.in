import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Blog, { BlogUtils } from "@/lib/models/Blog"

export async function GET(request, { params }) {
  await dbConnect()
  const { id } = params

  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, blog })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  await dbConnect()
  const { id } = params

  try {
    const body = await request.json()

    // Regenerate slug if title/slug changed
    if (body.slug) {
      body.slug = BlogUtils.generateSlug(body.slug)
    }

    // Recalculate read time if content changed
    if (body.content) {
      body.readTime = BlogUtils.calculateReadTime(body.content)
    }

    // Handle publishing date logic
    if (body.published === true) {
      // If it was already published, keep original date, else set new
      // We need to fetch current to know but for simplicity we can check if body has publishedAt
      if (!body.publishedAt) {
        body.publishedAt = new Date()
      }
    }

    const blog = await Blog.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, blog })
  } catch (error) {
    console.error("Update Blog Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update blog" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  await dbConnect()
  const { id } = params

  try {
    const blog = await Blog.findByIdAndDelete(id)
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Blog deleted successfully" })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete blog" }, { status: 500 })
  }
}
