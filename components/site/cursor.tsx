"use client"

import { useEffect, useRef } from "react"

export function initCursor() {
  if (typeof window === "undefined" || !window || typeof document === "undefined" || !document) return
  if (typeof window.addEventListener !== "function") return
  const ring = document.getElementById("v0-cursor-ring") as HTMLDivElement | null
  if (!ring) return

  let x = window.innerWidth / 2
  let y = window.innerHeight / 2
  let tx = x
  let ty = y

  const onMove = (e: MouseEvent) => {
    tx = e.clientX
    ty = e.clientY
  }

  let rafId = 0
  const raf = () => {
    if (!ring) return
    x += (tx - x) * 0.15
    y += (ty - y) * 0.15
    ring.style.transform = `translate3d(${x - 0.5 * ring.offsetWidth}px, ${y - 0.5 * ring.offsetHeight}px, 0)`
    rafId = requestAnimationFrame(raf)
  }

  if (typeof window.addEventListener === "function") {
    window.addEventListener("mousemove", onMove, { passive: true })
  }
  rafId = requestAnimationFrame(raf)

  const onDown = () => {
    if (!ring) return
    ring.style.width = "40px"
    ring.style.height = "40px"
  }
  const onUp = () => {
    if (!ring) return
    ring.style.width = "32px"
    ring.style.height = "32px"
  }

  if (typeof window.addEventListener === "function") {
    window.addEventListener("pointerdown", onDown)
    window.addEventListener("pointerup", onUp)
  }

  return () => {
    if (typeof window.removeEventListener === "function") {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointerup", onUp)
    }
    if (rafId) cancelAnimationFrame(rafId)
  }
}

export default function CursorInit() {
  const cleanupRef = useRef<(() => void) | null>(null)
  useEffect(() => {
    cleanupRef.current = initCursor() || null
    return () => cleanupRef.current?.()
  }, [])
  return null
}
