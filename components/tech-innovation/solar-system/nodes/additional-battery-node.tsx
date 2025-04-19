"use client"
import { Handle, Position, type NodeProps } from "reactflow"
import { Battery, AlertTriangle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface AdditionalBatteryData {
  batteryId: string
  displayName?: string // Add this line
  isEnabled: boolean
  batteryType: "lead-acid" | "lithium-ion" | "gel"
  capacity: number // in Ah
  voltage: number // in V
  connectionType: "series" | "parallel"
  chargeLevel: number // in percentage
  systemVoltage: number // in V
  energyFlow: "charging" | "discharging" | "balanced"
  onEnableChange: (id: string, enabled: boolean) => void
  onTypeChange: (id: string, type: "lead-acid" | "lithium-ion" | "gel") => void
  onCapacityChange: (id: string, capacity: number) => void
  onVoltageChange: (id: string, voltage: number) => void
  onConnectionTypeChange: (id: string, type: "series" | "parallel") => void
}

function AdditionalBatteryNode({ data }: NodeProps<AdditionalBatteryData>) {
  const [showConfig, setShowConfig] = useState(false)
  const { t } = useTranslation()

  // Check if voltage matches system voltage
  const voltageMatches = data.connectionType === "parallel" ? data.voltage === data.systemVoltage : true // In series, voltage adds up so individual batteries can be different

  // Get battery status color
  const getBatteryColor = () => {
    if (data.chargeLevel > 70) return "bg-green-500"
    if (data.chargeLevel > 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Get energy flow status
  const getEnergyFlowStatus = () => {
    switch (data.energyFlow) {
      case "charging":
        return "Charging"
      case "discharging":
        return "Discharging"
      case "balanced":
        return "Balanced"
      default:
        return "Unknown"
    }
  }

  // Get energy flow color
  const getEnergyFlowColor = () => {
    switch (data.energyFlow) {
      case "charging":
        return "text-lime-400"
      case "discharging":
        return "text-red-400"
      case "balanced":
        return "text-blue-400"
      default:
        return "text-white"
    }
  }

  // Get battery type display name
  const getBatteryTypeDisplay = () => {
    switch (data.batteryType) {
      case "lead-acid":
        return "Lead Acid"
      case "lithium-ion":
        return "Lithium Ion"
      case "gel":
        return "Gel"
      default:
        return data.batteryType
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{ background: "#ef4444", width: "10px", height: "10px" }}
        isConnectable={true}
      />

      {/* Use displayName if available, otherwise use a generic name */}
      <div className="w-32 h-40 bg-slate-800/80 rounded-md shadow-md flex flex-col items-center justify-center relative overflow-hidden border border-slate-700/50">
        {/* Voltage mismatch warning */}
        {!voltageMatches && data.isEnabled && (
          <div className="absolute top-1 right-1 z-20">
            <div className="bg-red-500 rounded-full p-1" title="Voltage mismatch with system">
              <AlertTriangle className="h-3 w-3 text-white" />
            </div>
          </div>
        )}

        {/* Connection type indicator */}
        <div className="absolute top-1 left-1 z-20">
          <div className="bg-slate-700 rounded-md px-1 py-0.5 text-xs text-white">
            {data.connectionType === "series" ? "Series" : "Parallel"}
          </div>
        </div>

        <div
          className={cn("absolute bottom-0 left-0 right-0 transition-all duration-1000", getBatteryColor())}
          style={{ height: `${data.chargeLevel}%` }}
        ></div>

        <div className="relative z-10 text-white font-bold text-2xl drop-shadow-md">
          {Math.round(data.chargeLevel)}%
        </div>
        <Battery className="relative z-10 text-white h-8 w-8 mt-2 drop-shadow-md" />

        <div className="relative z-10 mt-2 px-2 py-1 bg-slate-800/90 rounded text-xs text-white">
          <div>
            {data.voltage.toFixed(1)}V / {data.capacity}Ah
          </div>
          <div className={cn("text-center font-medium", getEnergyFlowColor())}>{getEnergyFlowStatus()}</div>
        </div>
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <div className="font-medium text-white text-sm">{data.displayName || t("Battery Bank")}</div>
        </div>
      </div>

      {/* Battery controls */}
      <div className="mt-2 flex items-center space-x-2">
        <Switch
          checked={data.isEnabled}
          onCheckedChange={(checked) => data.onEnableChange(data.batteryId, checked)}
          id={`battery-enabled-${data.batteryId}`}
          className="data-[state=checked]:bg-lime-600"
        />
        <Label htmlFor={`battery-enabled-${data.batteryId}`} className="text-sm text-white">
          {data.isEnabled ? t("Enabled") : t("Disabled")}
        </Label>
      </div>

      {/* Configuration toggle */}
      <button
        onClick={() => setShowConfig(!showConfig)}
        className="mt-2 text-xs bg-slate-700 hover:bg-slate-600 text-white px-2 py-1 rounded w-full"
      >
        {showConfig ? t("Hide Config") : t("Configure")}
      </button>

      {/* Configuration panel */}
      {showConfig && (
        <div className="mt-4 bg-slate-800/80 p-3 rounded-md border border-slate-700/50 w-48">
          <h4 className="text-sm font-medium text-white mb-2">{t("Battery Configuration")}</h4>

          {/* Battery Type selector */}
          <div className="mb-3">
            <div className="text-xs text-slate-300 mb-1">{t("Battery Type")}</div>
            <div className="grid grid-cols-3 gap-1">
              {(["lead-acid", "lithium-ion", "gel"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => data.onTypeChange(data.batteryId, type)}
                  className={cn(
                    "text-xs py-1 px-1 rounded text-center",
                    data.batteryType === type
                      ? "bg-lime-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600",
                  )}
                >
                  {type === "lead-acid" ? "Lead" : type === "lithium-ion" ? "Li-Ion" : "Gel"}
                </button>
              ))}
            </div>
          </div>

          {/* Capacity slider */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>{t("Capacity")}</span>
              <span>{data.capacity}Ah</span>
            </div>
            <Slider
              value={[data.capacity]}
              min={50}
              max={500}
              step={10}
              onValueChange={(value) => data.onCapacityChange(data.batteryId, value[0])}
              className="w-full"
            />
          </div>

          {/* Voltage selector */}
          <div className="mb-3">
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>{t("Voltage")}</span>
              <span>{data.voltage}V</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[12, 24, 48].map((voltage) => (
                <button
                  key={voltage}
                  onClick={() => data.onVoltageChange(data.batteryId, voltage)}
                  className={cn(
                    "text-xs py-1 rounded",
                    data.voltage === voltage
                      ? "bg-lime-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600",
                  )}
                >
                  {voltage}V
                </button>
              ))}
            </div>
          </div>

          {/* Connection Type selector */}
          <div className="mb-2">
            <div className="text-xs text-slate-300 mb-1">{t("Connection Type")}</div>
            <div className="grid grid-cols-2 gap-1">
              {(["parallel", "series"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => data.onConnectionTypeChange(data.batteryId, type)}
                  className={cn(
                    "text-xs py-1 rounded capitalize",
                    data.connectionType === type
                      ? "bg-lime-600 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600",
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Warning for voltage mismatch */}
          {!voltageMatches && (
            <div className="mt-2 text-xs text-red-400 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Voltage mismatch with system
            </div>
          )}
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

export default AdditionalBatteryNode
