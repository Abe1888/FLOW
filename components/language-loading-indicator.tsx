"use client"

import { useEffect, useState } from "react"
import { useLanguage } from "@/lib/language-context"

export function LanguageLoadingIndicator() {
  const { language } = useLanguage()
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Hide the indicator after a short delay
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [language])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center transition-opacity duration-300">
      <div className="flex flex-col items-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">{language === "am" ? "በመጫን ላይ..." : "Loading..."}</p>
      </div>
    </div>
  )
}
