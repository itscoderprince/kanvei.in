"use client"
import { useState, useEffect } from "react"
import ProductCard from "./ProductCard"

export default function SimilarProducts({ categoryId, currentProductId }) {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            if (!categoryId) return

            try {
                // Fetch products from the same category, limit to 4
                // We might need to adjust the API to support excluding ID or filter client side
                const res = await fetch(`/api/products?category=${encodeURIComponent(categoryId)}&limit=5`)
                const data = await res.json()

                if (data.success) {
                    // Filter out current product and take top 4
                    const similar = data.products
                        .filter(p => p._id !== currentProductId)
                        .slice(0, 4)
                    setProducts(similar)
                }
            } catch (error) {
                console.error("Failed to fetch similar products", error)
            } finally {
                setLoading(false)
            }
        }

        fetchSimilarProducts()
    }, [categoryId, currentProductId])

    if (loading) return <div className="py-10 text-center">Loading recommendations...</div>
    if (products.length === 0) return null

    return (
        <section className="py-16 bg-gray-50/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-2xl font-bold text-[#5A0117] mb-8" style={{ fontFamily: "Sugar, serif" }}>
                    You May Also Like
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    )
}
