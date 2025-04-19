"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-emerald-950/90 backdrop-blur-md shadow-md py-1.5 sm:py-2 dark:bg-slate-900/90"
          : "bg-transparent py-2 sm:py-4",
      )}
    >
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 overflow-hidden">
              <Image
                src="/images/grean-world-logo.png"
                alt="GREAN WORLD"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>
            <span className="text-lg sm:text-xl md:text-2xl font-bold text-white hidden xs:inline-block">
              GREAN WORLD
            </span>
          </Link>

          {/* Project Title - Desktop */}
          <div className="hidden md:block text-center">
            <h1 className="text-base md:text-lg lg:text-xl text-lime-400 dark:text-emerald-400 font-medium tracking-wide">
              GREAN WORLD ENERGY TECHNOLOGY PLC
            </h1>
            <p className="text-xs md:text-sm text-white/80">SOLAR SYSTEM VISUALIZATION SIMULATION</p>
          </div>

          {/* Mobile Project Title - Visible on small screens */}
          <div className="block md:hidden text-center max-w-[60%]">
            <h1 className="text-xs sm:text-sm text-lime-400 dark:text-emerald-400 font-medium tracking-wide truncate">
              GREAN WORLD ENERGY
            </h1>
            <p className="text-[0.65rem] sm:text-xs text-white/80 truncate">SOLAR SYSTEM SIMULATION</p>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
            {isMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-950/95 backdrop-blur-md dark:bg-slate-900/95">
          <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
            <div className="flex flex-col space-y-4 sm:space-y-6">
              <div className="text-center">
                <h1 className="text-base sm:text-lg text-lime-400 dark:text-emerald-400 font-medium tracking-wide">
                  GREAN WORLD ENERGY TECHNOLOGY PLC
                </h1>
                <p className="text-xs sm:text-sm text-white/80">SOLAR SYSTEM VISUALIZATION SIMULATION</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
