import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Blog, { BlogUtils } from "@/lib/models/Blog"

export async function POST(request) {
  await dbConnect()

  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: "Title and Content are required" },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    if (!body.slug) {
      body.slug = BlogUtils.generateSlug(body.title)
    } else {
      body.slug = BlogUtils.generateSlug(body.slug)
    }

    // Check for duplicate slug
    const existingBlog = await Blog.findOne({ slug: body.slug })
    if (existingBlog) {
      // Append random string to make unique if duplicate
      body.slug = `${body.slug}-${Math.random().toString(36).substring(2, 7)}`
    }

    // Set published date if publishing now
    if (body.published && !body.publishedAt) {
      body.publishedAt = new Date()
    }

    // Calculate Read Time
    body.readTime = BlogUtils.calculateReadTime(body.content)

    const blog = await Blog.create(body)

    return NextResponse.json({ success: true, blog }, { status: 201 })
  } catch (error) {
    console.error("Create Blog Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to create blog post" },
      { status: 500 }
    )
  }
}

export async function GET(request) {
  await dbConnect()

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const tag = searchParams.get("tag") || ""
  const status = searchParams.get("status") // 'published', 'draft', or all

  const skip = (page - 1) * limit

  const query = {}

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ]
  }

  if (tag) {
    query.tags = tag
  }

  if (status === "published") {
    query.published = true
  } else if (status === "draft") {
    query.published = false
  }

  try {
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Blog.countDocuments(query)

    return NextResponse.json({
      success: true,
      blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Fetch Blogs Error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch blogs" },
      { status: 500 }
    )
  }
}
