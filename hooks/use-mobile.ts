"use client"

import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with false to match SSR, will be updated in useEffect on client
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    if (typeof window === "undefined" || !window || typeof window.addEventListener !== "function") return
    if (typeof window.matchMedia !== "function") {
      // Fallback to resize listener if matchMedia is not available
      const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      window.addEventListener("resize", onChange, { passive: true })
      onChange()
      return () => window.removeEventListener("resize", onChange)
    }

    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    if (!mql) {
      // Fallback if matchMedia returns null
      const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
      window.addEventListener("resize", onChange, { passive: true })
      onChange()
      return () => window.removeEventListener("resize", onChange)
    }

    const onChange = (evt?: MediaQueryListEvent | Event) => {
      const matches =
        evt && "matches" in (evt as MediaQueryListEvent) && typeof (evt as MediaQueryListEvent).matches === "boolean"
          ? (evt as MediaQueryListEvent).matches
          : window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(!!matches)
    }

    if (typeof mql.addEventListener === "function") {
      mql.addEventListener("change", onChange as EventListener)
      return () => {
        try {
          mql.removeEventListener("change", onChange as EventListener)
        } catch {
          // no-op
        }
      }
    } else if (typeof (mql as any).addListener === "function") {
      // legacy API support
      ;(mql as any).addListener(onChange)
      return () => {
        try {
          ;(mql as any).removeListener?.(onChange)
        } catch {
          // no-op
        }
      }
    } else {
      // Fallback to resize listener
      window.addEventListener("resize", onChange, { passive: true })
      onChange()
      return () => window.removeEventListener("resize", onChange)
    }
  }, [])

  return isMobile
}
