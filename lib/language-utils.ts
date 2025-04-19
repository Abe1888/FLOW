import type { Language } from "./translations"

/**
 * Detects the user's preferred language from browser settings
 * @returns The detected language code or default language
 */
export function detectBrowserLanguage(defaultLang: Language = "en"): Language {
  // Only run on client side
  if (typeof window === "undefined") {
    return defaultLang
  }

  try {
    // Get browser language
    const browserLang = navigator.language.toLowerCase()

    // Check if it's one of our supported languages
    if (browserLang.startsWith("am")) {
      return "am"
    }

    // Default to English for any other language
    return "en"
  } catch (error) {
    console.error("Error detecting browser language:", error)
    return defaultLang
  }
}

/**
 * Formats a string with variable substitution
 * Example: formatString("Hello {{name}}", { name: "World" }) => "Hello World"
 */
export function formatString(str: string, variables?: Record<string, string | number>): string {
  if (!variables) return str

  return str.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    return variables[key]?.toString() || `{{${key}}}`
  })
}

/**
 * Formats a date according to the current language
 */
export function formatDate(date: Date | string, language: Language, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date

  const locale = language === "am" ? "am-ET" : "en-US"

  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(dateObj)
}

/**
 * Formats a number according to the current language
 */
export function formatNumber(num: number, language: Language, options?: Intl.NumberFormatOptions): string {
  const locale = language === "am" ? "am-ET" : "en-US"

  return new Intl.NumberFormat(locale, options).format(num)
}
