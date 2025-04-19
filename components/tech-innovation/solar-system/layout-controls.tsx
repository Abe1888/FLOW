"use client"
import { useState } from "react"
import { Save, Share2, RotateCcw, Settings, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface LayoutControlsProps {
  savedLayout: Record<string, { x: number; y: number }>
  saveLayoutEnabled: boolean
  onSaveLayoutEnabledChange: (enabled: boolean) => void
  onResetLayout: () => void
  onSaveLayout: () => void
  onShareLayout: () => void
  t: (key: string) => string // Add translation function
}

export function LayoutControls({
  savedLayout,
  saveLayoutEnabled,
  onSaveLayoutEnabledChange,
  onResetLayout,
  onSaveLayout,
  onShareLayout,
  t,
}: LayoutControlsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <TooltipProvider>
      <div className="fixed right-3 sm:right-4 md:right-5 top-20 sm:top-24 md:top-20 z-40">
        {!isOpen ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsOpen(true)}
                className="bg-slate-800/80 hover:bg-slate-700/80 text-lime-400 dark:text-emerald-400 rounded-lg p-1.5 sm:p-2 shadow-lg transition-all duration-200 hover:scale-105 border border-lime-600/20 dark:border-emerald-600/20"
                aria-label={t("Layout Settings")}
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="text-sm">{t("Layout Settings")}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="fixed right-3 sm:right-4 md:right-5 top-20 sm:top-24 md:top-20 z-40 bg-slate-800/90 backdrop-blur-md border border-lime-600/30 rounded-lg p-3 sm:p-4 shadow-xl max-w-[90vw] sm:max-w-[20rem] md:max-w-[22rem]">
            <div className="flex justify-between items-center mb-3 border-b border-slate-700/50 pb-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/grean-world-logo.png"
                  alt="GREAN WORLD"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <h3 className="text-white font-medium text-sm">{t("Layout Settings")}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={t("Close panel")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col space-y-2.5">
              <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-md">
                <Label htmlFor="save-layout" className="text-sm text-slate-300 font-medium flex items-center">
                  <Save className="h-4 w-4 mr-2 text-lime-500" />
                  {t("Save Layout")}
                </Label>
                <Switch
                  id="save-layout"
                  checked={saveLayoutEnabled}
                  onCheckedChange={onSaveLayoutEnabledChange}
                  className="data-[state=checked]:bg-lime-600 scale-110"
                  aria-label={t("Save Layout")}
                />
              </div>

              <div className="space-y-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-700/90 border-slate-600 hover:bg-slate-600 text-white w-full justify-start px-2 sm:px-3 py-1.5 sm:py-2 h-auto rounded-md transition-all duration-200 hover:translate-x-0.5 text-xs sm:text-sm"
                  onClick={onSaveLayout}
                  disabled={!saveLayoutEnabled}
                  aria-disabled={!saveLayoutEnabled}
                >
                  <Save className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-green-400 flex-shrink-0" />
                  <span className="font-medium">{t("Save Current Layout")}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-700/90 border-slate-600 hover:bg-slate-600 text-white w-full justify-start px-2 sm:px-3 py-1.5 sm:py-2 h-auto rounded-md transition-all duration-200 hover:translate-x-0.5 text-xs sm:text-sm"
                  onClick={onResetLayout}
                >
                  <RotateCcw className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-yellow-400 flex-shrink-0" />
                  <span className="font-medium">{t("Reset Layout")}</span>
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  className="bg-slate-700/90 border-slate-600 hover:bg-slate-600 text-white w-full justify-start px-2 sm:px-3 py-1.5 sm:py-2 h-auto rounded-md transition-all duration-200 hover:translate-x-0.5 text-xs sm:text-sm"
                  onClick={onShareLayout}
                >
                  <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-blue-400 flex-shrink-0" />
                  <span className="font-medium">{t("Share Layout")}</span>
                </Button>
              </div>

              <div className="text-xs text-slate-400 pt-2 border-t border-slate-700/50">
                <p>
                  {Object.keys(savedLayout).length > 0
                    ? t("Layout contains {{count}} components", { count: Object.keys(savedLayout).length })
                    : t("No saved layout")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
