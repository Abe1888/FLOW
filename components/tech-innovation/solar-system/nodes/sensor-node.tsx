import { Handle, Position, type NodeProps } from "reactflow"
import { Sun, Thermometer, Wind, Droplet, BarChart } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SensorData {
  isActive: boolean
  sunlightIntensity: number
  temperature: number
  onToggleActive: (value: boolean) => void
  t: (key: string) => string // Make sure this is defined
  language?: string // Add language if available
}

function SensorNode({ data }: NodeProps<SensorData>) {
  const { t } = data

  // Add this check
  console.log("SensorNode translation function:", t)
  console.log("Current language:", data.language)

  // Calculate simulated humidity based on temperature
  const humidity = Math.max(30, 100 - data.temperature * 1.5)

  // Calculate simulated wind speed
  const windSpeed = 2 + Math.random() * 8

  // Calculate simulated air quality index
  const airQuality = 50 + Math.random() * 50

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-[20rem] h-[24rem] bg-gradient-to-b from-slate-700 to-slate-800 rounded-md shadow-md flex flex-col border-2 p-3 relative",
          data.isActive ? "border-blue-500 hover:border-blue-400" : "border-slate-600 hover:border-slate-500",
          "transition-all duration-300",
        )}
      >
        {/* Sensor brand and model */}
        <div className="absolute top-3 left-4 right-4 flex justify-between items-center">
          <div className="text-sm font-bold text-blue-400 tracking-wider">{t("ENVI-SENSE")}</div>
          <div className="text-xs font-medium text-slate-300 bg-slate-800 px-2 py-0.5 rounded-full">{t("MS-200")}</div>
        </div>

        {/* Main display panel */}
        <div className="mt-8 bg-slate-900 border border-slate-700 rounded-md p-3 mb-4 shadow-inner">
          <div className="grid grid-cols-2 gap-3">
            {/* Sunlight reading */}
            <div className="bg-slate-800 p-2.5 rounded-md flex items-center shadow-md hover:bg-slate-800/80 transition-colors duration-200">
              <Sun className="h-5 w-5 text-yellow-400 mr-2.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400 mb-0.5">{t("SUNLIGHT")}</div>
                <div className="text-sm font-medium text-white">{data.sunlightIntensity}%</div>
              </div>
            </div>

            {/* Temperature reading */}
            <div className="bg-slate-800 p-2.5 rounded-md flex items-center shadow-md hover:bg-slate-800/80 transition-colors duration-200">
              <Thermometer className="h-5 w-5 text-red-400 mr-2.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400 mb-0.5">{t("TEMP")}</div>
                <div className="text-sm font-medium text-white">{data.temperature}°C</div>
              </div>
            </div>

            {/* Humidity reading */}
            <div className="bg-slate-800 p-2.5 rounded-md flex items-center shadow-md hover:bg-slate-800/80 transition-colors duration-200">
              <Droplet className="h-5 w-5 text-blue-400 mr-2.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400 mb-0.5">{t("HUMIDITY")}</div>
                <div className="text-sm font-medium text-white">{Math.round(humidity)}%</div>
              </div>
            </div>

            {/* Wind speed reading */}
            <div className="bg-slate-800 p-2.5 rounded-md flex items-center shadow-md hover:bg-slate-800/80 transition-colors duration-200">
              <Wind className="h-5 w-5 text-cyan-400 mr-2.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400 mb-0.5">{t("WIND")}</div>
                <div className="text-sm font-medium text-white">{windSpeed.toFixed(1)} m/s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Air quality meter */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <BarChart className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-sm font-medium text-slate-300">{t("AIR QUALITY INDEX")}</span>
            </div>
            <span className="text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded-full">
              {Math.round(airQuality)}
            </span>
          </div>
          <div className="h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner">
            <div
              className={cn(
                "h-full transition-all duration-500",
                airQuality < 50
                  ? "bg-gradient-to-r from-green-600 to-green-400"
                  : airQuality < 100
                    ? "bg-gradient-to-r from-yellow-600 to-yellow-400"
                    : "bg-gradient-to-r from-red-600 to-red-400",
              )}
              style={{
                width: `${airQuality}%`,
                boxShadow:
                  airQuality < 50
                    ? "0 0 10px rgba(34, 197, 94, 0.4)"
                    : airQuality < 100
                      ? "0 0 10px rgba(234, 179, 8, 0.4)"
                      : "0 0 10px rgba(239, 68, 68, 0.4)",
              }}
            ></div>
          </div>
        </div>

        {/* Sensor activation toggle */}
        <div className="bg-slate-900 border border-slate-700 rounded-md p-3 flex items-center justify-between mt-auto shadow-inner">
          <Label htmlFor="sensor-active" className="text-sm font-medium text-slate-300">
            {t("Sensor Status")}
          </Label>
          <div className="flex items-center">
            <span className="text-xs font-medium mr-3 px-2 py-1 rounded-full bg-slate-800 text-slate-300">
              {data.isActive ? t("MONITORING") : t("OFFLINE")}
            </span>
            <Switch
              checked={data.isActive}
              onCheckedChange={data.onToggleActive}
              id="sensor-active"
              className="data-[state=checked]:bg-blue-600 scale-110"
            />
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-3 left-3 flex items-center">
          <div
            className={cn("w-2 h-2 rounded-full mr-1", data.isActive ? "bg-green-500 animate-pulse" : "bg-red-500")}
          ></div>
          <span className="text-[10px] text-slate-400">{data.isActive ? "" : t("OFFLINE")}</span>
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

export default SensorNode
