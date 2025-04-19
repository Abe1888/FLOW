import { Handle, Position, type NodeProps } from "reactflow"
import { Battery, Thermometer } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChargeControllerData {
  solarProduction: number
  output: number
  t: (key: string) => string // Translation function
}

function ChargeControllerNode({ data }: NodeProps<ChargeControllerData>) {
  const { t } = data
  // Calculate efficiency percentage
  const efficiency = data.solarProduction > 0 ? Math.round((data.output / data.solarProduction) * 100) : 100

  // Determine temperature based on load (simulated)
  const temperature = 25 + (data.output / 200) * 15

  // Determine status based on input/output
  const getStatus = () => {
    if (data.solarProduction === 0) return t("Standby")
    if (data.solarProduction < 50) return t("Low Input")
    return t("Normal")
  }

  // Get status color
  const getStatusColor = () => {
    if (data.solarProduction === 0) return "text-slate-400"
    if (data.solarProduction < 50) return "text-yellow-400"
    return "text-green-400"
  }

  return (
    <div className="flex flex-col items-center">
      {/* Input handle - solar input */}
      <Handle
        type="target"
        position={Position.Right}
        id="input"
        style={{
          background: "#22c55e",
          width: "10px",
          height: "10px",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(34, 197, 94, 0.5)",
        }}
        isConnectable={false}
      />

      {/* Realistic charge controller design */}
      <div className="w-56 h-[16rem] bg-gradient-to-b from-slate-700 to-slate-800 rounded-md shadow-md border border-slate-600 p-3 relative">
        {/* Controller brand and model */}
        <div className="absolute top-2 left-3 right-3 flex justify-between items-center">
          <div className="text-xs font-bold text-lime-400">{t("SOLAR-PRO")}</div>
          <div className="text-xs text-slate-300">{t("MPPT-120")}</div>
        </div>

        {/* Main display panel */}
        <div className="mt-6 bg-slate-900 border border-slate-700 rounded-sm p-2 mb-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-400">{t("INPUT")}</span>
              <span className="text-lime-400 font-bold text-lg">{data.solarProduction}W</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400">{t("OUTPUT")}</span>
              <span className="text-lime-400 font-bold text-lg">{data.output}W</span>
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center">
              <Battery className="h-3 w-3 text-blue-400 mr-1" />
              <span className="text-blue-400 text-xs">{t("CHARGING")}</span>
            </div>
            <div className="flex items-center">
              <Thermometer className="h-3 w-3 text-orange-400 mr-1" />
              <span className="text-xs">{temperature.toFixed(1)}°C</span>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className={cn("w-2 h-2 rounded-full mr-1", getStatusColor())}></div>
            <span className="text-xs text-slate-300">{t("Status")}</span>
          </div>
          <div className="text-xs text-slate-300">
            {t("EFF")}: <span className="text-lime-400">{efficiency}%</span>
          </div>
        </div>

        {/* Connection terminals with labels */}
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="bg-slate-900 rounded-sm p-1 text-center border border-slate-700">
            <span className="text-[10px] text-slate-400">{t("PV INPUT")}</span>
          </div>
          <div className="bg-slate-900 rounded-sm p-1 text-center border border-slate-700">
            <span className="text-[10px] text-slate-400">{t("BATTERY")}</span>
          </div>
        </div>

        {/* Heat sink visual elements */}
        <div className="absolute -right-1 top-10 bottom-10 w-2 flex flex-col space-y-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-600 h-3 w-1"></div>
          ))}
        </div>
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <div className="font-medium text-white text-sm">{t("Charge Controller")}</div>
        </div>
      </div>

      {/* Output handles */}
      <Handle
        type="source"
        position={Position.Left}
        id="to-inverter"
        style={{
          background: "#ef4444",
          width: "10px",
          height: "10px",
          top: "40%",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(239, 68, 68, 0.5)",
        }}
        isConnectable={false}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="to-battery"
        style={{
          background: "#ef4444",
          width: "10px",
          height: "10px",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(239, 68, 68, 0.5)",
        }}
        isConnectable={false}
      />
    </div>
  )
}

export default ChargeControllerNode
