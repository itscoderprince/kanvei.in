"use client"
import Header from "../../components/shared/Header"
import Footer from "../../components/shared/Footer"
import WishlistContent from "../../components/wishlist/WishlistContent"
import { Heart } from "lucide-react"

export default function WishlistPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-montserrat">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold text-[#5A0117] font-sugar flex items-center gap-3">
                <Heart className="w-8 h-8" />
                My Wishlist
              </h1>
              <p className="text-[#8C6141] text-lg mt-1">
                Your saved collection of favorites
              </p>
            </div>
          </div>

          <WishlistContent />
        </div>
      </main>

      <Footer />
    </div>
  )
}
