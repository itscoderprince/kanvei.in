"use client"
import { useState } from "react"
import AdminSidebar from "./AdminSidebar"
import ProtectedRoute from "../ProtectedRoute"
import { Menu } from "lucide-react"

export default function AdminLayout({ children }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="flex min-h-screen bg-gray-50/50">
        {/* Desktop sidebar */}
        <div className="hidden md:flex flex-shrink-0">
          <AdminSidebar />
        </div>

        {/* Mobile sidebar drawer */}
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <div className="relative h-full w-64 animate-slide-in-right">
              <AdminSidebar onLinkClick={() => setIsMobileSidebarOpen(false)} />
            </div>
          </div>
        )}

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile top bar */}
          <div className="md:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
            <button
              aria-label="Open admin menu"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <span className="text-lg font-bold" style={{ color: "#5A0117", fontFamily: "Sugar, serif" }}>
              Kanvei Admin
            </span>
          </div>

          <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
