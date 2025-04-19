import type React from "react"
import "@/app/globals.css"
import { Inter, Noto_Sans_Ethiopic } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/lib/language-context"

// Load Inter font for Latin text
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

// Load Noto Sans Ethiopic font for Amharic text with proper weights
const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ["ethiopic"],
  weight: ["400", "500", "600", "700"], // Regular, Medium, SemiBold, Bold
  display: "swap",
  variable: "--font-noto-sans-ethiopic",
})

// Update the metadata to include the landing page metadata
export const metadata: Metadata = {
  title: "Green World | Sustainable Energy Solutions",
  description:
    "Green World is pioneering sustainable energy solutions with revolutionary BioSynth technology, creating a cleaner planet for generations to come.",
  keywords: ["green energy", "sustainable solutions", "biofuel", "carbon capture", "renewable energy", "BioSynth"],
  openGraph: {
    title: "Green World | Sustainable Energy Solutions",
    description: "Pioneering sustainable energy solutions with revolutionary BioSynth technology",
    url: "https://greenworld.com",
    siteName: "Green World",
    images: [
      {
        url: "https://greenworld.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Green World Sustainable Energy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Green World | Sustainable Energy Solutions",
    description: "Pioneering sustainable energy solutions with revolutionary BioSynth technology",
    images: ["https://greenworld.com/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${notoSansEthiopic.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#065f46" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
