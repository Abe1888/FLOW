"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Database, ArrowLeft, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTranslation } from "@/hooks/use-translation"
import { cn } from "@/lib/utils"
import { useIsMobile as useMobile } from "@/lib/hooks"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function SolarSystemNavigation() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Add scroll effect for navigation styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const links = [
    {
      href: "/tech-innovation/solar-system",
      label: "Simulator",
      icon: (
        <Image src="/images/grean-world-logo.png" alt="GREAN WORLD" width={20} height={20} className="object-contain" />
      ),
    },
    {
      href: "/tech-innovation/solar-system/tech-stack",
      label: "Tech Stack",
      icon: <Database className="h-5 w-5" />,
    },
  ]

  return (
    <TooltipProvider>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled
            ? "bg-gradient-to-r from-emerald-950/90 via-slate-900/90 to-emerald-950/90 backdrop-blur-md shadow-lg border-b border-emerald-800/20"
            : "bg-gradient-to-r from-emerald-950/70 via-slate-900/70 to-emerald-950/70 backdrop-blur-sm",
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/tech-innovation"
                    className="text-emerald-400 hover:text-emerald-300 transition-all duration-300 flex items-center justify-center w-10 h-10 rounded-full hover:bg-emerald-900/30"
                    aria-label={t("Back to Tech Innovation")}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Back to Tech Innovation</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block text-center">
              <h1 className="text-lg font-bold tracking-wide bg-gradient-to-r from-lime-400 via-emerald-300 to-lime-400 bg-clip-text text-transparent">
                GREAN WORLD ENERGY TECHNOLOGY PLC
              </h1>
              <p className="text-xs text-emerald-400/80 font-medium tracking-wider">
                SOLAR SYSTEM VISUALIZATION SIMULATION
              </p>
            </div>

            <nav className="hidden md:flex items-center space-x-2">
              {links.map((link) => (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
                        pathname === link.href
                          ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 shadow-inner"
                          : "text-slate-300 hover:text-emerald-400 hover:bg-emerald-900/30",
                      )}
                      aria-current={pathname === link.href ? "page" : undefined}
                    >
                      {link.icon}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{link.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              <div className="ml-2">
                <ThemeToggle />
              </div>
            </nav>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-900/30"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? t("Close menu") : t("Open menu")}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-gradient-to-b from-slate-900/95 to-emerald-950/95 backdrop-blur-md border-b border-emerald-800/20 shadow-lg animate-in slide-in-from-top duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <div className="text-center py-2 mb-2">
                <h1 className="text-sm font-bold tracking-wide bg-gradient-to-r from-lime-400 via-emerald-300 to-lime-400 bg-clip-text text-transparent">
                  GREAN WORLD ENERGY TECHNOLOGY PLC
                </h1>
                <p className="text-xs text-emerald-400/80 font-medium tracking-wider">
                  SOLAR SYSTEM VISUALIZATION SIMULATION
                </p>
              </div>
              <div className="flex justify-center space-x-4 py-2">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300",
                      pathname === link.href
                        ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30 shadow-inner"
                        : "text-slate-300 hover:text-emerald-400 hover:bg-emerald-900/30",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                    aria-current={pathname === link.href ? "page" : undefined}
                  >
                    {link.icon}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>
    </TooltipProvider>
  )
}
