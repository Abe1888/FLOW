/**
 * Props for the EcoPattern component
 */
interface EcoPatternProps {
  /** CSS classes to apply to the pattern container */
  className?: string
  /** Pattern type */
  type?: "leaves" | "waves" | "hexagons" | "circles"
}

/**
 * A decorative SVG pattern background with ecological themes
 * Used to add a nature-inspired visual element to cards and sections
 *
 * @example
 * ```tsx
 * <div className="relative">
 *   <EcoPattern className="opacity-20" type="leaves" />
 *   <div className="relative z-10">Content on top of pattern</div>
 * </div>
 * ```
 */
export function EcoPattern({ className = "opacity-10", type = "leaves" }: EcoPatternProps) {
  const renderPattern = () => {
    switch (type) {
      case "leaves":
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="leaf-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M25,10 Q35,25 25,40 Q15,25 25,10" fill="none" stroke="#4ade80" strokeWidth="1" />
              <path d="M10,25 Q25,35 40,25 Q25,15 10,25" fill="none" stroke="#4ade80" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
          </svg>
        )
      case "waves":
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="wave-pattern" width="100" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 C20,5 30,15 50,10 C70,5 80,15 100,10" fill="none" stroke="#4ade80" strokeWidth="1" />
              <path
                d="M0,20 C20,15 30,25 50,20 C70,15 80,25 100,20"
                fill="none"
                stroke="#4ade80"
                strokeWidth="1"
                opacity="0.5"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#wave-pattern)" />
          </svg>
        )
      case "hexagons":
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="hexagon-pattern" width="50" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M25,0 L50,15 L50,35 L25,50 L0,35 L0,15 Z"
                fill="none"
                stroke="#4ade80"
                strokeWidth="1"
                transform="translate(0, -5)"
              />
            </pattern>
            <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
          </svg>
        )
      case "circles":
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="circle-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <circle cx="25" cy="25" r="10" fill="none" stroke="#4ade80" strokeWidth="1" />
              <circle cx="25" cy="25" r="5" fill="none" stroke="#4ade80" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circle-pattern)" />
          </svg>
        )
      default:
        return (
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="leaf-pattern" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M25,10 Q35,25 25,40 Q15,25 25,10" fill="none" stroke="#4ade80" strokeWidth="1" />
              <path d="M10,25 Q25,35 40,25 Q25,15 10,25" fill="none" stroke="#4ade80" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
          </svg>
        )
    }
  }

  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden="true">
      {renderPattern()}
    </div>
  )
}
