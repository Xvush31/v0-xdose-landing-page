"use client"
import { useRef, useState, useEffect } from "react"
import { ShakaPlayer } from "@/components/ui/ShakaPlayer"

// Remplace ce playbackId par un playbackId réel qui fonctionne sur une autre page
const TEST_PLAYBACK_ID = "nA6w02Q7Q6vQ01w02Q7Q6vQ01" // <-- à personnaliser si besoin
const TEST_SRC = `https://stream.mux.com/${TEST_PLAYBACK_ID}.m3u8`

export default function TestVideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState("idle")

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const onPlay = () => { setStatus("playing"); console.log("[TestVideo] play", video) }
    const onPause = () => { setStatus("paused"); console.log("[TestVideo] pause", video) }
    const onError = () => { setStatus("error"); console.log("[TestVideo] error", video.error) }
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('error', onError)
    return () => {
      video.removeEventListener('play', onPlay)
      video.removeEventListener('pause', onPause)
      video.removeEventListener('error', onError)
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Test Video ShakaPlayer</h1>
      <div className="w-full max-w-xl">
        <ShakaPlayer
          ref={videoRef}
          src={TEST_SRC}
          poster={"/placeholder.jpg"}
          autoPlay={false}
          controls={true}
          className="w-full aspect-video object-cover"
        />
      </div>
      <div className="mt-4 text-lg">Status: <span className="font-mono">{status}</span></div>
      <div className="mt-2 text-xs text-gray-400">playbackId: {TEST_PLAYBACK_ID}</div>
      <div className="mt-2 text-xs text-gray-400">src: {TEST_SRC}</div>
    </div>
  )
} 