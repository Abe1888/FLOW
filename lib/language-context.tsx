"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { Language } from "./translations"
import { detectBrowserLanguage } from "./language-utils"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  isLanguageLoaded: boolean
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  isLanguageLoaded: false,
})

export const useLanguage = () => useContext(LanguageContext)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en")
  const [isInitialized, setIsInitialized] = useState(false)
  const [isLanguageLoaded, setIsLanguageLoaded] = useState(false)

  // Load language preference from localStorage on mount
  useEffect(() => {
    // Only run on client side
    if (typeof window !== "undefined") {
      try {
        const savedLanguage = localStorage.getItem("preferred-language")
        console.log("LanguageProvider: Loading saved language:", savedLanguage)

        if (savedLanguage === "am" || savedLanguage === "en") {
          setLanguage(savedLanguage)
        } else {
          // If no saved preference, detect from browser
          const detectedLanguage = detectBrowserLanguage()
          setLanguage(detectedLanguage)
        }

        setIsInitialized(true)

        // Mark language as loaded after a short delay to allow for transitions
        setTimeout(() => {
          setIsLanguageLoaded(true)
        }, 100)
      } catch (error) {
        console.error("Error loading language preference:", error)
        setIsInitialized(true)
        setIsLanguageLoaded(true)
      }
    }
  }, [])

  // Save language preference to localStorage when it changes
  useEffect(() => {
    // Only save after initialization to prevent overwriting with default
    if (isInitialized && typeof window !== "undefined") {
      console.log("LanguageProvider: Saving language to localStorage:", language)
      localStorage.setItem("preferred-language", language)

      // Update HTML lang attribute
      document.documentElement.lang = language

      // Apply or remove Amharic font class to the entire document
      if (language === "am") {
        document.documentElement.classList.add("am-text")
        document.body.classList.add("amharic")
      } else {
        document.documentElement.classList.remove("am-text")
        document.body.classList.remove("amharic")
      }

      // Dispatch a custom event for language change
      const event = new CustomEvent("languagechange", { detail: { language } })
      window.dispatchEvent(event)

      // Force a re-render of components that might not be directly connected to the language context
      // This helps ensure all components update when language changes
      console.log("Language changed to:", language)
    }
  }, [language, isInitialized])

  const handleSetLanguage = (newLang: Language) => {
    console.log("LanguageProvider: Setting language to:", newLang)
    setLanguage(newLang)
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        isLanguageLoaded,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}
