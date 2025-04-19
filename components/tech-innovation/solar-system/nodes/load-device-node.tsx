"use client"

import { Handle, Position, type NodeProps } from "reactflow"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Zap, Gauge, Power, Cpu } from "lucide-react"
import { cn } from "@/lib/utils"

interface LoadDeviceData {
  deviceName: string
  isOn: boolean
  powerConsumption: number
  maxPower: number
  onToggleDevice: (on: boolean) => void
  onPowerChange: (power: number) => void
  t: (key: string) => string // Translation function
}

function LoadDeviceNode({ data }: NodeProps<LoadDeviceData>) {
  const { t } = data

  const handlePowerChange = (value: number[]) => {
    data.onPowerChange(value[0])
  }

  // Calculate power efficiency (simulated)
  const efficiency = 85 + Math.random() * 10

  // Calculate power as percentage of max
  const powerPercentage = (data.powerConsumption / data.maxPower) * 100

  return (
    <div className="flex flex-col items-center">
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        style={{
          background: "#ef4444",
          width: "10px",
          height: "10px",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(239, 68, 68, 0.5)",
        }}
        isConnectable={true}
      />

      <div
        className={cn(
          "w-[13rem] h-[19rem] bg-gradient-to-b from-slate-700 to-slate-800 rounded-md shadow-md flex flex-col p-3 border-2 relative",
          data.isOn ? "border-pink-500" : "border-slate-600",
        )}
      >
        {/* Device brand and model */}
        <div className="absolute top-2 left-3 right-3 flex justify-between items-center">
          <div className="text-xs font-bold text-pink-400">{t("SMART-TECH")}</div>
          <div className="text-xs text-slate-300">{t("SA-100")}</div>
        </div>

        {/* Main display panel */}
        <div className="mt-6 bg-slate-900 border border-slate-700 rounded-sm p-2 mb-3">
          <div className="flex flex-col items-center">
            <span className="text-slate-400">{t("POWER USAGE")}</span>
            <div className="flex items-center">
              <span className="text-pink-400 font-bold text-2xl">{data.powerConsumption}</span>
              <span className="text-pink-400 text-xs ml-1">{t("WATTS")}</span>
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center">
              <Power className={cn("h-3 w-3 mr-1", data.isOn ? "text-green-400" : "text-red-400")} />
              <span className={cn("text-xs", data.isOn ? "text-green-400" : "text-red-400")}>
                {data.isOn ? t("ACTIVE") : t("STANDBY")}
              </span>
            </div>
            <div className="flex items-center">
              <Cpu className="h-3 w-3 mr-1 text-blue-400" />
              <span className="text-xs text-white">{t("SMART")}</span>
            </div>
          </div>
        </div>

        {/* Power adjustment slider */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Gauge className="h-3 w-3 text-pink-400 mr-1" />
              <span className="text-xs text-slate-300">{t("POWER LEVEL")}</span>
            </div>
            <span className="text-xs text-white">{Math.round(powerPercentage)}%</span>
          </div>
          <div className="bg-slate-900 p-2 rounded-sm border border-slate-700">
            <Slider
              value={[data.powerConsumption]}
              min={0}
              max={data.maxPower}
              step={5}
              disabled={!data.isOn}
              onValueChange={handlePowerChange}
              className={data.isOn ? "" : "opacity-50"}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>{t("Min")}</span>
              <span>
                {t("Max")} ({data.maxPower}W)
              </span>
            </div>
          </div>
        </div>

        {/* Device status */}
        <div className="bg-slate-900 border border-slate-700 rounded-sm p-2 flex items-center justify-between mt-auto mb-8">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">{t("EFFICIENCY")}</span>
            <span className="text-xs text-green-400">{efficiency.toFixed(1)}%</span>
          </div>
          <div className="flex items-center">
            <Label htmlFor="device-toggle" className="text-xs text-slate-300 mr-2">
              {data.isOn ? t("ON") : t("OFF")}
            </Label>
            <Switch
              id="device-toggle"
              checked={data.isOn}
              onCheckedChange={data.onToggleDevice}
              className="data-[state=checked]:bg-pink-600"
            />
          </div>
        </div>

        {/* Power indicator lights */}
        {data.isOn && (
          <div className="absolute top-3 right-12">
            <div className="flex space-x-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn("w-1 h-1 rounded-full", powerPercentage > i * 30 ? "bg-green-500" : "bg-slate-600")}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Device operation animation */}
        {data.isOn && (
          <div className="absolute bottom-3 right-3">
            <Zap className="h-4 w-4 text-pink-400 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  )
}

export default LoadDeviceNode
