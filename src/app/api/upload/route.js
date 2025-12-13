import { uploadBuffer, deleteImage } from "../../../lib/cloudinary"
import sharp from "sharp"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { getAuthUser } from "../../../lib/auth"
import connectDB from "../../../lib/mongodb"
import User from "../../../lib/models/User"

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    let isAdmin = Boolean(session && session.user?.role === "admin")

    if (!isAdmin) {
      const authUser = await getAuthUser(request)
      if (authUser?.userId) {
        await connectDB()
        const dbUser = await User.findById(authUser.userId)
        if (dbUser && dbUser.role === "admin") {
          isAdmin = true
        }
      }
    }

    if (!isAdmin) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    // Optimization: Support multiple files for batch upload
    const files = formData.getAll("file")
    const folderInput = (formData.get("folder") || "").toString().trim()
    const folder = folderInput && folderInput.length > 0 ? folderInput : "kanvei/products"

    // Get custom dimensions for blog images
    const customWidth = formData.get("width") ? parseInt(formData.get("width")) : 1000
    const customHeight = formData.get("height") ? parseInt(formData.get("height")) : 1000

    if (!files || files.length === 0) {
      return Response.json({ success: false, error: "No file provided" }, { status: 400 })
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"]

    // Process all files in parallel
    const uploadPromises = files.map(async (file) => {
      try {
        const contentType = file.type || ""
        if (!validTypes.includes(contentType)) {
          return { success: false, error: "Unsupported file type", fileName: file.name }
        }

        // Read file into Buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const originalSize = buffer.length

        // Get metadata in parallel with resizing if valid image
        // const originalMetaPromise = sharp(buffer).metadata() 

        // Optimization: Resize and convert to WebP buffer directly
        // Stream directly to Cloudinary without base64 encoding (30% size reduction, faster CPU)
        const processPromise = sharp(buffer)
          .resize({ width: customWidth, height: customHeight, fit: "cover", position: "centre" })
          .webp({ quality: 80 })
          .toBuffer({ resolveWithObject: true }) // Get buffer and info together

        const [
          // originalMeta, 
          { data: processedBuffer, info: processedInfo }
        ] = await Promise.all([
          // originalMetaPromise,
          processPromise
        ])

        const processedSize = processedBuffer.length

        // Upload Buffer directly to Cloudinary
        const result = await uploadBuffer(processedBuffer, folder)

        if (result.success) {
          return {
            success: true,
            url: result.url,
            publicId: result.publicId,
            originalSize,
            processedSize,
            // Skip metadata for extreme speed unless strictly needed? 
            // Retaining basic dimensions from process info
            processedWidth: processedInfo.width,
            processedHeight: processedInfo.height,
            fileName: file.name
          }
        } else {
          return { success: false, error: result.error, fileName: file.name }
        }
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err)
        return { success: false, error: "Processing failed", fileName: file.name }
      }
    })

    const results = await Promise.all(uploadPromises)

    // Check strict success if we want to fail fast? No, partial success is better for batch.

    // BACKWARD COMPATIBILITY:
    // If request contained exactly one file, return the single object structure directly
    // so existing frontends don't break.
    if (files.length === 1) {
      const singleResult = results[0]
      if (singleResult.success) {
        return Response.json(singleResult)
      } else {
        return Response.json({ success: false, error: singleResult.error }, { status: 500 })
      }
    }

    // For multiple files, return an array structure
    const successCount = results.filter(r => r.success).length
    return Response.json({
      success: true,
      count: successCount,
      total: files.length,
      files: results
    })

  } catch (error) {
    console.error("Upload error:", error)
    return Response.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const session = await getServerSession(authOptions)
    let isAdmin = Boolean(session && session.user?.role === "admin")

    if (!isAdmin) {
      const authUser = await getAuthUser(request)
      if (authUser?.userId) {
        await connectDB()
        const dbUser = await User.findById(authUser.userId)
        if (dbUser && dbUser.role === "admin") {
          isAdmin = true
        }
      }
    }

    if (!isAdmin) {
      return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    const { publicId } = await request.json()
    if (!publicId || typeof publicId !== "string") {
      return Response.json({ success: false, error: "publicId required" }, { status: 400 })
    }

    const result = await deleteImage(publicId)
    if (!result.success) {
      return Response.json({ success: false, error: result.error || "Delete failed" }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error("Delete upload error:", error)
    return Response.json({ success: false, error: "Delete failed" }, { status: 500 })
  }
}
