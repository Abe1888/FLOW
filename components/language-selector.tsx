"use client"

import { useLanguage } from "@/lib/language-context"
import { getTranslation } from "@/lib/translations"
import { Globe } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

export function LanguageSelector() {
  const { language, setLanguage, isLanguageLoaded } = useLanguage()

  // Debug: Log language changes
  useEffect(() => {
    console.log("LanguageSelector: Current language:", language)
  }, [language])

  const handleLanguageChange = (newLang: "en" | "am") => {
    console.log("LanguageSelector: Changing language from", language, "to", newLang)
    setLanguage(newLang)
  }

  return (
    <TooltipProvider>
      <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-slate-800/80 backdrop-blur-sm rounded-md p-2 border border-lime-600/20">
        <Globe className="h-4 w-4 text-lime-400" />
        <span className="text-xs text-white mr-2">{getTranslation("Language", language)}:</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleLanguageChange("en")}
              className={cn(
                "text-xs px-2 py-1 rounded-md transition-colors",
                language === "en" ? "bg-lime-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600",
              )}
              disabled={!isLanguageLoaded}
              aria-pressed={language === "en"}
            >
              {getTranslation("English", language)}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs">Switch to English</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => handleLanguageChange("am")}
              className={cn(
                "text-xs px-2 py-1 rounded-md transition-colors amharic",
                language === "am" ? "bg-lime-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600",
              )}
              disabled={!isLanguageLoaded}
              aria-pressed={language === "am"}
            >
              {getTranslation("Amharic", language)}
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p className="text-xs amharic">አማርኛ ተጠቀም</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
