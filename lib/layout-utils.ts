// Enhance the layout utilities with better error handling and version tracking

/**
 * Utility functions for handling layout data in URLs
 */

// Add a version identifier to track layout format changes
const LAYOUT_VERSION = "1.0"

// Compress layout data for URL sharing with version information
export function compressLayout(layout: Record<string, { x: number; y: number }>): string {
  try {
    // Convert layout to a more compact format with version info
    const compactLayout = {
      version: LAYOUT_VERSION,
      nodes: Object.entries(layout).map(([id, pos]) => ({
        i: id,
        x: Math.round(pos.x),
        y: Math.round(pos.y),
      })),
    }

    // Convert to JSON and compress with base64
    const jsonString = JSON.stringify(compactLayout)
    return btoa(encodeURIComponent(jsonString))
  } catch (error) {
    console.error("Error compressing layout:", error)
    // Return a minimal valid compressed layout in case of error
    return btoa(encodeURIComponent(JSON.stringify({ version: LAYOUT_VERSION, nodes: [] })))
  }
}

// Decompress layout data from URL with version checking
export function decompressLayout(compressed: string): Record<string, { x: number; y: number }> {
  try {
    // Decode base64 and parse JSON
    const jsonString = decodeURIComponent(atob(compressed))
    const data = JSON.parse(jsonString)

    // Check if this is a versioned layout
    if (data.version && data.nodes) {
      // Handle versioned layout format
      const layout: Record<string, { x: number; y: number }> = {}
      data.nodes.forEach((item: { i: string; x: number; y: number }) => {
        layout[item.i] = { x: item.x, y: item.y }
      })
      return layout
    } else if (Array.isArray(data)) {
      // Handle legacy format (pre-versioning)
      const layout: Record<string, { x: number; y: number }> = {}
      data.forEach((item: { i: string; x: number; y: number }) => {
        layout[item.i] = { x: item.x, y: item.y }
      })
      return layout
    }

    // If we can't parse it as either format, return empty layout
    return {}
  } catch (error) {
    console.error("Error decompressing layout:", error)
    return {}
  }
}

// Get layout from URL search params with improved error handling
export function getLayoutFromUrl(): Record<string, { x: number; y: number }> | null {
  if (typeof window === "undefined") return null

  try {
    const url = new URL(window.location.href)
    const layoutParam = url.searchParams.get("layout")

    if (!layoutParam) return null

    return decompressLayout(layoutParam)
  } catch (error) {
    console.error("Error parsing layout from URL:", error)
    return null
  }
}

// Create a shareable URL with the current layout and metadata
export function createShareableUrl(layout: Record<string, { x: number; y: number }>): string {
  if (typeof window === "undefined") return ""

  try {
    const url = new URL(window.location.href)

    // Remove any existing layout parameter
    url.searchParams.delete("layout")

    // Add the compressed layout
    const compressed = compressLayout(layout)
    url.searchParams.set("layout", compressed)

    // Add a timestamp for cache busting
    url.searchParams.set("t", Date.now().toString())

    return url.toString()
  } catch (error) {
    console.error("Error creating shareable URL:", error)
    return window.location.href
  }
}

// Enhance the mergeLayouts function to handle conflicts better
export function mergeLayouts(
  baseLayout: Record<string, { x: number; y: number }>,
  overlayLayout: Record<string, { x: number; y: number }>,
  preferOverlay = true,
): Record<string, { x: number; y: number }> {
  const result = { ...baseLayout }

  // Add or update positions from overlay layout
  for (const [nodeId, position] of Object.entries(overlayLayout)) {
    // If node exists in both layouts
    if (result[nodeId] && !preferOverlay) {
      // Keep the base layout position
      continue
    }
    // Otherwise use the overlay position
    result[nodeId] = { ...position }
  }

  return result
}

// Add a function to validate layout data
export function validateLayout(layout: Record<string, { x: number; y: number }>): boolean {
  if (!layout || typeof layout !== "object") return false

  // Check if layout has at least some key positions
  const requiredKeys = ["solar-panel", "battery", "inverter"]
  const hasRequiredKeys = requiredKeys.some((key) => layout[key])

  if (!hasRequiredKeys) return false

  // Check if positions are valid numbers
  for (const [_, pos] of Object.entries(layout)) {
    if (
      typeof pos !== "object" ||
      typeof pos.x !== "number" ||
      typeof pos.y !== "number" ||
      isNaN(pos.x) ||
      isNaN(pos.y)
    ) {
      return false
    }
  }

  return true
}
