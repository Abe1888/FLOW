"use client"

import { useCallback } from "react"
import { useLanguage } from "@/lib/language-context"
import { usePathname } from "next/navigation"

/**
 * Hook to get and manipulate translated URLs
 */
export function useTranslatedUrl() {
  const { language } = useLanguage()
  const pathname = usePathname()

  /**
   * Gets the URL for a specific language
   */
  const getLanguageUrl = useCallback((targetLanguage: string): string => {
    if (typeof window === "undefined") return ""

    const url = new URL(window.location.href)

    // Add or update the language parameter
    url.searchParams.set("lang", targetLanguage)

    return url.toString()
  }, [])

  /**
   * Gets the current URL with the active language parameter
   */
  const getCurrentLanguageUrl = useCallback((): string => {
    return getLanguageUrl(language)
  }, [getLanguageUrl, language])

  return {
    getLanguageUrl,
    getCurrentLanguageUrl,
    currentPath: pathname,
    currentLanguage: language,
  }
}
