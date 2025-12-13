import React from 'react';

export default function SectionHeader({ title, subtitle, centered = true }) {
    return (
        <div className={`mb-10 ${centered ? 'text-center' : 'text-left'}`}>
            <h2 className="text-3xl font-bold text-[#5A0117] mb-3" style={{ fontFamily: "Sugar, serif" }}>
                {title}
            </h2>
            {centered && (
                <div className="w-16 h-1 bg-[#8C6141] mx-auto rounded-full opacity-50"></div>
            )}
            {subtitle && (
                <p className="mt-2 text-gray-600" style={{ fontFamily: "Montserrat, sans-serif" }}>{subtitle}</p>
            )}
        </div>
    );
}
