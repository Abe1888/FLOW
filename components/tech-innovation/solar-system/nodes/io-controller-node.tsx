"use client"

import { Handle, Position, type NodeProps } from "reactflow"
import { Cpu, Power, AlertTriangle, Settings, Activity, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface IOControllerData {
  isActive: boolean
  mode: "auto" | "manual"
  batteryLevel: number
  solarProduction: number
  loadDemand: number
  onToggleActive: (active: boolean) => void
  onModeChange: (mode: "auto" | "manual") => void
  t: (key: string) => string // Translation function
}

function IOControllerNode({ data }: NodeProps<IOControllerData>) {
  const { t } = data

  // Determine if there's a warning condition
  const hasWarning = data.batteryLevel < 20 && data.loadDemand > 0

  // Determine the current routing decision
  const getRoutingDecision = () => {
    if (!data.isActive) return t("System Off")
    if (data.mode === "manual") return t("Manual Control")

    if (data.batteryLevel < 15) return t("Emergency Mode")
    if (data.solarProduction > data.loadDemand) return t("Direct Solar + Charging")
    if (data.batteryLevel > 50) return t("Battery Discharge")
    return t("Power Conservation")
  }

  // Calculate system efficiency
  const efficiency =
    data.loadDemand > 0 && data.solarProduction > 0
      ? Math.min(100, Math.round((data.solarProduction / data.loadDemand) * 100))
      : 0

  return (
    <div className="flex flex-col items-center">
      {/* Input handles */}
      <Handle
        type="target"
        position={Position.Top}
        id="input-solar"
        style={{
          background: "#ef4444",
          width: "10px",
          height: "10px",
          left: "30%",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(239, 68, 68, 0.5)",
        }}
        isConnectable={true}
      />
      <Handle
        type="target"
        position={Position.Top}
        id="input-battery"
        style={{
          background: "#ef4444",
          width: "10px",
          height: "10px",
          left: "70%",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(239, 68, 68, 0.5)",
        }}
        isConnectable={true}
      />

      <div
        className={cn(
          "w-[16rem] h-[21rem] bg-gradient-to-b from-slate-700 to-slate-800 rounded-md shadow-md flex flex-col p-3 border-2 relative",
          data.isActive ? "border-purple-500" : "border-slate-600",
          hasWarning && data.isActive ? "border-yellow-500" : "",
        )}
      >
        {/* Controller brand and model */}
        <div className="absolute top-2 left-3 right-3 flex justify-between items-center">
          <div className="text-xs font-bold text-purple-400">{t("SMART-LOGIC")}</div>
          <div className="text-xs text-slate-300">{t("IC-5000")}</div>
        </div>

        {/* Controller header with status */}
        <div className="mt-6 flex justify-between items-center mb-2">
          <div className="flex items-center">
            <Cpu className={cn("h-4 w-4 mr-1", data.isActive ? "text-purple-400" : "text-slate-400")} />
            <span className="text-xs font-medium text-white">{t("System Control")}</span>
          </div>
          {hasWarning && data.isActive && <AlertTriangle className="h-4 w-4 text-yellow-400" />}
        </div>

        {/* Main display panel */}
        <div className="bg-slate-900 border border-slate-700 rounded-sm p-2 mb-3">
          <div className="grid grid-cols-3 gap-2 text-xs mb-2">
            <div className="flex flex-col">
              <span className="text-slate-400">{t("SOLAR")}</span>
              <span className="text-green-400 font-medium">{data.solarProduction}W</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400">{t("BATTERY")}</span>
              <span
                className={cn(
                  "font-medium",
                  data.batteryLevel > 50
                    ? "text-green-400"
                    : data.batteryLevel > 20
                      ? "text-yellow-400"
                      : "text-red-400",
                )}
              >
                {Math.round(data.batteryLevel)}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400">{t("LOAD")}</span>
              <span className="text-blue-400 font-medium">{data.loadDemand}W</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Activity className="h-3 w-3 text-purple-400 mr-1" />
              <span className="text-xs text-white">{t("SYSTEM STATUS")}</span>
            </div>
            <span className="text-xs font-medium text-purple-400">{getRoutingDecision()}</span>
          </div>
        </div>

        {/* Mode selector */}
        <div className="bg-slate-900 border border-slate-700 rounded-sm p-2 mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Settings className="h-3 w-3 text-purple-400 mr-1" />
              <span className="text-xs text-slate-300">{t("Operation Mode")}</span>
            </div>
            <span className="text-xs text-white">{data.mode === "auto" ? t("Auto") : t("Manual")}</span>
          </div>
          <div className="flex justify-between">
            <button
              className={cn(
                "text-xs px-3 py-1 rounded",
                data.mode === "auto" ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-300",
              )}
              onClick={() => data.onModeChange("auto")}
              disabled={!data.isActive}
            >
              {t("Auto")}
            </button>
            <button
              className={cn(
                "text-xs px-3 py-1 rounded",
                data.mode === "manual" ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-300",
              )}
              onClick={() => data.onModeChange("manual")}
              disabled={!data.isActive}
            >
              {t("Manual")}
            </button>
          </div>
        </div>

        {/* System efficiency */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Zap className="h-3 w-3 text-purple-400 mr-1" />
              <span className="text-xs text-slate-300">{t("SYSTEM EFFICIENCY")}</span>
            </div>
            <span className="text-xs text-white">{efficiency}%</span>
          </div>
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                efficiency > 80 ? "bg-green-500" : efficiency > 40 ? "bg-yellow-500" : "bg-red-500",
              )}
              style={{ width: `${efficiency}%` }}
            ></div>
          </div>
        </div>

        {/* Power toggle */}
        <div className="bg-slate-900 border border-slate-700 rounded-sm p-2 flex items-center justify-between mt-auto">
          <div className="flex items-center">
            <Power className={cn("h-4 w-4 mr-1", data.isActive ? "text-green-400" : "text-red-400")} />
            <span className="text-xs text-slate-300">{t("System Power")}</span>
          </div>
          <Switch
            checked={data.isActive}
            onCheckedChange={data.onToggleActive}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>

        {/* Processing indicator */}
        {data.isActive && (
          <div className="absolute bottom-3 right-3 flex space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1 h-1 rounded-full bg-purple-500 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              ></div>
            ))}
          </div>
        )}
      </div>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="output-load"
        style={{
          background: "#22c55e",
          width: "10px",
          height: "10px",
          left: "30%",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(34, 197, 94, 0.5)",
        }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="output-battery"
        style={{
          background: "#22c55e",
          width: "10px",
          height: "10px",
          left: "70%",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(34, 197, 94, 0.5)",
        }}
        isConnectable={true}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="output-monitor"
        style={{
          background: "#22c55e",
          width: "10px",
          height: "10px",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(34, 197, 94, 0.5)",
        }}
        isConnectable={true}
      />
    </div>
  )
}

export default IOControllerNode
