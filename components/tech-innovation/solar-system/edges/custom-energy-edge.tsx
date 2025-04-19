"use client"

import { type EdgeProps, BaseEdge, getSmoothStepPath } from "reactflow"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface CustomEdgeData {
  energyFlow: "input" | "output"
  active: boolean
  wattage?: string
  flowRate?: "slow" | "medium" | "fast" // Add flow rate control
}

function CustomEnergyEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<CustomEdgeData>) {
  // Get path for the edge
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 20,
  })

  // Add state to track hover
  const [isHovered, setIsHovered] = useState(false)

  const isActive = data?.active || false
  const flowType = data?.energyFlow || "input"
  const wattage = data?.wattage || ""
  const flowRate = data?.flowRate || "medium"

  // Determine animation class based on flow rate
  const getAnimationClass = () => {
    if (!isActive) return ""

    switch (flowRate) {
      case "slow":
        return "animate-energy-flow-slow"
      case "fast":
        return "animate-energy-flow-forward"
      default:
        return "animate-energy-flow-forward"
    }
  }

  // Add a hover effect class
  const edgeClasses = cn(
    "transition-all duration-300",
    isHovered ? "stroke-[3px]" : "stroke-[2px]",
    isActive ? "stroke-lime-500" : "stroke-slate-600",
  )

  // Add pulse effect for inactive edges that should be active
  const [shouldPulse, setShouldPulse] = useState(false)

  useEffect(() => {
    // Check if this is a critical connection that should be active
    const isCriticalConnection =
      (source === "solar-panel" && target === "charge-controller") ||
      (source === "charge-controller" && target === "battery") ||
      (source === "charge-controller" && target === "inverter") ||
      (source === "battery" && target === "inverter")

    setShouldPulse(isCriticalConnection && !isActive)
  }, [source, target, isActive])

  // Enhanced colors with gradients
  const getGradientId = () => `edge-gradient-${id}`
  const gradientId = getGradientId()

  // Determine colors based on energy flow and active state
  const getColors = () => {
    if (!isActive) return { start: "#475569", end: "#475569" }

    if (flowType === "input") {
      return { start: "#16a34a", end: "#22c55e" } // Green gradient
    } else {
      return { start: "#2563eb", end: "#3b82f6" } // Blue gradient
    }
  }

  const colors = getColors()

  return (
    <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style}>
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.start} />
          <stop offset="100%" stopColor={colors.end} />
        </linearGradient>
      </defs>
      <path
        id={id}
        className={cn(edgeClasses, getAnimationClass(), shouldPulse && "animate-pulse")}
        d={edgePath}
        fill="none"
        strokeWidth={4}
        stroke={`url(#${gradientId})`}
        filter={isActive ? "drop-shadow(0 0 3px rgba(34, 197, 94, 0.5))" : "none"}
        transition="all 0.3s ease"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />

      {/* Add arrow marker for direction */}
      <defs>
        <marker
          id={`arrow-${id}`}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={isActive ? "#84cc16" : "#64748b"} />
        </marker>
      </defs>

      {/* Add wattage label if provided */}
      {wattage && (
        <foreignObject
          width={100}
          height={40}
          x={labelX - 50}
          y={labelY - 20}
          className="overflow-visible pointer-events-none flex items-center justify-center"
        >
          <div
            className={cn(
              "flex items-center justify-center bg-slate-800/90 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md border",
              isActive
                ? flowType === "input"
                  ? "border-green-500/30 shadow-sm shadow-green-500/20"
                  : "border-blue-500/30 shadow-sm shadow-blue-500/20"
                : "border-slate-700",
            )}
          >
            <span className="font-medium">{wattage}</span>
          </div>
        </foreignObject>
      )}

      {/* Add double-click instruction on hover */}
      {isHovered && (
        <foreignObject
          width={120}
          height={24}
          x={labelX - 60}
          y={labelY + 15}
          className="overflow-visible pointer-events-none"
        >
          <div className="bg-slate-800/90 text-white text-xs px-2 py-1 rounded-md border border-slate-700/30 shadow-md text-center">
            Double-click to remove
          </div>
        </foreignObject>
      )}
    </BaseEdge>
  )
}

export default CustomEnergyEdge
