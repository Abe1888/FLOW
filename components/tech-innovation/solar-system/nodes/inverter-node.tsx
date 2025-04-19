import { Handle, Position, type NodeProps } from "reactflow"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Power, AlertTriangle, Thermometer, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

interface InverterData {
  inverterOn: boolean
  systemVoltage: number
  onInverterChange: (value: boolean) => void
  t: (key: string) => string // Translation function
}

function InverterNode({ data }: NodeProps<InverterData>) {
  const { t } = data
  // Calculate simulated temperature based on whether inverter is on
  const temperature = data.inverterOn ? 35 + Math.random() * 15 : 25

  // Calculate simulated efficiency
  const efficiency = 92 + Math.random() * 5

  // Determine if temperature is in warning range
  const tempWarning = temperature > 40

  return (
    <div className="flex flex-col items-center">
      <Handle
        type="target"
        position={Position.Top}
        id="input-controller"
        style={{
          background: "#ef4444",
          width: "12px",
          height: "12px",
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
          width: "12px",
          height: "12px",
          left: "25%",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(239, 68, 68, 0.5)",
        }}
        isConnectable={true}
      />

      <div
        className={cn(
          "w-72 h-[30rem] bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg shadow-xl flex flex-col relative border-2",
          data.inverterOn ? "border-blue-500" : "border-slate-600",
          "p-4 hover:border-blue-500/50 transition-all duration-300",
        )}
      >
        {/* Inverter brand and model */}
        <div className="absolute top-2 left-3 right-3 flex justify-between items-center">
          <div className="text-xs font-bold text-blue-400">{t("POWER-WAVE")}</div>
          <div className="text-xs text-slate-300">{t("INV-2400")}</div>
        </div>

        {/* Main display panel */}
        <div className="mt-6 mx-3 bg-slate-900 border border-slate-700 rounded-md p-3 mb-4 shadow-inner">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-800 p-3 rounded-md flex flex-col items-center shadow-md">
              <div className="text-sm text-slate-400 mb-1">{t("Input Voltage")}</div>
              <div className="text-xl font-bold text-blue-400">{data.systemVoltage.toFixed(1)}V</div>
              <div className="text-xs font-medium text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full mt-1">
                {t("DC")}
              </div>
            </div>
            <div className="bg-slate-800 p-3 rounded-md flex flex-col items-center shadow-md">
              <div className="text-sm text-slate-400 mb-1">{t("Output Voltage")}</div>
              <div className="text-xl font-bold text-blue-400">220V</div>
              <div className="text-xs font-medium text-slate-500 bg-slate-700 px-2 py-0.5 rounded-full mt-1">
                {t("AC")}
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-sm font-medium text-slate-300">{t("Efficiency")}</span>
              </div>
              <span className="text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded-full">94%</span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-blue-400"
                style={{
                  width: "94%",
                  boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                }}
              ></div>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <Thermometer className="h-5 w-5 text-red-400 mr-2" />
                <span className="text-sm font-medium text-slate-300">{t("Temperature")}</span>
              </div>
              <span className="text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded-full">42°C</span>
            </div>
            <div className="h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  data.inverterOn ? "bg-gradient-to-r from-yellow-600 to-yellow-400" : "bg-slate-600",
                )}
                style={{
                  width: data.inverterOn ? "60%" : "10%",
                  boxShadow: data.inverterOn ? "0 0 10px rgba(234, 179, 8, 0.3)" : "none",
                }}
              ></div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-4 h-4 rounded-full mr-2",
                  data.inverterOn ? "bg-green-500 animate-pulse" : "bg-red-500",
                )}
                style={{
                  boxShadow: data.inverterOn ? "0 0 8px rgba(34, 197, 94, 0.7)" : "0 0 8px rgba(239, 68, 68, 0.7)",
                }}
              ></div>
              <span className="text-sm font-medium text-white bg-slate-800 px-3 py-1 rounded-full">
                {data.inverterOn ? t("Online") : t("Offline")}
              </span>
            </div>
            <Switch
              checked={data.inverterOn}
              onCheckedChange={data.onInverterChange}
              className="data-[state=checked]:bg-green-600 scale-110"
            />
          </div>
        </div>

        {/* Power control */}
        <div className="mx-3 mt-3 p-2 bg-slate-900 border border-slate-700 rounded-sm flex items-center justify-between">
          <Label htmlFor="inverter-active" className="text-xs text-slate-300 flex items-center">
            <Power className="h-4 w-4 mr-1 text-slate-400" />
            {t("Power")}
          </Label>
          <Switch
            checked={data.inverterOn}
            onCheckedChange={data.onInverterChange}
            id="inverter-active"
            className="data-[state=checked]:bg-blue-600"
          />
        </div>

        {/* Heat sink visual elements */}
        <div className="absolute -left-1 top-10 bottom-10 w-2 flex flex-col space-y-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-600 h-3 w-1"></div>
          ))}
        </div>

        <div className="absolute -right-1 top-10 bottom-10 w-2 flex flex-col space-y-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-slate-600 h-3 w-1"></div>
          ))}
        </div>

        {/* Warning indicator */}
        {tempWarning && (
          <div className="absolute top-2 right-12 animate-pulse">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
        )}
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <div className="font-medium text-white text-sm">{t("Inverter & Power Control")}</div>
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

export default InverterNode
