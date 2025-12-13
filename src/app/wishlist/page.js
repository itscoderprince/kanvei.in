"use client"
import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import WishlistContent from "../../components/wishlist/WishlistContent"
import { AiFillHeart } from "react-icons/ai"

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <section
          className="py-16 px-4 sm:px-6 lg:px-8 text-white text-center"
          style={{ backgroundColor: "#5A0117" }}
        >
          <AiFillHeart className="w-16 h-16 mx-auto mb-4 animate-bounce" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "Sugar, serif" }}>
            My Wishlist
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto" style={{ fontFamily: "Montserrat, sans-serif", color: "#DBCCB7" }}>
            Here are the items you've saved for later. Move them to cart when you're ready to buy!
          </p>
        </section>

        {/* Wishlist Items Wrapper */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <WishlistContent />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
