"use client"
import { Handle, Position, type NodeProps } from "reactflow"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Compass } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { BarChart3, Zap } from "lucide-react"
import { useTranslation } from "react-i18next"

interface AdditionalSolarPanelData {
  panelId: string
  displayName?: string // Add this line
  isActive: boolean
  ratedWattage: number
  orientation: "east" | "south" | "west"
  sunlightMultiplier: number
  currentOutput: number
  sunIntensity: number
  onActivationChange: (id: string, active: boolean) => void
  onOrientationChange: (id: string, orientation: "east" | "south" | "west") => void
  onRatedWattageChange: (id: string, wattage: number) => void
}

function AdditionalSolarPanelNode({ data }: NodeProps<AdditionalSolarPanelData>) {
  const [showConfig, setShowConfig] = useState(false)
  const { t } = useTranslation()

  // Calculate effective output based on orientation and sun intensity
  const getEffectiveOutput = () => {
    if (!data.isActive) return 0

    // Apply orientation multiplier based on time of day (simplified)
    let orientationMultiplier = 1.0
    switch (data.orientation) {
      case "east":
        orientationMultiplier = 0.8 // Better in morning
        break
      case "south":
        orientationMultiplier = 1.0 // Best overall
        break
      case "west":
        orientationMultiplier = 0.8 // Better in afternoon
        break
    }

    return Math.round(data.ratedWattage * (data.sunIntensity / 100) * orientationMultiplier * data.sunlightMultiplier)
  }

  return (
    <div>
      <div className="relative">
        {/* Backdrop rectangle */}
        <div className="absolute -inset-3 bg-gradient-to-br from-blue-900/30 to-emerald-900/30 rounded-xl border border-blue-800/30 -z-10 shadow-lg"></div>

        <div className="flex items-start">
          {/* Solar Panel Visualization */}
          <div
            className={cn(
              "w-32 h-32 bg-slate-800/80 grid grid-cols-4 grid-rows-4 gap-1 p-2 rounded-md shadow-md border border-slate-700/50",
              data.isActive ? "opacity-100" : "opacity-50",
            )}
          >
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className={cn("bg-blue-900 rounded-sm", data.isActive && "bg-gradient-to-br from-blue-800 to-blue-950")}
              />
            ))}

            {/* Orientation indicator */}
            <div className="absolute top-2 right-2 bg-slate-800/80 rounded-full p-1">
              <Compass className="h-4 w-4 text-white" />
            </div>

            {/* Rated power indicator */}
            <div className="absolute bottom-2 left-2 bg-slate-800/80 rounded-md px-1 py-0.5 text-xs text-white">
              {data.ratedWattage}W
            </div>
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <div className="font-medium text-white text-sm">{data.displayName || t("Solar Panel")}</div>
            </div>
          </div>

          {/* Controls on the right side */}
          <div className="ml-4 flex flex-col space-y-4">
            {/* Active toggle */}
            <div className="flex items-center space-x-2">
              <Switch
                checked={data.isActive}
                onCheckedChange={(checked) => data.onActivationChange(data.panelId, checked)}
                id={`solar-active-${data.panelId}`}
                className="data-[state=checked]:bg-lime-600"
              />
              <Label
                htmlFor={`solar-active-${data.panelId}`}
                className="text-sm text-slate-300 font-medium flex items-center"
              >
                <div className={cn("w-2 h-2 rounded-full mr-2", data.isActive ? "bg-green-500" : "bg-red-500")}></div>
                {t("Panel Active")}
              </Label>
            </div>

            {/* Output wattage */}
            <div className="px-2 py-1 bg-slate-800/80 rounded text-xs text-white">
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="text-sm text-slate-300">
                  {t("Output")}: {getEffectiveOutput()}W
                </span>
              </div>
            </div>

            {/* Configuration toggle */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded"
            >
              {showConfig ? "Hide Config" : "Configure"}
            </button>
          </div>
        </div>
      </div>

      {/* Configuration panel */}
      {showConfig && (
        <div className="mt-4 bg-slate-800/80 p-3 rounded-md border border-slate-700/50">
          <h4 className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">{t("Specifications")}</h4>
          <div className="text-slate-400">{t("Type")}:</div>
          <div className="text-white">{t("Monocrystalline")}</div>
          <div className="text-slate-400">{t("Max Power")}:</div>
          <div className="text-slate-400">{t("Voltage")}:</div>
          <div className="text-slate-400">{t("Dimensions")}:</div>

          {/* Rated Wattage slider */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span className="text-sm text-slate-300 font-medium">{t("Sun Intensity")}</span>
              <span>{data.ratedWattage}W</span>
            </div>
            <Slider
              value={[data.ratedWattage]}
              min={50}
              max={500}
              step={10}
              onValueChange={(value) => data.onRatedWattageChange(data.panelId, value[0])}
              className="w-full"
            />
          </div>

          {/* Orientation selector */}
          <div className="mb-2">
            <div className="text-xs text-slate-300 mb-1">Orientation</div>
            <div className="grid grid-cols-3 gap-1">
              {(["east", "south", "west"] as const).map((orientation) => (
                <button
                  key={orientation}
                  onClick={() => data.onOrientationChange(data.panelId, orientation)}
                  className={cn(
                    "text-xs py-1 rounded capitalize",
                    data.orientation === orientation
                      ? "bg-lime-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600",
                  )}
                >
                  {orientation}
                </button>
              ))}
            </div>
          </div>

          {/* Efficiency indicator */}
          <div className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
            <span className="text-sm text-slate-300">
              {t("Efficiency")}: {Math.round(data.sunlightMultiplier * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        style={{ background: "#22c55e", width: "10px", height: "10px" }}
        isConnectable={true}
      />
    </div>
  )
}

export default AdditionalSolarPanelNode
