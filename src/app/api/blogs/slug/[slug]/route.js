import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Blog from "@/lib/models/Blog"

export async function GET(request, { params }) {
  await dbConnect()
  const { slug } = await params

  try {
    // Find blog by slug and increment views
    const blog = await Blog.findOneAndUpdate(
      { slug, published: true }, // Only find published blogs
      { $inc: { views: 1 } },
      { new: true }
    )

    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }

    return NextResponse.json(blog) // Return the blog object directly to match frontend expectation
  } catch (error) {
    console.error("Fetch Blog by Slug Error:", error)
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 })
  }
}
