import { Handle, Position, type NodeProps } from "reactflow"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Zap, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreakerPanelData {
  breakerOn: boolean
  overloadWarning: boolean
  onBreakerChange: (value: boolean) => void
  t: (key: string) => string // Add translation function
}

function BreakerPanelNode({ data }: NodeProps<BreakerPanelData>) {
  const { t } = data

  // Calculate simulated current based on breaker state
  const currentAmps = data.breakerOn ? (data.overloadWarning ? 18.5 : 12.3) : 0

  // Calculate simulated voltage
  const voltage = 24.0

  // Calculate trip threshold
  const tripThreshold = 20.0

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
        isConnectable={false}
      />

      <div
        className={cn(
          "w-[13rem] h-[19rem] bg-gradient-to-b from-slate-700 to-slate-800 rounded-md shadow-md flex flex-col p-3 border-2 relative",
          data.breakerOn ? "border-lime-500" : "border-red-500",
          data.overloadWarning && data.breakerOn ? "border-yellow-500" : "",
        )}
      >
        {/* Breaker brand and model */}
        <div className="absolute top-2 left-3 right-3 flex justify-between items-center">
          <div className="text-xs font-bold text-red-400">{t("SAFE-GUARD")}</div>
          <div className="text-xs text-slate-300">{t("CB-240")}</div>
        </div>

        {/* Warning indicator */}
        {data.overloadWarning && data.breakerOn && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full p-1 z-10">
            <AlertTriangle className="h-4 w-4 text-black" />
          </div>
        )}

        {/* Main display panel */}
        <div className="mt-6 bg-slate-900 border border-slate-700 rounded-sm p-2 mb-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex flex-col">
              <span className="text-slate-400">{t("CURRENT")}</span>
              <span className={cn("font-bold text-lg", data.overloadWarning ? "text-yellow-400" : "text-white")}>
                {currentAmps.toFixed(1)}A
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-400">{t("VOLTAGE")}</span>
              <span className="text-white font-bold text-lg">{voltage.toFixed(1)}V</span>
            </div>
          </div>

          <div className="mt-2 flex justify-between items-center">
            <div className="flex items-center">
              <Shield className={cn("h-3 w-3 mr-1", data.breakerOn ? "text-green-400" : "text-red-400")} />
              <span className={cn("text-xs", data.breakerOn ? "text-green-400" : "text-red-400")}>
                {data.breakerOn ? "PROTECTED" : "DISCONNECTED"}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-xs text-slate-400">
                {t("TRIP")}: {tripThreshold}A
              </span>
            </div>
          </div>
        </div>

        {/* Current load meter */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <Zap className="h-3 w-3 text-red-400 mr-1" />
              <span className="text-xs text-slate-300">{t("LOAD LEVEL")}</span>
            </div>
            <span className="text-xs text-white">{Math.round((currentAmps / tripThreshold) * 100)}%</span>
          </div>
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                currentAmps < tripThreshold * 0.7
                  ? "bg-green-500"
                  : currentAmps < tripThreshold * 0.9
                    ? "bg-yellow-500"
                    : "bg-red-500",
              )}
              style={{ width: `${Math.min(100, (currentAmps / tripThreshold) * 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Circuit diagram */}
        <div className="bg-slate-900 border border-slate-700 rounded-sm p-2 mb-3">
          <div className="flex justify-center items-center h-8">
            <div className="w-1/3 h-0.5 bg-slate-700"></div>
            <div
              className={cn(
                "w-8 h-8 rounded-md border-2 flex items-center justify-center mx-2",
                data.breakerOn ? "border-green-500 text-green-500" : "border-red-500 text-red-500",
              )}
            >
              {data.breakerOn ? "ON" : "OFF"}
            </div>
            <div className="w-1/3 h-0.5 bg-slate-700"></div>
          </div>
        </div>

        {/* Breaker control */}
        <div className="bg-slate-900 border border-slate-700 rounded-sm p-2 flex items-center justify-between mt-auto">
          <Label htmlFor="breaker-active" className="text-xs text-slate-300 flex items-center">
            <Shield className="h-4 w-4 mr-1 text-slate-400" />
            {t("Circuit Breaker")}
          </Label>
          <Switch
            checked={data.breakerOn}
            onCheckedChange={data.onBreakerChange}
            id="breaker-active"
            className="data-[state=checked]:bg-lime-600"
          />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="output"
        style={{
          background: "#22c55e",
          width: "10px",
          height: "10px",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(34, 197, 94, 0.5)",
        }}
        isConnectable={false}
      />
    </div>
  )
}

export default BreakerPanelNode
