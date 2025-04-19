import type { NodeProps } from "reactflow"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

interface SystemStatusData {
  solarProduction: number
  batteryLevel: number
  energyFlow: "charging" | "discharging" | "balanced"
  totalConsumption: number
}

function SystemStatusNode({ data }: NodeProps<SystemStatusData>) {
  const { t } = useTranslation()

  return (
    <div className="w-full">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 border border-lime-600/20">
        <div className="grid grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-slate-300 mb-1">{t("Solar Production")}</div>
            <div className="text-xl font-bold text-white">{data.solarProduction}W</div>
            <div className="mt-1 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500"
                style={{ width: `${Math.min(100, (data.solarProduction / 200) * 100)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-slate-300 mb-1">{t("Battery Status")}</div>
            <div
              className={cn(
                "text-xl font-bold",
                data.energyFlow === "charging"
                  ? "text-lime-400"
                  : data.energyFlow === "discharging"
                    ? "text-red-400"
                    : "text-blue-400",
              )}
            >
              {data.energyFlow === "charging"
                ? t("Charging")
                : data.energyFlow === "discharging"
                  ? t("Discharging")
                  : t("Balanced")}
            </div>
            <div className="mt-1 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full",
                  data.batteryLevel > 70 ? "bg-green-500" : data.batteryLevel > 30 ? "bg-yellow-500" : "bg-red-500",
                )}
                style={{ width: `${data.batteryLevel}%` }}
              ></div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm font-medium text-slate-300 mb-1">{t("Power Consumption")}</div>
            <div className="text-xl font-bold text-white">{data.totalConsumption}W</div>
            <div className="mt-1 w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${Math.min(100, (data.totalConsumption / 200) * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Net power balance */}
        <div className="mt-4 pt-3 border-t border-slate-700/50">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-300">{t("Net Power Balance")}</span>
            <span
              className={cn(
                "text-sm font-bold",
                data.solarProduction > data.totalConsumption ? "text-lime-400" : "text-red-400",
              )}
            >
              {data.solarProduction - data.totalConsumption}W
            </span>
          </div>
          <div className="mt-1 w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                data.solarProduction > data.totalConsumption ? "bg-lime-500" : "bg-red-500",
              )}
              style={{
                width: `${Math.min(100, Math.abs((data.solarProduction - data.totalConsumption) / 2))}%`,
                marginLeft:
                  data.solarProduction >= data.totalConsumption
                    ? "50%"
                    : `${50 - Math.min(50, Math.abs((data.solarProduction - data.totalConsumption) / 4))}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemStatusNode
