import Link from "next/link"
import CategoryPage from "../../../../components/CategoryPage"

export default function StationeryPage() {
  const subcategories = [
    <Link
      key="notebooks"
      href="/categories/stationery/notebooks"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          📔
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Notebooks & Diaries
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Premium paper for your thoughts
        </p>
      </div>
    </Link>,

    <Link
      key="writing"
      href="/categories/stationery/writing"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          ✒️
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Pens & Writing
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Fine writing instruments
        </p>
      </div>
    </Link>,

    <Link
      key="art"
      href="/categories/stationery/art-supplies"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          🎨
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Art Supplies
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Unleash your creativity
        </p>
      </div>
    </Link>
  ]

  return (
    <CategoryPage
      categoryName="Stationery"
      displayName="Stationery & Office Supplies"
      description="Premium stationery, writing instruments, and office supplies for professionals and students"
      icon="✏️"
      subcategories={subcategories}
    />
  )
}
