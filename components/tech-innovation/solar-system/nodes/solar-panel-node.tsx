"use client"
import { Handle, Position, type NodeProps } from "reactflow"
import type React from "react"

import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sun, Thermometer, Zap, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface SolarPanelData {
  sunIntensity: number
  solarActive: boolean
  solarProduction: number
  onSunIntensityChange: (value: number) => void
  onSolarActiveChange: (value: boolean) => void
  t: (key: string) => string // Translation function
}

function SolarPanelNode({ data }: NodeProps<SolarPanelData>) {
  const { t } = data
  const [isHovered, setIsHovered] = useState(false)
  const [rotation, setRotation] = useState({ x: 15, y: 0 })
  const [animate, setAnimate] = useState(false)

  // Handle mouse interaction for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovered) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Calculate rotation based on mouse position
    const rotateX = 20 * ((y - rect.height / 2) / rect.height)
    const rotateY = -20 * ((x - rect.width / 2) / rect.width)

    setRotation({ x: rotateX, y: rotateY })
  }

  // Add animation effect when component mounts
  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleSunIntensityChange = (value: number[]) => {
    data.onSunIntensityChange(value[0])
  }

  // Calculate panel temperature based on sun intensity
  const panelTemp = 20 + (data.sunIntensity / 100) * 25

  // Calculate efficiency based on temperature (efficiency decreases as temperature increases)
  const efficiency = Math.max(85 - (panelTemp - 25) * 0.5, 70).toFixed(1)

  return (
    <div className="w-[520px] transition-all duration-300" style={{ transform: animate ? "scale(1.05)" : "scale(1)" }}>
      <div className="relative">
        {/* Enhanced backdrop with glow effect */}
        <div className="absolute -inset-3 bg-gradient-to-br from-blue-900/40 to-emerald-900/40 rounded-xl border border-blue-800/40 -z-10 shadow-lg blur-[2px]"></div>

        <div
          className="flex items-start p-3 transition-transform duration-300 ease-out"
          onClick={(e) => e.stopPropagation()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false)
            setRotation({ x: 15, y: 0 })
          }}
          onMouseMove={handleMouseMove}
        >
          {/* 3D Solar Panel Visualization */}
          <div className="relative perspective-[1000px]">
            <div
              className={cn(
                "w-56 h-56 bg-slate-900 rounded-md shadow-xl border-2 overflow-hidden relative transition-all duration-300",
                data.solarActive ? "border-blue-500" : "border-slate-700",
              )}
              style={{
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {/* Enhanced aluminum frame with 3D effect */}
              <div
                className="absolute inset-0 border-4 border-slate-400/40"
                style={{ transform: "translateZ(2px)" }}
              ></div>

              {/* Solar cells grid with 3D effect */}
              <div className="grid grid-cols-6 grid-rows-6 gap-[2px] p-2 h-full w-full">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "relative overflow-hidden transition-all duration-300",
                      data.solarActive ? "bg-gradient-to-br from-blue-900 to-blue-950" : "bg-slate-800",
                    )}
                    style={{
                      transform: `translateZ(${data.solarActive ? 1 : 0}px)`,
                      boxShadow: data.solarActive ? "inset 0 0 5px rgba(59, 130, 246, 0.5)" : "none",
                    }}
                  >
                    {data.solarActive && (
                      <>
                        {/* Enhanced cell bus bars */}
                        <div className="absolute top-0 left-1/4 right-1/4 h-full bg-blue-700/30"></div>
                        <div className="absolute top-1/4 bottom-1/4 left-0 right-0 w-full bg-blue-700/30"></div>

                        {/* Enhanced reflection effect */}
                        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-blue-500/20 to-transparent transform -skew-x-12"></div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Enhanced junction box */}
              <div
                className="absolute bottom-1 right-1 w-6 h-4 bg-slate-800 border border-slate-700 rounded-sm"
                style={{ transform: "translateZ(3px)" }}
              ></div>

              {/* Enhanced panel specs label */}
              <div
                className="absolute top-1 left-1 bg-slate-900/90 rounded text-[8px] text-slate-300 px-1"
                style={{ transform: "translateZ(3px)" }}
              >
                250W • 24V
              </div>

              {/* Add sun reflection animation when active */}
              {data.solarActive && (
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent animate-pulse-slow"></div>
              )}
            </div>

            {/* Enhanced panel mount with 3D effect */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-slate-700 rounded-b-md"></div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-600 rounded-full"></div>
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-slate-600"></div>
          </div>
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <div className="font-medium text-white text-sm">{t("Solar Panel System")}</div>
          </div>

          {/* Enhanced controls and data display on the right side */}
          <div className="ml-6 flex flex-col space-y-4 pointer-events-auto relative z-10 w-64">
            {/* Enhanced sun intensity slider with icon */}
            <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700 pointer-events-auto shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
              <div className="flex items-center space-x-2 mb-2">
                <Sun
                  className={cn("h-5 w-5", data.solarActive ? "text-yellow-500 animate-pulse-slow" : "text-slate-400")}
                />
                <span className="text-sm text-slate-300 font-medium">{t("Sun Intensity")}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Slider
                  value={[data.sunIntensity]}
                  min={0}
                  max={100}
                  step={1}
                  className="w-40 relative z-20"
                  onValueChange={handleSunIntensityChange}
                />
                <span className="text-sm font-medium w-10 text-white">{data.sunIntensity}%</span>
              </div>
            </div>

            {/* Enhanced panel status indicators */}
            <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700 space-y-3 pointer-events-auto shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
              {/* Active toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="solar-active" className="text-sm text-slate-300 font-medium flex items-center">
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full mr-2",
                      data.solarActive ? "bg-green-500 animate-pulse" : "bg-red-500",
                    )}
                  ></div>
                  {t("Panel Active")}
                </Label>
                <Switch
                  checked={data.solarActive}
                  onCheckedChange={data.onSolarActiveChange}
                  id="solar-active"
                  className="data-[state=checked]:bg-lime-600 relative z-20"
                />
              </div>

              {/* Enhanced output wattage */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  <span className="text-sm text-slate-300">{t("Output")}:</span>
                </div>
                <span className="text-sm font-medium text-lime-400">{data.solarProduction}W</span>
              </div>

              {/* Enhanced panel temperature */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Thermometer className="h-4 w-4 mr-2 text-orange-400" />
                  <span className="text-sm text-slate-300">{t("Temperature")}:</span>
                </div>
                <span className="text-sm font-medium text-orange-400">{panelTemp.toFixed(1)}°C</span>
              </div>

              {/* Enhanced efficiency */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
                  <span className="text-sm text-slate-300">{t("Efficiency")}:</span>
                </div>
                <span className="text-sm font-medium text-blue-400">{efficiency}%</span>
              </div>
            </div>

            {/* Enhanced technical specifications */}
            <div className="bg-slate-800/90 p-3 rounded-lg border border-slate-700 pointer-events-auto shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
              <h4 className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
                {t("Specifications")}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-slate-400">{t("Type")}:</div>
                <div className="text-white">{t("Monocrystalline")}</div>
                <div className="text-slate-400">{t("Max Power")}:</div>
                <div className="text-white">250W</div>
                <div className="text-slate-400">{t("Voltage")}:</div>
                <div className="text-white">24V</div>
                <div className="text-slate-400">{t("Dimensions")}:</div>
                <div className="text-white">1650 × 992 × 40mm</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        style={{
          background: "#22c55e",
          width: "12px",
          height: "12px",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(34, 197, 94, 0.5)",
        }}
        isConnectable={true}
      />
    </div>
  )
}

export default SolarPanelNode
