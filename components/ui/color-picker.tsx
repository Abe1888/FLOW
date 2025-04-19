"use client"

import { useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  className?: string
}

const predefinedColors = [
  // Slate
  "#f8fafc",
  "#f1f5f9",
  "#e2e8f0",
  "#cbd5e1",
  "#94a3b8",
  "#64748b",
  "#475569",
  "#334155",
  "#1e293b",
  "#0f172a",
  // Red
  "#fef2f2",
  "#fee2e2",
  "#fecaca",
  "#fca5a5",
  "#f87171",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#991b1b",
  "#7f1d1d",
  // Orange
  "#fff7ed",
  "#ffedd5",
  "#fed7aa",
  "#fdba74",
  "#fb923c",
  "#f97316",
  "#ea580c",
  "#c2410c",
  "#9a3412",
  "#7c2d12",
  // Green
  "#f0fdf4",
  "#dcfce7",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#166534",
  "#14532d",
  // Blue
  "#eff6ff",
  "#dbeafe",
  "#bfdbfe",
  "#93c5fd",
  "#60a5fa",
  "#3b82f6",
  "#2563eb",
  "#1d4ed8",
  "#1e40af",
  "#1e3a8a",
  // Purple
  "#faf5ff",
  "#f3e8ff",
  "#e9d5ff",
  "#d8b4fe",
  "#c084fc",
  "#a855f7",
  "#9333ea",
  "#7e22ce",
  "#6b21a8",
  "#581c87",
]

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [currentColor, setCurrentColor] = useState(color || "#000000")

  const handleColorChange = (newColor: string) => {
    setCurrentColor(newColor)
    onChange(newColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("h-8 w-full flex items-center justify-between", className)}>
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-sm border border-slate-300 dark:border-slate-700"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-xs">{currentColor}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div className="grid grid-cols-10 gap-1">
            {predefinedColors.map((presetColor) => (
              <button
                key={presetColor}
                className={cn(
                  "h-5 w-5 rounded-sm border border-slate-300 dark:border-slate-700",
                  currentColor === presetColor && "ring-2 ring-slate-950 dark:ring-slate-50",
                )}
                style={{ backgroundColor: presetColor }}
                onClick={() => handleColorChange(presetColor)}
              />
            ))}
          </div>
          <div>
            <input
              type="color"
              value={currentColor}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-full h-8"
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
