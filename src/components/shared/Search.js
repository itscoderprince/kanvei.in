"use client"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search as SearchIcon, X, Loader2 } from "lucide-react"
import Image from "next/image"

export default function SearchBar({ isMobile = false, onClose }) {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const wrapperRef = useRef(null)
    const router = useRouter()

    // Debouce Search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.length >= 2) {
                setLoading(true)
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
                    const data = await res.json()
                    if (data.success) {
                        setResults(data.results)
                        setShowResults(true)
                    }
                } catch (error) {
                    console.error("Search error:", error)
                } finally {
                    setLoading(false)
                }
            } else {
                setResults([])
                setShowResults(false)
            }
        }, 400) // 400ms debounce

        return () => clearTimeout(timer)
    }, [query])

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowResults(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`)
            setShowResults(false)
            if (onClose) onClose()
        }
    }

    return (
        <div ref={wrapperRef} className={`relative ${isMobile ? 'w-full' : 'w-full max-w-md'}`}>
            <form onSubmit={handleSubmit} className="relative group">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowResults(true)}
                    placeholder="Search for products..."
                    className={`w-full py-2.5 pl-10 pr-10 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/60 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:border-white transition-all duration-300 shadow-sm ${showResults ? 'rounded-b-none border-b-0' : ''}`}
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                />
                <SearchIcon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${showResults || query ? 'text-gray-900' : 'text-white/70 group-hover:text-white'}`} />

                {loading && (
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                        <Loader2 className="w-4 h-4 animate-spin text-[#5A0117]" />
                    </div>
                )}

                {!loading && query && (
                    <button
                        type="button"
                        onClick={() => { setQuery(""); setResults([]); }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </form>

            {/* Results Dropdown */}
            {showResults && (
                <div className="absolute top-full left-0 right-0 bg-white border border-t-0 border-gray-100 rounded-b-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    {results.length > 0 ? (
                        <div className="py-2">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50">
                                PRODUCTS
                            </div>
                            {results.map((product) => (
                                <Link
                                    key={product._id}
                                    href={`/products/${product.slug || product._id}`}
                                    onClick={() => { setShowResults(false); if (onClose) onClose(); }}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                                >
                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 truncate" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                            {product.name}
                                        </h4>
                                        <p className="text-xs text-gray-500">{product.brand}</p>
                                    </div>
                                    <div className="text-sm font-bold text-[#5A0117]">
                                        ₹{product.price.toLocaleString()}
                                    </div>
                                </Link>
                            ))}
                            <button
                                onClick={handleSubmit}
                                className="w-full py-3 text-center text-sm font-semibold text-[#5A0117] hover:bg-gray-50 transition-colors"
                            >
                                View All {results.length}+ Results
                            </button>
                        </div>
                    ) : (
                        !loading && (
                            <div className="p-6 text-center text-gray-500">
                                <p>No products found for &quot;{query}&quot;</p>
                            </div>
                        )
                    )}
                </div>
            )}
        </div>
    )
}
