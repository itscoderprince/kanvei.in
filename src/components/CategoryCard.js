import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { LiaToggleOffSolid } from "react-icons/lia";
import { LiaToggleOnSolid } from "react-icons/lia";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({ category, simple = false }) {
  const [open, setOpen] = useState(false)
  const hasChildren = Array.isArray(category.subcategories) && category.subcategories.length > 0

  if (simple) {
    return (
      <Link href={`/categories/${category.slug || category._id}`} className="group block">
        <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100">
          <Image
            src={category.image || "/placeholder.svg?height=400&width=300&query=category"}
            alt={category.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

          <div className="absolute bottom-0 left-0 p-6 w-full transform transition-transform duration-500 group-hover:translate-y-[-8px]">
            <h3 className="text-2xl text-white font-bold mb-2" style={{ fontFamily: "Sugar, serif" }}>
              {category.name}
            </h3>
            <div className="flex items-center text-white/80 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0" style={{ fontFamily: "Montserrat, sans-serif" }}>
              Explore Collection <ArrowRight className="w-4 h-4 ml-2" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="group cursor-pointer relative h-full flex flex-col">
      <Link href={`/categories/${category.slug}`} className="flex-1 block">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 h-full border border-gray-100">
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src={category.image || "/placeholder.svg?height=300&width=400&query=category"}
              alt={category.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-500"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
              <h3
                className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg tracking-wide transform transition-all duration-500 group-hover:-translate-y-2"
                style={{ fontFamily: "Sugar, serif" }}
              >
                {category.name}
              </h3>
              <span
                className="inline-flex items-center gap-2 mt-2 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 border border-white/30 hover:bg-white hover:text-[#5A0117]"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                View Collection
              </span>
            </div>
          </div>

          {/* Description / Subtitle area if needed in future */}
          {category.description && (
            <div className="p-4 bg-white hidden">
              <p className="text-gray-600 text-sm line-clamp-2">{category.description}</p>
            </div>
          )}
        </div>
      </Link>

      {/* Desktop hover dropdown for subcategories */}
      {hasChildren && (
        <div className="hidden md:block absolute left-4 right-4 top-[80%] opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-20 pt-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-3 border border-gray-100 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider px-2 py-1 mb-1">Subcategories</span>
              {category.subcategories.map((child) => (
                <Link key={child._id} href={`/categories/${category.slug}/${child.slug || child._id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group/item">
                  {child.image ? (
                    <img src={child.image} alt={child.name} className="w-8 h-8 rounded-md object-cover shadow-sm" />
                  ) : (
                    <div className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 text-xs">#</div>
                  )}
                  <span className="text-sm font-medium text-gray-700 group-hover/item:text-[#5A0117]" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    {child.name}
                  </span>
                  <ArrowRight className="w-3 h-3 ml-auto text-gray-400 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile toggle button and list */}
      {hasChildren && (
        <div className="md:hidden mt-2 px-1">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setOpen((v) => !v)
            }}
            className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 hover:border-gray-300"
            style={{ fontFamily: "Montserrat, sans-serif" }}
            aria-expanded={open}
          >
            <span className="text-xs uppercase tracking-wide text-gray-500">
              {open ? 'Hide Subcategories' : `View Subcategories (${category.subcategories.length})`}
            </span>
            {open ? <LiaToggleOnSolid className="text-xl text-[#5A0117]" /> : <LiaToggleOffSolid className="text-xl text-gray-400" />}
          </button>

          <div
            className={`grid transition-all duration-300 ease-in-out overflow-hidden ${open ? 'grid-rows-[1fr] opacity-100 mt-2' : 'grid-rows-[0fr] opacity-0 mt-0'}`}
          >
            <div className="bg-gray-50 rounded-xl overflow-hidden min-h-0 border border-gray-100">
              <div className="p-2 space-y-1">
                {category.subcategories.map((child) => (
                  <Link key={child._id} href={`/categories/${category.slug}/${child.slug || child._id}`} className="flex items-center gap-3 p-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-all active:scale-95 border border-transparent hover:border-[#5A0117]/10">
                    {child.image && (
                      <img src={child.image} alt={child.name} className="w-8 h-8 rounded-md object-cover" />
                    )}
                    <span className="text-sm font-medium text-gray-800" style={{ fontFamily: "Montserrat, sans-serif" }}>
                      {child.name}
                    </span>
                    <ArrowRight className="w-3 h-3 ml-auto text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
