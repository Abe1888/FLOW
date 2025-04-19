"use client"
import type { NodeProps } from "reactflow"
import { Sun, Cloud, CloudRain, Wind, Thermometer, Droplet } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

type WeatherCondition = "sunny" | "cloudy" | "rainy"

interface WeatherControlsData {
  weatherCondition: WeatherCondition
  onWeatherChange: (condition: WeatherCondition) => void
  t: (key: string) => string // Translation function
}

function WeatherControlsNode({ data }: NodeProps<WeatherControlsData>) {
  const { t } = data
  const [animate, setAnimate] = useState(false)
  const [weatherEffects, setWeatherEffects] = useState<JSX.Element[]>([])

  // Add animation effect when component mounts
  useEffect(() => {
    setAnimate(true)
    const timer = setTimeout(() => setAnimate(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Generate weather effects based on current condition
  useEffect(() => {
    const effects: JSX.Element[] = []

    switch (data.weatherCondition) {
      case "sunny":
        // Sun rays
        for (let i = 0; i < 8; i++) {
          const angle = i * 45 * (Math.PI / 180)
          const x = Math.cos(angle) * 30
          const y = Math.sin(angle) * 30

          effects.push(
            <div
              key={`ray-${i}`}
              className="absolute bg-yellow-500/30 rounded-full"
              style={{
                width: "2px",
                height: "15px",
                left: "calc(50% - 1px)",
                top: "calc(50% - 7.5px)",
                transformOrigin: "center",
                transform: `rotate(${i * 45}deg) translate(${x}px, ${y}px)`,
                animation: `sunRay 3s infinite ${i * 0.2}s`,
              }}
            />,
          )
        }
        break

      case "cloudy":
        // Cloud particles
        for (let i = 0; i < 10; i++) {
          effects.push(
            <div
              key={`cloud-${i}`}
              className="absolute bg-slate-300/20 rounded-full"
              style={{
                width: `${5 + Math.random() * 10}px`,
                height: `${5 + Math.random() * 10}px`,
                left: `${Math.random() * 100}%`,
                top: `${10 + Math.random() * 40}%`,
                animation: `cloudFloat ${5 + Math.random() * 5}s infinite linear ${Math.random() * 5}s`,
              }}
            />,
          )
        }
        break

      case "rainy":
        // Raindrops
        for (let i = 0; i < 15; i++) {
          effects.push(
            <div
              key={`rain-${i}`}
              className="absolute bg-blue-400/40 rounded-b-full"
              style={{
                width: "2px",
                height: `${5 + Math.random() * 10}px`,
                left: `${Math.random() * 100}%`,
                top: `-10px`,
                animation: `rainfall ${1 + Math.random() * 1}s infinite linear ${Math.random() * 1}s`,
              }}
            />,
          )
        }
        break
    }

    setWeatherEffects(effects)
  }, [data.weatherCondition])

  // Get weather details based on condition
  const getWeatherDetails = () => {
    switch (data.weatherCondition) {
      case "sunny":
        return {
          temp: "25-30°C",
          humidity: "30-45%",
          wind: "5-10 km/h",
          solar: "80-100%",
        }
      case "cloudy":
        return {
          temp: "18-23°C",
          humidity: "50-65%",
          wind: "10-20 km/h",
          solar: "40-60%",
        }
      case "rainy":
        return {
          temp: "15-20°C",
          humidity: "75-90%",
          wind: "15-30 km/h",
          solar: "10-30%",
        }
    }
  }

  const weatherDetails = getWeatherDetails()

  return (
    <TooltipProvider>
      <div
        className={cn(
          "w-[18rem] bg-gradient-to-b from-slate-700 to-slate-800 p-4 rounded-lg border-2 border-slate-600 shadow-lg transition-all duration-300",
          animate ? "scale-105" : "scale-100",
          data.weatherCondition === "sunny"
            ? "border-yellow-600/30"
            : data.weatherCondition === "cloudy"
              ? "border-slate-500/30"
              : "border-blue-600/30",
        )}
      >
        {/* Weather selection buttons with enhanced visuals */}
        <div className="flex space-x-2 mb-4 relative">
          {/* Weather effects container */}
          <div className="absolute inset-0 overflow-hidden rounded-md pointer-events-none">{weatherEffects}</div>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => data.onWeatherChange("sunny")}
                className={cn(
                  "p-3 rounded-md transition-all duration-300 flex-1 relative overflow-hidden",
                  data.weatherCondition === "sunny"
                    ? "bg-amber-600/50 text-white border border-amber-500 shadow-md shadow-amber-900/20"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600 hover:border-amber-600/30",
                )}
                aria-label={t("Sunny weather")}
              >
                <div className="flex flex-col items-center relative z-10">
                  <Sun
                    className={cn(
                      "h-6 w-6 mb-1",
                      data.weatherCondition === "sunny" && "animate-pulse-slow text-yellow-300",
                    )}
                  />
                  <span className="text-xs">{t("Sunny")}</span>
                </div>
                {data.weatherCondition === "sunny" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-700/10"></div>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("Clear skies, optimal solar production")}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => data.onWeatherChange("cloudy")}
                className={cn(
                  "p-3 rounded-md transition-all duration-300 flex-1 relative overflow-hidden",
                  data.weatherCondition === "cloudy"
                    ? "bg-slate-500/50 text-white border border-slate-400 shadow-md shadow-slate-900/20"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600 hover:border-slate-400/30",
                )}
                aria-label={t("Cloudy weather")}
              >
                <div className="flex flex-col items-center relative z-10">
                  <Cloud
                    className={cn(
                      "h-6 w-6 mb-1",
                      data.weatherCondition === "cloudy" && "animate-pulse-slow text-slate-300",
                    )}
                  />
                  <span className="text-xs">{t("Cloudy")}</span>
                </div>
                {data.weatherCondition === "cloudy" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-400/10 to-slate-600/10"></div>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("Partial cloud cover, reduced solar efficiency")}</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => data.onWeatherChange("rainy")}
                className={cn(
                  "p-3 rounded-md transition-all duration-300 flex-1 relative overflow-hidden",
                  data.weatherCondition === "rainy"
                    ? "bg-blue-600/50 text-white border border-blue-500 shadow-md shadow-blue-900/20"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 border border-slate-600 hover:border-blue-600/30",
                )}
                aria-label={t("Rainy weather")}
              >
                <div className="flex flex-col items-center relative z-10">
                  <CloudRain
                    className={cn(
                      "h-6 w-6 mb-1",
                      data.weatherCondition === "rainy" && "animate-pulse-slow text-blue-300",
                    )}
                  />
                  <span className="text-xs">{t("Rainy")}</span>
                </div>
                {data.weatherCondition === "rainy" && (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-700/10"></div>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">{t("Heavy cloud cover and rain, minimal solar production")}</TooltipContent>
          </Tooltip>
        </div>

        {/* Enhanced weather details panel */}
        <div className="bg-slate-900 border border-slate-700 rounded-sm p-3 shadow-inner">
          <div className="text-xs text-slate-400 mb-2 border-b border-slate-700 pb-1 flex items-center justify-between">
            <span>{t("Current Conditions")}</span>
            <span
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px]",
                data.weatherCondition === "sunny"
                  ? "bg-yellow-600/20 text-yellow-400"
                  : data.weatherCondition === "cloudy"
                    ? "bg-slate-600/20 text-slate-300"
                    : "bg-blue-600/20 text-blue-400",
              )}
            >
              {t(data.weatherCondition.toUpperCase())}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center bg-slate-800/50 p-2 rounded-md">
              <Thermometer className="h-4 w-4 text-red-400 mr-2" />
              <div>
                <span className="text-slate-300 block">{t("Temp")}:</span>
                <span className="text-white font-medium">{weatherDetails.temp}</span>
              </div>
            </div>

            <div className="flex items-center bg-slate-800/50 p-2 rounded-md">
              <Droplet className="h-4 w-4 text-blue-400 mr-2" />
              <div>
                <span className="text-slate-300 block">{t("Humidity")}:</span>
                <span className="text-white font-medium">{weatherDetails.humidity}</span>
              </div>
            </div>

            <div className="flex items-center bg-slate-800/50 p-2 rounded-md">
              <Wind className="h-4 w-4 text-cyan-400 mr-2" />
              <div>
                <span className="text-slate-300 block">{t("Wind")}:</span>
                <span className="text-white font-medium">{weatherDetails.wind}</span>
              </div>
            </div>

            <div className="flex items-center bg-slate-800/50 p-2 rounded-md">
              <Sun className="h-4 w-4 text-yellow-400 mr-2" />
              <div>
                <span className="text-slate-300 block">{t("Sunlight")}:</span>
                <span className="text-white font-medium">{weatherDetails.solar}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced weather animation indicator */}
        <div className="mt-3 mb-8 h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full animate-pulse",
              data.weatherCondition === "sunny"
                ? "bg-yellow-500"
                : data.weatherCondition === "cloudy"
                  ? "bg-slate-400"
                  : "bg-blue-500",
            )}
          ></div>
        </div>
        <div className="absolute bottom-3 left-0 right-0 text-center">
          <div className="font-medium text-white text-sm">{t("Weather Conditions")}</div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default WeatherControlsNode
