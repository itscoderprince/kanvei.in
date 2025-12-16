import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import User from "../../../../lib/models/User"
import OTP from "../../../../lib/models/OTP"
import jwt from "jsonwebtoken"
import { validateUserNotBlocked } from "../../../../lib/auth"
import { sendLoginNotificationEmail, sendAdminLoginNotificationEmail } from "../../../../lib/email"
import { getClientIP, getUserAgent } from "../../../../lib/clientInfo"

export async function POST(request) {
  try {
    console.log("🚀 [API] POST /api/auth/verify-otp started")
    await connectDB()
    console.log("✅ [API] DB Connected")

    let { email, otp, type, userData } = await request.json()
    console.log(`📩 [API] Request received: email=${email}, otp=${otp}, type=${type}`)

    if (!email || !otp || !type) {
      console.error("❌ [API] Missing fields")
      return NextResponse.json({ success: false, error: "Email, OTP, and type are required" }, { status: 400 })
    }

    // Normalize type
    if (type === "forgot-password") {
      console.log("🔄 [API] Normalizing type 'forgot-password' -> 'password-reset'")
      type = "password-reset"
    }

    // Find and verify OTP
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type,
      expiresAt: { $gt: new Date() },
      verified: false,
    })

    if (!otpRecord) {
      console.warn(`⚠️ [API] Invalid or expired OTP. Query: { email: ${email}, otp: ${otp}, type: ${type} }`)
      return NextResponse.json({ success: false, error: "Invalid or expired OTP" }, { status: 400 })
    }
    console.log("✅ [API] OTP Record found")

    // Mark OTP as verified
    otpRecord.verified = true
    await otpRecord.save()
    console.log("💾 [API] OTP marked as verified")

    let user

    if (type === "login" || type === "password-reset") {
      // Find existing user for login or password reset
      console.log("🔍 [API] Finding user for login/reset")
      user = await User.findOne({ email })
      if (!user) {
        console.warn(`⚠️ [API] User not found: ${email}`)
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
      }

      // Check if user is blocked
      const blockValidation = await validateUserNotBlocked(user._id)
      if (!blockValidation.success) {
        console.warn(`⛔ [API] User blocked: ${email}`)
        return NextResponse.json({ success: false, error: blockValidation.error }, { status: 403 })
      }

      // If it's just verification for password reset, we can return early
      if (type === "password-reset") {
        console.log("✅ [API] Password reset OTP verified successfully")
        return NextResponse.json({
          success: true,
          message: "OTP verified successfully",
          email: user.email // confirm email for next step
        })
      }

    } else if (type === "register") {
      // Create new user for registration
      console.log("📝 [API] processing registration")
      if (!userData || !userData.name) {
        console.error("❌ [API] Missing userData name for registration")
        return NextResponse.json(
          { success: false, error: "Name is required for registration" },
          { status: 400 },
        )
      }

      const bcrypt = require("bcryptjs")
      const crypto = require("crypto")

      // If password is not provided (OTP registration), generate a random safe password
      const plainPassword = userData.password || crypto.randomBytes(16).toString("hex")
      const hashedPassword = await bcrypt.hash(plainPassword, 12)

      user = await User.create({
        name: userData.name,
        email,
        password: hashedPassword,
        role: "user",
      })
      console.log(`✅ [API] User created: ${user._id}`)

      // Check if newly created user account is blocked (edge case)
      const blockValidation = await validateUserNotBlocked(user._id)
      if (!blockValidation.success) {
        // Delete the newly created user if they're blocked
        await User.findByIdAndDelete(user._id)
        return NextResponse.json({ success: false, error: blockValidation.error }, { status: 403 })
      }
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" })

    // Remove password from user object
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    // Send login notification email for OTP login (only if it's login, not registration)
    if (type === "login") {
      const clientIP = getClientIP(request)
      const userAgent = getUserAgent(request)
      const loginTime = new Date()

      try {
        if (user.role === 'admin') {
          console.log('📧 Sending admin OTP login notification to:', user.email)
          await sendAdminLoginNotificationEmail(
            user.email,
            user.name,
            loginTime,
            clientIP,
            userAgent
          )
          console.log('✅ Admin OTP login notification sent successfully')
        } else {
          console.log('📧 Sending OTP login notification to:', user.email)
          await sendLoginNotificationEmail(
            user.email,
            user.name,
            'OTP Login',
            loginTime,
            clientIP,
            userAgent
          )
          console.log('✅ OTP login notification sent successfully')
        }
      } catch (emailError) {
        console.error('❌ Failed to send OTP login notification:', emailError)
        // Don't block login if email fails
      }
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("❌ [API] Verify OTP error:", error)
    return NextResponse.json({ success: false, error: "Failed to verify OTP" }, { status: 500 })
  }
}
