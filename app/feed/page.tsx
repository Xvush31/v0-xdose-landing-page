"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Play } from "lucide-react"
import { Navigation } from "@/components/layout/navigation"
import { ThemeProvider } from "@/components/theme-provider"

interface VideoPost {
  id: string
  creator: {
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
}

const mockPosts: VideoPost[] = [
  {
    id: "1",
    creator: {
      name: "Luna Rose",
      username: "@lunarose",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    thumbnail: "/placeholder.svg?height=300&width=400",
    title: "Exclusive private session 🔥",
    duration: "12:34",
    views: 15420,
    likes: 892,
    comments: 156,
    timestamp: "2h ago",
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: "2",
    creator: {
      name: "Scarlett Divine",
      username: "@scarlettdivine",
      avatar: "/placeholder.svg?height=40&width=40",
      verified: true,
    },
    thumbnail: "/placeholder.svg?height=300&width=400",
    title: "New sensual series",
    duration: "8:45",
    views: 23100,
    likes: 1240,
    comments: 203,
    timestamp: "4h ago",
    isLiked: true,
    isBookmarked: false,
  },
]

export default function FeedPage() {
  const [posts, setPosts] = useState(mockPosts)

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

            <div className="space-y-8">
              {posts.map((post, index) => (
                <motion.article
                  key={post.id}
                  className="bg-card rounded-2xl overflow-hidden border border-border"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {/* Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={post.creator.avatar || "/placeholder.svg"}
                        alt={post.creator.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-1">
                          <h3 className="font-semibold text-foreground">{post.creator.name}</h3>
                          {post.creator.verified && (
                            <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-xs text-white">✓</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {post.creator.username} • {post.timestamp}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-accent rounded-full transition-colors">
                      <MoreHorizontal size={20} className="text-muted-foreground" />
                    </button>
                  </div>

                  {/* Video Thumbnail */}
                  <div className="relative group cursor-pointer">
                    <img
                      src={post.thumbnail || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                      <motion.div
                        className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-6 h-6 ml-1 text-white" fill="white" />
                      </motion.div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm text-white">
                      {post.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h2 className="font-semibold mb-2 text-foreground">{post.title}</h2>
                    <p className="text-sm text-muted-foreground mb-4">{post.views.toLocaleString()} views</p>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <motion.button
                          className={`flex items-center space-x-2 ${
                            post.isLiked ? "text-red-500" : "text-muted-foreground"
                          } hover:text-red-400 transition-colors`}
                          onClick={() => toggleLike(post.id)}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
                          <span className="text-sm">{post.likes}</span>
                        </motion.button>

                        <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                          <MessageCircle size={20} />
                          <span className="text-sm">{post.comments}</span>
                        </button>

                        <button className="text-muted-foreground hover:text-foreground transition-colors">
                          <Share size={20} />
                        </button>
                      </div>

                      <motion.button
                        className={`${
                          post.isBookmarked ? "text-purple-500" : "text-muted-foreground"
                        } hover:text-purple-400 transition-colors`}
                        onClick={() => toggleBookmark(post.id)}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Bookmark size={20} fill={post.isBookmarked ? "currentColor" : "none"} />
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
