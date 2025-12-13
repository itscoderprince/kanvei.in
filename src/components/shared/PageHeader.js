
import React from 'react';

export default function PageHeader({ title, description, icon, breadcrumb }) {
  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8 text-white overflow-hidden bg-[#5A0117]">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('/pattern-bg.png')] mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>

      <div className="relative w-full px-4 sm:px-6 lg:px-8 text-center z-10">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-center md:text-left">
          <div>
            {breadcrumb && (
              <div className="mb-2 text-xs text-[#DBCCB7] uppercase tracking-wider font-medium opacity-80" style={{ fontFamily: "Montserrat, sans-serif" }}>
                {breadcrumb}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ fontFamily: "Sugar, serif" }}>
              {icon} {title}
            </h1>
          </div>

          {description && (
            <p className="text-sm md:text-base text-[#DBCCB7] max-w-xl font-light leading-relaxed hidden md:block" style={{ fontFamily: "Montserrat, sans-serif" }}>
              {description}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

