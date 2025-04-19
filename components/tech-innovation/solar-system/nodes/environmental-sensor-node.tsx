import { Handle, Position, type NodeProps } from "reactflow"
import { Sun, Thermometer, Wind, Droplet, BarChart } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface SensorData {
  isActive: boolean
  sunlightIntensity: number
  temperature: number
  onToggleActive: (active: boolean) => void
  t: (key: string) => string // Translation function
}

function SensorNode({ data }: NodeProps<SensorData>) {
  const { t } = data

  // Calculate simulated humidity based on temperature
  const humidity = Math.max(30, 100 - data.temperature * 1.5)

  // Calculate simulated wind speed
  const windSpeed = 2 + Math.random() * 8

  // Calculate simulated air quality index
  const airQuality = 50 + Math.random() * 50

  // For debugging - log the translation function and result
  console.log("Environmental Sensor Node - translation function available:", !!t)
  if (t) {
    console.log("Translation of 'Environmental Sensor':", t("Environmental Sensor"))
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "w-[20rem] h-[22rem] bg-gradient-to-b from-slate-700 to-slate-800 rounded-md shadow-md flex flex-col border-2 p-3 relative",
          data.isActive ? "border-blue-500" : "border-slate-600",
        )}
      >
        {/* Sensor brand and model */}
        <div className="absolute top-2 left-3 right-3 flex justify-between items-center">
          <div className="text-xs font-bold text-blue-400">{t("ENVI-SENSE")}</div>
          <div className="text-xs text-slate-300">{t("MS-200")}</div>
        </div>

        {/* Main display panel */}
        <div className="mt-6 bg-slate-900 border border-slate-700 rounded-sm p-2 mb-3">
          <div className="grid grid-cols-2 gap-2">
            {/* Sunlight reading */}
            <div className="bg-slate-800 p-2 rounded flex items-center">
              <Sun className="h-4 w-4 text-yellow-400 mr-2 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400">{t("SUNLIGHT")}</div>
                <div className="text-sm font-medium text-white">{data.sunlightIntensity}%</div>
              </div>
            </div>

            {/* Temperature reading */}
            <div className="bg-slate-800 p-2 rounded flex items-center">
              <Thermometer className="h-4 w-4 text-red-400 mr-2 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400">{t("TEMP")}</div>
                <div className="text-sm font-medium text-white">{data.temperature}°C</div>
              </div>
            </div>

            {/* Humidity reading */}
            <div className="bg-slate-800 p-2 rounded flex items-center">
              <Droplet className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400">{t("HUMIDITY")}</div>
                <div className="text-sm font-medium text-white">{Math.round(humidity)}%</div>
              </div>
            </div>

            {/* Wind speed reading */}
            <div className="bg-slate-800 p-2 rounded flex items-center">
              <Wind className="h-4 w-4 text-cyan-400 mr-2 flex-shrink-0" />
              <div>
                <div className="text-xs text-slate-400">{t("WIND")}</div>
                <div className="text-sm font-medium text-white">{windSpeed.toFixed(1)} m/s</div>
              </div>
            </div>
          </div>
        </div>

        {/* Air quality meter */}
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <div className="flex items-center">
              <BarChart className="h-3 w-3 text-blue-400 mr-1" />
              <span className="text-xs text-slate-300">{t("AIR QUALITY INDEX")}</span>
            </div>
            <span className="text-xs text-white">{Math.round(airQuality)}</span>
          </div>
          <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                airQuality < 50 ? "bg-green-500" : airQuality < 100 ? "bg-yellow-500" : "bg-red-500",
              )}
              style={{ width: `${airQuality}%` }}
            ></div>
          </div>
        </div>

        {/* Sensor activation toggle */}
        <div className="bg-slate-900 border border-slate-700 rounded-sm p-2 flex items-center justify-between mt-auto">
          <Label htmlFor="sensor-active" className="text-xs text-slate-300">
            {t("Sensor Status")}
          </Label>
          <div className="flex items-center">
            <span className="text-xs mr-2 text-slate-400">{data.isActive ? t("MONITORING") : t("OFFLINE")}</span>
            <Switch
              checked={data.isActive}
              onCheckedChange={data.onToggleActive}
              id="sensor-active"
              className="data-[state=checked]:bg-blue-600"
            />
          </div>
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-3 left-3 flex items-center">
          <div
            className={cn("w-2 h-2 rounded-full mr-1", data.isActive ? "bg-green-500 animate-pulse" : "bg-red-500")}
          ></div>
          <span className="text-[10px] text-slate-400">{data.isActive ? t("MONITORING") : t("OFFLINE")}</span>
        </div>
      </div>

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

export default SensorNode
