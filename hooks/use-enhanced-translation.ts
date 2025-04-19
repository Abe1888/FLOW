"use client"

import { useCallback, useMemo } from "react"
import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { formatString, formatDate, formatNumber } from "@/lib/language-utils"

interface TranslationOptions {
  variables?: Record<string, string | number>
}

/**
 * Enhanced translation hook with variable substitution and formatting
 */
export function useEnhancedTranslation() {
  const { language } = useLanguage()

  // Basic translation function with variable substitution
  const t = useCallback(
    (key: string, options?: TranslationOptions): string => {
      const translation = getTranslation(key, language)

      if (options?.variables) {
        return formatString(translation, options.variables)
      }

      return translation
    },
    [language],
  )

  // Date formatting function
  const formatLocalDate = useCallback(
    (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
      return formatDate(date, language, options)
    },
    [language],
  )

  // Number formatting function
  const formatLocalNumber = useCallback(
    (num: number, options?: Intl.NumberFormatOptions): string => {
      return formatNumber(num, language, options)
    },
    [language],
  )

  return useMemo(
    () => ({
      t,
      language,
      formatDate: formatLocalDate,
      formatNumber: formatLocalNumber,
    }),
    [t, language, formatLocalDate, formatLocalNumber],
  )
}
