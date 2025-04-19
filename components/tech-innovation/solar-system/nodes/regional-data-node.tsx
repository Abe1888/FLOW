import type { NodeProps } from "reactflow"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RegionState {
  id: string
  name: string
  position: { x: number; y: number }
  status: "active" | "warning" | "offline"
  batteryLevel: number
  solarOutput: number
}

interface RegionalDataProps {
  region: RegionState | undefined
}

function RegionalDataNode({ data }: NodeProps<RegionalDataProps>) {
  if (!data.region) return null

  const region = data.region

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm p-3 rounded-lg border border-lime-600/20 w-[250px]">
      <div className="flex justify-between items-center mb-2">
        <Badge
          className={cn(
            "text-xs",
            region.status === "active" ? "bg-green-600" : region.status === "warning" ? "bg-yellow-600" : "bg-red-600",
          )}
        >
          {region.status.toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>Battery Level</span>
            <span>{Math.round(region.batteryLevel)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                region.batteryLevel > 70 ? "bg-green-500" : region.batteryLevel > 30 ? "bg-yellow-500" : "bg-red-500",
              )}
              style={{ width: `${region.batteryLevel}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs text-slate-300 mb-1">
            <span>Solar Output</span>
            <span>{region.solarOutput}W</span>
          </div>
          <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-500"
              style={{ width: `${(region.solarOutput / 150) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-300">Households</div>
            <div className="text-white font-medium">
              {region.status === "offline" ? "0" : Math.floor(20 + Math.random() * 30)}
            </div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-300">Uptime</div>
            <div className="text-white font-medium">
              {region.status === "offline" ? "0%" : `${Math.floor(85 + Math.random() * 15)}%`}
            </div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-300">CO₂ Saved</div>
            <div className="text-white font-medium">
              {region.status === "offline" ? "0kg" : `${Math.floor(100 + Math.random() * 200)}kg`}
            </div>
          </div>
          <div className="bg-slate-700/50 p-2 rounded">
            <div className="text-slate-300">Efficiency</div>
            <div className="text-white font-medium">
              {region.status === "offline" ? "0%" : `${Math.floor(70 + Math.random() * 25)}%`}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button size="sm" className="text-xs h-7 bg-lime-600 hover:bg-lime-700 text-white">
            Diagnostics
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 border-lime-500 text-lime-400 hover:bg-lime-900/20"
          >
            Maintenance
          </Button>
        </div>
      </div>
      <div className="absolute bottom-3 left-0 right-0 text-center">
        <div className="font-medium text-white text-sm">{region.name} Details</div>
      </div>
    </div>
  )
}

export default RegionalDataNode
