import React from 'react';
import Link from 'next/link';
import { Sparkles, ShoppingBag, ArrowRight, Search } from 'lucide-react';

export default function EmptyProductState({ onClearFilters }) {
    return (
        <div className="min-h-[40vh] flex items-center justify-center px-4 py-8">
            <div className="text-center max-w-md mx-auto">
                {/* Icon with Animation */}
                <div className="relative inline-block mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#5A0117]/20 to-[#8C6141]/20 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-[#FDF8F3] to-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
                        <Search className="w-8 h-8 md:w-10 md:h-10 text-[#5A0117]" strokeWidth={1.5} />
                    </div>
                    <div className="absolute -top-1 -right-1">
                        <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#8C6141] animate-bounce" />
                    </div>
                </div>

                {/* Motivational Message */}
                <h2 className="text-2xl md:text-3xl font-bold text-[#5A0117] mb-2" style={{ fontFamily: "Sugar, serif" }}>
                    No Products Found
                </h2>

                <p className="text-gray-600 text-sm md:text-base mb-2 leading-relaxed" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Don&apos;t worry! Your perfect item is waiting for you.
                </p>

                <p className="text-gray-500 text-xs md:text-sm mb-6" style={{ fontFamily: "Montserrat, sans-serif" }}>
                    Try adjusting your filters or explore our full collection
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <button
                        onClick={onClearFilters}
                        className="group w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#5A0117] to-[#8C6141] text-white rounded-full font-bold text-sm hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        <Search className="w-4 h-4" />
                        Clear Filters
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <Link
                        href="/shop"
                        className="group w-full sm:w-auto px-6 py-2.5 bg-white border-2 border-[#5A0117] text-[#5A0117] rounded-full font-bold text-sm hover:bg-[#5A0117] hover:text-white hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                        <ShoppingBag className="w-4 h-4" />
                        Back to Shop
                    </Link>
                </div>

                {/* Decorative Elements */}
                <div className="mt-6 flex justify-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#5A0117]/20 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#8C6141]/20 animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#DBCCB7]/20 animate-pulse delay-150"></div>
                </div>
            </div>
        </div>
    );
}
