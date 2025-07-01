"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Play } from "lucide-react"
import { Navigation } from "@/components/layout/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { VideoPlayer } from "@/components/ui/VideoPlayer"
import Link from "next/link"

interface VideoPost {
  id: string
  creator: {
    id: string | undefined
    name: string
    username: string
    avatar: string
    verified: boolean
  }
  thumbnail: string
  title: string
  duration: string
  views: number
  likes: number
  comments: number
  timestamp: string
  isLiked: boolean
  isBookmarked: boolean
  playbackId: string
  status: string
}

export default function FeedPage() {
  const [posts, setPosts] = useState<VideoPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch("/api/videos")
      .then(res => res.json())
      .then(data => {
        if (data.videos) {
          setPosts(
            data.videos.map((video: any) => ({
              id: video.id,
              creator: {
                id: video.user?.id,
                name: video.user?.name || "Unknown",
                username: "",
                avatar: video.user?.image || "/placeholder.svg",
                verified: false,
              },
              thumbnail: video.thumbnail || "/placeholder.svg",
              title: video.title,
              duration: "--:--",
              views: 0,
              likes: 0,
              comments: 0,
              timestamp: "",
              isLiked: false,
              isBookmarked: false,
              playbackId: video.playbackId,
              status: video.status,
            }))
          )
        } else {
          setError("Erreur lors de the recovery of videos")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Erreur lors de the recovery of videos")
        setLoading(false)
      })
  }, [])

  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
          : post,
      ),
    )
  }

  const toggleBookmark = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post)))
  }

  const readyPosts = posts.filter(v => v.status === "ready" && v.playbackId);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="pt-20 pb-8">
          <div className="max-w-2xl mx-auto px-4">
            <motion.h1
              className="text-3xl font-bold mb-8 text-center text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Your Feed
            </motion.h1>

            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500 py-12">{error}</div>
            ) : readyPosts.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-12">No video available</div>
            ) : (
              <div className="space-y-8">
                {readyPosts.map((post) => (
                  <div key={post.id} className="w-full mb-6">
                    <VideoPlayer playbackId={post.playbackId} poster={post.thumbnail} className="w-full" context="feed" />
                    <h3 className="font-semibold mb-2 text-white">{post.title}</h3>
                    <div className="text-gray-400 text-sm">{post.duration}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
