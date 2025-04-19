"use client"

import { Handle, Position, type NodeProps } from "reactflow"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Fuel, AlertTriangle, Gauge, Power, Thermometer, RotateCw, Clock, Droplet } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

// Add these imports at the top of the file
import { useComponentSettings } from "@/lib/component-settings-context"
import type { BackupGeneratorSettings } from "@/lib/component-settings-types"

interface BackupGeneratorData {
  generatorOn: boolean
  fuelLevel: number
  onGeneratorChange: (value: boolean) => void
  t: (key: string) => string // Translation function
}

// Modify the BackupGeneratorNode function to use settings
function BackupGeneratorNode({ id, data }: NodeProps<BackupGeneratorData>) {
  const { t } = data
  const [engineRPM, setEngineRPM] = useState(0)
  const [engineTemp, setEngineTemp] = useState(25)
  const [oilPressure, setOilPressure] = useState(0)
  const [runTime, setRunTime] = useState(0)
  const [smokeParticles, setSmokeParticles] = useState<
    Array<{ id: number; size: number; opacity: number; left: string }>
  >([])
  const [fanRotation, setFanRotation] = useState(0)

  // Get component settings
  const { settings } = useComponentSettings(id, "backupGenerator")
  const customSettings = settings as BackupGeneratorSettings

  // Calculate simulated output based on fuel level and whether generator is on
  const outputWattage = data.generatorOn
    ? Math.round(customSettings.simulationParams.maxOutputWattage * (data.fuelLevel / 100))
    : 0

  // Calculate simulated runtime remaining based on fuel level
  const runtimeHours = Math.round((data.fuelLevel / 100) * 8)

  // Determine if fuel is low
  const lowFuel = data.fuelLevel < 20

  // Determine if temperature is in warning range
  const tempWarning = engineTemp > 85

  // Update engine parameters when generator is turned on/off
  useEffect(() => {
    if (data.generatorOn) {
      // Start engine - ramp up RPM
      const rampInterval = setInterval(() => {
        setEngineRPM((prev) => {
          if (prev < customSettings.simulationParams.maxRPM)
            return prev + customSettings.simulationParams.maxRPM / customSettings.simulationParams.startupTime / 3
          clearInterval(rampInterval)
          return customSettings.simulationParams.maxRPM
        })

        // Increase temperature gradually
        setEngineTemp((prev) =>
          Math.min(prev + customSettings.simulationParams.heatGenerationRate / 3, 75 + Math.random() * 15),
        )

        // Increase oil pressure
        setOilPressure((prev) => Math.min(prev + 10, 60 + Math.random() * 10))
      }, 300)

      // Start runtime counter
      const runtimeInterval = setInterval(() => {
        setRunTime((prev) => prev + 1)
      }, 60000) // Increment every minute

      // Start fan rotation animation
      const fanAnimationInterval = setInterval(() => {
        if (customSettings.animations.enableFanRotation) {
          setFanRotation((prev) => (prev + 10 * customSettings.animations.fanRotationSpeed) % 360)
        }
      }, 50)

      return () => {
        clearInterval(rampInterval)
        clearInterval(runtimeInterval)
        clearInterval(fanAnimationInterval)
      }
    } else {
      // Stop engine - ramp down RPM
      const rampDownInterval = setInterval(() => {
        setEngineRPM((prev) => {
          if (prev > 0)
            return Math.max(
              0,
              prev - customSettings.simulationParams.maxRPM / customSettings.simulationParams.shutdownTime / 3,
            )
          clearInterval(rampDownInterval)
          return 0
        })

        // Decrease temperature gradually
        setEngineTemp((prev) => Math.max(25, prev - customSettings.simulationParams.coolingRate / 3))

        // Decrease oil pressure
        setOilPressure((prev) => Math.max(0, prev - 15))
      }, 300)

      return () => {
        clearInterval(rampDownInterval)
      }
    }
  }, [
    data.generatorOn,
    customSettings.simulationParams,
    customSettings.animations.enableFanRotation,
    customSettings.animations.fanRotationSpeed,
  ])

  // Generate smoke particles when generator is running
  useEffect(() => {
    if (!data.generatorOn || engineRPM < 1000 || !customSettings.animations.enableSmoke) return

    const smokeInterval = setInterval(() => {
      // Ensure we have a valid smoke density value
      const maxParticles = Math.max(1, Math.min(30, customSettings.animations.smokeDensity || 10))

      if (smokeParticles.length < maxParticles) {
        setSmokeParticles((prev) => [
          ...prev,
          {
            id: Date.now(),
            size: 3 + Math.random() * 5,
            opacity: (customSettings.animations.smokeOpacity || 0.4) * (0.3 + Math.random() * 0.3),
            left: `${-5 + Math.random() * 15}%`,
          },
        ])
      }

      // Remove old particles
      setSmokeParticles((prev) => prev.filter((p) => Date.now() - p.id < 3000))
    }, 100)

    return () => clearInterval(smokeInterval)
  }, [data.generatorOn, engineRPM, smokeParticles.length, customSettings.animations])

  // Format runtime display
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

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
        isConnectable={true}
      />

      <div
        className={cn(
          "bg-gradient-to-b rounded-md shadow-md flex flex-col relative border-2 p-3",
          data.generatorOn
            ? `border-[${customSettings.containerStyle.activeColor}]`
            : `border-[${customSettings.containerStyle.inactiveColor}]`,
        )}
        style={{
          width: `${customSettings.containerSize.width}rem`,
          height: `${customSettings.containerSize.height + 2}rem`,
          backgroundImage: `linear-gradient(to bottom, ${customSettings.containerStyle.gradientStart}, ${customSettings.containerStyle.gradientEnd})`,
          borderRadius: `${customSettings.containerStyle.borderRadius}px`,
          borderWidth: `${customSettings.containerStyle.borderWidth}px`,
          borderColor: data.generatorOn
            ? customSettings.containerStyle.activeColor
            : customSettings.containerStyle.inactiveColor,
          boxShadow:
            customSettings.containerStyle.shadow === "lg"
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
              : customSettings.containerStyle.shadow === "md"
                ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                : customSettings.containerStyle.shadow === "sm"
                  ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                  : "none",
        }}
      >
        {/* Generator brand and model */}
        <div className="absolute top-2 left-3 right-3 flex flex-col items-center justify-center">
          <div className="text-xs font-bold" style={{ color: customSettings.panelStyle.accentColor }}>
            {t("Backup Generator")}
          </div>
          <div className="text-xs mt-1" style={{ color: customSettings.panelStyle.textColor }}>
            {t("DG-1000")}
          </div>
        </div>

        {/* Exhaust pipe aligned with the left border */}
        <div className="absolute -top-2 -left-3 w-10 h-8 z-10">
          <div
            className="w-6 h-6 bg-slate-600 rounded-t-md mx-auto border-t border-l border-r"
            style={{ borderColor: customSettings.containerStyle.activeColor }}
          ></div>
          <div className="w-8 h-2 bg-slate-700 rounded-md mx-auto -mt-1"></div>

          {/* Smoke particles coming from the exhaust pipe - positioned for left border */}
          {data.generatorOn && engineRPM > 1000 && customSettings.animations.enableSmoke && (
            <div className="absolute top-0 left-0 w-full h-10 overflow-visible">
              {/* First set of smoke particles */}
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={`smoke-basic-${i}`}
                  className="absolute w-3 h-3 rounded-full bg-slate-400/40"
                  style={{
                    top: `-${5 + i * 3}px`,
                    left: `${2 + Math.sin(Date.now() / 1000 + i) * 3}px`,
                    animation: `smokeRise ${1 + i * 0.2}s infinite linear`,
                    animationDelay: `${i * 0.1}s`,
                    opacity: customSettings.animations.smokeOpacity * (0.8 - i * 0.05),
                  }}
                ></div>
              ))}

              {/* Additional smoke particles with density control */}
              {(() => {
                // Ensure we have a valid smoke density
                const density = Math.max(
                  0,
                  Math.min(10, Math.floor((customSettings.animations.smokeDensity || 10) / 3)),
                )
                return Array.from({ length: density }).map((_, i) => (
                  <div
                    key={`smoke-extra-${i}`}
                    className="absolute w-4 h-4 rounded-full bg-slate-400/30"
                    style={{
                      top: `-${8 + i * 4}px`,
                      left: `${5 + Math.cos(Date.now() / 800 + i) * 4}px`,
                      animation: `smokeRise ${1.5 + i * 0.15}s infinite linear`,
                      animationDelay: `${i * 0.15 + 0.05}s`,
                      opacity: customSettings.animations.smokeOpacity * (0.7 - i * 0.05),
                    }}
                  ></div>
                ))
              })()}
            </div>
          )}
        </div>

        {/* Main display panel */}
        {(customSettings.displayOptions.showOutputWattage || customSettings.displayOptions.showRuntime) && (
          <div
            className="mt-12 border rounded-sm p-2 mb-3"
            style={{
              backgroundColor: customSettings.panelStyle.backgroundColor,
              borderColor: customSettings.panelStyle.borderColor,
              color: customSettings.panelStyle.textColor,
              fontSize: `${customSettings.panelStyle.fontSize}px`,
            }}
          >
            <div className="grid grid-cols-2 gap-2 text-xs">
              {customSettings.displayOptions.showOutputWattage && (
                <div className="flex flex-col">
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>{t("Output")}</span>
                  <span className="font-bold text-lg" style={{ color: customSettings.panelStyle.accentColor }}>
                    {outputWattage}W
                  </span>
                </div>
              )}
              {customSettings.displayOptions.showRuntime && (
                <div className="flex flex-col">
                  <span style={{ color: "rgba(255,255,255,0.7)" }}>{t("Runtime")}</span>
                  <span className="font-bold text-lg" style={{ color: customSettings.panelStyle.textColor }}>
                    {runtimeHours}h
                  </span>
                </div>
              )}
            </div>

            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center">
                <Power className={cn("h-3 w-3 mr-1", data.generatorOn ? "text-green-400" : "text-red-400")} />
                <span className={cn("text-xs", data.generatorOn ? "text-green-400" : "text-red-400")}>
                  {data.generatorOn ? t("Running") : t("Offline")}
                </span>
              </div>
              {customSettings.displayOptions.showTemperature && (
                <div className="flex items-center">
                  <Thermometer className={cn("h-3 w-3 mr-1", tempWarning ? "text-red-400" : "text-orange-400")} />
                  <span className={cn("text-xs", tempWarning ? "text-red-400" : "text-white")}>
                    {engineTemp.toFixed(1)}°C
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced Engine visualization with radiator */}
        {customSettings.displayOptions.showRPM && (
          <div
            className="border rounded-sm p-2 mb-3 relative overflow-hidden"
            style={{
              backgroundColor: customSettings.panelStyle.backgroundColor,
              borderColor: customSettings.panelStyle.borderColor,
              color: customSettings.panelStyle.textColor,
              fontSize: `${customSettings.panelStyle.fontSize}px`,
            }}
          >
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center">
                <RotateCw className={cn("h-3 w-3 mr-1", data.generatorOn ? "text-green-400" : "text-slate-400")} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {t("Engine")}
                </span>
              </div>
              <span className="text-xs" style={{ color: customSettings.panelStyle.textColor }}>
                {engineRPM} RPM
              </span>
            </div>

            {/* Enhanced Engine block visualization with radiator */}
            <div
              className="relative h-20 rounded-sm border overflow-hidden"
              style={{
                backgroundColor: "rgba(30, 41, 59, 0.5)",
                borderColor: customSettings.panelStyle.borderColor,
              }}
            >
              {/* Radiator grille */}
              <div className="absolute inset-0 grid grid-cols-8 grid-rows-4 gap-1 p-1">
                {(() => {
                  const elements = []
                  for (let i = 0; i < 32; i++) {
                    elements.push(<div key={`radiator-cell-${i}`} className="bg-slate-900 rounded-sm"></div>)
                  }
                  return elements
                })()}
              </div>

              {/* Heat sink visual elements */}
              <div className="absolute -left-1 top-10 bottom-10 w-2 flex flex-col space-y-1">
                {(() => {
                  const elements = []
                  for (let i = 0; i < 8; i++) {
                    elements.push(<div key={`left-heat-sink-${i}`} className="bg-slate-600 h-3 w-1"></div>)
                  }
                  return elements
                })()}
              </div>

              <div className="absolute -right-1 top-10 bottom-10 w-2 flex flex-col space-y-1">
                {(() => {
                  const elements = []
                  for (let i = 0; i < 8; i++) {
                    elements.push(<div key={`right-heat-sink-${i}`} className="bg-slate-600 h-3 w-1"></div>)
                  }
                  return elements
                })()}
              </div>

              {/* Engine fan animation - improved with radiator */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 z-10">
                {/* Fan housing */}
                <div className="absolute inset-0 border-2 border-slate-600 rounded-full"></div>

                {/* Fan blades */}
                <div
                  className="w-full h-full relative"
                  style={{
                    transform: `rotate(${fanRotation}deg)`,
                    transition:
                      data.generatorOn && customSettings.animations.enableFanRotation
                        ? "transform 50ms linear"
                        : "transform 500ms ease-out",
                  }}
                >
                  {/* Use a more reliable way to create the fan blades */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <div
                      key={`fan-blade-${angle}`}
                      className="absolute top-1/2 left-1/2 w-1.5 h-6 bg-slate-400"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                        transformOrigin: "center center",
                      }}
                    />
                  ))}
                  <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-slate-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-slate-400"></div>
                </div>
              </div>

              {/* Engine block details */}
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-slate-700 border-t border-slate-600 flex items-center justify-center">
                <div className="text-[8px] text-slate-300 font-bold">ENGINE BLOCK</div>
              </div>

              {/* Engine vibration effect */}
              {data.generatorOn && customSettings.animations.enableVibration && (
                <div
                  className="absolute inset-0 opacity-10 bg-white"
                  style={{
                    animation: `vibrate ${0.1 / customSettings.animations.vibrationIntensity}s ease-in-out infinite alternate`,
                  }}
                ></div>
              )}

              {/* Heat shimmer effect */}
              {data.generatorOn && engineTemp > 50 && customSettings.animations.enableHeatShimmer && (
                <div
                  className="absolute inset-0 bg-orange-500/5"
                  style={{
                    animation: "heatShimmer 1s ease-in-out infinite",
                  }}
                ></div>
              )}
            </div>
          </div>
        )}

        {/* Additional gauges */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {/* Oil pressure gauge */}
          {customSettings.displayOptions.showOilPressure && (
            <div
              className="border rounded-sm p-2"
              style={{
                backgroundColor: customSettings.panelStyle.backgroundColor,
                borderColor: customSettings.panelStyle.borderColor,
                color: customSettings.panelStyle.textColor,
                fontSize: `${customSettings.panelStyle.fontSize}px`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Droplet className="h-3 w-3 text-blue-400 mr-1" />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {t("Oil")}
                  </span>
                </div>
                <span className="text-xs" style={{ color: customSettings.panelStyle.textColor }}>
                  {oilPressure.toFixed(0)} PSI
                </span>
              </div>
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={cn("h-full transition-all duration-500", oilPressure < 20 ? "bg-red-500" : "bg-blue-500")}
                  style={{ width: `${(oilPressure / 80) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Runtime counter */}
          {customSettings.displayOptions.showRuntime && (
            <div
              className="border rounded-sm p-2"
              style={{
                backgroundColor: customSettings.panelStyle.backgroundColor,
                borderColor: customSettings.panelStyle.borderColor,
                color: customSettings.panelStyle.textColor,
                fontSize: `${customSettings.panelStyle.fontSize}px`,
              }}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" style={{ color: customSettings.panelStyle.accentColor }} />
                  <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                    {t("Total")}
                  </span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-mono" style={{ color: customSettings.panelStyle.textColor }}>
                  {formatRuntime(runTime)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Fuel gauge */}
        {customSettings.displayOptions.showFuelLevel && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center">
                <Fuel className="h-3 w-3 mr-1" style={{ color: customSettings.panelStyle.accentColor }} />
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {t("Fuel Level")}
                </span>
              </div>
              <span className={cn("text-xs font-medium", lowFuel ? "text-red-400" : "text-white")}>
                {Math.round(data.fuelLevel)}%
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: customSettings.panelStyle.backgroundColor }}
            >
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  data.fuelLevel > 60 ? "bg-green-500" : data.fuelLevel > 20 ? "bg-yellow-500" : "bg-red-500",
                )}
                style={{ width: `${data.fuelLevel}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Generator controls */}
        <div
          className="border rounded-sm p-2 flex items-center justify-between mt-auto mb-6"
          style={{
            backgroundColor: customSettings.panelStyle.backgroundColor,
            borderColor: customSettings.panelStyle.borderColor,
            color: customSettings.panelStyle.textColor,
            fontSize: `${customSettings.panelStyle.fontSize}px`,
          }}
        >
          <div className="flex items-center">
            <Gauge className="h-4 w-4 mr-2" style={{ color: customSettings.panelStyle.accentColor }} />
            <Label htmlFor="generator-active" className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
              {t("Engine Power")}
            </Label>
          </div>
          <Switch
            checked={data.generatorOn}
            onCheckedChange={data.onGeneratorChange}
            id="generator-active"
            className="data-[state=checked]:bg-orange-600"
          />
        </div>

        {/* Warning indicators */}
        {lowFuel && (
          <div className="absolute top-2 right-12 animate-pulse">
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </div>
        )}

        {/* Engine sound effect indicator */}
        {data.generatorOn && (
          <div className="absolute bottom-3 right-3 flex items-center">
            <div className="flex space-x-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-orange-500 animate-pulse"
                  style={{
                    animationDuration: `${0.5 - i * 0.1}s`,
                    height: `${2 + i}px`,
                  }}
                ></div>
              ))}
            </div>
          </div>
        )}

        {/* Component title at the bottom */}
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <div className="font-medium text-sm" style={{ color: customSettings.panelStyle.textColor }}>
            {t("Backup Generator")}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id="output"
        style={{
          background: "#22c55e",
          width: "10px",
          height: "10px",
          border: "2px solid rgba(255, 255, 255, 0.5)",
          boxShadow: "0 0 5px rgba(34, 197, 94, 0.5)",
        }}
        isConnectable={true}
      />
    </div>
  )
}

export default BackupGeneratorNode
