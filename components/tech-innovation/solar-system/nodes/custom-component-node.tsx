"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Handle, Position, type NodeProps } from "reactflow"
import { Edit2, Check, X, ChevronDown, AlertTriangle, Info, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface CustomComponentData {
  label: string
  onLabelChange: (newLabel: string) => void
  componentType: string
  onComponentTypeChange?: (newType: string) => void
  isActive?: boolean
  onToggleActive?: (active: boolean) => void
  outputValue?: number
  onOutputChange?: (value: number) => void
  connectionSuggestions?: string[]
  isConnected?: boolean
  onRemove?: (id: string) => void
}

function CustomComponentNode({ id, data, selected }: NodeProps<CustomComponentData>) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedLabel, setEditedLabel] = useState(data.label)
  const [showTypeMenu, setShowTypeMenu] = useState(false)
  const [isActive, setIsActive] = useState(data.isActive ?? false)
  const [showTooltip, setShowTooltip] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Component type options with descriptions
  const componentTypes = [
    { id: "sensor", label: "Sensor", description: "Monitors environmental conditions" },
    { id: "controller", label: "Controller", description: "Manages system operations" },
    { id: "display", label: "Display", description: "Shows system information" },
    { id: "connector", label: "Connector", description: "Links system components" },
    { id: "breaker", label: "Breaker Panel", description: "Safety and circuit protection" },
    { id: "monitor", label: "System Monitor", description: "Displays performance metrics" },
    { id: "backup", label: "Backup Generator", description: "Alternative power source" },
    { id: "load", label: "Load Device", description: "Power-consuming appliance" },
  ]

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowTypeMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Update local state when props change
  useEffect(() => {
    setIsActive(data.isActive ?? false)
  }, [data.isActive])

  const handleStartEditing = () => {
    setIsEditing(true)
  }

  const handleSaveLabel = () => {
    if (editedLabel.trim()) {
      data.onLabelChange(editedLabel)
    } else {
      setEditedLabel(data.label) // Reset to original if empty
    }
    setIsEditing(false)
  }

  const handleCancelEditing = () => {
    setEditedLabel(data.label)
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveLabel()
    } else if (e.key === "Escape") {
      handleCancelEditing()
    }
  }

  const handleTypeChange = (type: string) => {
    if (data.onComponentTypeChange) {
      data.onComponentTypeChange(type)
    }
    setShowTypeMenu(false)
  }

  const handleToggleActive = () => {
    const newActiveState = !isActive
    setIsActive(newActiveState)
    if (data.onToggleActive) {
      data.onToggleActive(newActiveState)
    }
  }

  // Get icon color based on component type
  const getTypeColor = () => {
    switch (data.componentType) {
      case "sensor":
        return "text-blue-400"
      case "controller":
        return "text-purple-400"
      case "display":
        return "text-yellow-400"
      case "connector":
        return "text-lime-400"
      case "breaker":
        return "text-red-400"
      case "monitor":
        return "text-cyan-400"
      case "backup":
        return "text-orange-400"
      case "load":
        return "text-pink-400"
      default:
        return "text-lime-400"
    }
  }

  // Get component-specific output value
  const getOutputValue = () => {
    if (data.outputValue !== undefined) {
      return data.outputValue
    }

    switch (data.componentType) {
      case "sensor":
        return isActive ? Math.round(Math.random() * 100) : 0
      case "controller":
        return isActive ? 1 : 0
      case "display":
        return data.outputValue ?? 0
      case "backup":
        return isActive ? Math.round(50 + Math.random() * 50) : 0
      case "load":
        return isActive ? Math.round(20 + Math.random() * 80) : 0
      default:
        return 0
    }
  }

  // Get component-specific output label
  const getOutputLabel = () => {
    switch (data.componentType) {
      case "sensor":
        return "Sunlight %"
      case "controller":
        return "Status"
      case "display":
        return "Display"
      case "backup":
        return "Output (W)"
      case "load":
        return "Usage (W)"
      default:
        return "Value"
    }
  }

  // Get connection suggestions based on component type
  const getConnectionSuggestions = () => {
    if (data.connectionSuggestions && data.connectionSuggestions.length > 0) {
      return data.connectionSuggestions
    }

    switch (data.componentType) {
      case "sensor":
        return ["Charge Controller", "System Monitor", "Controller"]
      case "controller":
        return ["Battery Bank", "Load Device", "Breaker Panel"]
      case "display":
        return ["System Monitor", "Battery", "Controller"]
      case "connector":
        return ["Any component"]
      case "breaker":
        return ["Inverter", "Load Device"]
      case "monitor":
        return ["Sensor", "Battery", "Load Device"]
      case "backup":
        return ["Inverter", "Charge Controller"]
      case "load":
        return ["Inverter", "Breaker Panel"]
      default:
        return ["Any component"]
    }
  }

  return (
    <TooltipProvider>
      <div className={cn("transition-all duration-300 transform", selected ? "scale-105" : "")}>
        {/* Top handle */}
        <Handle
          type="target"
          position={Position.Top}
          id="input-top"
          style={{ background: "#ef4444", width: "10px", height: "10px" }}
          isConnectable={true}
        />

        {/* Left handle */}
        <Handle
          type="target"
          position={Position.Left}
          id="input-left"
          style={{ background: "#ef4444", width: "10px", height: "10px" }}
          isConnectable={true}
        />

        <div
          className={cn(
            "w-40 min-h-[100px] bg-slate-800/80 backdrop-blur-sm rounded-md shadow-md border-2 p-3 flex flex-col items-center justify-center transition-all",
            selected ? "border-lime-400" : isActive ? "border-green-500" : "border-slate-600",
            isEditing ? "ring-2 ring-lime-500" : "",
            !data.isConnected && "ring-1 ring-yellow-500 ring-opacity-50",
          )}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {/* Remove button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              if (typeof window !== "undefined" && window.confirm("Remove this component?")) {
                // Call the onRemove function if provided in props
                if (data.onRemove) {
                  data.onRemove(id)
                }
              }
            }}
            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 z-10 transition-colors"
            aria-label="Remove component"
          >
            <Trash2 size={12} />
          </button>

          {/* Component icon or visual representation */}
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center mb-2",
              isActive ? "bg-green-600/30" : "bg-slate-700/50",
            )}
          >
            <span className={cn("text-lg font-bold", isActive ? getTypeColor() : "text-slate-400")}>
              {data.componentType.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* Editable label */}
          {isEditing ? (
            <div className="flex items-center space-x-1">
              <label htmlFor="component-label" className="block text-xs text-slate-300 mb-1">
                Component Label
              </label>
              <input
                id="component-label"
                ref={inputRef}
                type="text"
                value={editedLabel}
                onChange={(e) => setEditedLabel(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full px-3 py-2 bg-slate-700/80 border border-slate-600 rounded-md text-white text-xs focus:outline-none focus:ring-1 focus:ring-lime-500"
                placeholder="Enter label..."
                autoFocus
              />
              <p className="text-slate-400 text-xs mt-1">This label will be displayed on the component</p>
              <button
                onClick={handleSaveLabel}
                className="text-lime-400 hover:text-lime-300 p-1"
                aria-label="Save label"
              >
                <Check size={14} />
              </button>
              <button
                onClick={handleCancelEditing}
                className="text-red-400 hover:text-red-300 p-1"
                aria-label="Cancel editing"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <span className="text-white text-sm font-medium">{data.label}</span>
              <button
                onClick={handleStartEditing}
                className="text-slate-400 hover:text-white p-1 opacity-50 hover:opacity-100 transition-opacity"
                aria-label="Edit label"
              >
                <Edit2 size={12} />
              </button>
            </div>
          )}

          {/* Component type selector - only show if not connected */}
          {!data.isConnected && (
            <div className="mt-2 relative w-full">
              <button
                onClick={() => setShowTypeMenu(!showTypeMenu)}
                className="flex items-center justify-between w-full text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 px-2 py-1 rounded transition-colors"
              >
                <span>{data.componentType}</span>
                <ChevronDown size={12} className={showTypeMenu ? "transform rotate-180" : ""} />
              </button>

              {showTypeMenu && (
                <div
                  ref={menuRef}
                  className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded shadow-lg z-50 max-h-32 overflow-y-auto"
                >
                  {componentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeChange(type.id)}
                      className={cn(
                        "block w-full text-left px-2 py-1 text-xs hover:bg-slate-700 transition-colors",
                        data.componentType === type.id ? "bg-slate-700 text-white" : "text-slate-300",
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* When connected, show component type as static text instead of dropdown */}
          {data.isConnected && (
            <div className="mt-2 w-full">
              <div className="text-xs bg-slate-700/50 px-2 py-1 rounded text-slate-300">
                <span className="font-medium">{data.componentType}</span>
              </div>
            </div>
          )}

          {/* Component activation toggle */}
          <div className="mt-3 flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={handleToggleActive} className="sr-only peer" />
              <div className="relative w-9 h-5 bg-slate-700 peer-focus:outline-none peer-focus:ring-1 peer-focus:ring-lime-500 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
              <span className="ms-2 text-xs font-medium text-slate-300">{isActive ? "Active" : "Inactive"}</span>
            </label>
          </div>

          {/* Component output value */}
          {isActive && (
            <div className="mt-2 w-full bg-slate-700/50 rounded p-1 text-center">
              <div className="text-xs text-slate-400">{getOutputLabel()}</div>
              <div className="text-sm font-medium text-white">
                {typeof data.outputValue !== "undefined" ? data.outputValue : getOutputValue()}
              </div>
            </div>
          )}

          {/* Connection status indicator */}
          {!data.isConnected && (
            <div className="absolute -top-1 -right-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-yellow-500 rounded-full p-1">
                    <AlertTriangle className="h-3 w-3 text-black" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">Unlinked Component</p>
                </TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Connection suggestions tooltip */}
          {showTooltip && !data.isConnected && (
            <div className="absolute -bottom-16 left-0 right-0 bg-slate-800 border border-slate-700 rounded p-2 shadow-lg z-50">
              <div className="flex items-center text-xs text-slate-300">
                <Info className="h-3 w-3 mr-1 text-blue-400" />
                <span>Connect to: {getConnectionSuggestions().join(", ")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Right handle */}
        <Handle
          type="source"
          position={Position.Right}
          id="output-right"
          style={{ background: "#22c55e", width: "10px", height: "10px" }}
          isConnectable={true}
        />

        {/* Bottom handle */}
        <Handle
          type="source"
          position={Position.Bottom}
          id="output-bottom"
          style={{ background: "#22c55e", width: "10px", height: "10px" }}
          isConnectable={true}
        />
      </div>
    </TooltipProvider>
  )
}

export default CustomComponentNode
