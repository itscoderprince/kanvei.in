import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { validateUserNotBlocked } from "@/lib/auth"
import { sendLoginNotificationEmail, sendAdminLoginNotificationEmail } from "@/lib/email"
import { getClientIP, getUserAgent } from "@/lib/clientInfo"

export async function POST(request) {
  try {
    await connectDB()

    let { email, password } = await request.json()
    email = email?.trim()?.toLowerCase() || ""

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      )
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }

    if (!user.password) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 400 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      )
    }

    const blockValidation = await validateUserNotBlocked(user._id)
    if (!blockValidation.success) {
      return NextResponse.json(
        { success: false, error: blockValidation.error },
        { status: 403 }
      )
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined in environment variables")
      throw new Error("Server configuration error")
    }

    const token = jwt.sign({
      userId: user._id,
      email: user.email,
      role: user.role
    },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    // 7. Handle Notifications (Non-blocking)
    // We perform this asynchronously and dont await it to block the response, 
    // BUT in Vercel/Serverless functions, we MUST await it or the function might freeze before completion.
    // So we await it but catch errors so login doesn't fail.
    const clientIP = getClientIP(request)
    const userAgent = getUserAgent(request)
    const loginTime = new Date()

    try {
      if (user.role === 'admin') {
        await sendAdminLoginNotificationEmail(
          user.email,
          user.name,
          loginTime,
          clientIP,
          userAgent
        )
      } else {
        await sendLoginNotificationEmail(
          user.email,
          user.name,
          'Regular',
          loginTime,
          clientIP,
          userAgent
        )
      }
    } catch (notificationError) {
      console.error("Login notification failed:", notificationError.message)
    }

    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      emailVerified: user.emailVerified
    }

    return NextResponse.json({
      success: true,
      message: "Login successful",
      user: userResponse,
      token,
    })

  } catch (error) {
    console.error("Login route error:", error)
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again later." },
      { status: 500 }
    )
  }
}
