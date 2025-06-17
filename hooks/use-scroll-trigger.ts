"use client"

import { useState, useEffect } from "react"

export function useScrollTrigger(threshold = 0.1) {
  const [isTriggered, setIsTriggered] = useState(false)

  useEffect(() => {
    // Ensure threshold is between 0 and 1
    const validThreshold = Math.max(0, Math.min(1, threshold))

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsTriggered(true)
        }
      },
      { threshold: validThreshold },
    )

    // Create a trigger element at the specified scroll position
    const element = document.createElement("div")
    element.style.position = "fixed"
    element.style.top = "50%"
    element.style.left = "0"
    element.style.height = "1px"
    element.style.width = "100%"
    element.style.pointerEvents = "none"
    element.style.zIndex = "-1"
    document.body.appendChild(element)

    observer.observe(element)

    return () => {
      observer.disconnect()
      if (document.body.contains(element)) {
        document.body.removeChild(element)
      }
    }
  }, [threshold])

  return isTriggered
}
