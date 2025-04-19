"use client"

import type React from "react"
import { useState, useEffect, useMemo, useCallback, useRef } from "react"
import {
  type Node,
  type Edge,
  type NodeTypes,
  type EdgeTypes,
  useNodesState,
  useEdgesState,
  addEdge,
  updateEdge,
  type Connection,
  ConnectionLineType,
} from "reactflow"
import ReactFlow, { ReactFlowProvider, Background, Controls, useStore } from "reactflow"
import "reactflow/dist/style.css"
import { Zap, MonitorSmartphone, Wifi, Lightbulb } from "lucide-react"
import { useLocalStorage } from "@/lib/hooks"
import { TooltipProvider } from "@/components/ui/tooltip"
import { EcoPattern } from "@/components/eco-pattern"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageSelector } from "@/components/language-selector"

// Add these imports at the top of the file
import { createShareableUrl } from "@/lib/layout-utils"

// Import custom node components
import SolarPanelNode from "./nodes/solar-panel-node"
import ChargeControllerNode from "./nodes/charge-controller-node"
import BatteryNode from "./nodes/battery-edge"
import InverterNode from "./nodes/inverter-node"
import DistributionPanelNode from "./nodes/distribution-panel-node"
import SystemStatusNode from "./nodes/system-status-node"
import EthiopiaMapNode from "./nodes/ethiopia-map-node"
import WeatherControlsNode from "./nodes/weather-controls-node"
import RegionalDataNode from "./nodes/regional-data-node"
import CustomComponentNode from "./nodes/custom-component-node"
import CustomEdge from "./edges/custom-energy-edge"
import BreakerPanelNode from "./nodes/breaker-panel-node"
import BackupGeneratorNode from "./nodes/backup-generator-node"
import SensorNode from "./nodes/sensor-node"
import IOControllerNode from "./nodes/io-controller-node"
import LoadDeviceNode from "./nodes/load-device-node"
import AdditionalSolarPanelNode from "./nodes/additional-solar-panel-node"
import AdditionalBatteryNode from "./nodes/additional-battery-node"
import { AddNodePanel } from "./add-node-panel"
import { LayoutControls } from "./layout-controls"
import { saveLayoutData } from "@/lib/api"
import { getLayoutFromUrl } from "@/lib/layout-utils"

// Add these imports at the top of the file
import { ComponentSettingsProvider, useSelectedComponent } from "@/lib/component-settings-context"
import { CustomizationPanel } from "./customization-panel"

// Interface definitions
interface DeviceState {
  id: string
  name: string
  icon: React.ReactNode
  on: boolean
  powerConsumption: number
  connected: boolean
}

interface RegionState {
  id: string
  name: string
  position: { x: number; y: number }
  status: "active" | "warning" | "offline"
  batteryLevel: number
  solarOutput: number
}

// Weather conditions type
type WeatherCondition = "sunny" | "cloudy" | "rainy"

// Energy flow type
type EnergyFlowDirection = "charging" | "discharging" | "balanced"

// Connection validation rules
interface ConnectionRule {
  source: string | RegExp
  target: string | RegExp
  valid: boolean
  message?: string
}

// Custom component type
interface CustomComponent {
  id: string
  type: string
  label: string
  isActive: boolean
  outputValue?: number
  isConnected: boolean
  connectionSuggestions?: string[]
}

// Add a debounce utility function at the top of the component, after the imports
// Add this after the type definitions, before the Flow component
function useDebounce<T extends (...args: any[]) => any>(func: T, wait: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        func(...args)
      }, wait)
    },
    [func, wait],
  )

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return debouncedFunction
}

// Update the SolarSystemSimulation component to accept isSharedLayout prop
import { Analytics } from "@/components/analytics"

export function SolarSystemSimulation({
  initialLayout,
  isSharedLayout = false,
}: {
  initialLayout?: Record<string, { x: number; y: number }> | null
  isSharedLayout?: boolean
} = {}) {
  return (
    <ComponentSettingsProvider>
      <TooltipProvider>
        <ReactFlowProvider>
          <Flow initialLayout={initialLayout} isSharedLayout={isSharedLayout} />
          <div className="sr-only" aria-live="polite" id="flow-announcements"></div>
          <Analytics />
        </ReactFlowProvider>
      </TooltipProvider>
    </ComponentSettingsProvider>
  )
}

// Define a well-designed default layout for all components with adjusted positions to match the image
// and prevent overlapping
// Define the embedded layout data that will always be used as the default
const defaultComponentLayout = {
  "solar-panel": {
    x: 465,
    y: -120,
  },
  "charge-controller": {
    x: 705,
    y: 375,
  },
  battery: {
    x: 990,
    y: 525,
  },
  inverter: {
    x: 150,
    y: 585,
  },
  "distribution-panel": {
    x: -165,
    y: 450,
  },
  "system-status": {
    x: 510,
    y: -240,
  },
  "ethiopia-map": {
    x: -180,
    y: -195,
  },
  "weather-controls": {
    x: -150,
    y: 165,
  },
  "breaker-panel": {
    x: 1050,
    y: -165,
  },
  "backup-generator": {
    x: 405,
    y: 585,
  },
  "sensor-node": {
    x: 1350,
    y: -195,
  },
  "io-controller": {
    x: 1320,
    y: 450,
  },
  "load-device": {
    x: 195,
    y: -75,
  },
}

// In the Flow component, modify how translation is handled:
function Flow({
  initialLayout: initialLayoutProp,
  isSharedLayout: isSharedLayoutProp = false,
}: {
  initialLayout?: Record<string, { x: number; y: number }> | null
  isSharedLayout?: boolean
}) {
  const { t, language } = useTranslation()

  // Add this near the other state declarations
  const { selectedComponentId, setSelectedComponentId } = useSelectedComponent()

  // System state - moved up before initialNodes
  const [sunIntensity, setSunIntensity] = useState(80)
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [systemVoltage, setSystemVoltage] = useState(24.0)
  const [inverterOn, setInverterOn] = useState(true)
  const [solarActive, setSolarActive] = useState(true)
  const [energyFlow, setEnergyFlow] = useState<EnergyFlowDirection>("charging")
  const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>("sunny")
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [showRegionalData, setShowRegionalData] = useState(false)
  const [totalConsumption, setTotalConsumption] = useState(90)
  const [solarProduction, setSolarProduction] = useState(120)
  const [netPower, setNetPower] = useState(30)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [customComponents, setCustomComponents] = useState<CustomComponent[]>([])

  // Add these state variables near the top of the Flow component, with the other state declarations
  const [solarPanelCount, setSolarPanelCount] = useState(1) // Start at 1 since we already have one solar panel
  const [batteryCount, setBatteryCount] = useState(1) // Start at 1 since we already have one battery bank

  // Add these state variables near the top of the Flow component, with the other state declarations
  const [saveLayoutEnabled, setSaveLayoutEnabled] = useLocalStorage<boolean>("solar-system-save-layout-enabled", false)
  const [savedLayout, setSavedLayout] = useLocalStorage<Record<string, { x: number; y: number }>>(
    "solar-system-layout",
    {},
  )

  // Add state for additional solar panels and batteries
  const [additionalSolarPanels, setAdditionalSolarPanels] = useState<
    {
      id: string
      isActive: boolean
      ratedWattage: number
      orientation: "east" | "south" | "west"
      sunlightMultiplier: number
      currentOutput: number
    }[]
  >([])

  const [additionalBatteries, setAdditionalBatteries] = useState<
    {
      id: string
      isEnabled: boolean
      batteryType: "lead-acid" | "lithium-ion" | "gel"
      capacity: number
      voltage: number
      connectionType: "series" | "parallel"
      chargeLevel: number
    }[]
  >([])

  // Add state for the new components
  const [breakerOn, setBreakerOn] = useState(true)
  const [overloadWarning, setOverloadWarning] = useState(false)
  const [generatorOn, setGeneratorOn] = useState(false)
  const [fuelLevel, setFuelLevel] = useState(75)
  const [controllerMode, setControllerMode] = useState<"auto" | "manual">("auto")
  const [environmentalTemp, setEnvironmentalTemp] = useState(25)
  const [sensorActive, setSensorActive] = useState(true)

  // Add a new state variable for Ethiopia connection
  const [ethiopiaConnected, setEthiopiaConnected] = useState(false)

  // React Flow wrapper ref
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Devices - moved up before initialNodes
  const [devices, setDevices] = useState<DeviceState[]>([
    {
      id: "tv",
      name: "Television",
      icon: <MonitorSmartphone className="h-5 w-5" />,
      on: true,
      powerConsumption: 60,
      connected: true,
    },
    {
      id: "lights",
      name: "LED Lights",
      icon: <Lightbulb className="h-5 w-5" />,
      on: true,
      powerConsumption: 20,
      connected: true,
    },
    {
      id: "sockets",
      name: "Wall Sockets",
      icon: <Zap className="h-5 w-5" />,
      on: false,
      powerConsumption: 80,
      connected: true,
    },
    {
      id: "router",
      name: "Wi-Fi Router",
      icon: <Wifi className="h-5 w-5" />,
      on: true,
      powerConsumption: 10,
      connected: true,
    },
  ])

  // Ethiopia regions with solar systems - moved up before initialNodes
  const [regions, setRegions] = useState<RegionState[]>([
    {
      id: "addis",
      name: "Addis Ababa",
      position: { x: 48, y: 52 },
      status: "active",
      batteryLevel: 85,
      solarOutput: 120,
    },
    {
      id: "tigray",
      name: "Tigray",
      position: { x: 45, y: 20 },
      status: "warning",
      batteryLevel: 35,
      solarOutput: 60,
    },
    {
      id: "amhara",
      name: "Amhara",
      position: { x: 35, y: 35 },
      status: "active",
      batteryLevel: 72,
      solarOutput: 95,
    },
    {
      id: "oromia",
      name: "Oromia",
      position: { x: 60, y: 60 },
      status: "active",
      batteryLevel: 90,
      solarOutput: 130,
    },
    {
      id: "somali",
      name: "Somali",
      position: { x: 80, y: 55 },
      status: "offline",
      batteryLevel: 10,
      solarOutput: 0,
    },
  ])

  // Add a toggle function for Ethiopia connection - moved up before initialNodes
  const toggleEthiopiaConnection = () => {
    setEthiopiaConnected(!ethiopiaConnected)
  }

  // Handle toggling a device - moved up before initialNodes
  const toggleDevice = (id: string) => {
    setDevices((prev) => prev.map((device) => (device.id === id ? { ...device, on: !device.on } : device)))
  }

  // Handle region selection - moved up before initialNodes
  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId === selectedRegion ? null : regionId)
    setShowRegionalData(regionId !== selectedRegion)
  }

  // Handle weather change - moved up before initialNodes
  const handleWeatherChange = (condition: WeatherCondition) => {
    setWeatherCondition(condition)

    // Adjust sun intensity based on weather
    switch (condition) {
      case "sunny":
        setSunIntensity(80)
        setEnvironmentalTemp(25)
        break
      case "cloudy":
        setSunIntensity(50)
        setEnvironmentalTemp(20)
        break
      case "rainy":
        setSunIntensity(30)
        setEnvironmentalTemp(15)
        break
    }
  }

  // Add onNodeClick handler
  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Set the selected component for customization
      setSelectedComponentId(node.id)
    },
    [setSelectedComponentId],
  )

  // Define initialNodes before using it
  const initialNodes: Node[] = [
    {
      id: "solar-panel",
      type: "solarPanel",
      position: defaultComponentLayout["solar-panel"],
      data: {
        sunIntensity: 80,
        solarActive: true,
        onSunIntensityChange: (value: number) => setSunIntensity(value),
        onSolarActiveChange: (value: boolean) => setSolarActive(value),
        solarProduction: 120,
        t, // Pass translation function
      },
    },
    {
      id: "charge-controller",
      type: "chargeController",
      position: defaultComponentLayout["charge-controller"],
      data: {
        solarProduction: 120,
        output: 120,
        t, // Pass translation function
      },
    },
    {
      id: "battery",
      type: "battery",
      position: defaultComponentLayout["battery"],
      data: {
        batteryLevel: 100,
        systemVoltage: 24.0,
        energyFlow: "charging",
        t, // Pass translation function
      },
    },
    {
      id: "inverter",
      type: "inverter",
      position: defaultComponentLayout["inverter"],
      data: {
        inverterOn: true,
        systemVoltage: 24.0,
        onInverterChange: (value: boolean) => setInverterOn(value),
        t, // Pass translation function
      },
    },
    {
      id: "distribution-panel",
      type: "distributionPanel",
      position: defaultComponentLayout["distribution-panel"],
      data: {
        devices,
        totalConsumption,
        inverterOn,
        onToggleDevice: (id: string) => toggleDevice(id),
        onToggleEthiopiaConnection: toggleEthiopiaConnection,
        ethiopiaConnected,
        t, // Pass translation function
      },
    },
    {
      id: "system-status",
      type: "systemStatus",
      position: defaultComponentLayout["system-status"],
      data: {
        solarProduction: 120,
        batteryLevel: 100,
        energyFlow: "charging",
        totalConsumption: 90,
        t, // Pass translation function
      },
    },
    {
      id: "ethiopia-map",
      type: "ethiopiaMap",
      position: defaultComponentLayout["ethiopia-map"],
      data: {
        regions,
        selectedRegion,
        onRegionSelect: (regionId: string) => handleRegionSelect(regionId),
        onToggleRegionalData: () => setShowRegionalData(!showRegionalData),
        showRegionalData,
        isConnected: false,
        t, // Pass translation function
      },
    },
    {
      id: "weather-controls",
      type: "weatherControls",
      position: defaultComponentLayout["weather-controls"],
      data: {
        weatherCondition,
        onWeatherChange: (condition: WeatherCondition) => handleWeatherChange(condition),
        t, // Pass translation function
      },
    },
    {
      id: "breaker-panel",
      type: "breakerPanel",
      position: defaultComponentLayout["breaker-panel"],
      data: {
        breakerOn: true,
        overloadWarning: false,
        onBreakerChange: (value: boolean) => setBreakerOn(value),
        t, // Pass translation function
      },
    },
    {
      id: "backup-generator",
      type: "backupGenerator",
      position: defaultComponentLayout["backup-generator"],
      data: {
        generatorOn: false,
        fuelLevel: 75,
        onGeneratorChange: (value: boolean) => setGeneratorOn(value),
        t, // Pass translation function
      },
    },
    {
      id: "sensor-node",
      type: "sensorNode",
      position: defaultComponentLayout["sensor-node"],
      data: {
        isActive: true,
        sunlightIntensity: 80,
        temperature: 25,
        onToggleActive: (value: boolean) => setSensorActive(value),
        t, // Pass translation function
      },
    },
    {
      id: "io-controller",
      type: "ioController",
      position: defaultComponentLayout["io-controller"],
      data: {
        isActive: true,
        mode: "auto",
        batteryLevel: 100,
        solarProduction: 120,
        loadDemand: 90,
        onToggleActive: (value: boolean) => {
          /* Handle controller activation */
        },
        onModeChange: (mode: "auto" | "manual") => setControllerMode(mode),
        t, // Pass translation function
      },
    },
    {
      id: "load-device",
      type: "loadDevice",
      position: defaultComponentLayout["load-device"],
      data: {
        deviceName: "Smart Appliance",
        isOn: true,
        powerConsumption: 45,
        maxPower: 100,
        onToggleDevice: (value: boolean) => {
          /* Handle device toggle */
        },
        onPowerChange: (value: number) => {
          /* Handle power change */
        },
        t, // Pass translation function
      },
    },
  ]

  // First, ensure all component nodes pass the translation function properly
  // For example, in the initialNodes array, make sure all node data objects include the t function:

  initialNodes.map((node) => {
    // Ensure all node data objects have the t function
    if (!node.data.t) {
      node.data.t = t
    }
    return node
  })

  // Initial edges for React Flow
  const initialEdges: Edge[] = [
    {
      id: "solar-to-controller",
      source: "solar-panel",
      target: "charge-controller",
      targetHandle: "input",
      type: "energyFlow",
      animated: true, // Active by default
      data: {
        energyFlow: "input",
        active: true,
        wattage: "120W", // Set to 120W
      },
    },
    {
      id: "controller-to-battery",
      source: "charge-controller",
      sourceHandle: "to-battery",
      target: "battery",
      type: "energyFlow",
      animated: true, // Active by default
      data: {
        energyFlow: "input",
        active: true,
      },
    },
    {
      id: "controller-to-inverter",
      source: "charge-controller",
      sourceHandle: "to-inverter",
      target: "inverter",
      type: "energyFlow",
      animated: true, // Active by default
      data: {
        energyFlow: "input",
        active: true,
        wattage: "120W", // Set to 120W
      },
    },
    {
      id: "battery-to-inverter",
      source: "battery",
      target: "inverter",
      type: "energyFlow",
      animated: false, // Not discharging by default
      data: {
        energyFlow: "output",
        active: false,
      },
    },
    {
      id: "inverter-to-distribution",
      source: "inverter",
      target: "distribution-panel",
      type: "energyFlow",
      animated: true, // Active by default
      data: {
        energyFlow: "output",
        active: true,
      },
    },
    {
      id: "breaker-to-controller",
      source: "breaker-panel",
      target: "charge-controller",
      type: "energyFlow",
      animated: true, // Active by default
      data: {
        energyFlow: "input",
        active: true,
      },
    },
    {
      id: "generator-to-inverter",
      source: "backup-generator",
      target: "inverter",
      type: "energyFlow",
      animated: false, // Not active by default
      data: {
        energyFlow: "input",
        active: false,
      },
    },
    {
      id: "sensor-to-controller",
      source: "sensor-node",
      target: "io-controller",
      type: "energyFlow",
      animated: true, // Active by default
      data: {
        energyFlow: "input",
        active: true,
        wattage: "Data",
      },
    },
    {
      id: "io-to-breaker",
      source: "io-controller",
      target: "breaker-panel",
      type: "energyFlow",
      animated: true, // Active by default
      data: {
        energyFlow: "output",
        active: true,
        wattage: "Control",
      },
    },
    {
      id: "inverter-to-load",
      source: "inverter",
      target: "load-device",
      type: "energyFlow",
      animated: true, // Active by default
      data: {
        energyFlow: "output",
        active: true,
        wattage: "45W", // Set to 45W
      },
    },
    {
      id: "io-to-battery",
      source: "io-controller",
      target: "battery",
      type: "energyFlow",
      animated: true, // Active by default
      data: {
        energyFlow: "output",
        active: true,
        wattage: "Control",
      },
    },
    {
      id: "distribution-to-ethiopia",
      source: "distribution-panel",
      target: "ethiopia-map",
      type: "energyFlow",
      animated: false, // Will be updated based on state
      data: {
        energyFlow: "output",
        active: false,
        wattage: "Grid Power",
      },
    },
  ]

  // Now use initialNodes and initialEdges
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Add this to access the ReactFlow instance
  // Also, make sure the useEffect that updates nodes when language changes is properly implemented:
  useEffect(() => {
    console.log("Language changed to:", language)
    // Update all nodes with the new translation function
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          t, // Pass the fresh translation function
        },
      })),
    )
  }, [language, setNodes, t])

  // Add this effect to force node updates when language changes
  useEffect(() => {
    console.log("Language changed to:", language)
    // Update all nodes with the new translation function
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          t, // Pass the fresh translation function
        },
      })),
    )
  }, [language, setNodes, t])

  // Only show regional data node if a region is selected and showRegionalData is true
  if (showRegionalData && selectedRegion) {
    initialNodes.push({
      id: "regional-data",
      type: "regionalData",
      position: { x: 50, y: 230 },
      data: {
        region: regions.find((r) => r.id === selectedRegion),
        t,
      },
    })
  }

  // Add custom component nodes
  customComponents.forEach((component) => {
    initialNodes.push({
      id: component.id,
      type: "customComponent",
      position: { x: 250, y: 150 }, // Default position, will be adjusted
      data: {
        label: component.label,
        componentType: component.type,
        isActive: component.isActive,
        outputValue: component.outputValue || 0, // Ensure there's a default value
        isConnected: component.isConnected,
        connectionSuggestions: component.connectionSuggestions,
        onLabelChange: (newLabel: string) => handleUpdateCustomComponentLabel(component.id, newLabel),
        onComponentTypeChange: (newType: string) => handleUpdateCustomComponentType(component.id, newType),
        onToggleActive: (active: boolean) => handleToggleCustomComponent(component.id, active),
        onRemove: (id: string) => handleRemoveCustomComponent(id), // Add this line
        t,
      },
      draggable: true,
    })
  })

  // Add a useEffect to prevent scrolling on the body when the component is mounted
  useEffect(() => {
    // Save the original overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow

    // Prevent scrolling on the body
    document.body.style.overflow = "hidden"

    // Restore original style when component unmounts
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  // Connection validation rules
  const connectionRules: ConnectionRule[] = [
    { source: "solar-panel", target: "charge-controller", valid: true },
    { source: "charge-controller", target: "battery", valid: true },
    { source: "charge-controller", target: "inverter", valid: true },
    { source: "battery", target: "inverter", valid: true },
    { source: "inverter", target: "distribution-panel", valid: true },
    { source: "breaker-panel", target: "charge-controller", valid: true },
    { source: "backup-generator", target: "inverter", valid: true },
    { source: "sensor-node", target: "io-controller", valid: true },
    { source: "sensor-node", target: "charge-controller", valid: true },
    { source: "io-controller", target: "breaker-panel", valid: true },
    { source: "io-controller", target: "distribution-panel", valid: true },
    { source: "io-controller", target: "battery", valid: true },
    { source: "inverter", target: "load-device", valid: true },
    // Add explicit rules for additional components
    { source: /^solar-panel-.*/, target: "charge-controller", valid: true },
    { source: /^battery-.*/, target: "inverter", valid: true },
    { source: /^battery-.*/, target: "io-controller", valid: true },
    // More specific validation for custom components by type
    { source: /^custom-component-.*/, target: /^custom-component-.*/, valid: true },
    { source: /^custom-component-sensor-.*/, target: /^custom-component-controller-.*/, valid: true },
    { source: /^custom-component-sensor-.*/, target: "io-controller", valid: true },
    { source: /^custom-component-controller-.*/, target: "distribution-panel", valid: true },
    // Rules for custom components - allow connections to/from any component
    { source: /^custom-component-.*/, target: /.+/, valid: true },
    { source: /.+/, target: /^custom-component-.*/, valid: true },
    // Invalid connections
    {
      source: "solar-panel",
      target: "inverter",
      valid: false,
      message: "Solar panels must connect to a charge controller",
    },
    {
      source: "solar-panel",
      target: "battery",
      valid: false,
      message: "Solar panels must connect to a charge controller",
    },
    {
      source: "solar-panel",
      target: "distribution-panel",
      valid: false,
      message: "Solar panels must connect to a charge controller",
    },
    { source: "battery", target: "distribution-panel", valid: false, message: "Batteries must connect to an inverter" },
    {
      source: "charge-controller",
      target: "distribution-panel",
      valid: false,
      message: "Charge controllers must connect to an inverter or battery",
    },
  ]

  // Node types definition for React Flow
  const nodeTypes = useMemo<NodeTypes>(
    () => ({
      solarPanel: SolarPanelNode,
      chargeController: ChargeControllerNode,
      battery: BatteryNode,
      inverter: InverterNode,
      distributionPanel: DistributionPanelNode,
      systemStatus: SystemStatusNode,
      ethiopiaMap: EthiopiaMapNode,
      weatherControls: WeatherControlsNode,
      regionalData: RegionalDataNode,
      customComponent: CustomComponentNode,
      breakerPanel: BreakerPanelNode,
      backupGenerator: BackupGeneratorNode,
      sensorNode: SensorNode,
      ioController: IOControllerNode,
      loadDevice: LoadDeviceNode,
      additionalSolarPanel: AdditionalSolarPanelNode,
      additionalBattery: AdditionalBatteryNode,
    }),
    [],
  )

  // Edge types definition for React Flow
  const edgeTypes = useMemo<EdgeTypes>(
    () => ({
      energyFlow: CustomEdge,
    }),
    [],
  )

  // Handle adding a new solar panel
  const handleAddSolarPanel = () => {
    // Increment the counter for sequential naming
    const newCount = solarPanelCount + 1
    setSolarPanelCount(newCount)

    const id = `solar-panel-${Date.now()}`
    const displayName = `${t("Solar Panel")} ${newCount}`

    // Find a non-overlapping position
    const baseX = reactFlowWrapper.current ? reactFlowWrapper.current.clientWidth / 2 - 200 : 300
    const baseY = reactFlowWrapper.current ? reactFlowWrapper.current.clientHeight / 3 : 200

    // Check for existing nodes and find a position that doesn't overlap
    const newPosition = findNonOverlappingPosition(nodes, baseX, baseY)

    // Add new solar panel to state
    const newPanel = {
      id,
      isActive: true,
      ratedWattage: 100,
      orientation: "south" as const,
      sunlightMultiplier: 1.0,
      currentOutput: 0,
    }

    setAdditionalSolarPanels((prev) => [...prev, newPanel])

    // Add new node to flow with non-overlapping position
    const newNode: Node = {
      id,
      type: "additionalSolarPanel",
      position: newPosition,
      data: {
        panelId: id,
        displayName,
        isActive: true,
        ratedWattage: 100,
        orientation: "south" as const,
        sunlightMultiplier: 1.0,
        currentOutput: 0,
        sunIntensity,
        onActivationChange: handleSolarPanelActivationChange,
        onOrientationChange: handleSolarPanelOrientationChange,
        onRatedWattageChange: handleSolarPanelWattageChange,
        t, // Pass translation function
      },
    }

    setNodes((nds) => [...nds, newNode])

    // Save the position in the layout
    setSavedLayout((prev) => ({
      ...prev,
      [id]: newPosition,
    }))

    // Automatically create a connection to the charge controller
    const newEdgeId = `${id}-to-charge-controller-${Date.now()}`
    const newEdge: Edge = {
      id: newEdgeId,
      source: id,
      target: "charge-controller",
      targetHandle: "input",
      type: "energyFlow",
      animated: true,
      data: {
        energyFlow: "input",
        active: true,
        wattage: "100W", // Default wattage for new panel
      },
    }

    setEdges((eds) => [...eds, newEdge])

    // Show success message
    setConnectionError(t("New solar panel added and connected successfully!"))
    setTimeout(() => setConnectionError(null), 2000)
  }

  // Handle adding a new battery
  const handleAddBattery = () => {
    // Increment the counter for sequential naming
    const newCount = batteryCount + 1
    setBatteryCount(newCount)

    const id = `battery-${Date.now()}`
    const displayName = `${t("Battery Bank")} ${newCount}`

    // Find a non-overlapping position
    const baseX = reactFlowWrapper.current ? reactFlowWrapper.current.clientWidth / 2 + 200 : 300
    const baseY = reactFlowWrapper.current ? reactFlowWrapper.current.clientHeight / 3 : 200

    // Check for existing nodes and find a position that doesn't overlap
    const newPosition = findNonOverlappingPosition(nodes, baseX, baseY)

    // Add new battery to state
    const newBattery = {
      id,
      isEnabled: true,
      batteryType: "lithium-ion" as const,
      capacity: 100,
      voltage: 24,
      connectionType: "parallel" as const,
      chargeLevel: 80,
    }

    setAdditionalBatteries((prev) => [...prev, newBattery])

    // Add new node to flow with non-overlapping position
    const newNode: Node = {
      id,
      type: "additionalBattery",
      position: newPosition,
      data: {
        batteryId: id,
        displayName,
        isEnabled: true,
        batteryType: "lithium-ion" as const,
        capacity: 100,
        voltage: 24,
        connectionType: "parallel" as const,
        chargeLevel: 80,
        systemVoltage,
        energyFlow,
        onEnableChange: handleBatteryEnableChange,
        onTypeChange: handleBatteryTypeChange,
        onCapacityChange: handleBatteryCapacityChange,
        onVoltageChange: handleBatteryVoltageChange,
        onConnectionTypeChange: handleBatteryConnectionTypeChange,
        t, // Pass translation function
      },
    }

    setNodes((nds) => [...nds, newNode])

    // Save the position in the layout
    setSavedLayout((prev) => ({
      ...prev,
      [id]: newPosition,
    }))

    // Automatically create connections to both charge controller and inverter
    const edgeToChargeController: Edge = {
      id: `charge-controller-to-${id}-${Date.now()}`,
      source: "charge-controller",
      sourceHandle: "to-battery",
      target: id,
      type: "energyFlow",
      animated: energyFlow === "charging",
      data: {
        energyFlow: "input",
        active: true,
        wattage: t("Charging"),
      },
    }

    const edgeToInverter: Edge = {
      id: `${id}-to-inverter-${Date.now()}`,
      source: id,
      target: "inverter",
      type: "energyFlow",
      animated: energyFlow === "discharging",
      data: {
        energyFlow: "output",
        active: energyFlow === "discharging",
        wattage: "24V",
      },
    }

    setEdges((eds) => [...eds, edgeToChargeController, edgeToInverter])

    // Show success message
    setConnectionError(t("New battery added and connected successfully!"))
    setTimeout(() => setConnectionError(null), 2000)
  }

  // Update the handleAddCustomComponent function to use non-overlapping positions
  const handleAddCustomComponent = (type: string, label: string) => {
    const id = `custom-component-${Date.now()}`

    // Find a non-overlapping position
    const baseX = reactFlowWrapper.current ? reactFlowWrapper.current.clientWidth / 2 + 100 : 300
    const baseY = reactFlowWrapper.current ? reactFlowWrapper.current.clientHeight / 3 : 200

    // Check for existing nodes and find a position that doesn't overlap
    const newPosition = findNonOverlappingPosition(nodes, baseX, baseY)

    // Add new component to state
    const newComponent: CustomComponent = {
      id,
      type,
      label,
      isActive: false,
      outputValue: 0,
      isConnected: false,
      connectionSuggestions: getConnectionSuggestionsForType(type),
    }

    setCustomComponents((prev) => [...prev, newComponent])

    // Add new node to flow with non-overlapping position
    const newNode: Node = {
      id,
      type: "customComponent",
      position: newPosition,
      data: {
        label,
        componentType: type,
        isActive: false,
        isConnected: false,
        outputValue: 0,
        connectionSuggestions: getConnectionSuggestionsForType(type),
        onLabelChange: (newLabel: string) => handleUpdateCustomComponentLabel(id, newLabel),
        onComponentTypeChange: (newType: string) => handleUpdateCustomComponentType(id, newType),
        onToggleActive: (active: boolean) => handleToggleCustomComponent(id, active),
        onRemove: (id: string) => handleRemoveCustomComponent(id),
        t, // Pass translation function
      },
    }

    setNodes((nds) => [...nds, newNode])

    // Save the position in the layout
    setSavedLayout((prev) => ({
      ...prev,
      [id]: newPosition,
    }))

    // Show success animation or feedback
    setConnectionError(t("New component added successfully!"))
    setTimeout(() => setConnectionError(null), 2000)
  }

  // Handlers for solar panel changes
  const handleSolarPanelActivationChange = (id: string, active: boolean) => {
    setAdditionalSolarPanels((prev) => prev.map((panel) => (panel.id === id ? { ...panel, isActive: active } : panel)))
  }

  const handleSolarPanelOrientationChange = (id: string, orientation: "east" | "south" | "west") => {
    setAdditionalSolarPanels((prev) => prev.map((panel) => (panel.id === id ? { ...panel, orientation } : panel)))
  }

  const handleSolarPanelWattageChange = (id: string, wattage: number) => {
    setAdditionalSolarPanels((prev) =>
      prev.map((panel) => (panel.id === id ? { ...panel, ratedWattage: wattage } : panel)),
    )
  }

  // Handlers for battery changes
  const handleBatteryEnableChange = (id: string, enabled: boolean) => {
    setAdditionalBatteries((prev) =>
      prev.map((battery) => (battery.id === id ? { ...battery, isEnabled: enabled } : battery)),
    )
  }

  const handleBatteryTypeChange = (id: string, type: "lead-acid" | "lithium-ion" | "gel") => {
    setAdditionalBatteries((prev) =>
      prev.map((battery) => (battery.id === id ? { ...battery, batteryType: type } : battery)),
    )
  }

  const handleBatteryCapacityChange = (id: string, capacity: number) => {
    setAdditionalBatteries((prev) => prev.map((battery) => (battery.id === id ? { ...battery, capacity } : battery)))
  }

  const handleBatteryVoltageChange = (id: string, voltage: number) => {
    setAdditionalBatteries((prev) => prev.map((battery) => (battery.id === id ? { ...battery, voltage } : battery)))
  }

  const handleBatteryConnectionTypeChange = (id: string, type: "series" | "parallel") => {
    setAdditionalBatteries((prev) =>
      prev.map((battery) => (battery.id === id ? { ...battery, connectionType: type } : battery)),
    )
  }

  // Handle removing a custom component
  const handleRemoveCustomComponent = (id: string) => {
    // Remove the component from state
    setCustomComponents((prev) => prev.filter((comp) => comp.id !== id))

    // Remove the node from the flow
    setNodes((nds) => nds.filter((node) => node.id !== id))

    // Remove any edges connected to this component
    setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id))

    // Show feedback
    setConnectionError(t("Component removed successfully!"))
    setTimeout(() => setConnectionError(null), 2000)
  }

  // Set up nodes and edges for React Flow
  const [isLoading, setIsLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [initialLayout, setInitialLayout] = useState<Record<string, { x: number; y: number }> | null>(
    initialLayoutProp || null,
  )
  const [isSharedLayout, setIsSharedLayout] = useState<boolean>(isSharedLayoutProp)

  // Add this effect right after the nodes and edges state declarations (around line 1100)
  // This ensures the layout is automatically applied when the component initializes

  // Replace or add this effect to automatically apply the layout on initialization
  useEffect(() => {
    console.log("Applying embedded default layout")

    // Always apply the embedded default layout to the nodes
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        position: defaultComponentLayout[node.id] || node.position,
      })),
    )

    // Update savedLayout to match default
    setSavedLayout(defaultComponentLayout)
    setSaveLayoutEnabled(true)
  }, []) // Empty dependency array ensures this runs only once on mount

  // Get connection suggestions based on component type
  const getConnectionSuggestionsForType = (type: string): string[] => {
    switch (type) {
      case "sensor":
        return [t("Charge Controller"), t("System Monitor"), t("Controller")]
      case "controller":
        return [t("Battery Bank"), t("Load Device"), t("Breaker Panel")]
      case "display":
        return [t("System Monitor"), t("Battery"), t("Controller")]
      case "connector":
        return [t("Any component")]
      case "breaker":
        return [t("Inverter"), t("Load Device")]
      case "monitor":
        return [t("Sensor"), t("Battery"), t("Load Device")]
      case "backup":
        return [t("Inverter"), t("Charge Controller")]
      case "load":
        return [t("Inverter"), t("Breaker Panel")]
      default:
        return [t("Any component")]
    }
  }

  // Handle updating a custom component label
  const handleUpdateCustomComponentLabel = (id: string, newLabel: string) => {
    // Update in custom components state
    setCustomComponents((prev) => prev.map((comp) => (comp.id === id ? { ...comp, label: newLabel } : comp)))

    // Update in nodes
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: newLabel,
            },
          }
        }
        return node
      }),
    )
  }

  // Handle updating a custom component type
  const handleUpdateCustomComponentType = (id: string, newType: string) => {
    // Update in custom components state
    setCustomComponents((prev) =>
      prev.map((comp) =>
        comp.id === id
          ? {
              ...comp,
              type: newType,
              connectionSuggestions: getConnectionSuggestionsForType(newType),
            }
          : comp,
      ),
    )

    // Update in nodes
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              componentType: newType,
              connectionSuggestions: getConnectionSuggestionsForType(newType),
            },
          }
        }
        return node
      }),
    )
  }

  // Handle toggling a custom component
  const handleToggleCustomComponent = (id: string, active: boolean) => {
    // Update in custom components state
    setCustomComponents((prev) =>
      prev.map((comp) => {
        if (comp.id === id) {
          // Calculate a new output value when toggled on
          const newOutputValue = active
            ? comp.type === "display"
              ? Math.round(solarProduction * 0.8)
              : // Display shows 80% of solar production
                Math.round(20 + Math.random() * 80)
            : // Other components get random values
              0 // When inactive, output is 0

          return {
            ...comp,
            isActive: active,
            outputValue: newOutputValue,
          }
        }
        return comp
      }),
    )

    // Update in nodes
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          // Calculate output value same as above
          const newOutputValue = active
            ? node.data.componentType === "display"
              ? Math.round(solarProduction * 0.8)
              : Math.round(20 + Math.random() * 80)
            : 0

          return {
            ...node,
            data: {
              ...node.data,
              isActive: active,
              outputValue: newOutputValue,
            },
          }
        }
        return node
      }),
    )
  }

  // Validate connection based on rules
  const validateConnection = (connection: Connection): { valid: boolean; message?: string } => {
    const { source, target } = connection

    if (!source || !target) {
      return { valid: false, message: t("Invalid connection") }
    }

    // Check for rules with regex patterns
    for (const rule of connectionRules) {
      // Handle regex source patterns
      if (rule.source instanceof RegExp && rule.target instanceof RegExp) {
        if (rule.source.test(source) && rule.target.test(target)) {
          return { valid: rule.valid, message: rule.message }
        }
      } else if (rule.source instanceof RegExp) {
        if (rule.source.test(source) && rule.target === target) {
          return { valid: rule.valid, message: rule.message }
        }
      } else if (rule.target instanceof RegExp) {
        if (rule.source === source && rule.target.test(target)) {
          return { valid: rule.valid, message: rule.message }
        }
      } else if (rule.source === source && rule.target === target) {
        // Exact match
        return { valid: rule.valid, message: rule.message }
      }
    }

    // If no rule found, default to valid for custom components, invalid otherwise
    if (source.startsWith("custom-component-") || target.startsWith("custom-component-")) {
      return { valid: true }
    }

    return { valid: false, message: t("This connection is not allowed") }
  }

  // Handle new connections
  const onConnect = useCallback(
    (params: Connection) => {
      const validation = validateConnection(params)

      if (!validation.valid) {
        setConnectionError(validation.message || t("Invalid connection"))
        // Clear error message after 3 seconds
        setTimeout(() => setConnectionError(null), 3000)
        return
      }

      // Create a unique ID for the new edge
      const newEdgeId = `${params.source}-to-${params.target}-${Date.now()}`

      // Add the new edge with appropriate data
      const newEdge: Edge = {
        id: newEdgeId,
        source: params.source!,
        target: params.target!,
        sourceHandle: params.sourceHandle,
        targetHandle: params.targetHandle,
        type: "energyFlow",
        animated: true,
        data: {
          energyFlow: "input",
          active: true,
          wattage: "0W", // Default wattage
        },
      }

      setEdges((eds) => addEdge(newEdge, eds))

      // Update connection status for custom components
      if (params.source?.startsWith("custom-component-")) {
        updateCustomComponentConnectionStatus(params.source, true)
      }
      if (params.target?.startsWith("custom-component-")) {
        updateCustomComponentConnectionStatus(params.target, true)
      }

      // Update the system to reflect the new connection
      updateSystemAfterConnectionChange()

      // Show success feedback
      setConnectionError(t("Connection created successfully!"))
      setTimeout(() => setConnectionError(null), 2000)
    },
    [setEdges, t],
  )

  // Update custom component connection status
  const updateCustomComponentConnectionStatus = (id: string, isConnected: boolean) => {
    // Update in custom components state
    setCustomComponents((prev) => prev.map((comp) => (comp.id === id ? { ...comp, isConnected } : comp)))

    // Update in nodes
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              isConnected,
            },
          }
        }
        return node
      }),
    )
  }

  // Handle edge updates (dragging connection endpoints)
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      const validation = validateConnection(newConnection)

      if (!validation.valid) {
        setConnectionError(validation.message || t("Invalid connection"))
        // Clear error message after 3 seconds
        setTimeout(() => setConnectionError(null), 3000)
        return
      }

      setEdges((els) => updateEdge(oldEdge, newConnection, els))

      // Update the system to reflect the changed connection
      updateSystemAfterConnectionChange()
    },
    [setEdges, t],
  )

  // Handle edge removal (double-click)
  const onEdgeDoubleClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      try {
        // Prevent removing critical connections
        const criticalEdges = [
          "solar-to-controller",
          "controller-to-battery",
          "controller-to-inverter",
          "battery-to-inverter",
          "inverter-to-distribution",
        ]

        if (criticalEdges.includes(edge.id)) {
          setConnectionError(t("Cannot remove critical system connection"))
          setTimeout(() => setConnectionError(null), 3000)
          return
        }

        // Check if this edge connects to a custom component
        const sourceIsCustom = edge.source.startsWith("custom-component-")
        const targetIsCustom = edge.target.startsWith("custom-component-")

        // Remove the edge
        setEdges((eds) => eds.filter((e) => e.id !== edge.id))

        // Check if the custom component has any remaining connections
        if (sourceIsCustom) {
          const hasOtherConnections = edges.some(
            (e) => e.id !== edge.id && (e.source === edge.source || e.target === edge.source),
          )
          if (!hasOtherConnections) {
            updateCustomComponentConnectionStatus(edge.source, false)
          }
        }

        if (targetIsCustom) {
          const hasOtherConnections = edges.some(
            (e) => e.id !== edge.id && (e.source === edge.target || e.target === edge.target),
          )
          if (!hasOtherConnections) {
            updateCustomComponentConnectionStatus(edge.target, false)
          }
        }

        // Update the system to reflect the removed connection
        updateSystemAfterConnectionChange()

        // Show success message
        toast.success(t("Connection removed successfully"))
      } catch (error) {
        console.error("Error removing connection:", error)
        toast.error(t("Failed to remove connection"))
      }
    },
    [setEdges, edges, t],
  )

  // Optimize the updateSystemAfterConnectionChange function to use debouncing
  // Replace the existing function with this improved version
  const updateSystemAfterConnectionChange = useDebounce(() => {
    // Recalculate energy flows based on the new connections
    const activeDeviceConsumption = devices.reduce((total, device) => {
      return total + (device.on && inverterOn ? device.powerConsumption : 0)
    }, 0)

    // Calculate additional consumption from custom components
    const customComponentConsumption = customComponents.reduce((total, comp) => {
      return total + (comp.isActive && comp.type === "load" ? comp.outputValue || 0 : 0)
    }, 0)

    // Update total consumption
    const newTotalConsumption = activeDeviceConsumption + customComponentConsumption
    setTotalConsumption(newTotalConsumption)

    // Recalculate net power
    const net = solarProduction - newTotalConsumption
    setNetPower(net)
  }, 100)

  // Calculate weather multiplier based on weather condition
  const getWeatherMultiplier = () => {
    switch (weatherCondition) {
      case "sunny":
        return 1.0
      case "cloudy":
        return 0.6
      case "rainy":
        return 0.3
      default:
        return 1.0
    }
  }

  // Update total consumption based on active devices
  useEffect(() => {
    const total = devices.reduce((total, device) => {
      return total + (device.on ? device.powerConsumption : 0)
    }, 0)
    setTotalConsumption(total)
  }, [devices])

  // Update solar production based on intensity and weather
  useEffect(() => {
    const production = solarActive ? Math.round(sunIntensity * 1.5 * getWeatherMultiplier()) : 0
    setSolarProduction(production)
  }, [sunIntensity, weatherCondition, solarActive])

  // Update net power and energy flow
  useEffect(() => {
    const net = solarProduction - (inverterOn ? totalConsumption : 0)
    setNetPower(net)

    // Determine energy flow state
    if (net > 10) {
      setEnergyFlow("charging")
    } else if (net < -10) {
      setEnergyFlow("discharging")
    } else {
      setEnergyFlow("balanced")
    }
  }, [solarProduction, totalConsumption, inverterOn])

  // Update battery level based on net power
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel((prev) => {
        // Calculate new level based on net power
        let newLevel = prev + netPower / 500

        // Clamp between 0 and 100
        newLevel = Math.max(0, Math.min(100, newLevel))

        // Update system voltage based on battery level
        const newVoltage = 18 + (newLevel / 100) * 6
        setSystemVoltage(Number.parseFloat(newVoltage.toFixed(1)))

        return newLevel
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [netPower])

  // Update regions based on weather conditions
  useEffect(() => {
    const updateRegions = () => {
      setRegions((prev) =>
        prev.map((region) => {
          // Randomly adjust battery levels and status based on weather
          let batteryChange = 0

          if (weatherCondition === "sunny") {
            batteryChange = Math.random() * 0.5
          } else if (weatherCondition === "cloudy") {
            batteryChange = Math.random() * 0.2 - 0.1
          } else if (weatherCondition === "rainy") {
            batteryChange = -Math.random() * 0.3
          }

          const newBatteryLevel = Math.max(0, Math.min(100, region.batteryLevel + batteryChange))

          let newStatus: "active" | "warning" | "offline" = region.status
          if (newBatteryLevel < 20) {
            newStatus = "offline"
          } else if (newBatteryLevel < 40) {
            newStatus = "warning"
          } else {
            newStatus = "active"
          }

          // Calculate solar output based on weather
          const newSolarOutput =
            region.status === "offline" ? 0 : Math.round((40 + Math.random() * 100) * getWeatherMultiplier())

          return {
            ...region,
            batteryLevel: newBatteryLevel,
            status: newStatus,
            solarOutput: newSolarOutput,
          }
        }),
      )
    }

    // Update regions every 5 seconds
    const intervalId = setInterval(updateRegions, 5000)

    return () => clearInterval(intervalId)
  }, [weatherCondition])

  // Find the useEffect that updates nodes based on state changes
  // This effect is likely causing the infinite loop by updating too frequently

  // Replace this useEffect (around line 1100-1200):

  // With this optimized version that uses a ref to prevent excessive updates:
  const prevStateRef = useRef({
    sunIntensity,
    solarActive,
    batteryLevel,
    systemVoltage,
    inverterOn,
    totalConsumption,
    solarProduction,
    energyFlow,
    weatherCondition,
    breakerOn,
    overloadWarning,
    generatorOn,
    fuelLevel,
    controllerMode,
    environmentalTemp,
    sensorActive,
    ethiopiaConnected,
  })

  useEffect(() => {
    // Check if any relevant state has changed
    const prevState = prevStateRef.current
    const hasStateChanged =
      prevState.sunIntensity !== sunIntensity ||
      prevState.solarActive !== solarActive ||
      prevState.batteryLevel !== batteryLevel ||
      prevState.systemVoltage !== systemVoltage ||
      prevState.inverterOn !== inverterOn ||
      prevState.totalConsumption !== totalConsumption ||
      prevState.solarProduction !== solarProduction ||
      prevState.energyFlow !== energyFlow ||
      prevState.weatherCondition !== weatherCondition ||
      prevState.breakerOn !== breakerOn ||
      prevState.overloadWarning !== overloadWarning ||
      prevState.generatorOn !== generatorOn ||
      prevState.fuelLevel !== fuelLevel ||
      prevState.controllerMode !== controllerMode ||
      prevState.environmentalTemp !== environmentalTemp ||
      prevState.sensorActive !== sensorActive ||
      prevState.ethiopiaConnected !== ethiopiaConnected

    // Only update nodes if state has actually changed
    if (hasStateChanged) {
      // Create a new nodes array in a single update to avoid cascading updates
      const updatedNodes = nodes.map((node) => {
        const updatedNode = { ...node }

        if (node.id === "solar-panel") {
          updatedNode.data = {
            ...node.data,
            sunIntensity,
            solarActive,
            solarProduction,
          }
        } else if (node.id === "charge-controller") {
          updatedNode.data = {
            ...node.data,
            solarProduction,
            output: solarActive ? Math.max(0, solarProduction) : 0,
          }
        } else if (node.id === "battery") {
          updatedNode.data = {
            ...node.data,
            batteryLevel,
            systemVoltage,
            energyFlow,
          }
        } else if (node.id === "inverter") {
          updatedNode.data = {
            ...node.data,
            inverterOn,
            systemVoltage,
          }
        } else if (node.id === "distribution-panel") {
          updatedNode.data = {
            ...node.data,
            devices,
            totalConsumption,
            inverterOn,
            onToggleEthiopiaConnection: toggleEthiopiaConnection,
            ethiopiaConnected,
          }
        } else if (node.id === "system-status") {
          updatedNode.data = {
            ...node.data,
            solarProduction,
            batteryLevel,
            energyFlow,
            totalConsumption,
          }
        } else if (node.id === "ethiopia-map") {
          updatedNode.data = {
            ...node.data,
            regions,
            selectedRegion,
            isConnected: ethiopiaConnected,
          }
        } else if (node.id === "weather-controls") {
          updatedNode.data = {
            ...node.data,
            weatherCondition,
          }
        } else if (node.id === "regional-data" && selectedRegion) {
          updatedNode.data = {
            ...node.data,
            region: regions.find((r) => r.id === selectedRegion),
          }
        } else if (node.id === "breaker-panel") {
          updatedNode.data = {
            ...node.data,
            breakerOn,
            overloadWarning,
          }
        } else if (node.id === "backup-generator") {
          updatedNode.data = {
            ...node.data,
            generatorOn,
            fuelLevel,
          }
        } else if (node.id === "sensor-node") {
          // Add this debugging code where the Environmental Sensor component is initialized
          console.log("Creating Environmental Sensor with translation function")
          console.log("Current language:", language)
          console.log("Translation for 'Environmental Sensor':", t("Environmental Sensor"))
          updatedNode.data = {
            ...node.data,
            isActive: sensorActive,
            sunlightIntensity: sunIntensity,
            temperature: environmentalTemp,
          }
        } else if (node.id === "io-controller") {
          updatedNode.data = {
            ...node.data,
            mode: controllerMode,
            batteryLevel,
            solarProduction,
            loadDemand: totalConsumption,
          }
        } else if (node.id === "load-device") {
          updatedNode.data = {
            ...node.data,
            powerConsumption: 45, // This would be dynamic in a real implementation
          }
        } else if (node.id.startsWith("custom-component-")) {
          const component = customComponents.find((c) => c.id === node.id)
          if (component) {
            updatedNode.data = {
              ...node.data,
              label: component.label,
              componentType: component.type,
              isActive: component.isActive,
              outputValue: component.outputValue,
              isConnected: component.isConnected,
            }
          }
        }
        return updatedNode
      })

      // Update nodes in a single batch
      setNodes(updatedNodes)

      // Update the ref with current state values
      prevStateRef.current = {
        sunIntensity,
        solarActive,
        batteryLevel,
        systemVoltage,
        inverterOn,
        totalConsumption,
        solarProduction,
        energyFlow,
        weatherCondition,
        breakerOn,
        overloadWarning,
        generatorOn,
        fuelLevel,
        controllerMode,
        environmentalTemp,
        sensorActive,
        ethiopiaConnected,
      }
    }
  }, [
    sunIntensity,
    solarActive,
    batteryLevel,
    systemVoltage,
    inverterOn,
    devices,
    totalConsumption,
    solarProduction,
    energyFlow,
    regions,
    selectedRegion,
    weatherCondition,
    breakerOn,
    overloadWarning,
    generatorOn,
    fuelLevel,
    controllerMode,
    environmentalTemp,
    sensorActive,
    customComponents,
    ethiopiaConnected,
    nodes, // Add nodes to dependencies
    setNodes, // Add setNodes to dependencies
    language,
    t,
  ])

  // Update edges based on energy flow
  useEffect(() => {
    setEdges((eds) =>
      eds.map((edge) => {
        if (edge.id === "solar-to-controller") {
          return {
            ...edge,
            animated: solarActive && solarProduction > 0,
            data: {
              ...edge.data,
              active: solarActive && solarProduction > 0,
              wattage: `${solarProduction}W`, // Dynamic wattage based on actual production
            },
          }
        } else if (edge.id === "controller-to-battery") {
          return {
            ...edge,
            animated: solarActive && solarProduction > 0 && energyFlow === "charging",
            data: {
              ...edge.data,
              active: solarActive && solarProduction > 0 && energyFlow === "charging",
            },
          }
        } else if (edge.id === "controller-to-inverter") {
          return {
            ...edge,
            animated: solarActive && solarProduction > 0,
            data: {
              ...edge.data,
              active: solarActive && solarProduction > 0,
              wattage: `${solarProduction}W`, // Dynamic wattage based on actual production
            },
          }
        } else if (edge.id === "battery-to-inverter") {
          return {
            ...edge,
            animated: inverterOn && energyFlow === "discharging",
            data: {
              ...edge.data,
              active: inverterOn && energyFlow === "discharging",
            },
          }
        } else if (edge.id === "inverter-to-distribution") {
          return {
            ...edge,
            animated: inverterOn,
            data: {
              ...edge.data,
              active: inverterOn,
            },
          }
        } else if (edge.id === "breaker-to-controller") {
          return {
            ...edge,
            animated: breakerOn && solarActive,
            data: {
              ...edge.data,
              active: breakerOn && solarActive,
            },
          }
        } else if (edge.id === "generator-to-inverter") {
          return {
            ...edge,
            animated: generatorOn && inverterOn,
            data: {
              ...edge.data,
              active: generatorOn && inverterOn,
            },
          }
        } else if (edge.id === "sensor-to-controller") {
          return {
            ...edge,
            animated: sensorActive,
            data: {
              ...edge.data,
              active: sensorActive,
            },
          }
        } else if (edge.id === "io-to-breaker") {
          return {
            ...edge,
            animated: true,
            data: {
              ...edge.data,
              active: true,
            },
          }
        } else if (edge.id === "inverter-to-load") {
          return {
            ...edge,
            animated: inverterOn,
            data: {
              ...edge.data,
              active: inverterOn,
            },
          }
        } else if (edge.id === "distribution-to-ethiopia") {
          return {
            ...edge,
            animated: ethiopiaConnected && inverterOn,
            data: {
              ...edge.data,
              active: ethiopiaConnected && inverterOn,
            },
          }
        }
        return edge
      }),
    )
  }, [
    energyFlow,
    solarActive,
    solarProduction,
    inverterOn,
    setEdges,
    breakerOn,
    generatorOn,
    sensorActive,
    ethiopiaConnected,
  ])

  // Add effect to simulate generator fuel consumption
  useEffect(() => {
    if (!generatorOn) return

    const interval = setInterval(() => {
      setFuelLevel((prev) => {
        const newLevel = Math.max(0, prev - 0.2)

        // Auto-shutdown when fuel is depleted
        if (newLevel <= 0 && generatorOn) {
          setGeneratorOn(false)
        }

        return newLevel
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [generatorOn])

  // Add effect to simulate overload conditions
  useEffect(() => {
    // Simulate overload when consumption is too high
    const checkOverload = () => {
      const isOverloaded = totalConsumption > 150 && inverterOn
      setOverloadWarning(isOverloaded)

      // Auto trip breaker if severe overload
      if (totalConsumption > 200 && breakerOn) {
        setBreakerOn(false)
        setConnectionError(t("Safety breaker tripped due to overload!"))
        setTimeout(() => setConnectionError(null), 3000)
      }
    }

    checkOverload()

    const interval = setInterval(checkOverload, 5000)
    return () => clearInterval(interval)
  }, [totalConsumption, inverterOn, breakerOn, t])

  // Update custom component output values periodically
  useEffect(() => {
    if (customComponents.length === 0) return

    const interval = setInterval(() => {
      // Create a new array of updated components
      const updatedComponents = customComponents.map((comp) => {
        if (!comp.isActive) return comp

        // Calculate new output value based on component type
        let newValue = comp.outputValue || 0

        switch (comp.type) {
          case "display":
            // Display shows current solar production
            newValue = Math.round(solarProduction * 0.8)
            break
          case "sensor":
            // Sensors fluctuate slightly
            newValue = Math.round((comp.outputValue || 50) + (Math.random() * 10 - 5))
            break
          case "controller":
            // Controllers show system load percentage
            newValue = Math.round((totalConsumption / Math.max(1, solarProduction)) * 100)
            break
          default:
            // Other components fluctuate more randomly
            newValue = Math.round((comp.outputValue || 30) + (Math.random() * 20 - 10))
        }

        // Keep values in reasonable range
        newValue = Math.max(0, Math.min(999, newValue))

        return { ...comp, outputValue: newValue }
      })

      // Update state in a single batch
      setCustomComponents(updatedComponents)

      // Update nodes based on the new component values
      setNodes((nds) =>
        nds.map((node) => {
          if (!node.id.startsWith("custom-component-") || !node.data.isActive) return node

          const comp = updatedComponents.find((c) => c.id === node.id)
          if (!comp) return node

          return {
            ...node,
            data: {
              ...node.data,
              outputValue: comp.outputValue,
            },
          }
        }),
      )
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [customComponents, solarProduction, totalConsumption, setNodes])

  // Add this function inside the Flow component, before the return statement
  // Add this function near the other layout-related functions
  const handleShareLayout = () => {
    // Create a shareable URL with the current layout
    const shareableUrl = createShareableUrl(
      // Collect current node positions
      nodes.reduce(
        (layout, node) => {
          layout[node.id] = { x: node.position.x, y: node.position.y }
          return layout
        },
        {} as Record<string, { x: number; y: number }>,
      ),
    )

    // Copy to clipboard
    navigator.clipboard
      .writeText(shareableUrl)
      .then(() => {
        toast.success(t("Shareable URL copied to clipboard!"))
        setConnectionError(t("Layout URL copied to clipboard!"))
        setTimeout(() => setConnectionError(null), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy URL:", err)
        toast.error(t("Failed to copy URL to clipboard"))
      })
  }

  // Add this function inside the Flow component, before the return statement
  const handleNodeDragStop = useCallback(
    (event: React.MouseEvent, node: Node) => {
      // Always save the position, regardless of saveLayoutEnabled
      setSavedLayout((prev) => ({
        ...prev,
        [node.id]: { x: node.position.x, y: node.position.y },
      }))
    },
    [setSavedLayout],
  )

  // Add this effect after the other useEffect hooks
  useEffect(() => {
    if (!saveLayoutEnabled || Object.keys(savedLayout).length === 0) return

    // Apply saved positions to nodes
    setNodes((nds) =>
      nds.map((node) => {
        if (savedLayout[node.id]) {
          return {
            ...node,
            position: savedLayout[node.id],
          }
        }
        return node
      }),
    )
  }, [savedLayout, saveLayoutEnabled, setNodes])

  // Add a separate effect that runs only once on component mount to load saved layout
  useEffect(() => {
    // Always apply saved layout if available, regardless of saveLayoutEnabled setting
    if (Object.keys(savedLayout).length > 0) {
      // Apply saved positions to initial nodes
      const nodesWithSavedPositions = initialNodes.map((node) => {
        if (savedLayout[node.id]) {
          return {
            ...node,
            position: savedLayout[node.id],
          }
        }
        return node
      })

      setNodes(nodesWithSavedPositions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty dependency array ensures this runs only once on mount

  // Add a function to reset the saved layout
  const resetSavedLayout = useCallback(() => {
    setSavedLayout(defaultComponentLayout)
    // Reset nodes to their initial positions by re-initializing them
    setNodes(
      initialNodes.map((node) => ({
        ...node,
        position: defaultComponentLayout[node.id] || node.position,
      })),
    )
  }, [setSavedLayout, setNodes])

  // Weather effects overlay
  const WeatherEffects = () => {
    // Memoize the raindrops to prevent re-creation on every render
    const raindrops = useMemo(() => {
      if (weatherCondition !== "rainy") return []

      return Array.from({ length: 40 }).map((_, i) => ({
        left: `${Math.random() * 100}%`,
        height: `${10 + Math.random() * 20}px`,
        duration: `${0.5 + Math.random() * 1}s`,
        delay: `${Math.random() * 2}s`,
      }))
    }, [weatherCondition])

    return (
      <div
        className={cn(
          "absolute inset-0 pointer-events-none z-20 transition-opacity duration-1000",
          weatherCondition === "sunny"
            ? "opacity-0"
            : weatherCondition === "cloudy"
              ? "opacity-40 bg-slate-500/30"
              : "opacity-60",
        )}
      >
        {weatherCondition === "rainy" && (
          <div className="absolute inset-0 overflow-hidden">
            {raindrops.map((drop, i) => (
              <div
                key={i}
                className="absolute bg-blue-200/30 w-0.5 rounded-full animate-rainfall"
                style={{
                  left: drop.left,
                  top: `-20px`,
                  height: drop.height,
                  animationDuration: drop.duration,
                  animationDelay: drop.delay,
                }}
              ></div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Add a collision detection function to prevent overlaps
  const findNonOverlappingPosition = (existingNodes: any[], baseX: number, baseY: number) => {
    const nodeWidth = 200
    const nodeHeight = 200
    let x = baseX
    let y = baseY

    // Create a spatial grid for faster collision detection
    const grid: Record<string, boolean> = {}
    const cellSize = 100 // Size of each grid cell

    // Add existing nodes to the grid
    existingNodes.forEach((node) => {
      const startX = Math.floor(node.position.x / cellSize)
      const startY = Math.floor(node.position.y / cellSize)
      const endX = Math.floor((node.position.x + nodeWidth) / cellSize)
      const endY = Math.floor((node.position.y + nodeHeight) / cellSize)

      // Mark all cells covered by this node
      for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
          grid[`${i},${j}`] = true
        }
      }
    })

    // Find a non-overlapping position using the grid
    let attempts = 0
    const maxAttempts = 50
    let hasCollision = true

    while (hasCollision && attempts < maxAttempts) {
      hasCollision = false

      // Check if current position overlaps with any existing node
      const startX = Math.floor(x / cellSize)
      const startY = Math.floor(y / cellSize)
      const endX = Math.floor((x + nodeWidth) / cellSize)
      const endY = Math.floor((y + nodeHeight) / cellSize)

      // Check all cells that would be covered by the new node
      for (let i = startX; i <= endX; i++) {
        for (let j = startY; j <= endY; j++) {
          if (grid[`${i},${j}`]) {
            hasCollision = true
            break
          }
        }
        if (hasCollision) break
      }

      if (hasCollision) {
        // Try a new position with a spiral pattern
        const spiralStep = Math.floor(attempts / 4) + 1
        const spiralDirection = attempts % 4

        switch (spiralDirection) {
          case 0:
            x += cellSize * spiralStep
            break // Right
          case 1:
            y += cellSize * spiralStep
            break // Down
          case 2:
            x -= cellSize * spiralStep
            break // Left
          case 3:
            y -= cellSize * spiralStep
            break // Up
        }

        attempts++
      }
    }

    // If we couldn't find a non-overlapping position, use the last attempted position
    return { x, y }
  }

  // Add a function to initialize with a predefined layout if no saved layout exists
  const initializeDefaultLayout = useCallback(() => {
    // Only use default layout if no saved layout exists
    if (Object.keys(savedLayout).length === 0) {
      setSavedLayout(defaultComponentLayout)
    }
  }, [savedLayout, setSavedLayout])

  // Call the initialization function on component mount
  useEffect(() => {
    initializeDefaultLayout()
  }, [initializeDefaultLayout])

  // Add this new function after the initializeDefaultLayout function and before the return statement
  // This will help center the diagram whenever needed
  const centerFlowView = useCallback(() => {
    // This function will be called to center the view
    setTimeout(() => {
      if (reactFlowWrapper.current) {
        const instance = reactFlowWrapper.current.querySelector(".react-flow__viewport")
        if (instance) {
          // Force a fit view by dispatching a custom event
          const event = new CustomEvent("fitview")
          instance.dispatchEvent(event)
        }
      }
    }, 100)
  }, [])

  // Add this effect to ensure the diagram stays centered
  useEffect(() => {
    // Center the view on initial load
    centerFlowView()

    // Add a resize listener to recenter when window size changes
    const handleResize = () => {
      centerFlowView()
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [centerFlowView])

  // Add this function to handle manual centering
  const handleCenterView = () => {
    centerFlowView()
  }

  const [isSaving, setIsSaving] = useState(false)

  // Add this function to handle saving the layout to the project
  const handleSaveToProject = async () => {
    try {
      setIsSaving(true)

      // Collect current node positions
      const currentLayout: Record<string, { x: number; y: number }> = {}
      nodes.forEach((node) => {
        currentLayout[node.id] = { x: node.position.x, y: node.position.y }
      })

      // Save to server
      const result = await saveLayoutData(currentLayout)

      if (result.success) {
        // Update local storage to match
        setSavedLayout(currentLayout)
        localStorage.setItem("solar-system-layout", JSON.stringify(currentLayout))
        localStorage.setItem("solar-system-save-layout-enabled", "true")
        toast.success(t("Layout saved to project successfully!"))
      } else {
        toast.error(`${t("Failed to save layout")}: ${result.message}`)

        // Still save to localStorage as a fallback
        localStorage.setItem("solar-system-layout", JSON.stringify(currentLayout))
        toast.info(t("Layout saved locally as a backup"))
      }
    } catch (error) {
      console.error("Error saving layout to project:", error)
      toast.error(t("Failed to save layout to project"))

      try {
        // Attempt to save locally as a fallback
        const currentLayout: Record<string, { x: number; y: number }> = {}
        nodes.forEach((node) => {
          currentLayout[node.id] = { x: node.position.x, y: node.position.y }
        })
        localStorage.setItem("solar-system-layout", JSON.stringify(currentLayout))
        toast.info(t("Layout saved locally as a backup"))
      } catch (localError) {
        console.error("Failed to save layout locally:", localError)
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Add this function before the handleShareLayout function
  const mergeLayouts = (
    savedLayout: Record<string, { x: number; y: number }>,
    sharedLayout: Record<string, { x: number; y: number }>,
  ) => {
    // Create a new object to avoid mutating the original
    const mergedLayout = { ...savedLayout }

    // Add or update positions from shared layout
    Object.entries(sharedLayout).forEach(([nodeId, position]) => {
      mergedLayout[nodeId] = position
    })

    return mergedLayout
  }

  // Add a cleanup function for all intervals
  // Add this useEffect near the other cleanup effects
  useEffect(() => {
    // Store all interval IDs for cleanup
    const intervalIds: NodeJS.Timeout[] = []

    // Return cleanup function
    return () => {
      // Clear all intervals on component unmount
      intervalIds.forEach((id) => clearInterval(id))
    }
  }, [])

  // Update the initialization logic to ensure saved layout is always applied
  useEffect(() => {
    async function initializeLayout() {
      try {
        setIsLoading(true)

        // Check if there's a layout in the URL (only case where we override the default)
        const urlLayout = getLayoutFromUrl()

        if (urlLayout && Object.keys(urlLayout).length > 0) {
          console.log("Using layout from URL parameters")
          setInitialLayout(urlLayout)
          setIsSharedLayout(true)
        } else {
          // Always use the embedded default layout
          console.log("Using embedded default layout")
          setInitialLayout(defaultComponentLayout)
        }
      } catch (error) {
        console.error("Error during layout initialization:", error)
        // Fall back to the embedded default layout
        setInitialLayout(defaultComponentLayout)
      } finally {
        setIsLoading(false)
        setIsMounted(true)
      }
    }

    initializeLayout()
  }, [])

  // Add this effect to apply the layout when nodes change or when initialLayout is set
  useEffect(() => {
    if (!initialLayout || Object.keys(initialLayout).length === 0) return

    // Apply the layout to the nodes
    setNodes((nds) =>
      nds.map((node) => {
        if (initialLayout[node.id]) {
          return {
            ...node,
            position: initialLayout[node.id],
          }
        }
        return node
      }),
    )

    // Set saveLayoutEnabled to true to indicate we're using a saved layout
    setSaveLayoutEnabled(true)
  }, [initialLayout, setNodes])

  // Add a function to automatically save layout changes
  const autoSaveLayout = useDebounce(() => {
    if (!saveLayoutEnabled) return

    // Collect current node positions
    const currentLayout: Record<string, { x: number; y: number }> = {}
    nodes.forEach((node) => {
      currentLayout[node.id] = { x: node.position.x, y: node.position.y }
    })

    // Update local storage
    localStorage.setItem("solar-system-layout", JSON.stringify(currentLayout))
    setSavedLayout(currentLayout)

    // Optionally save to server (uncomment if you want auto-save to server)
    // handleSaveToProject();
  }, 2000) // Debounce for 2 seconds

  // Add this effect to auto-save when nodes change position
  useEffect(() => {
    if (isMounted && saveLayoutEnabled) {
      autoSaveLayout()
    }
  }, [nodes, saveLayoutEnabled, isMounted, autoSaveLayout])

  return (
    <div
      className="relative h-full w-full bg-gradient-to-b from-emerald-950 to-green-900 p-2 sm:p-3 md:p-4 overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.3)]"
      ref={reactFlowWrapper}
      onWheel={(e) => e.stopPropagation()} // Prevent wheel events from propagating
    >
      {/* Background pattern */}
      <EcoPattern className="opacity-5" type="waves" />
      <div className="absolute top-4 right-4 z-40">
        <LanguageSelector />
      </div>

      {/* Connection error/success message */}
      {connectionError && (
        <div
          className={cn(
            "fixed top-16 sm:top-20 left-1/2 transform -translate-x-1/2 z-50 px-3 sm:px-5 py-2 sm:py-3 rounded-lg shadow-xl text-white font-medium max-w-[90vw] sm:max-w-[80vw] md:max-w-[60vw] text-sm sm:text-base text-center",
            connectionError.includes("successfully")
              ? "bg-lime-600/90 border border-lime-500"
              : "bg-red-500/90 border border-red-400",
            "backdrop-blur-sm transition-all duration-300 animate-in fade-in",
          )}
        >
          {connectionError}
        </div>
      )}

      {/* Add Node Panel - only show if not in shared layout mode */}
      {!isSharedLayout && (
        <AddNodePanel
          onAddNode={handleAddCustomComponent}
          onAddSolarPanel={handleAddSolarPanel}
          onAddBattery={handleAddBattery}
          existingNodes={nodes}
          t={t} // Pass translation function
        />
      )}

      {/* Layout Controls - conditionally render based on shared layout mode */}
      {!isSharedLayout ? (
        <LayoutControls
          savedLayout={savedLayout}
          saveLayoutEnabled={saveLayoutEnabled}
          onSaveLayoutEnabledChange={setSaveLayoutEnabled}
          onResetLayout={resetSavedLayout}
          onSaveLayout={() => {
            // Save current node positions to layout
            const currentLayout: Record<string, { x: number; y: number }> = {}
            nodes.forEach((node) => {
              currentLayout[node.id] = { x: node.position.x, y: node.position.y }
            })
            setSavedLayout(currentLayout)
            setConnectionError(t("Layout saved successfully!"))
            setTimeout(() => setConnectionError(null), 2000)
          }}
          onShareLayout={handleShareLayout}
          t={t} // Pass translation function
        />
      ) : (
        <div
          className="absolute right-4 z-40 flex flex-col gap-2 bg-slate-800/80 backdrop-blur-sm border border-lime-600/20 rounded-md p-3"
          style={{ top: "5rem" }}
        >
          <button
            onClick={() => {
              // Save current layout to local storage
              const currentLayout: Record<string, { x: number; y: number }> = {}
              nodes.forEach((node) => {
                currentLayout[node.id] = { x: node.position.x, y: node.position.y }
              })
              setSavedLayout(currentLayout)
              localStorage.setItem("solar-system-save-layout-enabled", "true")
              setConnectionError(t("Layout saved to your account!"))
              setTimeout(() => setConnectionError(null), 2000)
              toast.success(t("Shared layout saved to your account"))
            }}
            className="text-xs bg-lime-600 hover:bg-lime-700 text-white px-3 py-1.5 rounded-md flex items-center gap-1"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {t("Save to My Layouts")}
          </button>
        </div>
      )}

      {/* React Flow canvas */}
      <div className="h-full w-full overflow-hidden flex flex-col">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeUpdate={onEdgeUpdate}
          onEdgeDoubleClick={onEdgeDoubleClick}
          onNodeDragStop={handleNodeDragStop}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{
            padding: 0.3,
            includeHiddenNodes: false,
            minZoom: 0.4,
            maxZoom: 1.5,
          }}
          minZoom={0.4}
          maxZoom={1.5}
          zoomOnScroll={false}
          panOnScroll={false}
          panOnDrag={true}
          preventScrolling={true}
          proOptions={{ hideAttribution: true }}
          connectionLineType={ConnectionLineType.SmoothStep}
          connectionLineStyle={{
            stroke: "#84cc16",
            strokeWidth: 3,
            strokeOpacity: 0.8,
            strokeDasharray: "0",
          }}
          deleteKeyCode={["Backspace", "Delete"]}
          snapToGrid={true}
          snapGrid={[20, 20]}
          className="h-full w-full rounded-lg overflow-hidden flex-grow"
          defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          nodesDraggable={!isSharedLayout}
          style={{ background: "rgba(0, 0, 0, 0.05)" }}
        >
          <Background color="#84cc16" gap={24} size={1.5} style={{ opacity: 0.4 }} variant="dots" />
          <div className="flex flex-col gap-1 absolute bottom-4 left-4 z-10">
            <Controls
              showInteractive={false}
              className="bg-slate-800/90 backdrop-blur-md border border-lime-600/30 rounded-lg shadow-xl p-1"
              style={{
                button: {
                  backgroundColor: "rgba(30, 41, 59, 0.9)",
                  color: "#84cc16",
                  border: "1px solid rgba(132, 204, 22, 0.3)",
                  borderRadius: "6px",
                  margin: "3px",
                  width: "1.75rem",
                  height: "1.75rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.2s ease",
                },
              }}
            />
            <div className="bg-slate-800/90 backdrop-blur-md border border-lime-600/30 rounded-lg shadow-xl p-1 flex items-center justify-center text-lime-400 text-xs font-mono w-[2.125rem] h-7">
              {Math.round(useStore((state) => state.transform?.[2] || 1) * 100)}%
            </div>
            <button
              onClick={handleCenterView}
              className="react-flow__controls-button flex items-center justify-center hover:bg-slate-700 transition-colors duration-200 bg-slate-800/90 text-lime-400 border border-lime-600/30 rounded-md shadow-md w-[1.75rem] h-[1.75rem]"
              aria-label="Center View"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82 12.75 12.75 0 0 0 0 3.59A1.63 1.63 0 0 1 21 21.03"></path>
                <path d="M2.6 15a1.65 1.65 0 0 1-.33 1.82 12.75 12.75 0 0 1 0 3.59A1.63 1.63 0 0 0 3 21.03"></path>
                <path d="M16.6 8a1.64 1.64 0 0 0-.33-1.82 12.75 12.75 0 0 0 0-3.59A1.63 1.63 0 0 1 15 3.03"></path>
                <path d="M7.4 8a1.64 1.64 0 0 1 .33-1.82 12.75 12.75 0 0 0 0-3.59A1.63 1.63 0 0 0 3 3.03"></path>
              </svg>
            </button>
          </div>
        </ReactFlow>
      </div>

      {/* Render the customization panel */}
      <CustomizationPanel />

      {/* Weather overlay effects */}
      <WeatherEffects />
    </div>
  )
}
