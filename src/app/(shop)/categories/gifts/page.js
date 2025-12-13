import Link from "next/link"
import CategoryPage from "../../../../components/CategoryPage"

export default function GiftsPage() {
  const subcategories = [
    <Link
      key="for-him"
      href="/categories/gifts/for-him"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          👨
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          For Him
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Thoughtful gifts for men
        </p>
      </div>
    </Link>,

    <Link
      key="for-her"
      href="/categories/gifts/for-her"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          👩
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          For Her
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Special surprises for women
        </p>
      </div>
    </Link>,

    <Link
      key="occasions"
      href="/categories/gifts/occasions"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          🎁
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Occasions
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Celebrate life's moments
        </p>
      </div>
    </Link>
  ]

  return (
    <CategoryPage
      categoryName="Gifts"
      displayName="Gifts & Special Occasions"
      description="Perfect gifts and special items for every occasion, celebration, and memorable moments"
      icon="🎁"
      subcategories={subcategories}
    />
  )
}
