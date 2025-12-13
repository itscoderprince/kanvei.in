import Link from "next/link"
import CategoryPage from "../../../../components/CategoryPage"

export default function ClothingCategoryPage() {
  // Subcategory components
  const subcategories = [
    <Link
      key="mens-wear"
      href="/categories/clothing/mens-wear"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          👔
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Men&apos;s Wear
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Stylish clothing for men
        </p>
      </div>
    </Link>,

    <Link
      key="womens-wear"
      href="/categories/clothing/womens-wear"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          👗
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Women&apos;s Wear
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Elegant fashion for women
        </p>
      </div>
    </Link>,

    <Link
      key="kids-wear"
      href="/categories/clothing/kids-wear"
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#5A0117]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="w-16 h-16 mx-auto mb-4 bg-[#FDF8F3] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300 text-[#5A0117]">
          🧸
        </div>
        <h3 className="text-2xl font-bold mb-3 text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
          Kids Wear
        </h3>
        <p className="text-gray-600 font-medium" style={{ fontFamily: "Montserrat, sans-serif" }}>
          Comfortable clothes for children
        </p>
      </div>
    </Link>
  ]

  return (
    <CategoryPage
      categoryName="Clothing"
      displayName="Fashion & Clothing"
      description="Discover our premium collection of clothing, fashion accessories, and apparel for men, women, and kids"
      icon="👕"
      subcategories={subcategories}
    />
  )
}
