import Link from "next/link"
import CategoryPage from "../../../../components/CategoryPage"

export default function ElectronicsPage() {
  const subcategories = [
    <Link
      key="mobile-accessories"
      href="/categories/electronics/mobile-accessories"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          📱
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Mobile & Accessories
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Latest phones and essential add-ons
        </p>
      </div>
    </Link>,

    <Link
      key="audio"
      href="/categories/electronics/audio"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          🎧
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Audio & Sound
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Immersive sound experiences
        </p>
      </div>
    </Link>,

    <Link
      key="smart-gadgets"
      href="/categories/electronics/smart-gadgets"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          ⌚
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Smart Gadgets
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Wearables and smart home devices
        </p>
      </div>
    </Link>
  ]

  return (
    <CategoryPage
      categoryName="Electronics"
      displayName="Electronics & Gadgets"
      description="Discover the latest technology, gadgets, and electronic devices for modern living"
      icon="📱"
      subcategories={subcategories}
    />
  )
}
