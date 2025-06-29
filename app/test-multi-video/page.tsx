"use client"
import { VideoPlayer } from "@/components/ui/VideoPlayer"

const TEST_PLAYBACK_ID = "x4m601Ns00DzNWJK6Vy8h7jh8i9ECWPpTBwb2qxvTnODA"

export default function TestMultiVideoPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-8">
      <h1 className="text-2xl font-bold mb-8">Test Multi-Layout VideoPlayer</h1>
      <div className="flex flex-row gap-8">
        {/* Discover style */}
        <div className="w-80">
          <h2 className="text-lg mb-2">Discover Layout</h2>
          <VideoPlayer playbackId={TEST_PLAYBACK_ID} poster="/placeholder.jpg" className="w-full" context="discover" />
        </div>
        {/* Feed style */}
        <div className="w-80">
          <h2 className="text-lg mb-2">Feed Layout</h2>
          <div className="w-full mb-6">
            <VideoPlayer playbackId={TEST_PLAYBACK_ID} poster="/placeholder.jpg" className="w-full" context="feed" />
            <h3 className="font-semibold mb-2 text-white">Titre vidéo</h3>
            <div className="text-gray-400 text-sm">Durée</div>
          </div>
        </div>
        {/* Profile style */}
        <div className="w-80">
          <h2 className="text-lg mb-2">Profile Layout</h2>
          <div className="w-full mb-6">
            <VideoPlayer playbackId={TEST_PLAYBACK_ID} poster="/placeholder.jpg" className="w-full" context="profile" />
            <h3 className="font-semibold mb-2 text-white">Titre vidéo</h3>
            <div className="text-gray-400 text-sm">Date</div>
          </div>
        </div>
      </div>
    </div>
  )
} 