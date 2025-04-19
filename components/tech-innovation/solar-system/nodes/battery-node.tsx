"use client"
import { Handle, Position, type NodeProps } from "reactflow"
import { Zap, AlertTriangle, BatteryCharging, BatteryMedium, BatteryLow, Gauge } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface BatteryData {
  batteryLevel: number
  systemVoltage: number
  energyFlow: "charging" | "discharging" | "balanced"
  t: (key: string) => string // Add translation function
}

function BatteryNode({ data }: NodeProps<BatteryData>) {
  const { t } = data
  const [animate, setAnimate] = useState(false)
  const [bubbles, setBubbles] = useState<
    Array<{ id: number; size: number; speed: number; left: string; battery: 1 | 2 }>
  >([])
  const [selectedBattery, setSelectedBattery] = useState<1 | 2>(1)

  // Create bubbling effect for charging animation
  useEffect(() => {
    if (data.energyFlow === "charging") {
      const interval = setInterval(() => {
        if (bubbles.length < 15) {
          setBubbles((prev) => [
            ...prev,
            {
              id: Date.now(),
              size: 2 + Math.random() * 4,
              speed: 1 + Math.random() * 2,
              left: `${10 + Math.random() * 80}%`,
              battery: Math.random() > 0.5 ? 1 : 2,
            },
          ])
        }
      }, 500)

      return () => clearInterval(interval)
    }
  }, [data.energyFlow, bubbles.length])

  // Remove bubbles when they reach the top
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles((prev) => prev.slice(-12)) // Keep only the last 12 bubbles
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Add animation effect when component mounts
  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Get battery status color
  const getBatteryColor = () => {
    if (data.batteryLevel > 70) return "bg-green-500"
    if (data.batteryLevel > 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  // Get energy flow status
  const getEnergyFlowStatus = () => {
    switch (data.energyFlow) {
      case "charging":
        return t("Charging")
      case "discharging":
        return t("Discharging")
      case "balanced":
        return t("Balanced")
      default:
        return t("Unknown")
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

  // Get battery icon based on level and charging state
  const getBatteryIcon = () => {
    if (data.energyFlow === "charging") {
      return <BatteryCharging className="ml-1 h-5 w-5 text-lime-400" />
    } else if (data.batteryLevel < 30) {
      return <BatteryLow className="ml-1 h-5 w-5 text-red-400" />
    } else {
      return <BatteryMedium className="ml-1 h-5 w-5 text-white" />
    }
  }

  // Calculate estimated amp hours based on voltage (simulated)
  const estimatedAh = Math.round(100 + (data.batteryLevel / 100) * 50)

  // Calculate health percentage (simulated)
  const healthPercentage = Math.round(85 + (data.batteryLevel / 100) * 10)

  // Low battery warning
  const lowBattery = data.batteryLevel < 20

  // Calculate second battery level (slightly different for visual interest)
  const secondBatteryLevel = Math.min(100, Math.max(0, data.batteryLevel + (Math.random() > 0.5 ? 5 : -5)))

  return (
    <div
      className="flex flex-col items-center transition-all duration-300"
      style={{ transform: animate ? "scale(1.05)" : "scale(1)" }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="input"
        style={{
          background: "#ef4444",
          width: "10px",
          height: "10px",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(239, 68, 68, 0.5)",
        }}
        isConnectable={false}
      />

      <div className="w-72 h-[26rem] bg-gradient-to-b from-slate-700 to-slate-800 rounded-md shadow-xl flex flex-col relative border-2 border-slate-600 hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300">
        {/* Enhanced digital display panel - more compact */}
        <div className="mx-3 mt-3 p-2 bg-slate-900 border border-slate-700 rounded-md shadow-inner">
          <div className="flex justify-between items-center mb-1">
            <div className="text-sm font-bold text-blue-400">{t("Battery System")}</div>
            <div className="text-xs text-slate-300">
              {data.systemVoltage.toFixed(1)}V {t("Battery Type")}
            </div>
          </div>

          {/* Digital readout with LCD effect */}
          <div className="bg-slate-800 p-2 rounded border border-slate-700 mb-1 font-mono">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <div className="text-xs text-slate-400">{t("Battery")} 1+2</div>
                <div className="text-lg font-bold text-green-400 flex items-center">
                  {Math.round(data.batteryLevel)}%{getBatteryIcon()}
                </div>
              </div>
              <div className="flex flex-col">
                <div className="text-xs text-slate-400">{t("Status")}</div>
                <div className={cn("text-lg font-bold", getEnergyFlowColor())}>{getEnergyFlowStatus()}</div>
              </div>
            </div>
          </div>

          {/* Battery stats */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center bg-slate-800/50 p-1 rounded">
              <Gauge className="h-3 w-3 text-blue-400 mr-1" />
              <span className="text-slate-400 mr-1">{t("Voltage")}:</span>
              <span className="text-white font-medium">{data.systemVoltage.toFixed(1)}V</span>
            </div>
            <div className="flex items-center bg-slate-800/50 p-1 rounded">
              <Zap className="h-3 w-3 text-blue-400 mr-1" />
              <span className="text-slate-400 mr-1">{t("Capacity")}:</span>
              <span className="text-white font-medium">{estimatedAh * 2}Ah</span>
            </div>
          </div>
        </div>

        {/* Battery selector tabs */}
        <div className="mx-3 mt-1 flex">
          <button
            className={cn(
              "flex-1 text-xs py-1 rounded-t-md border-t border-l border-r border-slate-700",
              selectedBattery === 1 ? "bg-slate-700 text-white" : "bg-slate-800/50 text-slate-400",
            )}
            onClick={() => setSelectedBattery(1)}
          >
            {t("Battery")} 1
          </button>
          <button
            className={cn(
              "flex-1 text-xs py-1 rounded-t-md border-t border-l border-r border-slate-700",
              selectedBattery === 2 ? "bg-slate-700 text-white" : "bg-slate-800/50 text-slate-400",
            )}
            onClick={() => setSelectedBattery(2)}
          >
            {t("Battery")} 2
          </button>
        </div>

        {/* Dual battery visualization - slightly smaller */}
        <div className="mx-3 flex space-x-2">
          {/* Battery 1 */}
          <div
            className={cn(
              "flex-1 h-28 bg-slate-900 border border-slate-700 rounded-md relative overflow-hidden",
              selectedBattery === 1 ? "ring-2 ring-blue-500" : "",
            )}
          >
            {/* Battery terminals */}
            <div className="absolute top-1 left-1 w-3 h-3 bg-red-900 rounded-full border border-red-700 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">+</span>
            </div>
            <div className="absolute top-1 right-1 w-3 h-3 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">-</span>
            </div>

            {/* Liquid fill effect */}
            <div
              className={cn("absolute bottom-0 left-0 right-0 transition-all duration-1000", getBatteryColor())}
              style={{ height: `${data.batteryLevel}%` }}
            >
              {/* Liquid surface effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 transform -skew-x-45"></div>

              {/* Bubbles for charging animation */}
              {data.energyFlow === "charging" &&
                bubbles
                  .filter((bubble) => bubble.battery === 1)
                  .map((bubble) => (
                    <div
                      key={bubble.id}
                      className="absolute rounded-full bg-white/40"
                      style={{
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        left: bubble.left,
                        bottom: "0%",
                        animation: `batteryBubble ${bubble.speed}s linear forwards`,
                      }}
                    />
                  ))}
            </div>

            {/* Battery level markers */}
            <div className="absolute inset-0 flex flex-col justify-between py-1 px-4">
              <div className="w-full border-b border-slate-700/50"></div>
              <div className="w-full border-b border-slate-700/50"></div>
              <div className="w-full border-b border-slate-700/50"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-sm">
                <div className="text-sm font-bold text-white drop-shadow-md">{Math.round(data.batteryLevel)}%</div>
              </div>
            </div>
          </div>

          {/* Battery 2 */}
          <div
            className={cn(
              "flex-1 h-28 bg-slate-900 border border-slate-700 rounded-md relative overflow-hidden",
              selectedBattery === 2 ? "ring-2 ring-blue-500" : "",
            )}
          >
            {/* Battery terminals */}
            <div className="absolute top-1 left-1 w-3 h-3 bg-red-900 rounded-full border border-red-700 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">+</span>
            </div>
            <div className="absolute top-1 right-1 w-3 h-3 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center">
              <span className="text-[8px] font-bold text-white">-</span>
            </div>

            {/* Liquid fill effect */}
            <div
              className={cn(
                "absolute bottom-0 left-0 right-0 transition-all duration-1000",
                secondBatteryLevel > 70 ? "bg-green-500" : secondBatteryLevel > 30 ? "bg-yellow-500" : "bg-red-500",
              )}
              style={{ height: `${secondBatteryLevel}%` }}
            >
              {/* Liquid surface effect */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 transform -skew-x-45"></div>

              {/* Bubbles for charging animation */}
              {data.energyFlow === "charging" &&
                bubbles
                  .filter((bubble) => bubble.battery === 2)
                  .map((bubble) => (
                    <div
                      key={bubble.id}
                      className="absolute rounded-full bg-white/40"
                      style={{
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        left: bubble.left,
                        bottom: "0%",
                        animation: `batteryBubble ${bubble.speed}s linear forwards`,
                      }}
                    />
                  ))}
            </div>

            {/* Battery level markers */}
            <div className="absolute inset-0 flex flex-col justify-between py-1 px-4">
              <div className="w-full border-b border-slate-700/50"></div>
              <div className="w-full border-b border-slate-700/50"></div>
              <div className="w-full border-b border-slate-700/50"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-slate-900/70 px-2 py-0.5 rounded backdrop-blur-sm">
                <div className="text-sm font-bold text-white drop-shadow-md">{Math.round(secondBatteryLevel)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Connection diagram - more compact */}
        <div className="mx-3 mt-1 p-1 bg-slate-800 border border-slate-700 rounded-md">
          <div className="text-xs text-slate-400 mb-0.5">
            {t("Connection Type")}: {t("Parallel Connection")}
          </div>
          <div className="flex justify-center items-center">
            <div className="w-12 h-5 border border-slate-600 rounded-sm flex items-center justify-center">
              <span className="text-[10px] text-slate-300">24V</span>
            </div>
            <div className="w-8 h-0.5 bg-slate-600"></div>
            <div className="w-12 h-5 border border-slate-600 rounded-sm flex items-center justify-center">
              <span className="text-[10px] text-slate-300">24V</span>
            </div>
          </div>
        </div>

        {/* Battery health and system info - ENHANCED but more compact */}
        <div className="mx-3 mt-2 grid grid-cols-2 gap-2">
          <div className="bg-slate-900 p-2 rounded-md border border-slate-700 shadow-inner">
            <div className="text-sm text-slate-300 mb-1 font-medium">{t("Health")}</div>
            <div className="flex items-center">
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mr-2">
                <div className="h-full bg-green-500" style={{ width: `${healthPercentage}%` }}></div>
              </div>
              <span className="text-sm text-green-400 font-medium">{healthPercentage}%</span>
            </div>
          </div>
          <div className="bg-slate-900 p-2 rounded-md border border-slate-700 shadow-inner">
            <div className="text-sm text-slate-300 mb-1 font-medium">{t("Temperature")}</div>
            <div className="flex items-center">
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mr-2">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${data.energyFlow === "charging" ? 60 : 40}%` }}
                ></div>
              </div>
              <span className="text-sm text-blue-400 font-medium">
                {data.energyFlow === "charging" ? "28°C" : "24°C"}
              </span>
            </div>
          </div>
        </div>

        {/* Low battery warning with enhanced animation */}
        {lowBattery && (
          <div className="absolute top-2 right-2 animate-pulse">
            <AlertTriangle className="h-5 w-5 text-red-500 drop-shadow-glow-red" />
          </div>
        )}

        {/* Charging indicator with enhanced animation */}
        {data.energyFlow === "charging" && (
          <div className="absolute top-2 left-2 animate-pulse">
            <Zap className="h-5 w-5 text-lime-400 drop-shadow-glow-green" />
          </div>
        )}
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
        isConnectable={false}
      />
    </div>
  )
}

export default BatteryNode
