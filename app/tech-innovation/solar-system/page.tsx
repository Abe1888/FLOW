"use client"

import { SolarSystemSimulation } from "@/components/tech-innovation/solar-system/solar-system-simulation"
import { EcoPattern } from "@/components/eco-pattern"
import { useState, useEffect } from "react"
import { Toaster } from "sonner"
import { useTranslation } from "@/hooks/use-translation"
import Image from "next/image"

export default function SolarSystemPage() {
  const { t } = useTranslation()
  const [isMounted, setIsMounted] = useState(false)

  // Simple effect to set the component as mounted
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden relative">
      <Toaster position="top-center" richColors />

      <div className="flex-grow relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 -z-10">
          <EcoPattern className="opacity-10" type="hexagons" />

          {/* Add animated background elements - more responsive sizing */}
          <div className="absolute top-1/4 left-1/5 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full bg-green-500/10 dark:bg-emerald-500/5 animate-pulse-slow"></div>
          <div
            className="absolute bottom-1/3 right-1/4 w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 rounded-full bg-lime-500/10 dark:bg-lime-500/5 animate-pulse-slow"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* Logo watermark - more responsive sizing */}
        <div className="absolute bottom-4 right-4 opacity-20 pointer-events-none z-10">
          <Image
            src="/images/grean-world-logo.png"
            alt="GREAN WORLD"
            width={60}
            height={60}
            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
          />
        </div>

        <div className="bg-slate-800/30 dark:bg-slate-900/40 backdrop-blur-sm rounded-lg border border-lime-600/20 dark:border-emerald-800/20 h-[calc(100vh-4.5rem)] m-1 sm:m-2 overflow-hidden transition-colors duration-300 shadow-xl">
          {isMounted ? (
            <div className="h-full w-full overflow-hidden relative">
              <SolarSystemSimulation />
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <Image
                  src="/images/grean-world-logo.png"
                  alt="GREAN WORLD"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-3 sm:mb-4 animate-pulse"
                />
                <div
                  className="text-lime-400 dark:text-emerald-400 animate-pulse text-sm sm:text-base"
                  aria-live="polite"
                  role="status"
                >
                  {t("Initializing solar system...")}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
