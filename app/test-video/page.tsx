"use client"
import { useState } from "react"
import { VideoPlayer } from "@/components/ui/VideoPlayer"

const TEST_PLAYBACK_ID = "x4m601Ns00DzNWJK6Vy8h7jh8i9ECWPpTBwb2qxvTnODA" // playbackId Mux valide

export default function TestVideoPage() {
  const [status] = useState("idle")

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-2xl font-bold mb-4">Test Video MuxPlayer</h1>
      <div className="w-full max-w-xl">
        <VideoPlayer
          playbackId={TEST_PLAYBACK_ID}
          poster={"/placeholder.jpg"}
          autoPlay={false}
          controls={true}
          className="w-full"
        />
      </div>
      <div className="mt-4 text-lg">Status: <span className="font-mono">{status}</span></div>
      <div className="mt-2 text-xs text-gray-400">playbackId: {TEST_PLAYBACK_ID}</div>
      <div className="mt-2 text-xs text-gray-400">src: https://stream.mux.com/{TEST_PLAYBACK_ID}.m3u8</div>
    </div>
  )
} 