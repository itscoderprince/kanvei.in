"use client"
import { useState } from "react"
import {
    Search,
    ChevronDown,
    ChevronUp,
    X,
    Check,
    RotateCcw // Added icon for reset
} from "lucide-react"

export default function ProductFilters({
    filters,
    setFilters,
    categories,
    onCloseMobile,
    showMobile,
    hideCategories = false
}) {
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        price: true,
        rating: true,
        availability: true
    })

    // Helper to check if any filter is active
    const hasActiveFilters =
        filters.search !== "" ||
        filters.category !== "" ||
        filters.inStock !== false ||
        filters.priceRange.min > 0 ||
        filters.priceRange.max < 10000;

    const resetFilters = () => {
        setFilters({
            search: "",
            category: "",
            priceRange: { min: 0, max: 10000 },
            inStock: false,
            sortBy: "newest"
        })
    }

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const handlePriceChange = (e, type) => {
        const val = e.target.value === "" ? 0 : parseInt(e.target.value)
        setFilters(prev => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [type]: val
            }
        }))
    }

    return (
        <>
            {/* Mobile/Desktop Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${showMobile ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={onCloseMobile}
            />

            {/* Filter Sidebar (Drawer) */}
            <div className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-white transform transition-transform duration-300 ease-in-out shadow-2xl
        ${showMobile ? "translate-x-0" : "-translate-x-full"}
      `}>
                <div className="h-full flex flex-col pb-20">

                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b">
                        <h2 className="text-xl font-bold text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>
                            Filters
                        </h2>

                        {/* Clear All Button - Visible if filters are active */}
                        {hasActiveFilters && (
                            <button
                                onClick={resetFilters}
                                className="text-xs font-medium text-gray-500 hover:text-[#5A0117] flex items-center gap-1 transition-colors"
                            >
                                <RotateCcw className="w-3 h-3" />
                                Clear All
                            </button>
                        )}

                        <button onClick={onCloseMobile} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8
                        scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent 
                        hover:scrollbar-thumb-gray-300">


                        {/* Categories */}
                        {!hideCategories && (
                            <div className="space-y-3">
                                <button
                                    onClick={() => toggleSection('category')}
                                    className="flex items-center justify-between w-full text-left"
                                >
                                    <span className="font-semibold text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>Category</span>
                                    {expandedSections.category ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>

                                {expandedSections.category && (
                                    <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                        <label className="flex items-center gap-3 cursor-pointer group">
                                            <div className={`
                      w-5 h-5 rounded border flex items-center justify-center transition-colors
                      ${filters.category === "" ? "bg-[#5A0117] border-[#5A0117]" : "border-gray-300 group-hover:border-[#5A0117]"}
                    `}>
                                                {filters.category === "" && <Check className="w-3 h-3 text-white" />}
                                            </div>
                                            <input
                                                type="radio"
                                                name="category"
                                                value=""
                                                checked={filters.category === ""}
                                                onChange={() => setFilters(prev => ({ ...prev, category: "" }))}
                                                className="hidden"
                                            />
                                            <span className={`text-sm ${filters.category === "" ? "text-[#5A0117] font-medium" : "text-gray-600"}`}>
                                                All Categories
                                            </span>
                                        </label>

                                        {categories.map((cat) => (
                                            <label key={cat._id} className="flex items-center gap-3 cursor-pointer group">
                                                <div className={`
                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${filters.category === cat.name ? "bg-[#5A0117] border-[#5A0117]" : "border-gray-300 group-hover:border-[#5A0117]"}
                      `}>
                                                    {filters.category === cat.name && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                <input
                                                    type="radio"
                                                    name="category"
                                                    value={cat.name}
                                                    checked={filters.category === cat.name}
                                                    onChange={() => setFilters(prev => ({ ...prev, category: cat.name }))}
                                                    className="hidden"
                                                />
                                                <span className={`text-sm ${filters.category === cat.name ? "text-[#5A0117] font-medium" : "text-gray-600"}`}>
                                                    {cat.name}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Price Range */}
                        <div className="space-y-4">
                            <button
                                onClick={() => toggleSection('price')}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <span className="font-semibold text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>Price Range</span>
                                {expandedSections.price ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {expandedSections.price && (
                                <div className="space-y-4 animate-in slide-in-from-top-2 duration-200">
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 mb-1 block">Min</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-gray-400 text-sm">₹</span>
                                                <input
                                                    type="number"
                                                    value={filters.priceRange.min}
                                                    onChange={(e) => handlePriceChange(e, 'min')}
                                                    className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#5A0117]"
                                                />
                                            </div>
                                        </div>
                                        <div className="mb-2 text-gray-400">-</div>
                                        <div className="flex-1">
                                            <label className="text-xs text-gray-500 mb-1 block">Max</label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-gray-400 text-sm">₹</span>
                                                <input
                                                    type="number"
                                                    value={filters.priceRange.max}
                                                    onChange={(e) => handlePriceChange(e, 'max')}
                                                    className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#5A0117]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Rating */}
                        <div className="space-y-3">
                            <button
                                onClick={() => toggleSection('rating')}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <span className="font-semibold text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>Rating</span>
                                {expandedSections.rating ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {expandedSections.rating && (
                                <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                                    {[4, 3, 2, 1].map((rating) => (
                                        <label key={rating} className="flex items-center gap-3 cursor-pointer group hover:bg-gray-50 p-1 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                name="rating"
                                                className="w-4 h-4 rounded border-gray-300 text-[#5A0117] focus:ring-[#5A0117]"
                                            />
                                            <div className="flex items-center gap-1">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <svg key={i} className={`w-3.5 h-3.5 ${i < rating ? "fill-current" : "text-gray-200 fill-current"}`} viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-600">& Up</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Availability */}
                        <div className="space-y-3">
                            <button
                                onClick={() => toggleSection('availability')}
                                className="flex items-center justify-between w-full text-left"
                            >
                                <span className="font-semibold text-[#5A0117]" style={{ fontFamily: "Sugar, serif" }}>Availability</span>
                                {expandedSections.availability ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {expandedSections.availability && (
                                <label className="flex items-center gap-3 cursor-pointer group animate-in slide-in-from-top-2 duration-200">
                                    <div className={`
                        w-5 h-5 rounded border flex items-center justify-center transition-colors
                        ${filters.inStock ? "bg-[#5A0117] border-[#5A0117]" : "border-gray-300 group-hover:border-[#5A0117]"}
                      `}>
                                        {filters.inStock && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={filters.inStock}
                                        onChange={(e) => setFilters(prev => ({ ...prev, inStock: e.target.checked }))}
                                        className="hidden"
                                    />
                                    <span className="text-sm text-gray-600">In Stock Only</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white z-10 w-full">
                        <button
                            onClick={onCloseMobile}
                            className="w-full bg-[#5A0117] text-white py-3 rounded-full font-medium active:scale-95 transition-transform"
                        >
                            Show Results
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}