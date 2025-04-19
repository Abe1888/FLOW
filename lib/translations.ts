// Translation dictionary for English to Amharic
export type Language = "en" | "am"

export interface TranslationDictionary {
  [key: string]: {
    en: string
    am: string
  }
}

// Solar System Component Translations
export const solarSystemTranslations: TranslationDictionary = {
  // Ensure "Environmental Sensor" is translated with high priority
  // Add this at the beginning of the dictionary or in a prominent place
  "Environmental Sensor": {
    en: "Environmental Sensor",
    am: "የአካባቢ ሴንሰር",
  },
  // General terms
  "Solar System": {
    en: "Solar System",
    am: "የፀሐይ ሥርዓት",
  },
  "Solar Panel": {
    en: "Solar Panel",
    am: "የፀሐይ ፓነል",
  },
  "Solar Panel System": {
    en: "Solar Panel System",
    am: "የፀሐይ ፓነል ሥርዓት",
  },
  "Battery Bank": {
    en: "Battery Bank",
    am: "የባትሪ ባንክ",
  },
  "Charge Controller": {
    en: "Charge Controller",
    am: "የቻርጅ ተቆጣጣሪ",
  },
  Inverter: {
    en: "Inverter",
    am: "ኢንቨርተር",
  },
  "Inverter & Power Control": {
    en: "Inverter & Power Control",
    am: "ኢንቨርተር እና የኃይል ቁጥጥር",
  },
  "Distribution Panel": {
    en: "Distribution Panel",
    am: "የስርጭት ፓነል",
  },
  "System Status": {
    en: "System Status",
    am: "የሥርዓት ሁኔታ",
  },
  "Ethiopia Energy Network": {
    en: "Ethiopia Energy Network",
    am: "የኢትዮጵያ የኃይል አውታር",
  },
  "Ethiopia Solar Network": {
    en: "Ethiopia Solar Network",
    am: "የኢትዮጵያ የፀሐይ አውታር",
  },
  "Weather Conditions": {
    en: "Weather Conditions",
    am: "የአየር ሁኔታዎች",
  },
  "Safety Breaker": {
    en: "Safety Breaker",
    am: "የደህንነት ብሬከር",
  },
  "Backup Generator": {
    en: "Backup Generator",
    am: "ተጠባባቂ ጀነሬተር",
  },
  "I/O Controller": {
    en: "I/O Controller",
    am: "የግብዓት/ውጤት ተቆጣጣሪ",
  },
  "Smart Appliance": {
    en: "Smart Appliance",
    am: "ብልህ መሣሪያ",
  },

  // Weather conditions
  Sunny: {
    en: "Sunny",
    am: "ፀሐያማ",
  },
  Cloudy: {
    en: "Cloudy",
    am: "ደመናማ",
  },
  Rainy: {
    en: "Rainy",
    am: "ዝናባማ",
  },
  "Clear skies, optimal solar production": {
    en: "Clear skies, optimal solar production",
    am: "ጥሩ ሰማይ፣ ምርጥ የፀሐይ ምርት",
  },
  "Partial cloud cover, reduced solar efficiency": {
    en: "Partial cloud cover, reduced solar efficiency",
    am: "በከፊል ደመን፣ የቀነሰ የፀሐይ ውጤታማነት",
  },
  "Heavy cloud cover and rain, minimal solar production": {
    en: "Heavy cloud cover and rain, minimal solar production",
    am: "ከባድ ደመን እና ዝናብ፣ አነስተኛ የፀሐይ ምርት",
  },
  "CURRENT CONDITIONS": {
    en: "CURRENT CONDITIONS",
    am: "የአሁኑ ሁኔታዎች",
  },
  SUNNY: {
    en: "SUNNY",
    am: "ፀሐያማ",
  },
  CLOUDY: {
    en: "CLOUDY",
    am: "ደመናማ",
  },
  RAINY: {
    en: "RAINY",
    am: "ዝናባማ",
  },

  // Status terms
  Active: {
    en: "Active",
    am: "ንቁ",
  },
  Warning: {
    en: "Warning",
    am: "ማስጠንቀቂያ",
  },
  Offline: {
    en: "Offline",
    am: "ከመስመር ውጪ",
  },
  Charging: {
    en: "Charging",
    am: "በመሙላት ላይ",
  },
  Discharging: {
    en: "Discharging",
    am: "በመልቀቅ ላይ",
  },
  Balanced: {
    en: "Balanced",
    am: "ተመጣጣኝ",
  },
  Running: {
    en: "Running",
    am: "በሥራ ላይ",
  },
  Standby: {
    en: "Standby",
    am: "ዝግጁ",
  },
  Connected: {
    en: "Connected",
    am: "ተገናኝቷል",
  },
  Disconnected: {
    en: "Disconnected",
    am: "ተቋርጧል",
  },
  "Grid Connected": {
    en: "Grid Connected",
    am: "ከኤሌክትሪክ መስመር ጋር ተገናኝቷል",
  },
  "Connected to grid": {
    en: "Connected to grid",
    am: "ከኤሌክትሪክ መስመር ጋር ተገናኝቷል",
  },
  "Low Input": {
    en: "Low Input",
    am: "ዝቅተኛ ግብዓት",
  },
  Normal: {
    en: "Normal",
    am: "መደበኛ",
  },
  PROTECTED: {
    en: "PROTECTED",
    am: "ተጠብቋል",
  },
  DISCONNECTED: {
    en: "DISCONNECTED",
    am: "ተቋርጧል",
  },
  CHARGING: {
    en: "CHARGING",
    am: "በመሙላት ላይ",
  },
  RUNNING: {
    en: "RUNNING",
    am: "በሥራ ላይ",
  },
  MONITORING: {
    en: "MONITORING",
    am: "በክትትል ላይ",
  },
  OFFLINE: {
    en: "OFFLINE",
    am: "ከመስመር ውጪ",
  },
  STANDBY: {
    en: "STANDBY",
    am: "ዝግጁ",
  },
  ONLINE: {
    en: "ONLINE",
    am: "በመስመር ላይ",
  },

  // Measurement units and parameters
  "Battery Level": {
    en: "Battery Level",
    am: "የባትሪ መጠን",
  },
  "Solar Output": {
    en: "Solar Output",
    am: "የፀሐይ ውጤት",
  },
  "Power Consumption": {
    en: "Power Consumption",
    am: "የኃይል ፍጆታ",
  },
  "System Voltage": {
    en: "System Voltage",
    am: "የሥርዓት ቮልቴጅ",
  },
  Temperature: {
    en: "Temperature",
    am: "የሙቀት መጠን",
  },
  Humidity: {
    en: "Humidity",
    am: "የአየር እርጥበት",
  },
  Wind: {
    en: "Wind",
    am: "ነፋስ",
  },
  Sunlight: {
    en: "Sunlight",
    am: "የፀሐይ ብርሃን",
  },
  Efficiency: {
    en: "Efficiency",
    am: "ውጤታማነት",
  },
  Voltage: {
    en: "Voltage",
    am: "ቮልቴጅ",
  },
  Current: {
    en: "Current",
    am: "ኤሌክትሪክ ፍሰት",
  },
  Power: {
    en: "Power",
    am: "ኃይል",
  },
  Watts: {
    en: "Watts",
    am: "ዋት",
  },
  Output: {
    en: "Output",
    am: "ውጤት",
  },
  Input: {
    en: "Input",
    am: "ግብዓት",
  },
  Load: {
    en: "Load",
    am: "ጫና",
  },
  "Fuel Level": {
    en: "Fuel Level",
    am: "የነዳጅ መጠን",
  },
  Runtime: {
    en: "Runtime",
    am: "የሥራ ጊዜ",
  },
  "Sun Intensity": {
    en: "Sun Intensity",
    am: "የፀሐይ ጥንካሬ",
  },
  "LOAD LEVEL": {
    en: "LOAD LEVEL",
    am: "የጫና ደረጃ",
  },
  "AIR QUALITY INDEX": {
    en: "AIR QUALITY INDEX",
    am: "የአየር ጥራት መለኪያ",
  },
  SUNLIGHT: {
    en: "SUNLIGHT",
    am: "የፀሐይ ብርሃን",
  },
  TEMP: {
    en: "TEMP",
    am: "ሙቀት",
  },
  HUMIDITY: {
    en: "HUMIDITY",
    am: "እርጥበት",
  },
  WIND: {
    en: "WIND",
    am: "ነፋስ",
  },
  "DC INPUT": {
    en: "DC INPUT",
    am: "የዲሲ ግብዓት",
  },
  "AC OUTPUT": {
    en: "AC OUTPUT",
    am: "የኤሲ ውፅዓት",
  },
  "PV INPUT": {
    en: "PV INPUT",
    am: "የፓነል ግብዓት",
  },
  BATTERY: {
    en: "BATTERY",
    am: "ባትሪ",
  },
  EFF: {
    en: "EFF",
    am: "ውጤት",
  },
  CURRENT: {
    en: "CURRENT",
    am: "ኤሌክትሪክ ፍሰት",
  },
  VOLTAGE: {
    en: "VOLTAGE",
    am: "ቮልቴጅ",
  },
  Health: {
    en: "Health",
    am: "ጤንነት",
  },
  "Connection Type": {
    en: "Connection Type",
    am: "የግንኙነት ዓይነት",
  },
  "Battery Type": {
    en: "Battery Type",
    am: "የባትሪ ዓይነት",
  },
  Capacity: {
    en: "Capacity",
    am: "አቅም",
  },
  Lead: {
    en: "Lead",
    am: "የእርሳስ",
  },
  "Li-Ion": {
    en: "Li-Ion",
    am: "ሊ-አዮን",
  },
  Gel: {
    en: "Gel",
    am: "ጄል",
  },
  parallel: {
    en: "parallel",
    am: "ትይዩ",
  },
  series: {
    en: "series",
    am: "ተከታታይ",
  },
  "Voltage mismatch with system": {
    en: "Voltage mismatch with system",
    am: "ከሥርዓቱ ጋር የማይጣጣም ቮልቴጅ",
  },
  Enabled: {
    en: "Enabled",
    am: "ነቅቷል",
  },
  Disabled: {
    en: "Disabled",
    am: "ተሰናክሏል",
  },
  "FUEL LEVEL": {
    en: "FUEL LEVEL",
    am: "የነዳጅ መጠን",
  },
  TOTAL: {
    en: "TOTAL",
    am: "ጠቅላላ",
  },
  OIL: {
    en: "OIL",
    am: "ዘይት",
  },
  ENGINE: {
    en: "ENGINE",
    am: "ሞተር",
  },
  "ENGINE BLOCK": {
    en: "ENGINE BLOCK",
    am: "የሞተር ብሎክ",
  },
  "SYSTEM EFFICIENCY": {
    en: "SYSTEM EFFICIENCY",
    am: "የሥርዓት ውጤታማነት",
  },

  // Control actions
  Configure: {
    en: "Configure",
    am: "አዋቅር",
  },
  "Add Component": {
    en: "Add Component",
    am: "አካል ጨምር",
  },
  "Save Layout": {
    en: "Save Layout",
    am: "አቀማመጥ አስቀምጥ",
  },
  "Reset Layout": {
    en: "Reset Layout",
    am: "አቀማመጥ ዳግም አስጀምር",
  },
  "Share Layout": {
    en: "Share Layout",
    am: "አቀማመጥ አጋራ",
  },
  "Auto Save": {
    en: "Auto Save",
    am: "ራስ-ሰር ማስቀመጫ",
  },
  "Panel Active": {
    en: "Panel Active",
    am: "ፓነል ንቁ",
  },
  "System Power": {
    en: "System Power",
    am: "የሥርዓት ኃይል",
  },
  "Engine Power": {
    en: "Engine Power",
    am: "የሞተር ኃይል",
  },
  "Sensor Status": {
    en: "Sensor Status",
    am: "የሴንሰር ሁኔታ",
  },
  "Operation Mode": {
    en: "Operation Mode",
    am: "የሥራ ሁኔታ",
  },
  Auto: {
    en: "Auto",
    am: "ራስ-ሰር",
  },
  Manual: {
    en: "Manual",
    am: "በእጅ",
  },
  ON: {
    en: "ON",
    am: "በርቷል",
  },
  OFF: {
    en: "OFF",
    am: "ጠፍቷል",
  },
  "Layout Controls": {
    en: "Layout Controls",
    am: "የአቀማመጥ መቆጣጠሪያዎች",
  },
  "Close panel": {
    en: "Close panel",
    am: "ፓነሉን ዝጋ",
  },
  "Layout saved": {
    en: "Layout saved",
    am: "አቀማመጥ ተቀምጧል",
  },
  components: {
    en: "components",
    am: "አካላት",
  },
  "No saved layout": {
    en: "No saved layout",
    am: "የተቀመጠ አቀማመጥ የለም",
  },
  "Save to My Layouts": {
    en: "Save to My Layouts",
    am: "ወደ የኔ አቀማመጦች አስቀምጥ",
  },
  "Component Label": {
    en: "Component Label",
    am: "የአካል መለያ",
  },
  "Enter label...": {
    en: "Enter label...",
    am: "መለያ ያስገቡ...",
  },
  "This label will be displayed on the component": {
    en: "This label will be displayed on the component",
    am: "ይህ መለያ በአካሉ ላይ ይታያል",
  },
  Add: {
    en: "Add",
    am: "ጨምር",
  },
  Cancel: {
    en: "Cancel",
    am: "ሰርዝ",
  },
  "Power Components": {
    en: "Power Components",
    am: "የኃይል አካላት",
  },
  "Monitoring Components": {
    en: "Monitoring Components",
    am: "የክትትል አካላት",
  },
  "Utility Components": {
    en: "Utility Components",
    am: "የጥቅም አካላት",
  },
  "Special Components": {
    en: "Special Components",
    am: "ልዩ አካላት",
  },
  "Add a new solar panel with automatic connections": {
    en: "Add a new solar panel with automatic connections",
    am: "አዲስ የፀሐይ ፓነል ከራስሰር ግንኙነቶች ጋር ጨምር",
  },
  "Add a new battery bank with automatic connections": {
    en: "Add a new battery bank ከራስሰር ግንኙነቶች ጋር ጨምር",
    am: "አዲስ የባትሪ ባንክ ከራስሰር ግንኙነቶች ጋር ጨምር",
  },
  "Circuit Breaker": {
    en: "Circuit Breaker",
    am: "የሰርኪት ብሬከር",
  },
  Status: {
    en: "Status",
    am: "ሁኔታ",
  },
  Battery: {
    en: "Battery",
    am: "ባትሪ",
  },
  "Component Configuration": {
    en: "Component Configuration",
    am: "የአካል ውቅር",
  },
  "Battery Configuration": {
    en: "Battery Configuration",
    am: "የባትሪ ውቅር",
  },
  "Unlinked Component": {
    en: "Unlinked Component",
    am: "ያልተገናኘ አካል",
  },
  "Connect to": {
    en: "Connect to",
    am: "ከዚህ ጋር አገናኝ",
  },
  "Any component": {
    en: "Any component",
    am: "ማንኛውም አካል",
  },
  Value: {
    en: "Value",
    am: "እሴት",
  },
  "Sunlight %": {
    en: "Sunlight %",
    am: "የፀሐይ ብርሃን %",
  },
  "Usage (W)": {
    en: "Usage (W)",
    am: "አጠቃቀም (ዋት)",
  },
  "Remove component": {
    en: "Remove component",
    am: "አካል አስወግድ",
  },
  "Edit label": {
    en: "Edit label",
    am: "መለያ አርትዕ",
  },
  "Save label": {
    en: "Save label",
    am: "መለያ አስቀምጥ",
  },
  "Cancel editing": {
    en: "Cancel editing",
    am: "አርትዕ ሰርዝ",
  },
  Inactive: {
    en: "Inactive",
    am: "ንቁ ያልሆነ",
  },

  // Ethiopian regions
  "Addis Ababa": {
    en: "Addis Ababa",
    am: "አዲስ አበባ",
  },
  Tigray: {
    en: "Tigray",
    am: "ትግራይ",
  },
  Amhara: {
    en: "Amhara",
    am: "አማራ",
  },
  Oromia: {
    en: "Oromia",
    am: "ኦሮሚያ",
  },
  Somali: {
    en: "Somali",
    am: "ሶማሊ",
  },

  // Device names
  Television: {
    en: "Television",
    am: "ቴሌቪዥን",
  },
  "LED Lights": {
    en: "LED Lights",
    am: "ኤልኢዲ መብራቶች",
  },
  "Wall Sockets": {
    en: "Wall Sockets",
    am: "የግድግዳ ሶኬቶች",
  },
  "Wi-Fi Router": {
    en: "Wi-Fi Router",
    am: "ዋይ-ፋይ ራውተር",
  },

  // Technical specifications
  Specifications: {
    en: "Specifications",
    am: "ዝርዝር ባህሪያት",
  },
  Type: {
    en: "Type",
    am: "ዓይነት",
  },
  "Max Power": {
    en: "Max Power",
    am: "ከፍተኛ ኃይል",
  },
  Dimensions: {
    en: "Dimensions",
    am: "መጠኖች",
  },
  Monocrystalline: {
    en: "Monocrystalline",
    am: "ሞኖክሪስታላይን",
  },

  // System messages
  "Connection created successfully!": {
    en: "Connection created successfully!",
    am: "ግንኙነት በተሳካ ሁኔታ ተፈጥሯል!",
  },
  "Connection removed successfully": {
    en: "Connection removed successfully",
    am: "ግንኙነት በተሳካ ሁኔታ ተወግዷል",
  },
  "Cannot remove critical system connection": {
    en: "Cannot remove critical system connection",
    am: "አስፈላጊ የሥርዓት ግንኙነትን ማስወገድ አይቻልም",
  },
  "Invalid connection": {
    en: "Invalid connection",
    am: "ልክ ያልሆነ ግንኙነት",
  },
  "This connection is not allowed": {
    en: "This connection is not allowed",
    am: "ይህ ግንኙነት አይፈቀድም",
  },
  "Layout saved successfully!": {
    en: "Layout saved successfully!",
    am: "አቀማመጥ በተሳካ ሁኔታ ተቀምጧል!",
  },
  "Layout URL copied to clipboard!": {
    en: "Layout URL copied to clipboard!",
    am: "የአቀማመጥ ዩአርኤል ወደ ቅንጥብ ሰሌዳ ተቀድቷል!",
  },
  "Safety breaker tripped due to overload!": {
    en: "Safety breaker tripped due to overload!",
    am: "የደህንነት ብሬከር በከፍተኛ ጫና ምክንያት ተቋርጧል!",
  },
  "New solar panel added and connected successfully!": {
    en: "New solar panel added and connected successfully!",
    am: "አዲስ የፀሐይ ፓነል ታክሎ በተሳካ ሁኔታ ተገናኝቷል!",
  },
  "New battery added and connected successfully!": {
    en: "New battery added and connected successfully!",
    am: "አዲስ ባትሪ ታክሎ በተሳካ ሁኔታ ተገናኝቷል!",
  },
  "New component added successfully!": {
    en: "New component added successfully!",
    am: "አዲስ አካል በተሳካ ሁኔታ ታክሏል!",
  },
  "Component removed successfully!": {
    en: "Component removed successfully!",
    am: "አካል በተሳካ ሁኔታ ተወግዷል!",
  },

  // Language selector
  Language: {
    en: "Language",
    am: "ቋንቋ",
  },
  English: {
    en: "English",
    am: "እንግሊዝኛ",
  },
  Amharic: {
    en: "Amharic",
    am: "አማርኛ",
  },

  // Add these missing translations to the solarSystemTranslations dictionary

  // Safety Breaker specific translations
  "SAFE-GUARD": {
    en: "SAFE-GUARD",
    am: "ደህንነት-ጠባቂ",
  },
  "CB-240": {
    en: "CB-240",
    am: "ሲቢ-240",
  },
  TRIP: {
    en: "TRIP",
    am: "መቋረጥ",
  },

  // Environmental Sensor specific translations
  "ENVI-SENSE": {
    en: "ENVI-SENSE",
    am: "አካባቢ-ስሜት",
  },
  "MS-200": {
    en: "MS-200",
    am: "ኤምኤስ-200",
  },
  "Monitors environmental conditions": {
    en: "Monitors environmental conditions",
    am: "የአካባቢ ሁኔታዎችን ይከታተላል",
  },

  // Inverter specific translations
  "POWER-WAVE": {
    en: "POWER-WAVE",
    am: "ኃይል-ሞገድ",
  },
  "INV-2400": {
    en: "INV-2400",
    am: "አይኤንቪ-2400",
  },

  // Charge Controller specific translations
  "SOLAR-PRO": {
    en: "SOLAR-PRO",
    am: "ፀሐይ-ፕሮ",
  },
  "MPPT-120": {
    en: "MPPT-120",
    am: "ኤምፒፒቲ-120",
  },

  // IO Controller specific translations
  "SMART-LOGIC": {
    en: "SMART-LOGIC",
    am: "ብልህ-ሎጂክ",
  },
  "IC-5000": {
    en: "IC-5000",
    am: "አይሲ-5000",
  },
  "SYSTEM STATUS": {
    en: "SYSTEM STATUS",
    am: "የሥርዓት ሁኔታ",
  },
  "Manages system operations": {
    en: "Manages system operations",
    am: "የሥርዓት ሥራዎችን ያስተዳድራል",
  },

  // Backup Generator specific translations
  "POWER-GEN": {
    en: "POWER-GEN",
    am: "ኃይል-ጀነሬተር",
  },
  "DG-1000": {
    en: "DG-1000",
    am: "ዲጂ-1000",
  },
  OUTPUT: {
    en: "OUTPUT",
    am: "ውጤት",
  },
  RUNTIME: {
    en: "RUNTIME",
    am: "የሥራ ጊዜ",
  },
  "Alternative power source": {
    en: "Alternative power source",
    am: "አማራጭ የኃይል ምንጭ",
  },

  // Load Device specific translations
  "SMART-TECH": {
    en: "SMART-TECH",
    am: "ብልህ-ቴክ",
  },
  "SA-100": {
    en: "SA-100",
    am: "ኤስኤ-100",
  },
  "POWER USAGE": {
    en: "POWER USAGE",
    am: "የኃይል አጠቃቀም",
  },
  WATTS: {
    en: "WATTS",
    am: "ዋት",
  },
  ACTIVE: {
    en: "ACTIVE",
    am: "ንቁ",
  },
  SMART: {
    en: "SMART",
    am: "ብልህ",
  },
  "Power-consuming appliance": {
    en: "Power-consuming appliance",
    am: "ኃይል የሚጠቀም መሣሪያ",
  },
  Min: {
    en: "Min",
    am: "ዝቅተኛ",
  },
  Max: {
    en: "Max",
    am: "ከፍተኛ",
  },
  "Change language": {
    en: "Change language",
    am: "ቋንቋ ይቀይሩ",
  },
  "Loading translations": {
    en: "Loading translations",
    am: "ትርጉሞችን በመጫን ላይ",
  },
  "Translation not found": {
    en: "Translation not found",
    am: "ትርጉም አልተገኘም",
  },
  "POWER DISTRIBUTION": {
    en: "POWER DISTRIBUTION",
    am: "የኃይል ስርጭት",
  },
  "CIRCUIT BREAKERS": {
    en: "CIRCUIT BREAKERS",
    am: "የሰርኪት ብሬከሮች",
  },
  "POWER ON": {
    en: "POWER ON",
    am: "ኃይል በርቷል",
  },
  "POWER OFF": {
    en: "POWER OFF",
    am: "ኃይል ጠፍቷል",
  },
  "GRID CONNECTION": {
    en: "GRID CONNECTION",
    am: "የኤሌክትሪክ መስመር ግንኙነት",
  },
  "Ethiopia Grid": {
    en: "Ethiopia Grid",
    am: "የኢትዮጵያ የኤሌክትሪክ መስመር",
  },

  // Battery specific translations
  "Power Cell Dual": {
    en: "Power Cell Dual",
    am: "የኃይል ሴል ድርብ",
  },
  "Deep Cycle Battery": {
    en: "Deep Cycle Battery",
    am: "ጥልቅ ዑደት ባትሪ",
  },
  "Battery System": {
    en: "Battery System",
    am: "የባትሪ ሥርዓት",
  },
  "Parallel Connection": {
    en: "Parallel Connection",
    am: "ትይዩ ግንኙነት",
  },

  // Component types and descriptions
  Sensor: {
    en: "Sensor",
    am: "ሴንሰር",
  },
  Controller: {
    en: "Controller",
    am: "ተቆጣጣሪ",
  },
  Display: {
    en: "Display",
    am: "ማሳያ",
  },
  Connector: {
    en: "Connector",
    am: "አገናኝ",
  },
  "Breaker Panel": {
    en: "Breaker Panel",
    am: "የብሬከር ፓነል",
  },
  "System Monitor": {
    en: "System Monitor",
    am: "የሥርዓት ክትትል",
  },
  "Load Device": {
    en: "Load Device",
    am: "የጫና መሣሪያ",
  },
  "Shows system information": {
    en: "Shows system information",
    am: "የሥርዓት መረጃን ያሳያል",
  },
  "Links system components": {
    en: "Links system components",
    am: "የሥርዓት አካላትን ያገናኛል",
  },
  "Safety and circuit protection": {
    en: "Safety and circuit protection",
    am: "የደህንነት እና የሰርኪት ጥበቃ",
  },
  "Displays performance metrics": {
    en: "Displays performance metrics",
    am: "የአፈጻጸም መለኪያዎችን ያሳያል",
  },

  // Navigation and UI
  "Back to Tech Innovation": {
    en: "Back to Tech Innovation",
    am: "ወደ ቴክ ፈጠራ ተመለስ",
  },
  "Back to Simulator": {
    en: "Back to Simulator",
    am: "ወደ ሲሙሌተር ተመለስ",
  },
  Simulator: {
    en: "Simulator",
    am: "ሲሙሌተር",
  },
  "Tech Stack": {
    en: "Tech Stack",
    am: "የቴክኖሎጂ ክምችት",
  },
  "Close menu": {
    en: "Close menu",
    am: "ምናሌ ዝጋ",
  },
  "Open menu": {
    en: "Open menu",
    am: "ምናሌ ክፈት",
  },
  "Technology Stack": {
    en: "Technology Stack",
    am: "የቴክኖሎጂ ክምችት",
  },
  "A comprehensive list of technologies and libraries used in the solar system simulator": {
    en: "A comprehensive list of technologies and libraries used in the solar system simulator",
    am: "በፀሐይ ሥርዓት ሲሙ��ተር ውስጥ ጥቅም ላይ የዋሉ ቴክኖሎጂዎች እና ላይብረሪዎች ዝርዝር",
  },
  "Search technologies...": {
    en: "Search technologies...",
    am: "ቴክኖሎጂዎችን ፈልግ...",
  },
  "Search technologies": {
    en: "Search technologies",
    am: "ቴክኖሎጂዎችን ፈልግ",
  },
  technologies: {
    en: "technologies",
    am: "ቴክኖሎጂዎች",
  },
  Category: {
    en: "Category",
    am: "ምድብ",
  },
  "Technology / Library": {
    en: "Technology / Library",
    am: "ቴክኖሎጂ / ላይብረሪ",
  },
  Role: {
    en: "Role",
    am: "ሚና",
  },
  Documentation: {
    en: "Documentation",
    am: "ሰነድ",
  },
  "Documentation for": {
    en: "Documentation for",
    am: "የዚህ ሰነድ",
  },
  "No technologies found matching your search.": {
    en: "No technologies found matching your search.",
    am: "ከፍለጋዎ ጋር የሚዛመዱ ቴክኖሎጂዎች አልተገኙም።",
  },

  // Tech categories
  "Frontend Framework": {
    en: "Frontend Framework",
    am: "የፊት-መጨረሻ ማዕቀፍ",
  },
  UI: {
    en: "UI",
    am: "የተጠቃሚ ገጽታ",
  },
  Visualization: {
    en: "Visualization",
    am: "የእይታ አቀራረብ",
  },
  Icons: {
    en: "Icons",
    am: "አዶዎች",
  },
  "State Management": {
    en: "State Management",
    am: "የሁኔታ አስተዳደር",
  },
  Animation: {
    en: "Animation",
    am: "እንቅስቃሴ",
  },
  Storage: {
    en: "Storage",
    am: "ማከማቻ",
  },
  Utilities: {
    en: "Utilities",
    am: "መገልገያዎች",
  },
  Internationalization: {
    en: "Internationalization",
    am: "አለም አቀፋዊነት",
  },
  Performance: {
    en: "Performance",
    am: "አፈጻጸም",
  },

  // Tech descriptions
  "Core application framework with server-side rendering and routing": {
    en: "Core application framework framework with server-side rendering and routing",
    am: "የሰርቨር-ጎን አሳያ እና ጎዳና ማስያዣ ያለው ዋና የመተግበሪያ ማዕቀፍ",
  },
  "Utility-first CSS framework for styling components": {
    en: "Utility-first CSS framework for styling components",
    am: "ለአካላት ቅጥ መስጫ የሚያገለግል መገልገያ-መጀመሪያ የሲኤስኤስ ማዕቀፍ",
  },
  "Reusable component library built with Radix UI and Tailwind CSS": {
    en: "Reusable component library built with Radix UI and Tailwind CSS",
    am: "በራዲክስ ዩአይ እና ቴይልዊንድ ሲኤስኤስ የተገነባ እንደገና ጥቅም ላይ የሚውል የአካል ላይብረሪ",
  },
  "Library for building node-based interactive diagrams": {
    en: "Library for building node-based interactive diagrams",
    am: "ኖድ-ተኮር ተግባራዊ ንድፎችን ለመገንባት የሚያገለግል ላይብረሪ",
  },
  "Icon library with clean, consistent design": {
    en: "Icon library with clean, consistent design",
    am: "ንጹህ፣ ተመጣጣኝ ንድፍ ያለው የአዶ ላይብረሪ",
  },
  "Global state management for component settings and language": {
    en: "Global state management for component settings and language",
    am: "ለአካል ቅንብሮች እና ቋንቋ የሚያገለግል ዓለም አቀፍ የሁኔታ አስተዳደር",
  },
  "Animation library for creating fluid UI transitions": {
    en: "Animation library for creating fluid UI transitions",
    am: "ለስላሳ የተጠቃሚ ገጽታ ሽግግሮችን ለመፍጠር የሚያገለግል የእንቅስቃሴ ላይብረሪ",
  },
  "Persistent storage for saving user layouts and preferences": {
    en: "Persistent storage for saving user layouts and preferences",
    am: "የተጠቃሚ አቀማመጦችን እና ምርጫዎችን ለማስቀመጥ የሚያገለግል ቋሚ ማከማቻ",
  },
  "Static type checking for improved code quality and developer experience": {
    en: "Static type checking for improved code quality and developer experience",
    am: "የተሻሻለ የኮድ ጥራት እና የገንቢ ተሞክሮ ለማግኘት የሚያገለግል ቋሚ ዓይነት ማረጋገጫ",
  },
  "Date manipulation library for handling timestamps and date formatting": {
    en: "Date manipulation library for handling timestamps and date formatting",
    am: "የጊዜ ማህተሞችን እና የቀን ቅርጸት ለማስተዳደር የሚያገለግል የቀን ማዘዋወሪያ ላይብረሪ",
  },
  "Library for creating variant components with TypeScript support": {
    en: "Library for creating variant components with TypeScript support",
    am: "በታይፕስክሪፕት ድጋፍ የተለያዩ አካላትን ለመፍጠር የሚያገለግል ላይብረሪ",
  },
  "Utility for constructing className strings conditionally": {
    en: "Utility for constructing className strings conditionally",
    am: "በሁኔታ ላይ የተመሰረተ የክላስኔም ሕብረቁምፊዎችን ለመገንባት የሚያገለግል መገልገያ",
  },
  "Utility for merging Tailwind CSS classes without conflicts": {
    en: "Utility for merging Tailwind CSS classes without conflicts",
    am: "ያለ ግጭት የቴይልዊንድ ሲኤስኤስ ክፍሎችን ለማዋሃድ የሚያገለግል መገልገያ",
  },
  "Custom internationalization implementation for multi-language support": {
    en: "Custom internationalization implementation for multi-language support",
    am: "ለብዙ ቋንቋ ድጋፍ የሚያገለግል ብጁ አለም አቀፋዊነት ትግበራ",
  },
  "Optimization hooks to prevent unnecessary re-renders": {
    en: "Optimization hooks to prevent unnecessary re-renders",
    am: "ያላስፈላጊ እንደገና-ማሳየቶችን ለመከላከል የሚያገለግሉ የማሻሻያ ሜንጦዎች",
  },
  "Headless UI components for building accessible interfaces": {
    en: "Headless UI components for building accessible interfaces",
    am: "ተደራሽ ገጽታዎችን ለመገንባት የሚያገለግሉ ራስ-አልባ የተጠቃሚ ገጽታ አካላት",
  },

  // System initialization
  "Initializing solar system...": {
    en: "Initializing solar system...",
    am: "የፀሐይ ሥርዓትን በማስጀመር ላይ...",
  },

  // Layout contains
  "Layout contains {{count}} components": {
    en: "Layout contains {{count}} components",
    am: "አቀማመጥ {{count}} አካላት ይዟል",
  },
  "Solar Production": {
    en: "Solar Production",
    am: "የፀሐይ ምርት",
  },
  "Battery Status": {
    en: "Battery Status",
    am: "የባትሪ ሁኔታ",
  },
  "Power Consumption": {
    en: "Power Consumption",
    am: "የኃይል ፍጆታ",
  },
  "Direct Solar + Charging": {
    en: "Direct Solar + Charging",
    am: "ቀጥታ የፀሐይ + መሙላት",
  },
  "System Control": {
    en: "System Control",
    am: "የሥርዓት ቁጥጥር",
  },
  "Circuit Breaker": {
    en: "Circuit Breaker",
    am: "የሰርኪት ብሬከር",
  },
  PSI: {
    en: "PSI",
    am: "ፒኤስአይ",
  },
  RPM: {
    en: "RPM",
    am: "አርፒኤም",
  },
  "Current Conditions": {
    en: "Current Conditions",
    am: "የአሁኑ ሁኔታዎች",
  },
  "Power Level": {
    en: "Power Level",
    am: "የኃይል ደረጃ",
  },
  "Connection Type: Parallel Connection": {
    en: "Connection Type: Parallel Connection",
    am: "የግንኙነት ዓይነት: ትይዩ ግንኙነት",
  },
  "Battery System": {
    en: "Battery System",
    am: "የባትሪ ሥርዓት",
  },
  "Center View": {
    en: "Center View",
    am: "ዋና እይታ",
  },
  "Fit view": {
    en: "Fit view",
    am: "ሙሉ እይታ",
  },
  "Zoom in": {
    en: "Zoom in",
    am: "አቅርብ",
  },
  "Zoom out": {
    en: "Zoom out",
    am: "አራራቅ",
  },
  "Emergency Mode": {
    en: "Emergency Mode",
    am: "የአስቸኳይ ጊዜ ሁኔታ",
  },
  "Battery Discharge": {
    en: "Battery Discharge",
    am: "የባትሪ መልቀቅ",
  },
  "Power Conservation": {
    en: "Power Conservation",
    am: "የኃይል ቁጠባ",
  },
  "System Off": {
    en: "System Off",
    am: "ሥርዓት ጠፍቷል",
  },
  "Manual Control": {
    en: "Manual Control",
    am: "በእጅ መቆጣጠሪያ",
  },
  "Layout Settings": {
    en: "Layout Settings",
    am: "የአቀማመጥ ቅንብሮች",
  },
  "Remember component positions": {
    en: "Remember component positions",
    am: "የአካል ቦታዎችን አስታውስ",
  },
  "Save Current Layout": {
    en: "Save Current Layout",
    am: "አሁን ያለውን አቀማመጥ አስቀምጥ",
  },
  "Reset to Default": {
    en: "Reset to Default",
    am: "ወደ ነባሩ መልስ",
  },
  "Save to Project": {
    en: "Save to Project",
    am: "ወደ ፕሮጀክት አስቀምጥ",
  },
  "Shared layout saved to your account": {
    en: "Shared layout saved to your account",
    am: "የተጋራ አቀማመጥ ወደ መለያዎ ተቀምጧል",
  },
  "Shareable URL copied to clipboard": {
    en: "Shareable URL copied to clipboard",
    am: "የሚጋራ ዩአርኤል ወደ ቅንጥብ ሰሌዳ ተቀድቷል",
  },
  Heat: {
    en: "Heat",
    am: "ሙቀት",
  },
  "Oil Pressure": {
    en: "Oil Pressure",
    am: "የዘይት ግፊት",
  },
  "Fan Speed": {
    en: "Fan Speed",
    am: "የአየር መንፊያ ፍጥነት",
  },
  Fuel: {
    en: "Fuel",
    am: "ነዳጅ",
  },
  Cooling: {
    en: "Cooling",
    am: "ማቀዝቀዝ",
  },
  Vibration: {
    en: "Vibration",
    am: "ንዝረት",
  },
  "Heat Shimmer": {
    en: "Heat Shimmer",
    am: "የሙቀት ብልጭታ",
  },
  Smoke: {
    en: "Smoke",
    am: "ጭስ",
  },
  "Smoke Opacity": {
    en: "Smoke Opacity",
    am: "የጭስ ጥግግት",
  },
  "Smoke Density": {
    en: "Smoke Density",
    am: "የጭስ ብዛት",
  },
  "Panel Background": {
    en: "Panel Background",
    am: "የፓነል ዳራ",
  },
  "Panel Border": {
    en: "Panel Border",
    am: "የፓነል ድንበር",
  },
  "Text Color": {
    en: "Text Color",
    am: "የጽሑፍ ቀለም",
  },
  "Accent Color": {
    en: "Accent Color",
    am: "የአክሰንት ቀለም",
  },
  "Font Size": {
    en: "Font Size",
    am: "የፊደል መጠን",
  },
  "Gradient Start": {
    en: "Gradient Start",
    am: "የግራዲየንት መጀመሪያ",
  },
  "Gradient End": {
    en: "Gradient End",
    am: "የግራዲየንት መጨረሻ",
  },
  "Active Border Color": {
    en: "Active Border Color",
    am: "የንቁ ድንበር ቀለም",
  },
  "Inactive Border Color": {
    en: "Inactive Border Color",
    am: "የንቁ ያልሆነ ድንበር ቀለም",
  },
  "Border Width": {
    en: "Border Width",
    am: "የድንበር ስፋት",
  },
  "Border Radius": {
    en: "Border Radius",
    am: "የድንበር ክብ",
  },
  Shadow: {
    en: "Shadow",
    am: "ጥላ",
  },
  None: {
    en: "None",
    am: "ምንም",
  },
  Small: {
    en: "Small",
    am: "ትንሽ",
  },
  Medium: {
    en: "Medium",
    am: "መካከለኛ",
  },
  Large: {
    en: "Large",
    am: "ትልቅ",
  },
  "Customize Component": {
    en: "Customize Component",
    am: "አካል አዘጋጅ",
  },
  "Reset to Default Layout": {
    en: "Reset to Default Layout",
    am: "ወደ ነባሩ አቀማመጥ መልስ",
  },
  Appearance: {
    en: "Appearance",
    am: "መልክ",
  },
  Simulation: {
    en: "Simulation",
    am: "ሲሙሌሽን",
  },
  Animations: {
    en: "Animations",
    am: "እንቅስቃሴዎች",
  },
  "Container Size": {
    en: "Container Size",
    am: "የመያዣ መጠን",
  },
  "Width (rem)": {
    en: "Width (rem)",
    am: "ስፋት (rem)",
  },
  "Height (rem)": {
    en: "Height (rem)",
    am: "ቁመት (rem)",
  },
  Colors: {
    en: "Colors",
    am: "ቀለማት",
  },
  "Border & Shadow": {
    en: "Border & Shadow",
    am: "ድንበር እና ጥላ",
  },
  "Performance Parameters": {
    en: "Performance Parameters",
    am: "የአፈጻጸም መለኪያዎች",
  },
  "Max Output (W)": {
    en: "Max Output (W)",
    am: "ከፍተኛ ውጤት (ዋት)",
  },
  "Max RPM": {
    en: "Max RPM",
    am: "ከፍተኛ አርፒኤም",
  },
  "Fuel Consumption Rate": {
    en: "Fuel Consumption Rate",
    am: "የነዳጅ ፍጆታ መጠን",
  },
  "Thermal Behavior": {
    en: "Thermal Behavior",
    am: "የሙቀት ባህሪ",
  },
  "Heat Generation (°C/s)": {
    en: "Heat Generation (°C/s)",
    am: "የሙቀት ማመንጨት (°C/በሰከንድ)",
  },
  "Cooling Rate (°C/s)": {
    en: "Cooling Rate (°C/s)",
    am: "የማቀዝቀዝ መጠን (°C/በሰከንድ)",
  },
  Timing: {
    en: "Timing",
    am: "ጊዜ አወሳሰድ",
  },
  "Startup Time (s)": {
    en: "Startup Time (s)",
    am: "የማስጀመሪያ ጊዜ (ሰከንድ)",
  },
  "Shutdown Time (s)": {
    en: "Shutdown Time (s)",
    am: "የማጥፊያ ጊዜ (ሰከንድ)",
  },
  "Enable Smoke": {
    en: "Enable Smoke",
    am: "ጭስ አንቃ",
  },
  "Enable Fan Rotation": {
    en: "Enable Fan Rotation",
    am: "የአየር መንፊያ ዙረት አንቃ",
  },
  "Enable Vibration": {
    en: "Enable Vibration",
    am: "ንዝረት አንቃ",
  },
  "Heat Shimmer Effect": {
    en: "Heat Shimmer Effect",
    am: "የሙቀት ብልጭታ ውጤት",
  },
  "Display Elements": {
    en: "Display Elements",
    am: "የማሳያ አካላት",
  },
  "Output Wattage": {
    en: "Output Wattage",
    am: "የውጤት ዋቴጅ",
  },
  "Engine RPM": {
    en: "Engine RPM",
    am: "የሞተር አርፒኤም",
  },
  "Panel Style": {
    en: "Panel Style",
    am: "የፓነል ቅጥ",
  },
  "Save as Preset": {
    en: "Save as Preset",
    am: "እንደ ቅድመ-ቅንብር አስቀምጥ",
  },
  // Layout controls
  "Layout contains": {
    en: "Layout contains",
    am: "አቀማመጥ ይዟል",
  },

  // Weather measurement units
  Temp: {
    en: "Temp",
    am: "ሙቀት",
  },

  // Additional component states
  ACTIVE: {
    en: "ACTIVE",
    am: "ንቁ",
  },

  // Additional component types
  "Environmental Sensor": {
    en: "Environmental Sensor",
    am: "የአካባቢ ሴንሰር",
  },

  // Additional UI elements
  Display: {
    en: "Display",
    am: "ማሳያ",
  },

  // Additional technical terms
  "Connection Type: Parallel Connection": {
    en: "Connection Type: Parallel Connection",
    am: "የግንኙነት ዓይነት: ትይዩ ግንኙነት",
  },

  // Additional system control terms
  "Emergency Mode": {
    en: "Emergency Mode",
    am: "የአስቸኳይ ጊዜ ሁኔታ",
  },

  // Additional customization options
  "Panel Style": {
    en: "Panel Style",
    am: "የፓነል ቅጥ",
  },

  // Additional measurement units
  "Engine RPM": {
    en: "Engine RPM",
    am: "የሞተር አርፒኤም",
  },
}

// Add these specific translations if they're missing from the dictionary
// These are the technical terms used in the Environmental Sensor component

// Check if "ENVI-SENSE" is in the dictionary, if not add it
if (!solarSystemTranslations["ENVI-SENSE"]) {
  solarSystemTranslations["ENVI-SENSE"] = {
    en: "ENVI-SENSE",
    am: "አካባቢ-ስሜት",
  }
}

// Check if "MS-200" is in the dictionary, if not add it
if (!solarSystemTranslations["MS-200"]) {
  solarSystemTranslations["MS-200"] = {
    en: "MS-200",
    am: "ኤምኤስ-200",
  }
}

// Ensure all sensor reading labels have translations
// These should already exist but let's make sure they're consistent
if (!solarSystemTranslations["SUNLIGHT"]) {
  solarSystemTranslations["SUNLIGHT"] = {
    en: "SUNLIGHT",
    am: "የፀሐይ ብርሃን",
  }
}

if (!solarSystemTranslations["TEMP"]) {
  solarSystemTranslations["TEMP"] = {
    en: "TEMP",
    am: "ሙቀት",
  }
}

if (!solarSystemTranslations["HUMIDITY"]) {
  solarSystemTranslations["HUMIDITY"] = {
    en: "HUMIDITY",
    am: "እርጥበት",
  }
}

if (!solarSystemTranslations["WIND"]) {
  solarSystemTranslations["WIND"] = {
    en: "WIND",
    am: "ነፋስ",
  }
}

if (!solarSystemTranslations["AIR QUALITY INDEX"]) {
  solarSystemTranslations["AIR QUALITY INDEX"] = {
    en: "AIR QUALITY INDEX",
    am: "የአየር ጥራት መለኪያ",
  }
}

// Make sure status indicators are translated
if (!solarSystemTranslations["MONITORING"]) {
  solarSystemTranslations["MONITORING"] = {
    en: "MONITORING",
    am: "በክትትል ላይ",
  }
}

if (!solarSystemTranslations["OFFLINE"]) {
  solarSystemTranslations["OFFLINE"] = {
    en: "OFFLINE",
    am: "ከመስመር ውጪ",
  }
}

// Ensure "Sensor Status" is translated
if (!solarSystemTranslations["Sensor Status"]) {
  solarSystemTranslations["Sensor Status"] = {
    en: "Sensor Status",
    am: "የሴንሰር ሁኔታ",
  }
}

// Ensure "Environmental Sensor" is translated
if (!solarSystemTranslations["Environmental Sensor"]) {
  solarSystemTranslations["Environmental Sensor"] = {
    en: "Environmental Sensor",
    am: "የአካባቢ ሴንሰር",
  }
}

// Helper function to get translation
export function getTranslation(key: string, language: Language): string {
  // Special case for Environmental Sensor to ensure it works
  if (key === "Environmental Sensor") {
    return language === "am" ? "የአካባቢ ሴንሰር" : "Environmental Sensor"
  }

  if (solarSystemTranslations[key]) {
    return solarSystemTranslations[key][language]
  }

  // If translation not found, return the key itself but log a warning
  console.warn(`Translation not found for key: ${key}`)

  // Return a formatted version of the key as fallback
  return (
    key.charAt(0).toUpperCase() +
    key
      .slice(1)
      .replace(/([A-Z])/g, " $1")
      .trim()
  )
}
