"use client"
import { useState } from "react"
import { Plus, X, Check, ChevronDown, ChevronUp, Battery, Sun, Zap, Cpu, Shield, Gauge } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import Image from "next/image"

interface AddNodePanelProps {
  onAddNode: (type: string, label: string) => void
  onAddSolarPanel?: () => void
  onAddBattery?: () => void
  existingNodes?: any[] // Add existingNodes prop
  t: (key: string) => string // Add translation function
}

// Organize node types into categories for better organization
const NODE_CATEGORIES = [
  {
    id: "power",
    nameKey: "Power Components",
    types: [
      {
        id: "sensor",
        labelKey: "Sensor",
        descriptionKey: "Monitors environmental conditions",
        icon: <Gauge className="h-3 w-3" />,
      },
      {
        id: "controller",
        labelKey: "Controller",
        descriptionKey: "Manages system operations",
        icon: <Cpu className="h-3 w-3" />,
      },
      {
        id: "breaker",
        labelKey: "Breaker Panel",
        descriptionKey: "Safety and circuit protection",
        icon: <Shield className="h-3 w-3" />,
      },
      {
        id: "backup",
        labelKey: "Backup Generator",
        descriptionKey: "Alternative power source",
        icon: <Zap className="h-3 w-3" />,
      },
      {
        id: "load",
        labelKey: "Load Device",
        descriptionKey: "Power-consuming appliance",
        icon: <Zap className="h-3 w-3" />,
      },
    ],
  },
  {
    id: "monitoring",
    nameKey: "Monitoring Components",
    types: [
      {
        id: "display",
        labelKey: "Display",
        descriptionKey: "Shows system information",
        icon: <Cpu className="h-3 w-3" />,
      },
      {
        id: "monitor",
        labelKey: "System Monitor",
        descriptionKey: "Displays performance metrics",
        icon: <Gauge className="h-3 w-3" />,
      },
    ],
  },
  {
    id: "utility",
    nameKey: "Utility Components",
    types: [
      {
        id: "connector",
        labelKey: "Connector",
        descriptionKey: "Links system components",
        icon: <Zap className="h-3 w-3" />,
      },
    ],
  },
]

// Flatten the categories for backward compatibility
const NODE_TYPES = NODE_CATEGORIES.flatMap((category) => category.types)

export function AddNodePanel({ onAddNode, onAddSolarPanel, onAddBattery, existingNodes = [], t }: AddNodePanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [customLabel, setCustomLabel] = useState("")
  const [showSpecialOptions, setShowSpecialOptions] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>("power")
  const [showCustomComponentForm, setShowCustomComponentForm] = useState(false)
  const [componentType, setComponentType] = useState("")
  const [componentName, setComponentName] = useState("")

  // Add this function inside the AddNodePanel component, before the return statement
  const findNonOverlappingPosition = (existingNodes: any[], baseX: number, baseY: number) => {
    const nodeWidth = 200
    const nodeHeight = 200
    let x = baseX
    let y = baseY
    let hasCollision = true
    let attempts = 0

    while (hasCollision && attempts < 20) {
      hasCollision = false

      for (const node of existingNodes) {
        if (
          x < node.position.x + nodeWidth &&
          x + nodeWidth > node.position.x &&
          y < node.position.y + nodeHeight &&
          y + nodeHeight > node.position.y
        ) {
          // Collision detected, adjust position
          x += 50
          y += 50
          hasCollision = true
          attempts++
          break
        }
      }
    }

    return { x, y }
  }

  // Then modify the handleAddNode function to use this:
  const handleAddNode = (type: string) => {
    setSelectedType(type)
    setCustomLabel(NODE_CATEGORIES.flatMap((cat) => cat.types).find((t) => t.id === type)?.labelKey || "")
  }

  const handleConfirmAdd = () => {
    if (selectedType && customLabel.trim()) {
      // Find a non-overlapping position for the new node
      const defaultX = 100 // Initial X position
      const defaultY = 100 // Initial Y position
      const { x, y } = findNonOverlappingPosition(existingNodes || [], defaultX, defaultY)

      onAddNode(selectedType, customLabel)
      resetForm()
    }
  }

  const handleAddSolarPanel = () => {
    if (onAddSolarPanel) {
      onAddSolarPanel()
      resetForm()
    }
  }

  const handleAddBattery = () => {
    if (onAddBattery) {
      onAddBattery()
      resetForm()
    }
  }

  const handleAddComponent = () => {
    if (componentType && componentName) {
      onAddNode(componentType, componentName)
      setComponentType("")
      setComponentName("")
      setShowCustomComponentForm(false)
      resetForm()
    }
  }

  const resetForm = () => {
    setSelectedType(null)
    setCustomLabel("")
    setIsOpen(false)
    setShowSpecialOptions(false)
  }

  return (
    <TooltipProvider>
      <div className="fixed left-3 sm:left-4 md:left-5 top-32 sm:top-36 md:top-40 z-40">
        {!isOpen ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsOpen(true)}
                className="bg-slate-800/80 hover:bg-slate-700/80 text-lime-400 dark:text-emerald-400 rounded-lg p-1.5 sm:p-2 shadow-lg transition-all duration-200 hover:scale-105 border border-lime-600/20 dark:border-emerald-600/20"
                aria-label={t("Add Component")}
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p className="text-sm">{t("Add Component")}</p>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="bg-slate-800/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg border border-lime-600/20 dark:border-emerald-600/20 shadow-lg p-3 sm:p-4 w-[16rem] sm:w-64 animate-in fade-in duration-200 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-3 border-b border-slate-700/50 pb-2">
              <div className="flex items-center gap-2">
                <Image
                  src="/images/grean-world-logo.png"
                  alt="GREAN WORLD"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                <h3 className="text-white font-medium text-sm">{t("Add Component")}</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label={t("Close panel")}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {!selectedType ? (
              <>
                {/* Category tabs */}
                <div className="flex flex-wrap gap-1 mb-3 border-b border-slate-700/50 pb-2">
                  {NODE_CATEGORIES.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={cn(
                        "text-[0.65rem] sm:text-xs px-1.5 sm:px-2 py-1 rounded-md transition-colors",
                        activeCategory === category.id
                          ? "bg-lime-600/20 dark:bg-emerald-600/20 text-lime-400 dark:text-emerald-400"
                          : "bg-slate-700/30 text-slate-300 hover:bg-slate-700/50",
                      )}
                      aria-pressed={activeCategory === category.id}
                    >
                      {t(category.nameKey)}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5 mb-3 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                  {NODE_CATEGORIES.find((cat) => cat.id === activeCategory)?.types.map((type) => (
                    <Tooltip key={type.id}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => handleAddNode(type.id)}
                          className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-md bg-slate-700/50 hover:bg-slate-700 text-white text-[0.65rem] sm:text-xs transition-colors flex justify-between items-center group"
                          aria-label={t(type.labelKey)}
                        >
                          <div className="flex items-center">
                            <span className="bg-slate-600/80 p-0.5 sm:p-1 rounded-full mr-1.5 sm:mr-2 group-hover:bg-lime-600/30 dark:group-hover:bg-emerald-600/30 transition-colors">
                              {type.icon}
                            </span>
                            <span className="truncate">{t(type.labelKey)}</span>
                          </div>
                          <span className="bg-slate-600 group-hover:bg-lime-600 dark:group-hover:bg-emerald-600 rounded-full p-0.5 sm:p-1 transition-colors flex-shrink-0 ml-1">
                            <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p className="text-sm">{t(type.descriptionKey)}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-700/50">
                  <button
                    onClick={() => setShowSpecialOptions(!showSpecialOptions)}
                    className="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 rounded-md bg-slate-700/50 hover:bg-slate-700 text-white text-[0.65rem] sm:text-xs transition-colors flex justify-between items-center"
                    aria-expanded={showSpecialOptions}
                    aria-controls="special-options"
                  >
                    <span className="font-medium">{t("Special Components")}</span>
                    {showSpecialOptions ? (
                      <ChevronUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-lime-400 dark:text-emerald-400" />
                    ) : (
                      <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-lime-400 dark:text-emerald-400" />
                    )}
                  </button>

                  {showSpecialOptions && (
                    <div
                      id="special-options"
                      className="mt-2 space-y-1.5 pl-2 border-l-2 border-lime-600/30 dark:border-emerald-600/30"
                    >
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={handleAddSolarPanel}
                            className="w-full text-left px-3 py-2 rounded-md bg-blue-900/30 hover:bg-blue-900/50 text-white text-xs transition-colors flex items-center justify-between"
                            aria-label={t("Add Solar Panel")}
                          >
                            <div className="flex items-center">
                              <Sun className="h-3 w-3 text-blue-400 mr-2" />
                              <span>{t("Solar Panel")}</span>
                            </div>
                            <span className="bg-blue-800/50 rounded-full p-1">
                              <Plus className="h-3 w-3 text-white" />
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="text-sm">{t("Add a new solar panel with automatic connections")}</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={handleAddBattery}
                            className="w-full text-left px-3 py-2 rounded-md bg-green-900/30 hover:bg-green-900/50 text-white text-xs transition-colors flex items-center justify-between"
                            aria-label={t("Add Battery Bank")}
                          >
                            <div className="flex items-center">
                              <Battery className="h-3 w-3 text-green-400 mr-2" />
                              <span>{t("Battery Bank")}</span>
                            </div>
                            <span className="bg-green-800/50 rounded-full p-1">
                              <Plus className="h-3 w-3 text-white" />
                            </span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <p className="text-sm">{t("Add a new battery bank with automatic connections")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label htmlFor="component-label" className="block text-xs text-slate-300 mb-1">
                    {t("Component Label")}
                  </label>
                  <input
                    id="component-label"
                    type="text"
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700/80 border border-slate-600 rounded-md text-white text-xs focus:outline-none focus:ring-1 focus:ring-lime-500 dark:focus:ring-emerald-500"
                    placeholder={t("Enter label...")}
                    autoFocus
                    aria-required="true"
                  />
                  <p className="text-slate-400 text-xs mt-1">{t("This label will be displayed on the component")}</p>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={handleConfirmAdd}
                    disabled={!customLabel.trim()}
                    className={cn(
                      "flex-1 flex items-center justify-center px-3 py-1.5 rounded-md text-xs",
                      customLabel.trim()
                        ? "bg-lime-600 dark:bg-emerald-600 hover:bg-lime-700 dark:hover:bg-emerald-700 text-white"
                        : "bg-slate-700 text-slate-400 cursor-not-allowed",
                    )}
                    aria-disabled={!customLabel.trim()}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    {t("Add")}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedType(null)
                      setCustomLabel("")
                    }}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-1.5 rounded-md text-xs"
                    aria-label={t("Cancel")}
                  >
                    {t("Cancel")}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
