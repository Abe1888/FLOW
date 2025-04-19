"use client"

import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { useCallback, useEffect, useState, useMemo } from "react"
import { formatString } from "@/lib/language-utils"

// Custom hook to simplify translation usage in components
export function useTranslation() {
  const { language, isLanguageLoaded } = useLanguage()
  const [currentLanguage, setCurrentLanguage] = useState<"en" | "am">("en")

  // Update current language when language context changes
  useEffect(() => {
    console.log("useTranslation detected language change to:", language)
    setCurrentLanguage(language)
  }, [language])

  // Use useCallback to memoize the translation function
  const t = useCallback(
    (key: string, variables?: Record<string, string | number>): string => {
      // Add debugging to help identify translation issues
      const translation = getTranslation(key, currentLanguage)

      // Log when specific keys are translated for debugging
      if (key === "Environmental Sensor") {
        console.log(`Translating "Environmental Sensor" to: ${translation} (language: ${currentLanguage})`)
      }

      if (variables) {
        return formatString(translation, variables)
      }

      return translation
    },
    [currentLanguage],
  )

  return useMemo(
    () => ({
      t,
      language: currentLanguage,
      isLoaded: isLanguageLoaded,
    }),
    [t, currentLanguage, isLanguageLoaded],
  )
}
