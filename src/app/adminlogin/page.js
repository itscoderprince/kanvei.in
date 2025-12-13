"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"
import { Mail, Lock, ArrowRight, Loader2, ShieldCheck, ShoppingBag, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"

export default function AdminLoginPage() {
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { login, logout } = useAuth()
  const router = useRouter()

  // Session protection - redirect if already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Check role presence to avoid race conditions
      if (session.user.role === 'admin') {
        router.replace('/admindashboard')
      } else if (session.user.role === 'user') {
        // Only redirect to home if explicitly a user role
        router.replace('/')
      }
      // If role is undefined/loading, do nothing and wait
    }
  }, [status, router, session])

  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#5A0117]" size={40} />
          <div className="text-xl font-medium text-gray-700">
            {status === 'loading' ? 'Loading...' : 'Redirecting...'}
          </div>
        </div>
      </div>
    )
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        // The auth context or next-auth session update should handle the redirect? 
        // We double check role here just in case, though usually session update is async.
        // Ideally checking the user object returned from login
        const user = result.user

        if (user && user.role === 'admin') {
          toast.success("Welcome back, Administrator")
          router.push("/admindashboard")
        } else {
          toast.error("Access Denied: You do not have admin privileges")
          await logout() // Logout if they managed to login but aren't admin
        }
      } else {
        toast.error(result.error || "Login failed")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white tracking-wide">

      {/* Left Side - Brand Visuals (Admin Theme) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#5A0117] text-white flex-col justify-between p-8 xl:p-12 overflow-hidden">
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 L 100 0 L 100 100 Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 -ml-20 -mt-20 w-96 h-96 rounded-full bg-[#8C6141] opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-0 -mr-20 -mb-20 w-80 h-80 rounded-full bg-black opacity-30 blur-3xl"></div>

        {/* Header */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold opacity-80 hover:opacity-100 transition-opacity" style={{ fontFamily: "Sugar, serif" }}>
            <ShoppingBag className="w-6 h-6" /> Kanvei
          </Link>
        </div>

        {/* Main Text */}
        <div className="relative z-10 max-w-lg mb-8">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 border border-white/20">
            <ShieldCheck className="w-8 h-8 text-[#DBCCB7]" />
          </div>
          <h2 className="text-3xl xl:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "Sugar, serif" }}>
            Management Portal
          </h2>
          <p className="text-base text-white/80 leading-relaxed font-light" style={{ fontFamily: "Montserrat, sans-serif" }}>
            Secure access for Kanvei administrators. Manage products, orders, and customer insights from one central hub.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-xs text-white/50 font-light flex justify-between items-center" style={{ fontFamily: "Montserrat, sans-serif" }}>
          <span>© {new Date().getFullYear()} Kanvei Admin.</span>
          <span>Secure Connection 🔒</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-white relative">
        <div className="w-full max-w-sm space-y-8">

          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-2xl font-bold text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
              <ShieldCheck /> Kanvei Admin
            </Link>
          </div>

          <div className="text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "Sugar, serif" }}>Admin Sign In</h1>
            <p className="text-sm text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Please enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#5A0117] transition-colors" size={16} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] outline-none transition-all placeholder:text-gray-300 text-sm"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                  placeholder="admin@kanvei.in"
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
                  required
                  className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#5A0117] focus:border-[#5A0117] outline-none transition-all placeholder:text-gray-300 text-sm"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 bg-[#5A0117] text-white text-sm font-semibold rounded-lg hover:bg-[#4a0113] focus:ring-2 focus:ring-[#5A0117]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-[#5A0117]/10"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  Access Dashboard
                  <ArrowRight size={16} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center border-t border-gray-50">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-[#5A0117] transition-colors flex items-center justify-center gap-1"
            >
              Return to Storefront
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}