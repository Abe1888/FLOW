"use client"

import { useState } from "react"
import { Search, ExternalLink, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "@/hooks/use-translation"
import { LanguageProvider } from "@/lib/language-context"
import Link from "next/link"
import Image from "next/image"

// Define the tech stack data structure
interface TechStackItem {
  category: string
  technology: string
  library?: string
  role: string
  docsUrl: string
}

function TechStackPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TechStackItem
    direction: "ascending" | "descending"
  } | null>(null)

  // Define the tech stack data
  const techStackData: TechStackItem[] = [
    {
      category: "Frontend Framework",
      technology: "React",
      library: "Next.js",
      role: "Core application framework with server-side rendering and routing",
      docsUrl: "https://nextjs.org/docs",
    },
    {
      category: "UI",
      technology: "Tailwind CSS",
      role: "Utility-first CSS framework for styling components",
      docsUrl: "https://tailwindcss.com/docs",
    },
    {
      category: "UI",
      technology: "shadcn/ui",
      role: "Reusable component library built with Radix UI and Tailwind CSS",
      docsUrl: "https://ui.shadcn.com",
    },
    {
      category: "Visualization",
      technology: "ReactFlow",
      role: "Library for building node-based interactive diagrams",
      docsUrl: "https://reactflow.dev/docs",
    },
    {
      category: "Icons",
      technology: "Lucide React",
      role: "Icon library with clean, consistent design",
      docsUrl: "https://lucide.dev/docs",
    },
    {
      category: "State Management",
      technology: "React",
      library: "Context API",
      role: "Global state management for component settings and language",
      docsUrl: "https://react.dev/reference/react/createContext",
    },
    {
      category: "Animation",
      technology: "Framer Motion",
      role: "Animation library for creating fluid UI transitions",
      docsUrl: "https://www.framer.com/motion/",
    },
    {
      category: "Storage",
      technology: "Web Storage API",
      library: "localStorage",
      role: "Persistent storage for saving user layouts and preferences",
      docsUrl: "https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage",
    },
    {
      category: "Utilities",
      technology: "TypeScript",
      role: "Static type checking for improved code quality and developer experience",
      docsUrl: "https://www.typescriptlang.org/docs/",
    },
    {
      category: "Utilities",
      technology: "date-fns",
      role: "Date manipulation library for handling timestamps and date formatting",
      docsUrl: "https://date-fns.org/docs/",
    },
    {
      category: "Utilities",
      technology: "class-variance-authority",
      role: "Library for creating variant components with TypeScript support",
      docsUrl: "https://cva.style/docs",
    },
    {
      category: "Utilities",
      technology: "clsx",
      role: "Utility for constructing className strings conditionally",
      docsUrl: "https://github.com/lukeed/clsx",
    },
    {
      category: "Utilities",
      technology: "tailwind-merge",
      role: "Utility for merging Tailwind CSS classes without conflicts",
      docsUrl: "https://github.com/dcastil/tailwind-merge",
    },
    {
      category: "Internationalization",
      technology: "Custom i18n",
      role: "Custom internationalization implementation for multi-language support",
      docsUrl: "https://nextjs.org/docs/app/building-your-application/routing/internationalization",
    },
    {
      category: "Performance",
      technology: "React",
      library: "useMemo & useCallback",
      role: "Optimization hooks to prevent unnecessary re-renders",
      docsUrl: "https://react.dev/reference/react/useMemo",
    },
    {
      category: "UI",
      technology: "Radix UI",
      role: "Headless UI components for building accessible interfaces",
      docsUrl: "https://www.radix-ui.com/docs/primitives",
    },
  ]

  // Filter tech stack based on search query
  const filteredTechStack = techStackData.filter((item) => {
    const searchString = searchQuery.toLowerCase()
    return (
      item.category.toLowerCase().includes(searchString) ||
      item.technology.toLowerCase().includes(searchString) ||
      (item.library && item.library.toLowerCase().includes(searchString)) ||
      item.role.toLowerCase().includes(searchString)
    )
  })

  // Sort tech stack based on sort config
  const sortedTechStack = [...filteredTechStack].sort((a, b) => {
    if (!sortConfig) return 0

    const aValue = a[sortConfig.key]
    const bValue = b[sortConfig.key]

    if (aValue === undefined || bValue === undefined) return 0

    if (aValue < bValue) {
      return sortConfig.direction === "ascending" ? -1 : 1
    }
    if (aValue > bValue) {
      return sortConfig.direction === "ascending" ? 1 : -1
    }
    return 0
  })

  // Handle sort request
  const requestSort = (key: keyof TechStackItem) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sort direction indicator
  const getSortDirectionIndicator = (key: keyof TechStackItem) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === "ascending" ? "↑" : "↓"
  }

  return (
    <div className="container mx-auto p-4 h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Image
              src="/images/grean-world-logo.png"
              alt="GREAN WORLD"
              width={40}
              height={40}
              className="object-contain"
            />
            <h1 className="text-2xl font-bold">{t("Technology Stack")}</h1>
          </div>
          <p className="text-muted-foreground">
            {t("A comprehensive list of technologies and libraries used in the solar system simulator")}
          </p>
        </div>
        <Link href="/tech-innovation/solar-system">
          <Button variant="outline" aria-label={t("Back to Simulator")}>
            {t("Back to Simulator")}
          </Button>
        </Link>
      </div>

      <div className="flex-1 border rounded-lg overflow-hidden flex flex-col shadow-lg">
        <div className="p-4 border-b bg-muted/30">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={t("Search technologies...")}
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label={t("Search technologies")}
              />
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="whitespace-nowrap">
                {filteredTechStack.length} {t("technologies")}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full" aria-label={t("Technology stack table")}>
            <thead className="bg-muted/50 sticky top-0">
              <tr>
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                  onClick={() => requestSort("category")}
                  aria-sort={sortConfig?.key === "category" ? sortConfig.direction : undefined}
                >
                  <div className="flex items-center">
                    {t("Category")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                    {getSortDirectionIndicator("category")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:bg-muted/80"
                  onClick={() => requestSort("technology")}
                  aria-sort={sortConfig?.key === "technology" ? sortConfig.direction : undefined}
                >
                  <div className="flex items-center">
                    {t("Technology / Library")}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                    {getSortDirectionIndicator("technology")}
                  </div>
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">{t("Role")}</th>
              </tr>
            </thead>
            <tbody>
              {sortedTechStack.map((item, index) => (
                <tr
                  key={`${item.category}-${item.technology}-${index}`}
                  className="border-b hover:bg-muted/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="font-normal">
                      {t(item.category)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{item.technology}</div>
                    {item.library && <div className="text-sm text-muted-foreground">{item.library}</div>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-between items-start">
                      <span>{t(item.role)}</span>
                      <a
                        href={item.docsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80 ml-2 inline-flex items-center"
                        aria-label={`${t("Documentation for")} ${item.technology}`}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">{t("Documentation")}</span>
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTechStack.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                    {t("No technologies found matching your search.")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logo watermark */}
      <div className="fixed bottom-4 right-4 opacity-10 pointer-events-none">
        <Image
          src="/images/grean-world-logo.png"
          alt="GREAN WORLD"
          width={100}
          height={100}
          className="object-contain"
        />
      </div>
    </div>
  )
}

export default function TechStackPageWithProvider() {
  return (
    <LanguageProvider>
      <TechStackPage />
    </LanguageProvider>
  )
}
