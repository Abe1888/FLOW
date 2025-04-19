# Duplicating Component Customization: A Step-by-Step Guide

This guide explains how to extend the customization system to new components in the Solar System Visualization project. The customization system allows users to modify appearance, behavior, animations, and display options for components.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Step 1: Define Component Settings Types](#step-1-define-component-settings-types)
3. [Step 2: Modify the Component to Use Settings](#step-2-modify-the-component-to-use-settings)
4. [Step 3: Add Customization UI to the Panel](#step-3-add-customization-ui-to-the-panel)
5. [Step 4: Test and Refine](#step-4-test-and-refine)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

## Architecture Overview

The customization system consists of several key parts:

1. **Settings Types**: TypeScript interfaces that define the structure of settings for each component type
2. **Context Provider**: A React context that manages component settings state
3. **Component Integration**: Components that consume settings from the context
4. **Customization Panel**: UI for modifying component settings

The system uses React Context to share settings across components and localStorage to persist settings between sessions.

## Step 1: Define Component Settings Types

First, define the settings interface for your component in `lib/component-settings-types.ts`:

\`\`\`typescript
// Example for a new Solar Panel component
export interface SolarPanelSettings extends BaseComponentSettings {
  // Container customization
  containerSize: { width: number; height: number };
  containerStyle: {
    backgroundColor: string;
    gradientStart: string;
    gradientEnd: string;
    borderColor: string;
    activeColor: string;
    inactiveColor: string;
    borderWidth: number;
    borderRadius: number;
    shadow: "none" | "sm" | "md" | "lg";
  };
  
  // Panel appearance
  panelStyle: {
    cellColor: string;
    frameColor: string;
    reflectionOpacity: number;
    textColor: string;
  };
  
  // Simulation parameters
  simulationParams: {
    maxOutputWattage: number;
    efficiencyFactor: number;
    temperatureCoefficient: number;
  };
  
  // Animation settings
  animations: {
    enableReflection: boolean;
    enableHeatShimmer: boolean;
    enableRotation: boolean;
    rotationSensitivity: number;
  };
  
  // Display options
  displayOptions: {
    showOutputWattage: boolean;
    showEfficiency: boolean;
    showTemperature: boolean;
    showSpecifications: boolean;
  };
}

// Then create default settings
export const defaultSolarPanelSettings: SolarPanelSettings = {
  id: "solar-panel",
  name: "Solar Panel",
  type: "solarPanel",
  containerSize: { width: 30, height: 30 },
  containerStyle: {
    backgroundColor: "",
    gradientStart: "#334155", // slate-700
    gradientEnd: "#1e293b", // slate-800
    borderColor: "#475569", // slate-600
    activeColor: "#3b82f6", // blue-500
    inactiveColor: "#475569", // slate-600
    borderWidth: 2,
    borderRadius: 6,
    shadow: "md",
  },
  panelStyle: {
    cellColor: "#1e3a8a", // blue-900
    frameColor: "#64748b", // slate-500
    reflectionOpacity: 0.3,
    textColor: "#f8fafc", // slate-50
  },
  simulationParams: {
    maxOutputWattage: 250,
    efficiencyFactor: 0.85,
    temperatureCoefficient: -0.004, // -0.4% per degree C
  },
  animations: {
    enableReflection: true,
    enableHeatShimmer: true,
    enableRotation: true,
    rotationSensitivity: 1.0,
  },
  displayOptions: {
    showOutputWattage: true,
    showEfficiency: true,
    showTemperature: true,
    showSpecifications: true,
  },
};
\`\`\`

Then update the `getDefaultSettingsForType` function to include your new component type:

\`\`\`typescript
export const getDefaultSettingsForType = (type: string): BaseComponentSettings => {
  switch (type) {
    case "backupGenerator":
      return { ...defaultBackupGeneratorSettings };
    case "distributionPanel":
      return { ...defaultDistributionPanelSettings };
    case "solarPanel": // Add your new component type
      return { ...defaultSolarPanelSettings };
    // Add cases for other component types
    default:
      return {
        id: "unknown",
        name: "Unknown Component",
        type: "unknown",
      };
  }
};
\`\`\`

## Step 2: Modify the Component to Use Settings

Update your component to use the settings from the context:

\`\`\`tsx
import { useComponentSettings } from "@/lib/component-settings-context";
import type { SolarPanelSettings } from "@/lib/component-settings-types";

function SolarPanelNode({ id, data }: NodeProps<SolarPanelData>) {
  const { t } = data;
  
  // Get component settings
  const { settings } = useComponentSettings(id, "solarPanel");
  const customSettings = settings as SolarPanelSettings;
  
  // Use settings in your component
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "bg-gradient-to-b rounded-md shadow-xl p-3 flex flex-col border-2 relative",
          data.solarActive ? "border-blue-500" : "border-slate-600",
          "transition-all duration-300",
        )}
        style={{
          width: `${customSettings.containerSize.width}rem`,
          height: `${customSettings.containerSize.height}rem`,
          backgroundImage: `linear-gradient(to bottom, ${customSettings.containerStyle.gradientStart}, ${customSettings.containerStyle.gradientEnd})`,
          borderRadius: `${customSettings.containerStyle.borderRadius}px`,
          borderWidth: `${customSettings.containerStyle.borderWidth}px`,
          borderColor: data.solarActive 
            ? customSettings.containerStyle.activeColor 
            : customSettings.containerStyle.inactiveColor,
          boxShadow: customSettings.containerStyle.shadow === "lg" 
            ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
            : customSettings.containerStyle.shadow === "md" 
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" 
              : customSettings.containerStyle.shadow === "sm" 
                ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" 
                : "none",
        }}
      >
        {/* Component content using customSettings */}
        {/* ... */}
      </div>
    </div>
  );
}
\`\`\`

## Step 3: Add Customization UI to the Panel

Add a new function to render customization options for your component in `components/tech-innovation/solar-system/customization-panel.tsx`:

\`\`\`tsx
function renderSolarPanelOptions(
  settings: SolarPanelSettings,
  updateSettings: (newSettings: Partial<SolarPanelSettings>) => void,
  t: ReturnType<typeof useTranslation>,
) {
  return (
    <Tabs defaultValue="appearance">
      <TabsList className="w-full">
        <TabsTrigger value="appearance" className="text-xs">
          {t("Appearance")}
        </TabsTrigger>
        <TabsTrigger value="simulation" className="text-xs">
          {t("Simulation")}
        </TabsTrigger>
        <TabsTrigger value="animations" className="text-xs">
          {t("Animations")}
        </TabsTrigger>
        <TabsTrigger value="display" className="text-xs">
          {t("Display")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="appearance" className="space-y-4 mt-4">
        {/* Container Size settings */}
        <div>
          <h3 className="text-sm font-medium text-white mb-2">{t("Container Size")}</h3>
          <div className="grid grid-cols-2 gap-2">
            {/* Width input */}
            <div>
              <Label htmlFor="width" className="text-xs text-slate-300">
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
                max={50}
                step={1}
                className="h-8 text-xs"
              />
            </div>
            {/* Height input */}
            <div>
              <Label htmlFor="height" className="text-xs text-slate-300">
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
                min={10}
                max={50}
                step={1}
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Add more appearance settings */}
        {/* ... */}
      </TabsContent>

      {/* Add other tabs content */}
      {/* ... */}
    </Tabs>
  );
}
\`\`\`

Then update the `renderCustomizationOptions` function to include your new component type:

\`\`\`tsx
const renderCustomizationOptions = () => {
  switch (componentType) {
    case "backupGenerator":
      return renderBackupGeneratorOptions(settings as BackupGeneratorSettings, updateSettings, t);
    case "distributionPanel":
      return renderDistributionPanelOptions(settings as DistributionPanelSettings, updateSettings, t);
    case "solarPanel": // Add your new component type
      return renderSolarPanelOptions(settings as SolarPanelSettings, updateSettings, t);
    // Add cases for other component types
    default:
      return <div className="text-white">{t("No customization options available for this component type.")}</div>;
  }
};
\`\`\`

## Step 4: Test and Refine

1. Test the customization by selecting your component in the visualization
2. Verify that all settings are applied correctly
3. Check that settings persist when reloading the page
4. Refine the UI and settings based on testing

## Best Practices

### Organizing Settings

Group related settings together for better organization:

- **containerStyle**: For overall container appearance
- **elementStyle**: For specific elements within the component
- **simulationParams**: For behavior and simulation parameters
- **animations**: For animation-related settings
- **displayOptions**: For toggling visibility of elements

### Performance Considerations

- Use memoization for expensive calculations based on settings
- Avoid unnecessary re-renders by using React.memo or useMemo
- Consider debouncing settings updates for sliders and other continuous inputs

### Reusable Settings Components

Create reusable settings components for common patterns:

\`\`\`tsx
// Example of a reusable color setting component
function ColorSetting({ 
  label, 
  value, 
  onChange 
}: { 
  label: string; 
  value: string; 
  onChange: (color: string) => void 
}) {
  return (
    <div>
      <Label htmlFor={label.replace(/\s+/g, '-').toLowerCase()} className="text-xs text-slate-300">
        {label}
      </Label>
      <ColorPicker
        color={value}
        onChange={onChange}
      />
    </div>
  );
}
\`\`\`

### Translation Support

Always use the translation function for UI text:

\`\`\`tsx
<Label htmlFor="width" className="text-xs text-slate-300">
  {t("Width (rem)")}
</Label>
\`\`\`

## Troubleshooting

### Settings Not Applying

If settings aren't applying to your component:

1. Check that you're using the correct component type in `useComponentSettings`
2. Verify that your component is correctly consuming the settings
3. Check the browser console for errors

### Settings Not Persisting

If settings aren't persisting between page reloads:

1. Check that the ComponentSettingsProvider is properly set up
2. Verify that localStorage is working in your browser
3. Check for any errors during serialization/deserialization

### Type Errors

If you're getting TypeScript errors:

1. Ensure your settings interface extends BaseComponentSettings
2. Check that you're properly casting the settings to your specific type
3. Verify that all required properties are defined in your default settings

---

By following this guide, you can extend the customization system to any component in the Solar System Visualization project. The modular architecture makes it easy to add new customizable components while maintaining a consistent user experience.
