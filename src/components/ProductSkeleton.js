"use client"

export default function ProductSkeleton({ count = 10 }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          {/* Image Skeleton */}
          <div className="aspect-[6/7] bg-gray-200 relative w-full">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
          </div>

          {/* Content Skeleton */}
          <div className="p-3">
            {/* Title Skeleton */}
            <div className="space-y-2 mb-3">
              <div className="h-3.5 bg-gray-200 rounded w-11/12"></div>
              <div className="h-3.5 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Price and Button Skeleton */}
            <div className="flex items-end justify-between mt-auto">
              <div className="h-5 bg-gray-200 rounded w-20"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

// Skeleton for grid layout
export function ProductGridSkeleton({ itemsPerRow = 6, rows = 2 }) {
  const totalItems = itemsPerRow * rows

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
      <ProductSkeleton count={totalItems} />
    </div>
  )
}

// Mobile optimized skeleton
export function MobileProductSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <ProductSkeleton count={count} />
    </div>
  )
}
