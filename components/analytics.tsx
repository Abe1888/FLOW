"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Path changed - send page view
    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`

    // Example analytics call - replace with your actual analytics service
    const trackPageView = () => {
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag("config", "G-XXXXXXXXXX", {
          page_path: url,
        })
      }
    }

    // Track page view
    trackPageView()
  }, [pathname, searchParams])

  return null
}
