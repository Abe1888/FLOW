// Component settings types for the solar system simulation

// Base interface for all component settings
export interface BaseComponentSettings {
  id: string
  name: string
  type: string
}

// Backup Generator specific settings
export interface BackupGeneratorSettings extends BaseComponentSettings {
  // Container customization
  containerSize: { width: number; height: number }
  containerStyle: {
    backgroundColor: string
    gradientStart: string
    gradientEnd: string
    borderColor: string
    activeColor: string // Color when generator is on
    inactiveColor: string // Color when generator is off
    borderWidth: number
    borderRadius: number
    shadow: "none" | "sm" | "md" | "lg"
  }

  // Element customization
  panelStyle: {
    backgroundColor: string
    borderColor: string
    textColor: string
    accentColor: string // For gauges and indicators
    fontSize: number
  }

  // Simulation parameters
  simulationParams: {
    maxOutputWattage: number
    maxRPM: number
    fuelConsumptionRate: number
    heatGenerationRate: number
    coolingRate: number
    startupTime: number // Time to reach max RPM in seconds
    shutdownTime: number // Time to cool down in seconds
  }

  // Animation settings
  animations: {
    enableSmoke: boolean
    smokeOpacity: number
    smokeDensity: number
    enableFanRotation: boolean
    fanRotationSpeed: number
    enableVibration: boolean
    vibrationIntensity: number
    enableHeatShimmer: boolean
  }

  // Display options
  displayOptions: {
    showOutputWattage: boolean
    showRuntime: boolean
    showRPM: boolean
    showTemperature: boolean
    showOilPressure: boolean
    showFuelLevel: boolean
  }
}

// Default settings for Backup Generator
export const defaultBackupGeneratorSettings: BackupGeneratorSettings = {
  id: "backup-generator",
  name: "Backup Generator",
  type: "backupGenerator",
  containerSize: { width: 18, height: 30 },
  containerStyle: {
    backgroundColor: "",
    gradientStart: "#334155", // slate-700
    gradientEnd: "#1e293b", // slate-800
    borderColor: "",
    activeColor: "#f97316", // orange-500
    inactiveColor: "#475569", // slate-600
    borderWidth: 2,
    borderRadius: 6,
    shadow: "md",
  },
  panelStyle: {
    backgroundColor: "#0f172a", // slate-900
    borderColor: "#334155", // slate-700
    textColor: "#f8fafc", // slate-50
    accentColor: "#f97316", // orange-500
    fontSize: 12,
  },
  simulationParams: {
    maxOutputWattage: 1000,
    maxRPM: 3600,
    fuelConsumptionRate: 0.2, // % per second when running
    heatGenerationRate: 5, // °C per second when starting
    coolingRate: 3, // °C per second when cooling
    startupTime: 3, // seconds to reach max RPM
    shutdownTime: 5, // seconds to cool down
  },
  animations: {
    enableSmoke: true,
    smokeOpacity: 0.4,
    smokeDensity: 10, // Number of particles
    enableFanRotation: true,
    fanRotationSpeed: 1, // Multiplier
    enableVibration: true,
    vibrationIntensity: 1, // Multiplier
    enableHeatShimmer: true,
  },
  displayOptions: {
    showOutputWattage: true,
    showRuntime: true,
    showRPM: true,
    showTemperature: true,
    showOilPressure: true,
    showFuelLevel: true,
  },
}

// Distribution Panel specific settings
export interface DistributionPanelSettings extends BaseComponentSettings {
  // Container customization
  containerSize: { width: number; height: number }
  containerStyle: {
    backgroundColor: string
    gradientStart: string
    gradientEnd: string
    borderColor: string
    activeColor: string // Color when panel is active
    inactiveColor: string // Color when panel is inactive
    overloadColor: string // Color when panel is overloaded
    borderWidth: number
    borderRadius: number
    shadow: "none" | "sm" | "md" | "lg"
  }

  // Element customization
  panelStyle: {
    backgroundColor: string
    borderColor: string
    textColor: string
    accentColor: string // For indicators and highlights
    fontSize: number
  }

  // Device display options
  deviceStyle: {
    activeBackgroundColor: string
    inactiveBackgroundColor: string
    activeBorderColor: string
    inactiveBorderColor: string
    textColor: string
    iconColor: string
    powerTextColor: string
  }

  // Power flow visualization
  powerFlow: {
    enableFlowAnimation: boolean
    flowAnimationSpeed: number
    flowColor: string
    flowOpacity: number
    flowWidth: number
  }

  // Load meter settings
  loadMeter: {
    normalColor: string
    warningColor: string
    criticalColor: string
    warningThreshold: number
    criticalThreshold: number
    enableGradient: boolean
    enableShimmer: boolean
  }

  // Display options
  displayOptions: {
    showLoadMeter: boolean
    showPowerConsumption: boolean
    showDeviceStatus: boolean
    showGridConnection: boolean
    showCircuitLabels: boolean
  }
}

// Default settings for Distribution Panel
export const defaultDistributionPanelSettings: DistributionPanelSettings = {
  id: "distribution-panel",
  name: "Distribution Panel",
  type: "distributionPanel",
  containerSize: { width: 25, height: 28 }, // Updated height from 22 to 28
  containerStyle: {
    backgroundColor: "",
    gradientStart: "#334155", // slate-700
    gradientEnd: "#1e293b", // slate-800
    borderColor: "#475569", // slate-600
    activeColor: "#84cc16", // lime-500
    inactiveColor: "#475569", // slate-600
    overloadColor: "#ef4444", // red-500
    borderWidth: 2,
    borderRadius: 6,
    shadow: "md",
  },
  panelStyle: {
    backgroundColor: "#0f172a", // slate-900
    borderColor: "#334155", // slate-700
    textColor: "#f8fafc", // slate-50
    accentColor: "#84cc16", // lime-500
    fontSize: 12,
  },
  deviceStyle: {
    activeBackgroundColor: "#1e293b", // slate-800
    inactiveBackgroundColor: "#0f172a", // slate-900
    activeBorderColor: "#84cc16", // lime-500
    inactiveBorderColor: "#334155", // slate-700
    textColor: "#f8fafc", // slate-50
    iconColor: "#84cc16", // lime-500
    powerTextColor: "#f8fafc", // slate-50
  },
  powerFlow: {
    enableFlowAnimation: true,
    flowAnimationSpeed: 1.5,
    flowColor: "#84cc16", // lime-500
    flowOpacity: 0.6,
    flowWidth: 2,
  },
  loadMeter: {
    normalColor: "#84cc16", // lime-500
    warningColor: "#facc15", // yellow-500
    criticalColor: "#ef4444", // red-500
    warningThreshold: 60,
    criticalThreshold: 80,
    enableGradient: true,
    enableShimmer: true,
  },
  displayOptions: {
    showLoadMeter: true,
    showPowerConsumption: true,
    showDeviceStatus: true,
    showGridConnection: true,
    showCircuitLabels: true,
  },
}

// Add interfaces for other components as needed
// For example:
export interface SolarPanelSettings extends BaseComponentSettings {
  // Solar panel specific settings
  // ...
}

// Map component types to their default settings
export const getDefaultSettingsForType = (type: string): BaseComponentSettings => {
  switch (type) {
    case "backupGenerator":
      return { ...defaultBackupGeneratorSettings }
    case "distributionPanel":
      return { ...defaultDistributionPanelSettings }
    // Add cases for other component types
    default:
      return {
        id: "unknown",
        name: "Unknown Component",
        type: "unknown",
      }
  }
}
