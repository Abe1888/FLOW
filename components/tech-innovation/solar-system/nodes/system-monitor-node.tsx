// Add a new System Monitor Node component
import { Handle, Position, type NodeProps } from "reactflow"
import { cn } from "@/lib/utils"

interface SystemMonitorData {
  batteryLevel: number
  solarProduction: number
  totalConsumption: number
  systemVoltage: number
  energyFlow: "charging" | "discharging" | "balanced"
}

function SystemMonitorNode({ data }: NodeProps<SystemMonitorData>) {
  // Calculate efficiency
  const efficiency =
    data.solarProduction > 0 ? Math.min(100, Math.round((data.totalConsumption / data.solarProduction) * 100)) : 0

  // Get energy flow status color
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

  // Format time
  const getCurrentTime = () => {
    const now = new Date()
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="flex flex-col items-center">
      <Handle
        type="target"
        position={Position.Top}
        id="input"
        style={{ background: "#ef4444", width: "10px", height: "10px" }}
        isConnectable={false}
      />

      <div className="w-48 h-40 bg-slate-800/80 rounded-md shadow-md border border-slate-700/50 p-3 flex flex-col relative">
        {/* Header with time */}
        <div className="flex justify-between items-center mb-2 pb-1 border-b border-slate-700">
          <div className="text-xs font-medium text-slate-300">System Status</div>
          <div className="text-xs text-slate-400">{getCurrentTime()}</div>
        </div>

        {/* Metrics grid */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-300">Battery</div>
            <div className="text-white font-medium flex items-center">
              <div
                className={cn(
                  "w-2 h-2 rounded-full mr-1",
                  data.batteryLevel > 70 ? "bg-green-500" : data.batteryLevel > 30 ? "bg-yellow-500" : "bg-red-500",
                )}
              ></div>
              {Math.round(data.batteryLevel)}%
            </div>
          </div>

          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-300">Solar</div>
            <div className="text-white font-medium">{data.solarProduction}W</div>
          </div>

          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-300">Load</div>
            <div className="text-white font-medium">{data.totalConsumption}W</div>
          </div>

          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-300">Voltage</div>
            <div className="text-white font-medium">{data.systemVoltage.toFixed(1)}V</div>
          </div>
        </div>

        {/* Status bar */}
        <div className="mt-auto pt-2 border-t border-slate-700 flex justify-between items-center">
          <div className="text-xs text-slate-300">Flow:</div>
          <div className={cn("text-xs font-medium", getEnergyFlowColor())}>{data.energyFlow.toUpperCase()}</div>
        </div>
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <div className="font-medium text-white text-sm">System Monitor</div>
        </div>
      </div>
    </div>
  )
}

export default SystemMonitorNode
