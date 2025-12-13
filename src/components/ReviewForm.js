"use client"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"
import { MdVerified, MdBlock, MdShoppingCart } from "react-icons/md"
import { AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai"

export default function ReviewForm({ productId, onReviewAdded }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [userName, setUserName] = useState("")
  const [loading, setLoading] = useState(false)
  const [canReview, setCanReview] = useState(null)
  const [reviewEligibility, setReviewEligibility] = useState(null)
  const [checkingEligibility, setCheckingEligibility] = useState(true)

  const { user, isAuthenticated } = useAuth()


  // Simplified eligibility check - just to get past order info if present, but not blocking
  useEffect(() => {
    const checkReviewEligibility = async () => {
      if (!isAuthenticated || !user || !productId) {
        setReviewEligibility(null)
        return
      }

      try {
        // We still fetch this to show "Verified Purchase" badge if applicable
        const res = await fetch(`/api/products/${productId}/can-review`)
        const data = await res.json()

        if (data.success) {
          setReviewEligibility(data)
        }
      } catch (error) {
        console.error("Error checking review eligibility:", error)
      } finally {
        setCheckingEligibility(false)
      }
    }

    checkReviewEligibility()
  }, [isAuthenticated, user, productId])

  // Set user name from auth context
  useEffect(() => {
    if (user && user.name) {
      setUserName(user.name)
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!userName.trim() || !comment.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userName: userName.trim(),
          rating,
          comment: comment.trim(),
        }),
      })

      const data = await res.json()
      if (data.success) {
        setUserName("")
        setComment("")
        setRating(5)
        onReviewAdded()
        alert("Review added successfully!")
      }
    } catch (error) {
      console.error("Error adding review:", error)
      alert("Error adding review")
    } finally {
      setLoading(false)
    }
  }

  // Show loading state while checking eligibility
  if (checkingEligibility) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
          Write a Review
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: "#5A0117" }}></div>
          <span className="ml-3 text-sm" style={{ fontFamily: "Montserrat, sans-serif", color: "#8C6141" }}>
            Checking review eligibility...
          </span>
        </div>
      </div>
    )
  }

  // Show simple login message if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
          Write a Review
        </h3>
        <p className="mb-4 text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Please login to share your experience with this product.
        </p>
        <button
          className="px-6 py-2 text-white rounded-lg hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
          onClick={() => {
            toast.error("Please login to review products")
            // Optionally redirect to login page
          }}
        >
          Login to Review
        </button>
      </div>
    )
  }

  // Show review form if user can review
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Review eligibility confirmation */}
      <div className={`mb-6 p-4 border-2 rounded-lg ${reviewEligibility?.isAdmin
        ? 'bg-blue-50 border-blue-200'
        : 'bg-green-50 border-green-200'
        }`}>
        <div className="flex items-center">
          <AiOutlineCheckCircle className={`w-6 h-6 mr-3 ${reviewEligibility?.isAdmin ? 'text-blue-600' : 'text-green-600'
            }`} />
          <div>
            <h4 className={`font-semibold ${reviewEligibility?.isAdmin ? 'text-blue-800' : 'text-green-800'
              }`} style={{ fontFamily: "Sugar, serif" }}>
              {reviewEligibility?.isAdmin
                ? '👑 Admin Review Access'
                : '✅ Verified Purchase'
              }
            </h4>
            <p className={`text-sm mt-1 ${reviewEligibility?.isAdmin ? 'text-blue-700' : 'text-green-700'
              }`} style={{ fontFamily: "Montserrat, sans-serif" }}>
              {reviewEligibility?.message}
              {reviewEligibility?.orderCount && reviewEligibility.orderCount > 1 &&
                ` (${reviewEligibility.orderCount} delivered orders)`
              }
            </p>
            {reviewEligibility?.isAdmin && (
              <div className="mt-2 p-2 bg-white rounded border border-blue-200">
                <p className="text-xs text-blue-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
                  🛡️ As an administrator, you can add reviews to help customers make informed decisions
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "Sugar, serif", color: "#5A0117" }}>
        Write a Review
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
          >
            Your Name
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
            required
            disabled={user && user.name} // Disable if user name is from auth
            placeholder={user?.name ? "Using your account name" : "Enter your name"}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
          >
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl ${star <= rating ? "text-yellow-400" : "text-gray-300"} hover:text-yellow-400 transition-colors`}
              >
                ★
              </button>
            ))}
          </div>
          <p className="text-xs mt-1 text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {rating === 1 && "😞 Very Poor"}
            {rating === 2 && "😐 Poor"}
            {rating === 3 && "🙂 Average"}
            {rating === 4 && "😊 Good"}
            {rating === 5 && "🤩 Excellent"}
          </p>
        </div>

        <div className="mb-6">
          <label
            className="block text-sm font-semibold mb-2"
            style={{ fontFamily: "Montserrat, sans-serif", color: "#5A0117" }}
          >
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ fontFamily: "Montserrat, sans-serif", focusRingColor: "#5A0117" }}
            placeholder="Share your experience with this product..."
            required
          />
          <p className="text-xs mt-1 text-gray-500" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {comment.length}/500 characters
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !comment.trim()}
          className="px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: "#5A0117", fontFamily: "Montserrat, sans-serif" }}
        >
          {loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Adding Review...
            </span>
          ) : (
            "📝 Submit Review"
          )}
        </button>
      </form>
    </div>
  )
}
