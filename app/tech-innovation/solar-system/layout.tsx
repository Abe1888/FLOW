import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { Analytics } from "@/components/analytics"
import { Suspense } from "react"
import { SolarSystemNavigation } from "./navigation"
import { LanguageProvider } from "@/lib/language-context"

export default function SolarSystemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <LanguageProvider>
        <div className="min-h-screen bg-gradient-to-b from-emerald-950 to-green-900 dark:from-slate-950 dark:to-slate-900 transition-colors duration-300 overflow-hidden">
          <Suspense>
            <SolarSystemNavigation />
          </Suspense>
          <div className="pt-12 sm:pt-14 md:pt-16">
            <Suspense>{children}</Suspense>
          </div>
          <Analytics />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  )
}
