"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type BaseComponentSettings, getDefaultSettingsForType } from "./component-settings-types"

// Define the context shape
interface ComponentSettingsContextType {
  settings: Record<string, BaseComponentSettings>
  updateSettings: (componentId: string, newSettings: Partial<BaseComponentSettings>) => void
  resetSettings: (componentId: string) => void
  selectedComponentId: string | null
  setSelectedComponentId: (id: string | null) => void
}

// Create the context with default values
const ComponentSettingsContext = createContext<ComponentSettingsContextType>({
  settings: {},
  updateSettings: () => {},
  resetSettings: () => {},
  selectedComponentId: null,
  setSelectedComponentId: () => {},
})

// Provider component
export function ComponentSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Record<string, BaseComponentSettings>>({})
  const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null)

  // Load settings from localStorage on initial render
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("component-settings")
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings))
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage:", error)
    }
  }, [])

  // Save settings to localStorage when they change
  useEffect(() => {
    if (Object.keys(settings).length > 0) {
      try {
        localStorage.setItem("component-settings", JSON.stringify(settings))
      } catch (error) {
        console.error("Failed to save settings to localStorage:", error)
      }
    }
  }, [settings])

  // Update settings for a specific component
  const updateSettings = (componentId: string, newSettings: Partial<BaseComponentSettings>) => {
    setSettings((prev) => {
      // Get existing settings or default settings if none exist
      const existingSettings = prev[componentId] || getDefaultSettingsForType(newSettings.type || "unknown")

      // Merge existing settings with new settings
      return {
        ...prev,
        [componentId]: {
          ...existingSettings,
          ...newSettings,
        },
      }
    })
  }

  // Reset settings for a specific component to defaults
  const resetSettings = (componentId: string) => {
    setSettings((prev) => {
      const componentType = prev[componentId]?.type || "unknown"
      return {
        ...prev,
        [componentId]: getDefaultSettingsForType(componentType),
      }
    })
  }

  return (
    <ComponentSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        resetSettings,
        selectedComponentId,
        setSelectedComponentId,
      }}
    >
      {children}
    </ComponentSettingsContext.Provider>
  )
}

// Custom hook for using component settings
export function useComponentSettings(componentId: string, componentType: string) {
  const { settings, updateSettings, resetSettings } = useContext(ComponentSettingsContext)

  // Get settings for this component, or use defaults if none exist
  const componentSettings = settings[componentId] || getDefaultSettingsForType(componentType)

  // Function to update this component's settings
  const updateComponentSettings = (newSettings: Partial<BaseComponentSettings>) => {
    updateSettings(componentId, { ...newSettings, type: componentType })
  }

  // Function to reset this component's settings
  const resetComponentSettings = () => {
    resetSettings(componentId)
  }

  return {
    settings: componentSettings,
    updateSettings: updateComponentSettings,
    resetSettings: resetComponentSettings,
  }
}

// Hook for accessing the selected component
export function useSelectedComponent() {
  const { selectedComponentId, setSelectedComponentId } = useContext(ComponentSettingsContext)
  return { selectedComponentId, setSelectedComponentId }
}
