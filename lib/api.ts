"use server"

import { saveLayoutData as saveLayoutDataToStorage } from "@/lib/solar-system-storage"

/**
 * API functions for handling data operations
 */

// Save layout data
export async function saveLayoutData(layoutData: Record<string, { x: number; y: number }>) {
  try {
    // Call the storage function to save the layout data
    return await saveLayoutDataToStorage(layoutData)
  } catch (error) {
    console.error("Error saving layout data via API:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
