import { NextResponse } from "next/server"
import dbConnect from "../../../../lib/mongodb"
import User from "../../../../lib/models/User"
import OTP from "../../../../lib/models/OTP"
import bcrypt from "bcryptjs"

export async function POST(request) {
  await dbConnect()

  try {
    console.log("📝 [Update Password] Request received")
    const { email, otp, password } = await request.json()

    if (!email || !otp || !password) {
      console.log("❌ [Update Password] Missing fields")
      return NextResponse.json({ success: false, error: "Email, OTP, and new password are required" }, { status: 400 })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(password)) {
      console.log("❌ [Update Password] Weak password")
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number.",
        },
        { status: 400 }
      )
    }

    // Find the most recent, valid OTP for this email and type
    console.log("🔍 [Update Password] verifying OTP for", email)
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type: "password-reset",
      expiresAt: { $gt: new Date() }, // Check if the token is not expired
    })

    if (!otpRecord) {
      console.log("❌ [Update Password] Invalid/Expired OTP")
      return NextResponse.json({ success: false, error: "Invalid or expired OTP." }, { status: 400 })
    }

    // Find the user
    console.log("🔍 [Update Password] Finding user")
    const user = await User.findOne({ email })
    if (!user) {
      console.log("❌ [Update Password] User not found")
      // This case should ideally not be reached if OTP is valid, but it's a good safeguard.
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 })
    }

    // Hash the new password
    console.log("🔐 [Update Password] Hashing password")
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Update the user's password
    console.log("💾 [Update Password] Saving user")
    user.password = hashedPassword
    await user.save()

    // Delete the used OTP
    console.log("🧹 [Update Password] Deleting OTP")
    await OTP.deleteOne({ _id: otpRecord._id })

    console.log("✅ [Update Password] Success")
    return NextResponse.json({ success: true, message: "Password has been updated successfully." })

  } catch (error) {
    console.error("❌ [Update Password] Error:", error)
    return NextResponse.json({ success: false, error: "An internal server error occurred." }, { status: 500 })
  }
}

