"use client"
import { X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ColorPicker } from "@/components/ui/color-picker"
import { useComponentSettings, useSelectedComponent } from "@/lib/component-settings-context"
import type { BackupGeneratorSettings, DistributionPanelSettings } from "@/lib/component-settings-types"
import { useTranslation } from "@/hooks/use-translation"

export function CustomizationPanel() {
  const { t } = useTranslation()
  const { selectedComponentId, setSelectedComponentId } = useSelectedComponent()

  if (!selectedComponentId) return null

  return (
    <div className="fixed right-3 sm:right-4 md:right-5 top-20 sm:top-24 md:top-28 z-50 w-[90vw] sm:w-80 max-h-[80vh] overflow-auto">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg border border-lime-600/20 shadow-lg p-3 sm:p-4">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-white font-medium text-base sm:text-lg">{t("Customize Component")}</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400 hover:text-white"
            onClick={() => setSelectedComponentId(null)}
          >
            <X size={14} className="sm:hidden" />
            <X size={16} className="hidden sm:block" />
          </Button>
        </div>

        <ComponentCustomizer componentId={selectedComponentId} t={t} />
      </div>
    </div>
  )
}

interface ComponentCustomizerProps {
  componentId: string
  t: ReturnType<typeof useTranslation>
}

function ComponentCustomizer({ componentId, t }: ComponentCustomizerProps) {
  // Get component type from the ID
  // This is a simplification - in a real implementation, you'd get the type from the node data
  const componentType = componentId.includes("backup-generator")
    ? "backupGenerator"
    : componentId.includes("distribution-panel")
      ? "distributionPanel"
      : componentId.includes("solar-panel")
        ? "solarPanel"
        : componentId.includes("battery")
          ? "battery"
          : componentId.includes("inverter")
            ? "inverter"
            : "unknown"

  const { settings, updateSettings, resetSettings } = useComponentSettings(componentId, componentType)

  // Render different customization options based on component type
  const renderCustomizationOptions = () => {
    switch (componentType) {
      case "backupGenerator":
        return renderBackupGeneratorOptions(settings as BackupGeneratorSettings, updateSettings, t)
      case "distributionPanel":
        return renderDistributionPanelOptions(settings as DistributionPanelSettings, updateSettings, t)
      // Add cases for other component types
      default:
        return <div className="text-white">{t("No customization options available for this component type.")}</div>
    }
  }

  return (
    <div className="space-y-4">
      {renderCustomizationOptions()}

      <div className="flex justify-between pt-2 border-t border-slate-700">
        <Button
          variant="outline"
          size="sm"
          onClick={resetSettings}
          className="text-[0.65rem] sm:text-xs h-7 sm:h-8 px-2 sm:px-3"
        >
          {t("Reset to Default")}
        </Button>
        <Button size="sm" className="text-[0.65rem] sm:text-xs h-7 sm:h-8 px-2 sm:px-3">
          {t("Save as Preset")}
        </Button>
      </div>
    </div>
  )
}

function renderBackupGeneratorOptions(
  settings: BackupGeneratorSettings,
  updateSettings: (newSettings: Partial<BackupGeneratorSettings>) => void,
  t: ReturnType<typeof useTranslation>,
) {
  return (
    <Tabs defaultValue="appearance">
      <TabsList className="w-full grid grid-cols-4 gap-1">
        <TabsTrigger value="appearance" className="text-[0.65rem] sm:text-xs px-1 sm:px-2 py-1">
          {t("Appearance")}
        </TabsTrigger>
        <TabsTrigger value="simulation" className="text-[0.65rem] sm:text-xs px-1 sm:px-2 py-1">
          {t("Simulation")}
        </TabsTrigger>
        <TabsTrigger value="animations" className="text-[0.65rem] sm:text-xs px-1 sm:px-2 py-1">
          {t("Animations")}
        </TabsTrigger>
        <TabsTrigger value="display" className="text-[0.65rem] sm:text-xs px-1 sm:px-2 py-1">
          {t("Display")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="appearance" className="space-y-4 mt-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Container Size")}</h3>
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            <div>
              <Label htmlFor="width" className="text-[0.65rem] sm:text-xs text-slate-300">
                {t("Width (rem)")}
              </Label>
              <Input
                id="width"
                type="number"
                value={settings.containerSize.width}
                onChange={(e) =>
                  updateSettings({
                    containerSize: {
                      ...settings.containerSize,
                      width: Number(e.target.value),
                    },
                  })
                }
                min={10}
                max={30}
                step={1}
                className="h-7 sm:h-8 text-[0.65rem] sm:text-xs"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-[0.65rem] sm:text-xs text-slate-300">
                {t("Height (rem)")}
              </Label>
              <Input
                id="height"
                type="number"
                value={settings.containerSize.height}
                onChange={(e) =>
                  updateSettings({
                    containerSize: {
                      ...settings.containerSize,
                      height: Number(e.target.value),
                    },
                  })
                }
                min={15}
                max={40}
                step={1}
                className="h-7 sm:h-8 text-[0.65rem] sm:text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Colors")}</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="gradientStart" className="text-xs text-slate-300">
                {t("Gradient Start")}
              </Label>
              <ColorPicker
                color={settings.containerStyle.gradientStart}
                onChange={(color) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      gradientStart: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="gradientEnd" className="text-xs text-slate-300">
                {t("Gradient End")}
              </Label>
              <ColorPicker
                color={settings.containerStyle.gradientEnd}
                onChange={(color) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      gradientEnd: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="activeColor" className="text-xs text-slate-300">
                {t("Active Border Color")}
              </Label>
              <ColorPicker
                color={settings.containerStyle.activeColor}
                onChange={(color) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      activeColor: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="inactiveColor" className="text-xs text-slate-300">
                {t("Inactive Border Color")}
              </Label>
              <ColorPicker
                color={settings.containerStyle.inactiveColor}
                onChange={(color) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      inactiveColor: color,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Border & Shadow")}</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="borderWidth" className="text-xs text-slate-300">
                {t("Border Width (px)")}
              </Label>
              <Input
                id="borderWidth"
                type="number"
                value={settings.containerStyle.borderWidth}
                onChange={(e) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      borderWidth: Number(e.target.value),
                    },
                  })
                }
                min={0}
                max={10}
                step={1}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="borderRadius" className="text-xs text-slate-300">
                {t("Border Radius (px)")}
              </Label>
              <Input
                id="borderRadius"
                type="number"
                value={settings.containerStyle.borderRadius}
                onChange={(e) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      borderRadius: Number(e.target.value),
                    },
                  })
                }
                min={0}
                max={20}
                step={1}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="shadow" className="text-xs text-slate-300">
                {t("Shadow")}
              </Label>
              <Select
                value={settings.containerStyle.shadow}
                onValueChange={(value) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      shadow: value as "none" | "sm" | "md" | "lg",
                    },
                  })
                }
              >
                <SelectTrigger id="shadow" className="h-8 text-xs">
                  <SelectValue placeholder={t("Select shadow")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("None")}</SelectItem>
                  <SelectItem value="sm">{t("Small")}</SelectItem>
                  <SelectItem value="md">{t("Medium")}</SelectItem>
                  <SelectItem value="lg">{t("Large")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="simulation" className="space-y-4 mt-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Performance Parameters")}</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between">
                <Label htmlFor="maxOutputWattage" className="text-[0.65rem] sm:text-xs text-slate-300">
                  {t("Max Output (W)")}
                </Label>
                <span className="text-[0.65rem] sm:text-xs text-slate-300">
                  {settings.simulationParams.maxOutputWattage}W
                </span>
              </div>
              <Slider
                id="maxOutputWattage"
                value={[settings.simulationParams.maxOutputWattage]}
                min={500}
                max={2000}
                step={100}
                onValueChange={(value) =>
                  updateSettings({
                    simulationParams: {
                      ...settings.simulationParams,
                      maxOutputWattage: value[0],
                    },
                  })
                }
                className="py-1.5 sm:py-2"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <Label htmlFor="maxRPM" className="text-[0.65rem] sm:text-xs text-slate-300">
                  {t("Max RPM")}
                </Label>
                <span className="text-[0.65rem] sm:text-xs text-slate-300">{settings.simulationParams.maxRPM} RPM</span>
              </div>
              <Slider
                id="maxRPM"
                value={[settings.simulationParams.maxRPM]}
                min={2000}
                max={5000}
                step={100}
                onValueChange={(value) =>
                  updateSettings({
                    simulationParams: {
                      ...settings.simulationParams,
                      maxRPM: value[0],
                    },
                  })
                }
                className="py-1.5 sm:py-2"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <Label htmlFor="fuelConsumptionRate" className="text-[0.65rem] sm:text-xs text-slate-300">
                  {t("Fuel Consumption Rate")}
                </Label>
                <span className="text-[0.65rem] sm:text-xs text-slate-300">
                  {settings.simulationParams.fuelConsumptionRate.toFixed(2)}%/s
                </span>
              </div>
              <Slider
                id="fuelConsumptionRate"
                value={[settings.simulationParams.fuelConsumptionRate]}
                min={0.05}
                max={0.5}
                step={0.01}
                onValueChange={(value) =>
                  updateSettings({
                    simulationParams: {
                      ...settings.simulationParams,
                      fuelConsumptionRate: value[0],
                    },
                  })
                }
                className="py-1.5 sm:py-2"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Thermal Behavior")}</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between">
                <Label htmlFor="heatGenerationRate" className="text-[0.65rem] sm:text-xs text-slate-300">
                  {t("Heat Generation (°C/s)")}
                </Label>
                <span className="text-[0.65rem] sm:text-xs text-slate-300">
                  {settings.simulationParams.heatGenerationRate}°C/s
                </span>
              </div>
              <Slider
                id="heatGenerationRate"
                value={[settings.simulationParams.heatGenerationRate]}
                min={1}
                max={10}
                step={0.5}
                onValueChange={(value) =>
                  updateSettings({
                    simulationParams: {
                      ...settings.simulationParams,
                      heatGenerationRate: value[0],
                    },
                  })
                }
                className="py-1.5 sm:py-2"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <Label htmlFor="coolingRate" className="text-[0.65rem] sm:text-xs text-slate-300">
                  {t("Cooling Rate (°C/s)")}
                </Label>
                <span className="text-[0.65rem] sm:text-xs text-slate-300">
                  {settings.simulationParams.coolingRate}°C/s
                </span>
              </div>
              <Slider
                id="coolingRate"
                value={[settings.simulationParams.coolingRate]}
                min={1}
                max={8}
                step={0.5}
                onValueChange={(value) =>
                  updateSettings({
                    simulationParams: {
                      ...settings.simulationParams,
                      coolingRate: value[0],
                    },
                  })
                }
                className="py-1.5 sm:py-2"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Timing")}</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between">
                <Label htmlFor="startupTime" className="text-[0.65rem] sm:text-xs text-slate-300">
                  {t("Startup Time (s)")}
                </Label>
                <span className="text-[0.65rem] sm:text-xs text-slate-300">
                  {settings.simulationParams.startupTime}s
                </span>
              </div>
              <Slider
                id="startupTime"
                value={[settings.simulationParams.startupTime]}
                min={1}
                max={10}
                step={0.5}
                onValueChange={(value) =>
                  updateSettings({
                    simulationParams: {
                      ...settings.simulationParams,
                      startupTime: value[0],
                    },
                  })
                }
                className="py-1.5 sm:py-2"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <Label htmlFor="shutdownTime" className="text-[0.65rem] sm:text-xs text-slate-300">
                  {t("Shutdown Time (s)")}
                </Label>
                <span className="text-[0.65rem] sm:text-xs text-slate-300">
                  {settings.simulationParams.shutdownTime}s
                </span>
              </div>
              <Slider
                id="shutdownTime"
                value={[settings.simulationParams.shutdownTime]}
                min={1}
                max={15}
                step={0.5}
                onValueChange={(value) =>
                  updateSettings({
                    simulationParams: {
                      ...settings.simulationParams,
                      shutdownTime: value[0],
                    },
                  })
                }
                className="py-1.5 sm:py-2"
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="animations" className="space-y-4 mt-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Smoke Effect")}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableSmoke" className="text-xs text-slate-300">
                {t("Enable Smoke")}
              </Label>
              <Switch
                id="enableSmoke"
                checked={settings.animations.enableSmoke}
                onCheckedChange={(checked) =>
                  updateSettings({
                    animations: {
                      ...settings.animations,
                      enableSmoke: checked,
                    },
                  })
                }
              />
            </div>

            {settings.animations.enableSmoke && (
              <>
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="smokeOpacity" className="text-[0.65rem] sm:text-xs text-slate-300">
                      {t("Smoke Opacity")}
                    </Label>
                    <span className="text-[0.65rem] sm:text-xs text-slate-300">
                      {settings.animations.smokeOpacity.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    id="smokeOpacity"
                    value={[settings.animations.smokeOpacity]}
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    onValueChange={(value) =>
                      updateSettings({
                        animations: {
                          ...settings.animations,
                          smokeOpacity: value[0],
                        },
                      })
                    }
                    className="py-1.5 sm:py-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="smokeDensity" className="text-[0.65rem] sm:text-xs text-slate-300">
                      {t("Smoke Density")}
                    </Label>
                    <span className="text-[0.65rem] sm:text-xs text-slate-300">{settings.animations.smokeDensity}</span>
                  </div>
                  <Slider
                    id="smokeDensity"
                    value={[settings.animations.smokeDensity]}
                    min={1}
                    max={30}
                    step={1}
                    onValueChange={(value) =>
                      updateSettings({
                        animations: {
                          ...settings.animations,
                          smokeDensity: value[0],
                        },
                      })
                    }
                    className="py-1.5 sm:py-2"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Fan Animation")}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableFanRotation" className="text-xs text-slate-300">
                {t("Enable Fan Rotation")}
              </Label>
              <Switch
                id="enableFanRotation"
                checked={settings.animations.enableFanRotation}
                onCheckedChange={(checked) =>
                  updateSettings({
                    animations: {
                      ...settings.animations,
                      enableFanRotation: checked,
                    },
                  })
                }
              />
            </div>

            {settings.animations.enableFanRotation && (
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="fanRotationSpeed" className="text-[0.65rem] sm:text-xs text-slate-300">
                    {t("Fan Speed")}
                  </Label>
                  <span className="text-[0.65rem] sm:text-xs text-slate-300">
                    ×{settings.animations.fanRotationSpeed.toFixed(1)}
                  </span>
                </div>
                <Slider
                  id="fanRotationSpeed"
                  value={[settings.animations.fanRotationSpeed]}
                  min={0.1}
                  max={3.0}
                  step={0.1}
                  onValueChange={(value) =>
                    updateSettings({
                      animations: {
                        ...settings.animations,
                        fanRotationSpeed: value[0],
                      },
                    })
                  }
                  className="py-1.5 sm:py-2"
                />
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Other Effects")}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableVibration" className="text-xs text-slate-300">
                {t("Enable Vibration")}
              </Label>
              <Switch
                id="enableVibration"
                checked={settings.animations.enableVibration}
                onCheckedChange={(checked) =>
                  updateSettings({
                    animations: {
                      ...settings.animations,
                      enableVibration: checked,
                    },
                  })
                }
              />
            </div>

            {settings.animations.enableVibration && (
              <div>
                <div className="flex justify-between">
                  <Label htmlFor="vibrationIntensity" className="text-[0.65rem] sm:text-xs text-slate-300">
                    {t("Vibration Intensity")}
                  </Label>
                  <span className="text-[0.65rem] sm:text-xs text-slate-300">
                    ×{settings.animations.vibrationIntensity.toFixed(1)}
                  </span>
                </div>
                <Slider
                  id="vibrationIntensity"
                  value={[settings.animations.vibrationIntensity]}
                  min={0.1}
                  max={2.0}
                  step={0.1}
                  onValueChange={(value) =>
                    updateSettings({
                      animations: {
                        ...settings.animations,
                        vibrationIntensity: value[0],
                      },
                    })
                  }
                  className="py-1.5 sm:py-2"
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="enableHeatShimmer" className="text-xs text-slate-300">
                {t("Heat Shimmer Effect")}
              </Label>
              <Switch
                id="enableHeatShimmer"
                checked={settings.animations.enableHeatShimmer}
                onCheckedChange={(checked) =>
                  updateSettings({
                    animations: {
                      ...settings.animations,
                      enableHeatShimmer: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="display" className="space-y-4 mt-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Display Elements")}</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="showOutputWattage" className="text-xs text-slate-300">
                {t("Output Wattage")}
              </Label>
              <Switch
                id="showOutputWattage"
                checked={settings.displayOptions.showOutputWattage}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showOutputWattage: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showRuntime" className="text-xs text-slate-300">
                {t("Runtime")}
              </Label>
              <Switch
                id="showRuntime"
                checked={settings.displayOptions.showRuntime}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showRuntime: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showRPM" className="text-xs text-slate-300">
                {t("Engine RPM")}
              </Label>
              <Switch
                id="showRPM"
                checked={settings.displayOptions.showRPM}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showRPM: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showTemperature" className="text-xs text-slate-300">
                {t("Temperature")}
              </Label>
              <Switch
                id="showTemperature"
                checked={settings.displayOptions.showTemperature}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showTemperature: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showOilPressure" className="text-xs text-slate-300">
                {t("Oil Pressure")}
              </Label>
              <Switch
                id="showOilPressure"
                checked={settings.displayOptions.showOilPressure}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showOilPressure: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showFuelLevel" className="text-xs text-slate-300">
                {t("Fuel Level")}
              </Label>
              <Switch
                id="showFuelLevel"
                checked={settings.displayOptions.showFuelLevel}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showFuelLevel: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Panel Style")}</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="panelBgColor" className="text-xs text-slate-300">
                {t("Panel Background")}
              </Label>
              <ColorPicker
                color={settings.panelStyle.backgroundColor}
                onChange={(color) =>
                  updateSettings({
                    panelStyle: {
                      ...settings.panelStyle,
                      backgroundColor: color,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="panelBorderColor" className="text-xs text-slate-300">
                {t("Panel Border")}
              </Label>
              <ColorPicker
                color={settings.panelStyle.borderColor}
                onChange={(color) =>
                  updateSettings({
                    panelStyle: {
                      ...settings.panelStyle,
                      borderColor: color,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="panelTextColor" className="text-xs text-slate-300">
                {t("Text Color")}
              </Label>
              <ColorPicker
                color={settings.panelStyle.textColor}
                onChange={(color) =>
                  updateSettings({
                    panelStyle: {
                      ...settings.panelStyle,
                      textColor: color,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="panelAccentColor" className="text-xs text-slate-300">
                {t("Accent Color")}
              </Label>
              <ColorPicker
                color={settings.panelStyle.accentColor}
                onChange={(color) =>
                  updateSettings({
                    panelStyle: {
                      ...settings.panelStyle,
                      accentColor: color,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="fontSize" className="text-xs text-slate-300">
                {t("Font Size (px)")}
              </Label>
              <Input
                id="fontSize"
                type="number"
                value={settings.panelStyle.fontSize}
                onChange={(e) =>
                  updateSettings({
                    panelStyle: {
                      ...settings.panelStyle,
                      fontSize: Number(e.target.value),
                    },
                  })
                }
                min={8}
                max={16}
                step={1}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}

function renderDistributionPanelOptions(
  settings: DistributionPanelSettings,
  updateSettings: (newSettings: Partial<DistributionPanelSettings>) => void,
  t: ReturnType<typeof useTranslation>,
) {
  return (
    <Tabs defaultValue="appearance">
      <TabsList className="w-full grid grid-cols-4 gap-1">
        <TabsTrigger value="appearance" className="text-[0.65rem] sm:text-xs px-1 sm:px-2 py-1">
          {t("Appearance")}
        </TabsTrigger>
        <TabsTrigger value="devices" className="text-[0.65rem] sm:text-xs px-1 sm:px-2 py-1">
          {t("Devices")}
        </TabsTrigger>
        <TabsTrigger value="power" className="text-[0.65rem] sm:text-xs px-1 sm:px-2 py-1">
          {t("Power Flow")}
        </TabsTrigger>
        <TabsTrigger value="display" className="text-[0.65rem] sm:text-xs px-1 sm:px-2 py-1">
          {t("Display")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="appearance" className="space-y-4 mt-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Container Size")}</h3>
          <div className="grid grid-cols-2 gap-1 sm:gap-2">
            <div>
              <Label htmlFor="width" className="text-[0.65rem] sm:text-xs text-slate-300">
                {t("Width (rem)")}
              </Label>
              <Input
                id="width"
                type="number"
                value={settings.containerSize.width}
                onChange={(e) =>
                  updateSettings({
                    containerSize: {
                      ...settings.containerSize,
                      width: Number(e.target.value),
                    },
                  })
                }
                min={15}
                max={40}
                step={1}
                className="h-7 sm:h-8 text-[0.65rem] sm:text-xs"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-[0.65rem] sm:text-xs text-slate-300">
                {t("Height (rem)")}
              </Label>
              <Input
                id="height"
                type="number"
                value={settings.containerSize.height}
                onChange={(e) =>
                  updateSettings({
                    containerSize: {
                      ...settings.containerSize,
                      height: Number(e.target.value),
                    },
                  })
                }
                min={15}
                max={40}
                step={1}
                className="h-7 sm:h-8 text-[0.65rem] sm:text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Colors")}</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="gradientStart" className="text-xs text-slate-300">
                {t("Gradient Start")}
              </Label>
              <ColorPicker
                color={settings.containerStyle.gradientStart}
                onChange={(color) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      gradientStart: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="gradientEnd" className="text-xs text-slate-300">
                {t("Gradient End")}
              </Label>
              <ColorPicker
                color={settings.containerStyle.gradientEnd}
                onChange={(color) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      gradientEnd: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="activeColor" className="text-xs text-slate-300">
                {t("Active Color")}
              </Label>
              <ColorPicker
                color={settings.containerStyle.activeColor}
                onChange={(color) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      activeColor: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="inactiveColor" className="text-xs text-slate-300">
                {t("Inactive Color")}
              </Label>
              <ColorPicker
                color={settings.containerStyle.inactiveColor}
                onChange={(color) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      inactiveColor: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="overloadColor" className="text-xs text-slate-300">
                {t("Overload Color")}
              </Label>
              <ColorPicker
                color={settings.containerStyle.overloadColor}
                onChange={(color) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      overloadColor: color,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Border & Shadow")}</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="borderWidth" className="text-xs text-slate-300">
                {t("Border Width (px)")}
              </Label>
              <Input
                id="borderWidth"
                type="number"
                value={settings.containerStyle.borderWidth}
                onChange={(e) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      borderWidth: Number(e.target.value),
                    },
                  })
                }
                min={0}
                max={10}
                step={1}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="borderRadius" className="text-xs text-slate-300">
                {t("Border Radius (px)")}
              </Label>
              <Input
                id="borderRadius"
                type="number"
                value={settings.containerStyle.borderRadius}
                onChange={(e) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      borderRadius: Number(e.target.value),
                    },
                  })
                }
                min={0}
                max={20}
                step={1}
                className="h-8 text-xs"
              />
            </div>
            <div>
              <Label htmlFor="shadow" className="text-xs text-slate-300">
                {t("Shadow")}
              </Label>
              <Select
                value={settings.containerStyle.shadow}
                onValueChange={(value) =>
                  updateSettings({
                    containerStyle: {
                      ...settings.containerStyle,
                      shadow: value as "none" | "sm" | "md" | "lg",
                    },
                  })
                }
              >
                <SelectTrigger id="shadow" className="h-8 text-xs">
                  <SelectValue placeholder={t("Select shadow")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t("None")}</SelectItem>
                  <SelectItem value="sm">{t("Small")}</SelectItem>
                  <SelectItem value="md">{t("Medium")}</SelectItem>
                  <SelectItem value="lg">{t("Large")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="devices" className="space-y-4 mt-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Device Appearance")}</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="activeBackgroundColor" className="text-xs text-slate-300">
                {t("Active Background")}
              </Label>
              <ColorPicker
                color={settings.deviceStyle.activeBackgroundColor}
                onChange={(color) =>
                  updateSettings({
                    deviceStyle: {
                      ...settings.deviceStyle,
                      activeBackgroundColor: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="inactiveBackgroundColor" className="text-xs text-slate-300">
                {t("Inactive Background")}
              </Label>
              <ColorPicker
                color={settings.deviceStyle.inactiveBackgroundColor}
                onChange={(color) =>
                  updateSettings({
                    deviceStyle: {
                      ...settings.deviceStyle,
                      inactiveBackgroundColor: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="activeBorderColor" className="text-xs text-slate-300">
                {t("Active Border")}
              </Label>
              <ColorPicker
                color={settings.deviceStyle.activeBorderColor}
                onChange={(color) =>
                  updateSettings({
                    deviceStyle: {
                      ...settings.deviceStyle,
                      activeBorderColor: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="inactiveBorderColor" className="text-xs text-slate-300">
                {t("Inactive Border")}
              </Label>
              <ColorPicker
                color={settings.deviceStyle.inactiveBorderColor}
                onChange={(color) =>
                  updateSettings({
                    deviceStyle: {
                      ...settings.deviceStyle,
                      inactiveBorderColor: color,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Device Text & Icons")}</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="textColor" className="text-xs text-slate-300">
                {t("Text Color")}
              </Label>
              <ColorPicker
                color={settings.deviceStyle.textColor}
                onChange={(color) =>
                  updateSettings({
                    deviceStyle: {
                      ...settings.deviceStyle,
                      textColor: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="iconColor" className="text-xs text-slate-300">
                {t("Icon Color")}
              </Label>
              <ColorPicker
                color={settings.deviceStyle.iconColor}
                onChange={(color) =>
                  updateSettings({
                    deviceStyle: {
                      ...settings.deviceStyle,
                      iconColor: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="powerTextColor" className="text-xs text-slate-300">
                {t("Power Text Color")}
              </Label>
              <ColorPicker
                color={settings.deviceStyle.powerTextColor}
                onChange={(color) =>
                  updateSettings({
                    deviceStyle: {
                      ...settings.deviceStyle,
                      powerTextColor: color,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="power" className="space-y-4 mt-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Power Flow Animation")}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="enableFlowAnimation" className="text-xs text-slate-300">
                {t("Enable Flow Animation")}
              </Label>
              <Switch
                id="enableFlowAnimation"
                checked={settings.powerFlow.enableFlowAnimation}
                onCheckedChange={(checked) =>
                  updateSettings({
                    powerFlow: {
                      ...settings.powerFlow,
                      enableFlowAnimation: checked,
                    },
                  })
                }
              />
            </div>

            {settings.powerFlow.enableFlowAnimation && (
              <>
                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="flowAnimationSpeed" className="text-[0.65rem] sm:text-xs text-slate-300">
                      {t("Flow Speed")}
                    </Label>
                    <span className="text-[0.65rem] sm:text-xs text-slate-300">
                      ×{settings.powerFlow.flowAnimationSpeed.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    id="flowAnimationSpeed"
                    value={[settings.powerFlow.flowAnimationSpeed]}
                    min={0.5}
                    max={3.0}
                    step={0.1}
                    onValueChange={(value) =>
                      updateSettings({
                        powerFlow: {
                          ...settings.powerFlow,
                          flowAnimationSpeed: value[0],
                        },
                      })
                    }
                    className="py-1.5 sm:py-2"
                  />
                </div>

                <div>
                  <Label htmlFor="flowColor" className="text-xs text-slate-300">
                    {t("Flow Color")}
                  </Label>
                  <ColorPicker
                    color={settings.powerFlow.flowColor}
                    onChange={(color) =>
                      updateSettings({
                        powerFlow: {
                          ...settings.powerFlow,
                          flowColor: color,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="flowOpacity" className="text-[0.65rem] sm:text-xs text-slate-300">
                      {t("Flow Opacity")}
                    </Label>
                    <span className="text-[0.65rem] sm:text-xs text-slate-300">
                      {settings.powerFlow.flowOpacity.toFixed(1)}
                    </span>
                  </div>
                  <Slider
                    id="flowOpacity"
                    value={[settings.powerFlow.flowOpacity]}
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    onValueChange={(value) =>
                      updateSettings({
                        powerFlow: {
                          ...settings.powerFlow,
                          flowOpacity: value[0],
                        },
                      })
                    }
                    className="py-1.5 sm:py-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between">
                    <Label htmlFor="flowWidth" className="text-[0.65rem] sm:text-xs text-slate-300">
                      {t("Flow Width (px)")}
                    </Label>
                    <span className="text-[0.65rem] sm:text-xs text-slate-300">{settings.powerFlow.flowWidth}px</span>
                  </div>
                  <Slider
                    id="flowWidth"
                    value={[settings.powerFlow.flowWidth]}
                    min={1}
                    max={5}
                    step={1}
                    onValueChange={(value) =>
                      updateSettings({
                        powerFlow: {
                          ...settings.powerFlow,
                          flowWidth: value[0],
                        },
                      })
                    }
                    className="py-1.5 sm:py-2"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Load Meter")}</h3>
          <div className="space-y-3">
            <div>
              <Label htmlFor="normalColor" className="text-xs text-slate-300">
                {t("Normal Color")}
              </Label>
              <ColorPicker
                color={settings.loadMeter.normalColor}
                onChange={(color) =>
                  updateSettings({
                    loadMeter: {
                      ...settings.loadMeter,
                      normalColor: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="warningColor" className="text-xs text-slate-300">
                {t("Warning Color")}
              </Label>
              <ColorPicker
                color={settings.loadMeter.warningColor}
                onChange={(color) =>
                  updateSettings({
                    loadMeter: {
                      ...settings.loadMeter,
                      warningColor: color,
                    },
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="criticalColor" className="text-xs text-slate-300">
                {t("Critical Color")}
              </Label>
              <ColorPicker
                color={settings.loadMeter.criticalColor}
                onChange={(color) =>
                  updateSettings({
                    loadMeter: {
                      ...settings.loadMeter,
                      criticalColor: color,
                    },
                  })
                }
              />
            </div>

            <div>
              <div className="flex justify-between">
                <Label htmlFor="warningThreshold" className="text-[0.65rem] sm:text-xs text-slate-300">
                  {t("Warning Threshold (%)")}
                </Label>
                <span className="text-[0.65rem] sm:text-xs text-slate-300">{settings.loadMeter.warningThreshold}%</span>
              </div>
              <Slider
                id="warningThreshold"
                value={[settings.loadMeter.warningThreshold]}
                min={30}
                max={90}
                step={5}
                onValueChange={(value) =>
                  updateSettings({
                    loadMeter: {
                      ...settings.loadMeter,
                      warningThreshold: value[0],
                    },
                  })
                }
                className="py-1.5 sm:py-2"
              />
            </div>

            <div>
              <div className="flex justify-between">
                <Label htmlFor="criticalThreshold" className="text-[0.65rem] sm:text-xs text-slate-300">
                  {t("Critical Threshold (%)")}
                </Label>
                <span className="text-[0.65rem] sm:text-xs text-slate-300">
                  {settings.loadMeter.criticalThreshold}%
                </span>
              </div>
              <Slider
                id="criticalThreshold"
                value={[settings.loadMeter.criticalThreshold]}
                min={50}
                max={95}
                step={5}
                onValueChange={(value) =>
                  updateSettings({
                    loadMeter: {
                      ...settings.loadMeter,
                      criticalThreshold: value[0],
                    },
                  })
                }
                className="py-1.5 sm:py-2"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enableGradient" className="text-xs text-slate-300">
                {t("Enable Gradient")}
              </Label>
              <Switch
                id="enableGradient"
                checked={settings.loadMeter.enableGradient}
                onCheckedChange={(checked) =>
                  updateSettings({
                    loadMeter: {
                      ...settings.loadMeter,
                      enableGradient: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="enableShimmer" className="text-xs text-slate-300">
                {t("Enable Shimmer Effect")}
              </Label>
              <Switch
                id="enableShimmer"
                checked={settings.loadMeter.enableShimmer}
                onCheckedChange={(checked) =>
                  updateSettings({
                    loadMeter: {
                      ...settings.loadMeter,
                      enableShimmer: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="display" className="space-y-4 mt-4">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Display Elements")}</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="showLoadMeter" className="text-xs text-slate-300">
                {t("Load Meter")}
              </Label>
              <Switch
                id="showLoadMeter"
                checked={settings.displayOptions.showLoadMeter}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showLoadMeter: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showPowerConsumption" className="text-xs text-slate-300">
                {t("Power Consumption")}
              </Label>
              <Switch
                id="showPowerConsumption"
                checked={settings.displayOptions.showPowerConsumption}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showPowerConsumption: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showDeviceStatus" className="text-xs text-slate-300">
                {t("Device Status")}
              </Label>
              <Switch
                id="showDeviceStatus"
                checked={settings.displayOptions.showDeviceStatus}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showDeviceStatus: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showGridConnection" className="text-xs text-slate-300">
                {t("Grid Connection")}
              </Label>
              <Switch
                id="showGridConnection"
                checked={settings.displayOptions.showGridConnection}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showGridConnection: checked,
                    },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="showCircuitLabels" className="text-xs text-slate-300">
                {t("Circuit Labels")}
              </Label>
              <Switch
                id="showCircuitLabels"
                checked={settings.displayOptions.showCircuitLabels}
                onCheckedChange={(checked) =>
                  updateSettings({
                    displayOptions: {
                      ...settings.displayOptions,
                      showCircuitLabels: checked,
                    },
                  })
                }
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-xs sm:text-sm font-medium text-white mb-1.5 sm:mb-2">{t("Panel Style")}</h3>
          <div className="space-y-2">
            <div>
              <Label htmlFor="panelBgColor" className="text-xs text-slate-300">
                {t("Panel Background")}
              </Label>
              <ColorPicker
                color={settings.panelStyle.backgroundColor}
                onChange={(color) =>
                  updateSettings({
                    panelStyle: {
                      ...settings.panelStyle,
                      backgroundColor: color,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="panelBorderColor" className="text-xs text-slate-300">
                {t("Panel Border")}
              </Label>
              <ColorPicker
                color={settings.panelStyle.borderColor}
                onChange={(color) =>
                  updateSettings({
                    panelStyle: {
                      ...settings.panelStyle,
                      borderColor: color,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="panelTextColor" className="text-xs text-slate-300">
                {t("Text Color")}
              </Label>
              <ColorPicker
                color={settings.panelStyle.textColor}
                onChange={(color) =>
                  updateSettings({
                    panelStyle: {
                      ...settings.panelStyle,
                      textColor: color,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="panelAccentColor" className="text-xs text-slate-300">
                {t("Accent Color")}
              </Label>
              <ColorPicker
                color={settings.panelStyle.accentColor}
                onChange={(color) =>
                  updateSettings({
                    panelStyle: {
                      ...settings.panelStyle,
                      accentColor: color,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="fontSize" className="text-xs text-slate-300">
                {t("Font Size (px)")}
              </Label>
              <Input
                id="fontSize"
                type="number"
                value={settings.panelStyle.fontSize}
                onChange={(e) =>
                  updateSettings({
                    panelStyle: {
                      ...settings.panelStyle,
                      fontSize: Number(e.target.value),
                    },
                  })
                }
                min={8}
                max={16}
                step={1}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}
