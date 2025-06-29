import React, { useEffect, useRef, forwardRef } from "react"
// @ts-ignore
import * as shaka from "shaka-player/dist/shaka-player.compiled.js"

interface ShakaPlayerProps {
  src: string
  poster?: string
  autoPlay?: boolean
  controls?: boolean
  className?: string
}

const ShakaPlayerComponent = forwardRef<HTMLVideoElement, ShakaPlayerProps>(
  ({ src, poster, autoPlay = false, controls = true, className = "" }, ref) => {
    const localRef = useRef<HTMLVideoElement>(null)
    // Utilise le ref passé ou le local
    const videoRef = (ref as React.RefObject<HTMLVideoElement>) || localRef

    useEffect(() => {
      const video = videoRef.current
      console.log("[ShakaPlayer] mount", { src, ref: video })
      if (!video) return
      const player = new shaka.Player()
      player.attach(video)
      console.log("[ShakaPlayer] player attached", { src, ref: video })
      player.load(src).then(() => {
        console.log("[ShakaPlayer] player loaded", { src })
      }).catch((e: unknown) => {
        console.error("[ShakaPlayer] Erreur de chargement Shaka", e)
      })
      player.addEventListener("error", (e: Event) => {
        // @ts-ignore
        console.error("[ShakaPlayer] Player Error", e.detail)
      })
      return () => {
        player.destroy()
        console.log("[ShakaPlayer] destroy", { src })
      }
    }, [src, videoRef])

    return (
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        controls={controls}
        className={className}
        preload="metadata"
      />
    )
  }
)

export { ShakaPlayerComponent as ShakaPlayer } 