import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { CartProvider } from "../contexts/CartContext"
import { WishlistProvider } from "../contexts/WishlistContext"
import { AuthProvider } from "../contexts/AuthContext"
import { NotificationProvider } from "../contexts/NotificationContext"
import NextAuthSessionProvider from "../components/SessionProvider"
import NotificationContainer from "../components/NotificationContainer"
import { Toaster } from "react-hot-toast"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

export const metadata = {
  title: "Kanvei - Premium Quality Products",
  description: "Discover premium quality products with exceptional craftsmanship at Kanvei",
  generator: "v0.app",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable} antialiased`}>
      <body className="font-sans" suppressHydrationWarning={true}>
        <NextAuthSessionProvider>
          <AuthProvider>
            <NotificationProvider>
              <CartProvider>
                <WishlistProvider>
                  {children}
                  <NotificationContainer />
                </WishlistProvider>
              </CartProvider>
            </NotificationProvider>
          </AuthProvider>
        </NextAuthSessionProvider>
        <Toaster position="bottom-right" reverseOrder={false} />
      </body>
    </html>
  )
}
