"use client"
import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { createPortal } from "react-dom"
import styled from "@emotion/styled"

// Styled Components
const DrawerContainer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  justify-content: flex-end;
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: opacity 0.4s ease;
`

const Panel = styled.div`
  position: relative;
  width: 75%; /* Explicit user request */
  height: 100%;
  background-color: white;
  box-shadow: -5px 0 25px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  transform: translateX(${props => props.isOpen ? '0%' : '100%'});
  transition: transform 0.5s cubic-bezier(0.32, 0.72, 0, 1); /* Smooth spring-like eased animation */
  z-index: 51;
`

export default function Drawer({ isOpen, onClose, title, children, footer }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    if (!mounted) return null

    return createPortal(
        <DrawerContainer isOpen={isOpen}>
            <Overlay isOpen={isOpen} onClick={onClose} />

            <Panel isOpen={isOpen}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-[#5A0117] text-white">
                    <h2 className="text-xl font-bold" style={{ fontFamily: "Sugar, serif" }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        aria-label="Close drawer"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-thumb-gray-200">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                        {footer}
                    </div>
                )}
            </Panel>
        </DrawerContainer>,
        document.body
    )
}
