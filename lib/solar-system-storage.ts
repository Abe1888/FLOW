"use server"
import path from "path"
import { promises as fsPromises } from "fs"

// Define the type for the layout data with versioning
export type LayoutData = {
  version: string
  timestamp: number
  nodes: Record<string, { x: number; y: number }>
}

// Path to the data directory and file
const DATA_DIR = path.join(process.cwd(), "data")
const LAYOUT_FILE = path.join(DATA_DIR, "solar-system-layout.json")
const BACKUP_DIR = path.join(DATA_DIR, "backups")

// Ensure the data directory exists
async function ensureDataDir() {
  try {
    await fsPromises.access(DATA_DIR)
  } catch (error) {
    // Directory doesn't exist, create it
    await fsPromises.mkdir(DATA_DIR, { recursive: true })
  }

  // Also ensure backup directory exists
  try {
    await fsPromises.access(BACKUP_DIR)
  } catch (error) {
    // Backup directory doesn't exist, create it
    await fsPromises.mkdir(BACKUP_DIR, { recursive: true })
  }
}

// Create a backup of the current layout file
async function createBackup() {
  try {
    // Check if the layout file exists
    try {
      await fsPromises.access(LAYOUT_FILE)
    } catch (error) {
      // File doesn't exist, nothing to backup
      return
    }

    // Read the current file
    const fileContent = await fsPromises.readFile(LAYOUT_FILE, "utf8")

    // Create a backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
    const backupFile = path.join(BACKUP_DIR, `layout-backup-${timestamp}.json`)

    // Write the backup file
    await fsPromises.writeFile(backupFile, fileContent, "utf8")

    // Keep only the last 5 backups
    const backupFiles = await fsPromises.readdir(BACKUP_DIR)
    if (backupFiles.length > 5) {
      // Sort by name (which includes timestamp)
      backupFiles.sort()

      // Remove the oldest backups
      for (let i = 0; i < backupFiles.length - 5; i++) {
        await fsPromises.unlink(path.join(BACKUP_DIR, backupFiles[i]))
      }
    }
  } catch (error) {
    console.error("Error creating backup:", error)
    // Continue even if backup fails
  }
}

// Save layout data to the JSON file
export async function saveLayoutData(
  layoutData: Record<string, { x: number; y: number }>,
): Promise<{ success: boolean; message: string }> {
  try {
    await ensureDataDir()

    // Create a backup before saving
    await createBackup()

    // Format the data with version and timestamp
    const formattedData: LayoutData = {
      version: "1.0",
      timestamp: Date.now(),
      nodes: layoutData,
    }

    // Write the data to the file
    await fsPromises.writeFile(LAYOUT_FILE, JSON.stringify(formattedData, null, 2), "utf8")

    return {
      success: true,
      message: "Layout data saved successfully",
    }
  } catch (error) {
    console.error("Error saving layout data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Enhance the loadLayoutData function to be more robust
export async function loadLayoutData(): Promise<{
  data: Record<string, { x: number; y: number }> | null
  message: string
}> {
  try {
    await ensureDataDir()

    // Check if the file exists
    try {
      await fsPromises.access(LAYOUT_FILE)
    } catch (error) {
      // File doesn't exist yet, return empty data
      console.log("No saved layout file found")
      return {
        data: null,
        message: "No saved layout found",
      }
    }

    // Read the data from the file
    const fileContent = await fsPromises.readFile(LAYOUT_FILE, "utf8")

    try {
      // Try to parse the JSON data
      const parsedData = JSON.parse(fileContent)

      // Check if the data has the new format with version
      if (parsedData.version && parsedData.nodes) {
        console.log("Loaded versioned layout data successfully")
        return {
          data: parsedData.nodes,
          message: "Layout data loaded successfully",
        }
      }

      // Handle legacy format (direct object mapping)
      console.log("Loaded legacy layout data successfully")
      return {
        data: parsedData as Record<string, { x: number; y: number }>,
        message: "Legacy layout data loaded successfully",
      }
    } catch (parseError) {
      console.error("Error parsing layout data:", parseError)
      return {
        data: null,
        message: `Error parsing layout data: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
      }
    }
  } catch (error) {
    console.error("Error loading layout data:", error)
    return {
      data: null,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Add a new function to get the latest layout data without caching
export async function getLatestLayoutData(): Promise<Record<string, { x: number; y: number }> | null> {
  try {
    await ensureDataDir()

    // Check if the file exists
    try {
      await fsPromises.access(LAYOUT_FILE)
    } catch (error) {
      // File doesn't exist yet, return empty data
      return null
    }

    // Read the file directly from disk to ensure we get the latest data
    const fileContent = await fsPromises.readFile(LAYOUT_FILE, "utf8")

    try {
      const parsedData = JSON.parse(fileContent)

      // Check if the data has the new format with version
      if (parsedData.version && parsedData.nodes) {
        return parsedData.nodes
      }

      // Handle legacy format (direct object mapping)
      return parsedData as Record<string, { x: number; y: number }>
    } catch (parseError) {
      console.error("Error parsing layout data:", parseError)
      return null
    }
  } catch (error) {
    console.error("Error getting latest layout data:", error)
    return null
  }
}

// Get all available backups
export async function getBackups(): Promise<{ filename: string; timestamp: string }[]> {
  try {
    await ensureDataDir()

    // Get all files in the backup directory
    const files = await fsPromises.readdir(BACKUP_DIR)

    // Filter for backup files and extract timestamps
    return files
      .filter((file) => file.startsWith("layout-backup-"))
      .map((file) => {
        // Extract timestamp from filename
        const timestamp = file.replace("layout-backup-", "").replace(".json", "")
        return {
          filename: file,
          timestamp,
        }
      })
      .sort((a, b) => b.timestamp.localeCompare(a.timestamp)) // Sort newest first
  } catch (error) {
    console.error("Error getting backups:", error)
    return []
  }
}

// Restore from a specific backup
export async function restoreFromBackup(filename: string): Promise<{ success: boolean; message: string }> {
  try {
    const backupPath = path.join(BACKUP_DIR, filename)

    // Check if the backup file exists
    try {
      await fsPromises.access(backupPath)
    } catch (error) {
      return {
        success: false,
        message: "Backup file not found",
      }
    }

    // Read the backup file
    const backupContent = await fsPromises.readFile(backupPath, "utf8")

    // Create a backup of the current file before restoring
    await createBackup()

    // Restore the backup
    await fsPromises.writeFile(LAYOUT_FILE, backupContent, "utf8")

    return {
      success: true,
      message: "Layout restored from backup successfully",
    }
  } catch (error) {
    console.error("Error restoring from backup:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Add this new function to import layout data from a JSON object
export async function importLayoutData(layoutData: {
  version: string
  timestamp: number
  nodes: Record<string, { x: number; y: number }>
}): Promise<{ success: boolean; message: string }> {
  try {
    await ensureDataDir()

    // Create a backup before importing
    await createBackup()

    // Write the data to the file
    await fsPromises.writeFile(LAYOUT_FILE, JSON.stringify(layoutData, null, 2), "utf8")

    return {
      success: true,
      message: "Layout data imported successfully",
    }
  } catch (error) {
    console.error("Error importing layout data:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
