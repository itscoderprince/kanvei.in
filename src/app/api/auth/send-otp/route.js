import { NextResponse } from "next/server"
import connectDB from "../../../../lib/mongodb"
import User from "../../../../lib/models/User"
import OTP from "../../../../lib/models/OTP"
import { sendEmail } from "../../../../lib/email"

export async function POST(request) {
  try {
    console.log("🚀 [API] POST /api/auth/send-otp started")
    await connectDB()
    console.log("✅ [API] DB Connected")

    let { email, type } = await request.json()
    console.log(`📩 [API] Request received for: ${email}, type: ${type}`)

    if (!email || !type) {
      console.error("❌ [API] Email or type missing")
      return NextResponse.json({ success: false, error: "Email and type are required" }, { status: 400 })
    }

    // Normalize type: treat 'forgot-password' as 'password-reset' to match DB and other routes
    if (type === "forgot-password") {
      console.log("🔄 [API] Normalizing type 'forgot-password' -> 'password-reset'")
      type = "password-reset"
    }

    // For login OTP or Password Reset, check if user exists
    if (type === "login" || type === "password-reset") {
      const existingUser = await User.findOne({ email })
      if (!existingUser) {
        console.warn(`⚠️ [API] No user found for ${email}`)
        return NextResponse.json({ success: false, error: "No account found with this email" }, { status: 404 })
      }
      console.log("✅ [API] User found")
    }

    // For register OTP, check if user already exists
    if (type === "register") {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        console.warn(`⚠️ [API] User already exists: ${email}`)
        return NextResponse.json({ success: false, error: "Account already exists with this email" }, { status: 400 })
      }
    }

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    console.log(`🔢 [API] Generated OTP for ${email}`)

    // Delete any existing OTPs for this email and type
    await OTP.deleteMany({ email, type })
    console.log(`🧹 [API] Cleared old OTPs`)

    // Create new OTP
    await OTP.create({
      email,
      otp: otpCode,
      type,
    })
    console.log(`💾 [API] Saved new OTP to DB`)

    // Send OTP email
    let subject, actionText

    switch (type) {
      case "login":
        subject = "Your Kanvei Login OTP"
        actionText = "Use this code to sign in to your account:"
        break
      case "register":
        subject = "Your Kanvei Registration OTP"
        actionText = "Use this code to complete your registration:"
        break
      case "password-reset":
        subject = "Reset Your Kanvei Password - OTP"
        actionText = "Use this code to reset your password:"
        break
      default:
        subject = "Your Kanvei Verification Code"
        actionText = "Use this code to verify your action:"
    }

    const html = `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background-color: #5A0117; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-family: 'Sugar', serif; font-size: 32px;">Kanvei</h1>
        </div>
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #5A0117; margin-bottom: 20px;">Your OTP Code</h2>
          <p style="color: #8C6141; margin-bottom: 30px;">
            ${actionText}
          </p>
          <div style="background-color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <h1 style="color: #5A0117; font-size: 36px; margin: 0; letter-spacing: 8px; font-family: 'Montserrat', sans-serif;">${otpCode}</h1>
          </div>
          <p style="color: #8C6141; font-size: 14px;">
            This code will expire in 10 minutes. If you didn't request this code, please ignore this email.
          </p>
        </div>
      </div>
    `

    console.log(`📧 [API] Sending email to ${email}...`)
    const emailResult = await sendEmail(email, subject, html)
    console.log(`📧 [API] Email result:`, emailResult)

    if (!emailResult?.success) {
      throw new Error(emailResult?.error || "Email sending failed")
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    })
  } catch (error) {
    console.error("❌ [API] Send OTP error:", error)
    return NextResponse.json({ success: false, error: "Failed to send OTP: " + error.message }, { status: 500 })
  }
}
