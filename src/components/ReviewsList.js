export default function ReviewsList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
        <p className="text-gray-500 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          No reviews yet. Be the first to review this product!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review._id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#5A0117]/10 flex items-center justify-center text-[#5A0117] font-bold text-sm">
                {review.userName?.charAt(0).toUpperCase() || "U"}
              </div>
              <h4 className="font-bold text-gray-900" style={{ fontFamily: "Sugar, serif" }}>
                {review.userName}
              </h4>
            </div>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={`text-sm ${star <= review.rating ? "text-amber-400" : "text-gray-200"}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm mb-3" style={{ fontFamily: "Montserrat, sans-serif" }}>
            {review.comment}
          </p>
          <p className="text-xs text-gray-400 font-medium">
            {new Date(review.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      ))}
    </div>
  )
}
