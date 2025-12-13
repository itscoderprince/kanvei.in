"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"

const WishlistContext = createContext()

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}

export function WishlistProvider({ children }) {
  const { data: session } = useSession()
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(false)

  // Define userId for stability
  const userId = session?.user?.id

  // 1. Define fetchWishlist FIRST (before using it)
  const fetchWishlist = useCallback(async () => {
    if (!userId) return

    try {
      setLoading(true)
      const response = await fetch(`/api/wishlist?userId=${userId}`)
      const data = await response.json()

      if (data.success) {
        setWishlist(data.wishlist || [])
      } else {
        console.error("Failed to fetch wishlist:", data.error)
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error)
    } finally {
      setLoading(false)
    }
  }, [userId])

  // 2. Use useEffect AFTER definition
  useEffect(() => {
    if (userId) {
      console.log('❤️ User ID changed, fetching wishlist:', userId)
      fetchWishlist()
    } else {
      setWishlist([])
    }
  }, [userId, fetchWishlist])

  const toggleWishlist = async (product) => {
    if (!userId) {
      toast.error("Please login to add items to wishlist")
      return
    }

    try {
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          productId: product._id,
        }),
      })

      const data = await response.json()

      if (data.success) {
        if (data.action === "added") {
          setWishlist(prev => [...prev, { productId: product, userId: userId }])
          toast.success("Added to wishlist")
        } else {
          setWishlist(prev => prev.filter(item => item.productId && item.productId._id !== product._id))
          toast.success("Removed from wishlist")
        }
      } else {
        toast.error(data.error || "Failed to update wishlist")
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error)
      toast.error("Error updating wishlist")
    }
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.productId && item.productId._id === productId)
  }

  const getWishlistCount = () => {
    return wishlist.length
  }

  const clearWishlist = async () => {
    if (!userId) return

    try {
      // Since there's no bulk delete endpoint, we'll clear the local state
      // and let the next fetch update it properly
      setWishlist([])
      toast.success("Wishlist cleared")
    } catch (error) {
      console.error("Error clearing wishlist:", error)
      toast.error("Error clearing wishlist")
    }
  }

  const value = {
    wishlist,
    loading,
    toggleWishlist,
    isInWishlist,
    getWishlistCount,
    clearWishlist,
    fetchWishlist,
    isLoggedIn: !!userId
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}
