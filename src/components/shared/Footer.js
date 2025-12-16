"use client"
import Link from "next/link"
import { useAuth } from "../../contexts/AuthContext"
import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CreditCard
} from "lucide-react"

export default function Footer() {
  const { isAuthenticated } = useAuth()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#5A0117] text-white pt-12 pb-6 border-t-4 border-[#8C6141]">
      <div className="w-full px-4 sm:px-6 lg:px-8">

        {/* Top Section: Newsletter & Branding */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1: Brand & About */}
          <div className="lg:col-span-1 space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-4xl font-bold tracking-wide" style={{ fontFamily: "Sugar, serif" }}>
                Kanvei
              </h2>
            </Link>
            <p className="text-[#DBCCB7]/80 leading-relaxed text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Discover premium quality products with exceptional craftsmanship. Your trusted partner for an elegant and sophisticated shopping experience.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 pt-2">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#8C6141] hover:scale-110 transition-all duration-300 text-[#DBCCB7] hover:text-white"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Middle Section: Shop & Support (Side-by-side on mobile, Middle 2 cols on Desktop) */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:gap-12">

            {/* Column 2: Quick Links */}
            <div className="pl-0 lg:pl-8">
              <h3 className="text-xl font-semibold mb-6 text-[#DBCCB7]" style={{ fontFamily: "Sugar, serif" }}>
                Shop
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { name: 'All Products', href: '/products' },
                  { name: 'Jewellery', href: '/categories/jewellery' },
                  { name: 'Stationery', href: '/categories/stationery' },
                  { name: 'Cosmetics', href: '/categories/cosmetics' },
                  { name: 'Clothing', href: '/categories/clothing' },
                  { name: 'Blog', href: '/blog' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Customer Service */}
            <div>
              <h3 className="text-xl font-semibold mb-6 text-[#DBCCB7]" style={{ fontFamily: "Sugar, serif" }}>
                Support
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { name: 'Contact Us', href: '/contact' },
                  { name: 'Shipping Policy', href: '/shipping' },
                  { name: 'Returns & Exchanges', href: '/returns' },
                  { name: 'FAQ', href: '/faq' },
                  { name: 'Track Order', href: '/orders' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
                {!isAuthenticated && (
                  <li>
                    <Link
                      href="/adminlogin"
                      className="text-white/70 hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Admin Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="lg:col-span-1 space-y-6">
            <h3 className="text-xl font-semibold text-[#DBCCB7]" style={{ fontFamily: "Sugar, serif" }}>
              Stay Connected
            </h3>
            <p className="text-white/70 text-sm" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Subscribe to our newsletter for exclusive offers and updates.
            </p>

            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-white/10 border border-white/20 rounded-full py-3 px-5 pr-12 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#8C6141] transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              />
              <button
                type="submit"
                className="absolute right-1 top-1 p-2 bg-[#8C6141] rounded-full hover:bg-white hover:text-[#5A0117] transition-all duration-300"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="space-y-3 pt-4 text-sm text-white/80" style={{ fontFamily: "Montserrat, sans-serif" }}>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#8C6141] shrink-0" />
                <span>Ganga Nagar Harmu Ranchi, Kanvei Stationery & Cosmetics, 834002</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#8C6141] shrink-0" />
                <span>support@kanvei.in</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#8C6141] shrink-0" />
                <span>+91 74884 25690</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment */}
        <div className="border-t border-white/10 pt-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50 text-center md:text-left" style={{ fontFamily: "Montserrat, sans-serif" }}>
            © {currentYear} Kanvei. All rights reserved. | Privacy Policy | Terms of Service
          </p>

          <div className="flex items-center gap-4">
            <span className="text-xs text-white/50 uppercase tracking-wider font-semibold"> 100% Secure Payment</span>
            <div className="flex items-center gap-2 grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100">
              {/* Simulating Payment Badges with styled divs for no-asset dependency */}
              <div className="h-6 px-2 bg-white rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-800">VISA</span>
              </div>
              <div className="h-6 px-2 bg-white rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-red-600">MasterCard</span>
              </div>
              <div className="h-6 px-2 bg-white rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-600 italic">Amex</span>
              </div>
              <div className="h-6 px-2 bg-white rounded flex items-center justify-center">
                <span className="text-[10px] font-bold text-teal-600">UPI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
