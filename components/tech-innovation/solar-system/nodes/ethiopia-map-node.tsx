"use client"
import type { NodeProps } from "reactflow"
import { Handle, Position } from "reactflow"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState, useEffect } from "react"

interface RegionState {
  id: string
  name: string
  position: { x: number; y: number }
  status: "active" | "warning" | "offline"
  batteryLevel: number
  solarOutput: number
}

interface EthiopiaMapData {
  regions: RegionState[]
  selectedRegion: string | null
  showRegionalData: boolean
  onRegionSelect: (regionId: string) => void
  onToggleRegionalData: () => void
  isConnected?: boolean
  t: (key: string) => string
}

function EthiopiaMapNode({ data }: NodeProps<EthiopiaMapData>) {
  const { t } = data
  const [animate, setAnimate] = useState(false)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)
  const [pulseIntensity, setPulseIntensity] = useState(0.6)

  // Add animation effect when component mounts
  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Animate pulse intensity for connected regions
  useEffect(() => {
    if (!data.isConnected) return

    const interval = setInterval(() => {
      setPulseIntensity((prev) => (prev === 0.6 ? 1 : 0.6))
    }, 2000)

    return () => clearInterval(interval)
  }, [data.isConnected])

  // Get status color for region markers with enhanced visual effect
  const getStatusColor = (status: "active" | "warning" | "offline", isHovered: boolean) => {
    switch (status) {
      case "active":
        return isHovered ? "bg-green-400 ring-2 ring-green-300" : "bg-green-500"
      case "warning":
        return isHovered ? "bg-yellow-400 ring-2 ring-yellow-300" : "bg-yellow-500"
      case "offline":
        return isHovered ? "bg-red-400 ring-2 ring-red-300" : "bg-red-500"
      default:
        return "bg-slate-500"
    }
  }

  // Determine the glow color based on connection state
  const glowColor = data.isConnected ? "rgba(132, 204, 22, 0.6)" : "rgba(100, 116, 139, 0.3)"
  const glowIntensity = data.isConnected ? "8px" : "3px"

  return (
    <div className="flex flex-col items-center">
      {/* Add input handle for connection */}
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
        isConnectable={true}
      />

      <div
        className={cn(
          "p-4 rounded-lg border border-lime-600/20 transition-all duration-500 transform hover:scale-105 relative",
          data.isConnected ? "border-lime-500" : "",
          animate ? "scale-105" : "scale-100",
        )}
        style={{
          boxShadow: `0 0 ${glowIntensity} ${glowColor}, inset 0 0 ${glowIntensity} ${glowColor}`,
          transition: "box-shadow 0.5s ease-in-out, transform 0.3s ease-out",
        }}
      >
        {/* Enhanced pulsing effect when connected */}
        {data.isConnected && (
          <div
            className="absolute inset-0 rounded-lg pointer-events-none z-0"
            style={{
              background: `radial-gradient(circle, rgba(132, 204, 22, ${pulseIntensity * 0.2}) 0%, rgba(132, 204, 22, 0) 70%)`,
              transition: "background 1.5s ease-in-out",
            }}
          ></div>
        )}

        <h3 className="text-white text-sm font-medium mb-2 flex items-center justify-between">
          <span>{t("Ethiopia Solar Network")}</span>
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full transition-colors",
              data.isConnected ? "bg-lime-600/30 text-lime-400" : "bg-slate-700/30 text-slate-400",
            )}
          >
            {data.isConnected ? t("ONLINE") : t("OFFLINE")}
          </span>
        </h3>

        <div className="relative w-[270px] h-[220px] perspective-[800px]">
          {/* 3D effect for the map */}
          <div
            className="w-full h-full transition-transform duration-300 transform-style-3d"
            style={{ transform: "rotateX(10deg)" }}
          >
            <Image
              src="/etmap/et-04.png"
              alt="Ethiopia Map"
              width={270}
              height={220}
              className={cn(
                "opacity-70 transition-opacity duration-500 rounded-md",
                data.isConnected ? "opacity-90" : "opacity-70",
              )}
              style={{ transform: "translateZ(10px)" }}
            />

            {/* Enhanced region markers with 3D effect */}
            <TooltipProvider>
              {data.regions.map((region) => (
                <Tooltip key={region.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={cn(
                        "absolute w-5 h-5 rounded-full border-2 border-white transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                        getStatusColor(region.status, hoveredRegion === region.id),
                        data.selectedRegion === region.id && "w-6 h-6 ring-2 ring-white",
                        data.isConnected && region.status === "active" && "animate-pulse",
                      )}
                      style={{
                        left: `${region.position.x}%`,
                        top: `${region.position.y}%`,
                        animation: region.status === "warning" ? "pulse 2s infinite" : "none",
                        boxShadow:
                          data.isConnected && region.status === "active" ? "0 0 10px rgba(132, 204, 22, 0.8)" : "none",
                        transform: `translate(-50%, -50%) translateZ(${hoveredRegion === region.id ? 25 : 15}px)`,
                      }}
                      onClick={() => data.onRegionSelect(region.id)}
                      onMouseEnter={() => setHoveredRegion(region.id)}
                      onMouseLeave={() => setHoveredRegion(null)}
                      aria-label={`${t(region.name)} region`}
                    ></button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-bold">{t(region.name)}</p>
                      <p>
                        {t("Status")}: {t(region.status.charAt(0).toUpperCase() + region.status.slice(1))}
                      </p>
                      <p>
                        {t("Battery")}: {Math.round(region.batteryLevel)}%
                      </p>
                      {data.isConnected && <p className="text-lime-400">{t("Connected to grid")}</p>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>

        <div className="mt-3 flex justify-start">
          <div className="flex space-x-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span className="text-xs text-white">{t("Active")}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1"></div>
              <span className="text-xs text-white">{t("Warning")}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span className="text-xs text-white">{t("Offline")}</span>
            </div>
          </div>
        </div>

        {/* Enhanced connection status indicator */}
        {data.isConnected && (
          <div className="mt-2 bg-lime-600/20 rounded-md px-2 py-1 text-center border border-lime-600/30">
            <span className="text-xs text-lime-400 flex items-center justify-center">
              <span className="w-2 h-2 bg-lime-500 rounded-full mr-1 animate-pulse"></span>
              {t("Grid Connected")}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default EthiopiaMapNode
