"use client"
import React from "react"
import { Handle, Position, type NodeProps } from "reactflow"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Globe, AlertTriangle, Zap, Power, PlugZap } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useComponentSettings } from "@/lib/component-settings-context"
import type { DistributionPanelSettings } from "@/lib/component-settings-types"

interface DeviceState {
  id: string
  name: string
  icon: React.ReactNode
  on: boolean
  powerConsumption: number
  connected: boolean
}

interface DistributionPanelData {
  devices: DeviceState[]
  totalConsumption: number
  inverterOn: boolean
  onToggleDevice: (id: string) => void
  onToggleEthiopiaConnection?: (value: boolean) => void
  ethiopiaConnected?: boolean
  t: (key: string) => string // Translation function
  label: string
  isActive?: boolean
}

function DistributionPanelNode({ id, data }: NodeProps<DistributionPanelData>) {
  const { t } = data
  const [isEditing, setIsEditing] = useState(false)
  const [editedLabel, setEditedLabel] = useState(data.label)
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [isActive, setIsActive] = useState(data.isActive ?? false)
  const [showTooltip, setShowTooltip] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [animate, setAnimate] = useState(false)
  const [activeDevice, setActiveDevice] = useState<string | null>(null)

  // Get component settings
  const { settings } = useComponentSettings(id, "distributionPanel")
  const customSettings = settings as DistributionPanelSettings

  // Add animation effect when component mounts
  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Calculate load percentage (simulated max capacity of 200W)
  const loadPercentage = (data.totalConsumption / 200) * 100

  // Determine if the panel is overloaded based on settings
  const isWarning = loadPercentage > customSettings.loadMeter.warningThreshold
  const isOverloaded = loadPercentage > customSettings.loadMeter.criticalThreshold

  // Get device icon with proper size
  const getDeviceIcon = (icon: React.ReactNode) => {
    return React.cloneElement(icon as React.ReactElement, {
      className: "h-4 w-4",
      style: { color: customSettings.deviceStyle.iconColor },
    })
  }

  // Get load meter color based on load percentage and settings
  const getLoadMeterColor = () => {
    if (isOverloaded) return customSettings.loadMeter.criticalColor
    if (isWarning) return customSettings.loadMeter.warningColor
    return customSettings.loadMeter.normalColor
  }

  return (
    <div className="flex flex-col items-center">
      <Handle
        type="target"
        position={Position.Right}
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
          "bg-gradient-to-b rounded-lg shadow-xl flex flex-col border-2 relative",
          isOverloaded ? "border-red-500" : "border-slate-600",
          animate ? "scale-105" : "scale-100",
          "transition-all duration-300",
        )}
        style={{
          width: `${customSettings.containerSize.width}rem`,
          height: `${customSettings.containerSize.height}rem`,
          backgroundImage: `linear-gradient(to bottom, ${customSettings.containerStyle.gradientStart}, ${customSettings.containerStyle.gradientEnd})`,
          borderRadius: `${customSettings.containerStyle.borderRadius}px`,
          borderWidth: `${customSettings.containerStyle.borderWidth}px`,
          borderColor: isOverloaded
            ? customSettings.containerStyle.overloadColor
            : data.inverterOn
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
          padding: "14px", // Updated padding from 16px to 14px
        }}
      >
        {/* Panel header with title and power consumption */}
        <div className="flex justify-between items-center mb-4">
          <div
            className="text-xs font-bold px-3 py-1.5 rounded-md border flex items-center"
            style={{
              backgroundColor: customSettings.panelStyle.backgroundColor,
              borderColor: customSettings.panelStyle.borderColor,
              color: customSettings.panelStyle.textColor,
            }}
          >
            <PlugZap className="h-3.5 w-3.5 mr-1.5" />
            {t("POWER DISTRIBUTION")}
          </div>
          {customSettings.displayOptions.showPowerConsumption && (
            <div
              className="flex items-center px-3 py-1.5 rounded-md border"
              style={{
                backgroundColor: customSettings.panelStyle.backgroundColor,
                borderColor: customSettings.panelStyle.borderColor,
              }}
            >
              <Zap
                className={cn("h-3.5 w-3.5 mr-1.5")}
                style={{
                  color: isOverloaded ? customSettings.loadMeter.criticalColor : customSettings.panelStyle.accentColor,
                }}
              />
              <span
                className={cn("text-xs font-medium")}
                style={{
                  color: isOverloaded ? customSettings.loadMeter.criticalColor : customSettings.panelStyle.textColor,
                }}
              >
                {data.totalConsumption}W
              </span>
            </div>
          )}
        </div>

        {/* Load meter with animated gradient */}
        {customSettings.displayOptions.showLoadMeter && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs" style={{ color: customSettings.panelStyle.textColor }}>
                {t("System Load")}
              </span>
              <span
                className="text-xs font-medium"
                style={{
                  color: isOverloaded ? customSettings.loadMeter.criticalColor : customSettings.panelStyle.textColor,
                }}
              >
                {Math.round(loadPercentage)}%
              </span>
            </div>
            <div
              className="h-3 rounded-full overflow-hidden shadow-inner"
              style={{ backgroundColor: customSettings.panelStyle.backgroundColor }}
            >
              <div
                className={cn("h-full transition-all duration-300 relative")}
                style={{
                  width: `${Math.min(100, loadPercentage)}%`,
                  backgroundColor: customSettings.loadMeter.enableGradient ? undefined : getLoadMeterColor(),
                  background: customSettings.loadMeter.enableGradient
                    ? isOverloaded
                      ? undefined
                      : `linear-gradient(to right, ${customSettings.loadMeter.normalColor}, ${isWarning ? customSettings.loadMeter.warningColor : customSettings.loadMeter.normalColor})`
                    : undefined,
                }}
              >
                {/* Add shimmer effect if enabled */}
                {customSettings.loadMeter.enableShimmer && (
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    style={{
                      animation: "shimmer 2s infinite",
                      backgroundSize: "200% 100%",
                    }}
                  ></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Circuit breakers and devices section */}
        <div
          className="border rounded-md p-3 mb-4 shadow-inner"
          style={{
            backgroundColor: customSettings.panelStyle.backgroundColor,
            borderColor: customSettings.panelStyle.borderColor,
          }}
        >
          {customSettings.displayOptions.showCircuitLabels && (
            <div
              className="text-xs mb-3 border-b pb-2 flex justify-between items-center"
              style={{
                color: customSettings.panelStyle.textColor,
                borderColor: customSettings.panelStyle.borderColor,
              }}
            >
              <div className="flex items-center">
                <Power className="h-3.5 w-3.5 mr-1.5" />
                <span className="font-medium">{t("CIRCUIT BREAKERS")}</span>
              </div>
              <span
                className={cn(
                  "text-[10px] px-2 py-1 rounded-full",
                  data.inverterOn ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400",
                )}
              >
                {data.inverterOn ? t("POWER ON") : t("POWER OFF")}
              </span>
            </div>
          )}

          {customSettings.displayOptions.showDeviceStatus && (
            <div className="grid grid-cols-2 gap-3">
              {data.devices.map((device) => (
                <div
                  key={device.id}
                  className={cn(
                    "p-2.5 rounded-md flex flex-col border transition-all duration-300",
                    activeDevice === device.id && "scale-105",
                  )}
                  style={{
                    backgroundColor:
                      device.on && data.inverterOn
                        ? customSettings.deviceStyle.activeBackgroundColor
                        : customSettings.deviceStyle.inactiveBackgroundColor,
                    borderColor:
                      device.on && data.inverterOn
                        ? customSettings.deviceStyle.activeBorderColor
                        : customSettings.deviceStyle.inactiveBorderColor,
                    color: customSettings.deviceStyle.textColor,
                    boxShadow: device.on && data.inverterOn ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
                  }}
                  onMouseEnter={() => setActiveDevice(device.id)}
                  onMouseLeave={() => setActiveDevice(null)}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="flex items-center">
                      {getDeviceIcon(device.icon)}
                      <span
                        className="text-xs ml-1.5 font-medium"
                        style={{ color: customSettings.deviceStyle.textColor }}
                      >
                        {t(device.name)}
                      </span>
                    </div>
                    <div
                      className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor:
                          device.on && data.inverterOn
                            ? `${customSettings.deviceStyle.activeBorderColor}20`
                            : "transparent",
                        color: customSettings.deviceStyle.powerTextColor,
                      }}
                    >
                      {device.powerConsumption}W
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full">
                    <div
                      className={cn("w-2 h-2 rounded-full", device.on && data.inverterOn ? "animate-pulse" : "")}
                      style={{
                        backgroundColor:
                          device.on && data.inverterOn
                            ? customSettings.containerStyle.activeColor
                            : customSettings.containerStyle.overloadColor,
                      }}
                    ></div>
                    <Switch
                      checked={device.on}
                      onCheckedChange={() => data.onToggleDevice(device.id)}
                      className="scale-75"
                      style={{
                        backgroundColor: device.on ? customSettings.containerStyle.activeColor : undefined,
                      }}
                    />
                  </div>

                  {/* Power flow animation */}
                  {device.on && data.inverterOn && customSettings.powerFlow.enableFlowAnimation && (
                    <div
                      className="absolute left-0 right-0 h-0.5 overflow-hidden"
                      style={{ backgroundColor: `${customSettings.powerFlow.flowColor}30` }}
                    >
                      <div
                        className="h-full w-1/3"
                        style={{
                          backgroundColor: customSettings.powerFlow.flowColor,
                          opacity: customSettings.powerFlow.flowOpacity,
                          animation: `flowRight ${customSettings.powerFlow.flowAnimationSpeed}s infinite linear`,
                        }}
                      ></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ethiopia Grid Connection section */}
        {data.onToggleEthiopiaConnection && customSettings.displayOptions.showGridConnection && (
          <div className="mt-auto">
            <div
              className="text-xs mb-2 border-b pb-1.5 flex items-center"
              style={{
                color: customSettings.panelStyle.textColor,
                borderColor: customSettings.panelStyle.borderColor,
              }}
            >
              <Globe className="h-3.5 w-3.5 mr-1.5" />
              <span className="font-medium">{t("GRID CONNECTION")}</span>
            </div>
            <div
              className={cn("p-3 rounded-md flex items-center justify-between transition-all duration-300")}
              style={{
                background: data.ethiopiaConnected
                  ? `linear-gradient(to right, ${customSettings.deviceStyle.activeBackgroundColor}, ${customSettings.containerStyle.activeColor}30)`
                  : customSettings.deviceStyle.inactiveBackgroundColor,
                borderWidth: "1px",
                borderStyle: "solid",
                borderColor: data.ethiopiaConnected
                  ? customSettings.deviceStyle.activeBorderColor
                  : customSettings.deviceStyle.inactiveBorderColor,
                color: customSettings.deviceStyle.textColor,
                boxShadow: data.ethiopiaConnected ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
              }}
            >
              <div className="flex items-center">
                <Globe
                  className={cn("h-5 w-5 mr-2", data.ethiopiaConnected ? "animate-pulse-slow" : "")}
                  style={{
                    color: data.ethiopiaConnected
                      ? customSettings.containerStyle.activeColor
                      : customSettings.deviceStyle.textColor,
                  }}
                />
                <div className="flex flex-col">
                  <span className="text-xs font-medium">{t("Ethiopia Grid")}</span>
                  <span
                    className="text-[10px]"
                    style={{
                      color: data.ethiopiaConnected
                        ? customSettings.containerStyle.activeColor
                        : "rgba(148, 163, 184, 1)", // slate-400
                    }}
                  >
                    {data.ethiopiaConnected ? t("Connected") : t("Disconnected")}
                  </span>
                </div>
              </div>
              <Switch
                checked={!!data.ethiopiaConnected}
                onCheckedChange={() =>
                  data.onToggleEthiopiaConnection && data.onToggleEthiopiaConnection(!data.ethiopiaConnected)
                }
                className="scale-75"
                style={{
                  backgroundColor: data.ethiopiaConnected ? customSettings.containerStyle.activeColor : undefined,
                }}
              />
            </div>
          </div>
        )}

        {/* Overload warning indicator */}
        {isOverloaded && (
          <div className="absolute top-3 right-3 animate-pulse">
            <div className="relative">
              <AlertTriangle className="h-5 w-5" style={{ color: customSettings.containerStyle.overloadColor }} />
              <div
                className="absolute inset-0 rounded-full blur-sm animate-ping"
                style={{ backgroundColor: `${customSettings.containerStyle.overloadColor}30` }}
              ></div>
            </div>
          </div>
        )}

        {/* Power flow visualization */}
        {data.inverterOn && customSettings.powerFlow.enableFlowAnimation && (
          <div
            className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-2 h-20 overflow-hidden"
            style={{ backgroundColor: `${customSettings.powerFlow.flowColor}20` }}
          >
            <div
              className="h-10 w-full"
              style={{
                backgroundColor: `${customSettings.powerFlow.flowColor}60`,
                animation: `flowRight ${customSettings.powerFlow.flowAnimationSpeed}s infinite linear`,
              }}
            ></div>
          </div>
        )}

        {/* Component title at the bottom */}
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <div className="font-medium text-sm" style={{ color: customSettings.panelStyle.textColor }}>
            {t("Distribution Panel")}
          </div>
        </div>
      </div>

      {/* Output handle for Ethiopia connection */}
      <Handle
        type="source"
        position={Position.Left}
        id="output-ethiopia"
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

export default DistributionPanelNode
