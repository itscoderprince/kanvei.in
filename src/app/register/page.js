"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"
import OTPVerification from "@/components/OTPVerification"
import { useAuth } from "@/contexts/AuthContext"
import { User, Mail, Lock, CheckCircle, ArrowRight, ArrowLeft, Loader2, ShoppingBag, Eye, EyeOff } from "lucide-react"
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
            {/* Left Side - Pure Premium Gradient */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#5A0117] via-[#4a0113] to-[#2d000b]">
                {/* Abstract Geometric Shapes */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#8C6141] rounded-full mix-blend-overlay filter blur-[100px] opacity-20 translate-x-1/2 -translate-y-1/2 animate-pulse duration-[10s]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#DBCCB7] rounded-full mix-blend-overlay filter blur-[80px] opacity-10 -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 flex flex-col justify-between h-full p-12 xl:p-16">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-3 text-white group">
                            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 group-hover:bg-white/20 transition-all">
                                <ShoppingBag className="w-5 h-5 text-[#DBCCB7]" />
                            </div>
                            <span className="text-2xl font-bold tracking-tight" style={{ fontFamily: "Sugar, serif" }}>Kanvei</span>
                        </Link>
                    </div>

                    <div className="space-y-6 max-w-lg">
                        <h1 className="text-4xl xl:text-5xl font-bold text-white leading-[1.1]" style={{ fontFamily: "Sugar, serif" }}>
                            Create Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DBCCB7] via-[#FDF8F3] to-[#DBCCB7]">Fashion Legacy</span>
                        </h1>
                        <p className="text-base text-white/70 leading-relaxed font-light max-w-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>
                            Start your journey today. Get exclusive access to latest trends and personalized recommendations.
                        </p>
                    </div>

                    <div className="relative z-10 text-xs text-white/60 font-light" style={{ fontFamily: "Montserrat, sans-serif" }}>
                        Already a member? <Link href="/login" className="text-white underline font-medium hover:text-[#DBCCB7] transition-colors">Sign in here</Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Compact & Clean Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center bg-white relative">
                {/* Mobile Header - Integrated & Compact */}
                <div className="lg:hidden w-full p-4 flex justify-center pb-0">
                    <Link href="/" className="flex items-center gap-2 text-[#5A0117]">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="font-bold text-lg tracking-tight" style={{ fontFamily: "Sugar, serif" }}>Kanvei</span>
                    </Link>
                </div>

                <div className="w-full max-w-[400px] mx-auto px-6 sm:px-8 space-y-6 md:space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl md:text-3xl font-bold text-[#1a1a1a]" style={{ fontFamily: "Sugar, serif" }}>Create Account</h2>
                        <p className="text-gray-400 text-xs md:text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>
                            Join us to start your shopping journey
                        </p>
                    </div>

                    {step === "otp" ? (
                        <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="mb-3">
                                <button
                                    onClick={() => setStep("form")}
                                    className="flex items-center justify-center w-full gap-1 text-[11px] font-medium text-gray-400 hover:text-[#5A0117] transition-colors mb-3"
                                >
                                    <ArrowLeft className="w-3 h-3" /> Back to form
                                </button>
                                <OTPVerification
                                    email={formData.email}
                                    type="register"
                                    onVerify={handleOTPVerify}
                                    onResend={handleOTPResend}
                                    loading={loading}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {/* Compact Method Toggle */}
                            <div className="bg-gray-50 p-1.5 rounded-lg flex relative">
                                <div
                                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-md shadow-sm transition-all duration-300 ease-spring ${registrationMethod === 'otp' ? 'translate-x-[calc(100%+6px)] left-1.5' : 'left-1.5'}`}
                                />
                                <button
                                    onClick={() => setRegistrationMethod("email")}
                                    className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors duration-300 ${registrationMethod === "email" ? "text-[#5A0117]" : "text-gray-400 hover:text-gray-600"}`}
                                >
                                    Standard
                                </button>
                                <button
                                    onClick={() => setRegistrationMethod("otp")}
                                    className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors duration-300 ${registrationMethod === "otp" ? "text-[#5A0117]" : "text-gray-400 hover:text-gray-600"}`}
                                >
                                    Via OTP
                                </button>
                            </div>

                            <form onSubmit={registrationMethod === "email" ? handleEmailRegister : handleOTPRegister}>
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User className="h-4 w-4 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] transition-all text-sm"
                                                placeholder="Full Name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail className="h-4 w-4 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="block w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] transition-all text-sm"
                                                placeholder="Email Address"
                                            />
                                        </div>
                                    </div>

                                    {registrationMethod === "email" && (
                                        <>
                                            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <Lock className="h-4 w-4 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" />
                                                    </div>
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] transition-all text-sm"
                                                        placeholder="Password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                        <CheckCircle className="h-4 w-4 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" />
                                                    </div>
                                                    <input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        className="block w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] transition-all text-sm"
                                                        placeholder="Confirm Password"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full flex items-center justify-center py-3 px-6 border border-transparent rounded-lg shadow-md shadow-[#5A0117]/20 text-sm font-bold text-white bg-[#5A0117] hover:bg-[#3d0010] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#5A0117] transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                {registrationMethod === "email" ? "Verify & Register" : "Verify & Register"}
                                                <ArrowRight className="w-4 h-4" />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="relative text-center my-3">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-100"></div>
                                </div>
                                <span className="relative bg-white px-3 text-xs text-gray-400 uppercase tracking-widest font-semibold">Or</span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={handleGoogleRegister} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all group">
                                    <GoogleIcon className="h-4 w-4 transition-all" />
                                    <span className="text-xs font-semibold text-gray-600">Google</span>
                                </button>
                                <button onClick={handleFacebookRegister} className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all group">
                                    <FacebookIcon className="h-4 w-4 transition-all" />
                                    <span className="text-xs font-semibold text-gray-600">Facebook</span>
                                </button>
                            </div>

                            <p className="text-center text-xs text-gray-500 pt-2">
                                Already have an account?{' '}
                                <Link href="/login" className="font-bold text-[#5A0117] hover:underline transition-all">
                                    Sign in instead
                                </Link>
                            </p>
                        </div>
                    )}

                    {/* Mobile Footer */}
                    <div className="lg:hidden text-center text-xs text-gray-300 pb-4">
                        © 2024 Kanvei
                    </div>
                </div>
            </div>
        </div>
    )
}
