import Link from "next/link"
import CategoryPage from "../../../../components/CategoryPage"
import { Gem, CircleDot, Sparkles, ArrowRight } from "lucide-react"

export default function JewelleryPage() {
  const subcategories = [
    // Necklaces Card
    <Link
      key="necklaces"
      href="/categories/jewellery/necklaces"
      className="group flex flex-col items-center p-6 bg-white border border-gray-100 rounded-xl transition-all duration-300 hover:border-[#5A0117] hover:shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-[#FDF8F3] flex items-center justify-center mb-4 group-hover:bg-[#5A0117] transition-colors duration-300">
        <Gem className="w-5 h-5 text-[#5A0117] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "Sugar, serif" }}>
        Necklaces
      </h3>

      <p className="text-sm text-gray-500 text-center mb-4 line-clamp-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
        Elegant chains & pendants
      </p>

      <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-[#5A0117] opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        Explore <ArrowRight className="w-3 h-3" />
      </div>
    </Link>,

    // Earrings Card
    <Link
      key="earrings"
      href="/categories/jewellery/earrings"
      className="group flex flex-col items-center p-6 bg-white border border-gray-100 rounded-xl transition-all duration-300 hover:border-[#5A0117] hover:shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-[#FDF8F3] flex items-center justify-center mb-4 group-hover:bg-[#5A0117] transition-colors duration-300">
        <Sparkles className="w-5 h-5 text-[#5A0117] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "Sugar, serif" }}>
        Earrings
      </h3>

      <p className="text-sm text-gray-500 text-center mb-4 line-clamp-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
        Beautiful studs & drops
      </p>

      <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-[#5A0117] opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        Explore <ArrowRight className="w-3 h-3" />
      </div>
    </Link>,

    // Rings Card
    <Link
      key="rings"
      href="/categories/jewellery/rings"
      className="group flex flex-col items-center p-6 bg-white border border-gray-100 rounded-xl transition-all duration-300 hover:border-[#5A0117] hover:shadow-sm"
    >
      <div className="w-12 h-12 rounded-full bg-[#FDF8F3] flex items-center justify-center mb-4 group-hover:bg-[#5A0117] transition-colors duration-300">
        <CircleDot className="w-5 h-5 text-[#5A0117] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-1" style={{ fontFamily: "Sugar, serif" }}>
        Rings
      </h3>

      <p className="text-sm text-gray-500 text-center mb-4 line-clamp-2" style={{ fontFamily: "Montserrat, sans-serif" }}>
        Timeless bands & gems
      </p>

      <div className="mt-auto flex items-center gap-2 text-xs font-semibold text-[#5A0117] opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
        Explore <ArrowRight className="w-3 h-3" />
      </div>
    </Link>
  ]

  return (
    <CategoryPage
      categoryName="Jewellery"
      displayName="Jewellery Collection"
      description="Curated elegance for every occasion."
      icon="💎"
      subcategories={subcategories}
    />
  )
}