"use client"

import { useEffect } from "react"

/**
 * Component that removes browser extension attributes after hydration
 * to prevent hydration mismatch warnings
 * Note: The inline script in layout.tsx handles cleanup before React hydrates
 */
export function SuppressHydrationAttributes() {
  useEffect(() => {
    if (typeof window === "undefined") return

    // Remove browser extension attributes that cause hydration mismatches
    const removeExtensionAttributes = () => {
      // Common extension attribute patterns
      const extensionPatterns = [
        /^bis_/,
        /^__processed_/,
        /^__reactInternal/,
      ]

      try {
        const walker = document.createTreeWalker(
          document.body || document.documentElement,
          NodeFilter.SHOW_ELEMENT,
          null
        )

        let node
        while ((node = walker.nextNode())) {
          if (node instanceof Element) {
            const attrsToRemove: string[] = []
            for (const attr of Array.from(node.attributes)) {
              if (extensionPatterns.some((pattern) => pattern.test(attr.name))) {
                attrsToRemove.push(attr.name)
              }
            }
            attrsToRemove.forEach((attr) => node.removeAttribute(attr))
          }
        }
      } catch (error) {
        // Silently fail if DOM manipulation fails
      }
    }

    // Run immediately after mount and periodically to catch late-injecting extensions
    // Use requestAnimationFrame for the first run to ensure DOM is ready
    requestAnimationFrame(() => {
      removeExtensionAttributes()
      setTimeout(removeExtensionAttributes, 0)
      setTimeout(removeExtensionAttributes, 10)
      setTimeout(removeExtensionAttributes, 50)
      setTimeout(removeExtensionAttributes, 100)
    })

    // Set up interval to catch extensions that inject later
    const intervalId = setInterval(removeExtensionAttributes, 2000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return null
}

