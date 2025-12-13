"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import OTPVerification from "@/components/OTPVerification"
import { useAuth } from "@/contexts/AuthContext"
import { User, Mail, Lock, CheckCircle, ArrowRight, Loader2, ShoppingBag, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

// Authentic Google Icon
const GoogleIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
)

// Authentic Facebook Icon
const FacebookIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1877F2">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
)

export default function RegisterPage() {
    const [registrationMethod, setRegistrationMethod] = useState("email") // email, otp
    const [step, setStep] = useState("form") // form, otp
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { register, registerWithOTP, sendOTP, loading, isAuthenticated } = useAuth()
    const router = useRouter()

    // Session protection - redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            router.replace('/')
        }
    }, [isAuthenticated, router])

    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="animate-spin text-[#5A0117]" size={40} />
                    <div className="text-xl font-medium text-gray-700">Redirecting to home...</div>
                </div>
            </div>
        )
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const validateForm = () => {
        if (!formData.name.trim()) {
            toast.error("Please enter your full name")
            return false
        }
        if (!formData.email.trim()) {
            toast.error("Please enter your email address")
            return false
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return false
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match")
            return false
        }
        return true
    }

    const handleEmailRegister = async (e) => {
        e.preventDefault()
        if (!validateForm()) return
        const result = await register(formData.name, formData.email, formData.password)
        if (result.success) {
            toast.success("Account created successfully!")
            router.push("/")
        } else {
            toast.error(result.error)
        }
    }

    const handleOTPRegister = async (e) => {
        e.preventDefault()
        if (!validateForm()) return
        const result = await sendOTP(formData.email, "register")
        if (result.success) {
            toast.success("OTP sent to your email")
            setStep("otp")
        } else {
            toast.error(result.error)
        }
    }

    const handleOTPVerify = async (otp) => {
        const result = await registerWithOTP(formData.name, formData.email, formData.password, otp)
        if (result.success) {
            toast.success("Account created and verified!")
            router.push("/")
        } else {
            toast.error(result.error || "Invalid OTP")
        }
        return result
    }

    const handleOTPResend = async () => {
        const result = await sendOTP(formData.email, "register")
        if (result.success) {
            toast.success("OTP resent successfully")
        } else {
            toast.error(result.error)
        }
        return result
    }

    const handleGoogleRegister = async () => {
        try {
            await signIn("google", { callbackUrl: "/" })
        } catch (error) {
            toast.error("Google registration failed")
        }
    }

    const handleFacebookRegister = async () => {
        try {
            await signIn("facebook", { callbackUrl: "/" })
        } catch (error) {
            toast.error("Facebook registration failed")
        }
    }

    return (
        <div className="min-h-screen flex bg-white tracking-wide">
            {/* Left Side - Brand Visuals */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-[#5A0117] text-white flex-col justify-between p-8 xl:p-12 overflow-hidden">
                {/* Decorative Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M100 0 C 80 100 50 100 0 0 Z" fill="currentColor" />
                    </svg>
                </div>
                <div className="absolute top-0 left-0 -ml-20 -mt-20 w-80 h-80 rounded-full bg-[#8C6141] opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-[#8C6141] opacity-20 blur-3xl"></div>

                {/* Content */}
                <div className="relative z-10">
                    <Link href="/" className="flex items-center gap-2 text-2xl font-bold" style={{ fontFamily: "Sugar, serif" }}>
                        <ShoppingBag /> Kanvei
                    </Link>
                </div>

                <div className="relative z-10 max-w-lg mb-8">
                    <h2 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "Sugar, serif" }}>
                        Create your fashion legacy with us.
                    </h2>
                    <p className="text-base text-white/80 leading-relaxed font-light" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        Start your journey today. Get exclusive access to the latest trends, personalized recommendations, and seamless shopping.
                    </p>
                </div>

                <div className="relative z-10 text-xs text-white/60 font-light" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Already a member? <Link href="/login" className="text-white underline font-medium">Sign in here</Link>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white relative">
                <div className="w-full max-w-sm space-y-6">
                    <div className="lg:hidden mb-6 text-center">
                        <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
                            <ShoppingBag /> Kanvei
                        </Link>
                    </div>

                    {step === "otp" ? (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                            <OTPVerification
                                email={formData.email}
                                type="register"
                                onVerify={handleOTPVerify}
                                onResend={handleOTPResend}
                                loading={loading}
                            />
                            <div className="mt-6 text-center">
                                <button
                                    onClick={() => setStep("form")}
                                    className="text-xs font-semibold hover:text-[#5A0117] transition-colors text-gray-500"
                                    style={{ fontFamily: "Montserrat, sans-serif" }}
                                >
                                    Back to form
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="text-left mb-6">
                                <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Sugar, serif" }}>Create an account</h1>
                                <p className="text-sm text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>
                                    Join us to start your shopping journey
                                </p>
                            </div>

                            {/* Method Toggle */}
                            <div className="flex p-1 bg-gray-50 rounded-lg mb-6">
                                <button
                                    onClick={() => setRegistrationMethod("email")}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${registrationMethod === "email" ? "bg-white text-[#5A0117] shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Standard
                                </button>
                                <button
                                    onClick={() => setRegistrationMethod("otp")}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all duration-200 ${registrationMethod === "otp" ? "bg-white text-[#5A0117] shadow-sm" : "text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    Via OTP
                                </button>
                            </div>

                            <form onSubmit={registrationMethod === "email" ? handleEmailRegister : handleOTPRegister} className="space-y-4">

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" size={16} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] outline-none transition-all placeholder:text-gray-300 text-sm"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" size={16} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] outline-none transition-all placeholder:text-gray-300 text-sm"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" size={16} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] outline-none transition-all placeholder:text-gray-300 text-sm"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <div className="relative group">
                                        <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" size={16} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] outline-none transition-all placeholder:text-gray-300 text-sm"
                                            placeholder="••••••••"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center py-2.5 px-4 bg-[#5A0117] text-white text-sm font-semibold rounded-lg hover:bg-[#4a0113] focus:ring-2 focus:ring-[#5A0117]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#5A0117]/10 mt-2"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                                        <>
                                            {registrationMethod === "email" ? "Verify & Register" : "Verify & Register"}
                                            <ArrowRight size={16} className="ml-2" />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase tracking-wider">
                                    <span className="bg-white px-2 text-gray-400">Or continue with</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={handleGoogleRegister} className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                                    <GoogleIcon className="w-5 h-5" />
                                    <span className="ml-2 text-xs font-medium text-gray-600">Google</span>
                                </button>
                                <button onClick={handleFacebookRegister} className="flex items-center justify-center py-2 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                                    <FacebookIcon className="w-5 h-5" />
                                    <span className="ml-2 text-xs font-medium text-gray-600">Facebook</span>
                                </button>
                            </div>

                            <p className="mt-6 text-center text-xs text-gray-500">
                                Already have an account?{' '}
                                <Link href="/login" className="font-semibold text-[#5A0117] hover:underline">
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
