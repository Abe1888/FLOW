# Green Innovation Landing Page

This is a streamlined Next.js project showcasing the BioSynth Algae-Based Biofuel System landing page.

## Project Structure

The project has been refactored to maintain only the essential files needed for the landing page:

\`\`\`
├── app/
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page component
├── components/
│   ├── eco-pattern.tsx    # SVG pattern background
│   ├── instagram-card.tsx # Main card component
│   └── ui/
│       ├── badge.tsx      # Badge component
│       └── button.tsx     # Button component
└── lib/
    └── utils.ts           # Utility functions
\`\`\`

## Features

- Responsive design that works on all screen sizes
- Interactive SVG animations showcasing the biofuel process
- Modern UI with a focus on green energy and sustainability
- Optimized performance with minimal dependencies

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technologies Used

- Next.js 14
- React
- Tailwind CSS
- Lucide React Icons
\`\`\`

```shellscript file="cleanup-script.sh"
#!/bin/bash

# Cleanup script for Green Innovation Landing Page
# This script removes all unnecessary files and directories,
# keeping only what's needed for the landing page

echo "Starting cleanup process..."

# Create backup directory if it doesn't exist
mkdir -p Backup

# Move unnecessary directories to Backup
echo "Moving unnecessary directories to Backup..."

# List of directories to move
directories=(
  "components/tech-innovation"
  "components/modern-innovation"
  "components/green-energy"
  "components/math-innovation"
  "components/green-innovation"
  "components/creator-studio"
  "app/green-world"
  "app/tech-innovation"
  "app/modern-innovation"
  "app/green-energy"
  "app/math-innovation"
  "app/green-innovation"
  "app/creator-studio"
  "app/explore-templates"
)

for dir in "${directories[@]}"; do
  if [ -d "$dir" ]; then
    # Create target directory in Backup
    mkdir -p "Backup/$dir"
    # Move contents
    mv "$dir"/* "Backup/$dir"/ 2>/dev/null || true
    # Remove original directory
    rmdir "$dir" 2>/dev/null || true
    echo "  Moved $dir to Backup/$dir"
  fi
done

# Reorganize files
echo "Reorganizing files..."

# Move instagram-card.tsx from app to components
if [ -f "app/instagram-card.tsx" ]; then
  mv "app/instagram-card.tsx" "components/"
  echo "  Moved instagram-card.tsx to components directory"
fi

# Move eco-pattern.tsx from app to components
if [ -f "app/eco-pattern.tsx" ]; then
  mv "app/eco-pattern.tsx" "components/"
  echo "  Moved eco-pattern.tsx to components directory"
fi

# Move UI components from app/ui to components/ui
if [ -d "app/ui" ]; then
  mkdir -p "components/ui"
  mv "app/ui"/* "components/ui"/ 2>/dev/null || true
  rmdir "app/ui" 2>/dev/null || true
  echo "  Moved UI components to components/ui directory"
fi

# Move utils.ts from app to lib
if [ -f "app/utils.ts" ]; then
  mkdir -p "lib"
  mv "app/utils.ts" "lib/"
  echo "  Moved utils.ts to lib directory"
fi

# Update imports in page.tsx
if [ -f "app/page.tsx" ]; then
  sed -i 's|@/app/instagram-card|@/components/instagram-card|g' "app/page.tsx"
  echo "  Updated imports in page.tsx"
fi

# Update imports in instagram-card.tsx
if [ -f "components/instagram-card.tsx" ]; then
  sed -i 's|@/app/ui/badge|@/components/ui/badge|g' "components/instagram-card.tsx"
  sed -i 's|@/app/ui/button|@/components/ui/button|g' "components/instagram-card.tsx"
  sed -i 's|@/app/eco-pattern|@/components/eco-pattern|g' "components/instagram-card.tsx"
  echo "  Updated imports in instagram-card.tsx"
fi

echo "Cleanup complete! Project structure has been streamlined."
echo "Only essential files for the landing page remain in the main directories."
