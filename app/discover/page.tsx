"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, TrendingUp, Clock, Heart } from "lucide-react"
import { Navigation } from "@/components/layout/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { VideoPlayer } from "@/components/ui/VideoPlayer"
import Link from "next/link"

const categories = ["Trending", "New", "Top Creators", "Live", "Premium", "Amateur", "Professional"]

const trendingCreators = [
  {
    id: "1",
    name: "Luna Rose",
    username: "@lunarose",
    avatar: "/placeholder.svg?height=60&width=60",
    followers: "125K",
    verified: true,
    category: "Premium",
  },
  {
    id: "2",
    name: "Scarlett Divine",
    username: "@scarlettdivine",
    avatar: "/placeholder.svg?height=60&width=60",
    followers: "89K",
    verified: true,
    category: "Artistic",
  },
]

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState("Trending")
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [creators, setCreators] = useState<any[]>([])

  useEffect(() => {
    setLoading(true)
    fetch("/api/videos")
      .then(res => res.json())
      .then(data => {
        if (data.videos) {
          setVideos(data.videos)
        } else {
          setError("Erreur lors de la récupération des vidéos")
        }
        setLoading(false)
      })
      .catch(() => {
        setError("Erreur lors de la récupération des vidéos")
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch("/api/users/creators")
      .then(res => res.json())
      .then(data => setCreators(data.creators || []))
  }, [])

  const readyVideos = videos.filter(v => v.status === "ready" && v.playbackId);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />

        <main className="pt-20 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            {/* Header */}
            <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-4xl font-bold mb-4 text-foreground">
                Discover{" "}
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  Content
                </span>
              </h1>
              <p className="text-muted-foreground text-lg">Explore the most popular creators and content</p>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search creators, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-foreground placeholder-muted-foreground focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  <Filter size={20} />
                </button>
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div
              className="flex flex-wrap justify-center gap-3 mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {categories.map((category) => (
                <motion.button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent"
                      : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  className="mb-8"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center space-x-2 mb-6">
                    <TrendingUp className="text-orange-400" size={24} />
                    <h2 className="text-2xl font-bold text-foreground">Trending Videos</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {loading ? (
                      <div className="col-span-2 text-center py-12">Chargement...</div>
                    ) : error ? (
                      <div className="col-span-2 text-center text-red-500 py-12">{error}</div>
                    ) : readyVideos.length === 0 ? (
                      <div className="col-span-2 text-center text-gray-400 py-12">Aucune vidéo disponible</div>
                    ) : (
                      readyVideos.map((video, index) => (
                        <motion.div
                          key={video.id}
                          className="group cursor-pointer"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          whileHover={{ y: -5 }}
                        >
                          <div className="relative w-full h-48">
                            <VideoPlayer playbackId={video.playbackId} poster={video.thumbnail} />
                            <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-sm text-white">
                              --:--
                            </div>
                          </div>
                          <h3 className="font-semibold mb-1 group-hover:text-purple-400 transition-colors text-foreground">
                            {video.title}
                          </h3>
                          <p className="text-muted-foreground text-sm">
                            {video.user?.name || "Unknown"}
                          </p>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-8">
                {/* Top Creators */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                  <div className="flex items-center space-x-2 mb-6">
                    <Heart className="text-pink-400" size={24} />
                    <h2 className="text-xl font-bold text-foreground">Top Creators</h2>
                  </div>

                  <div className="space-y-4">
                    {creators.map((creator, index) => (
                      <motion.div
                        key={creator.id}
                        className="flex items-center space-x-3 p-4 bg-card rounded-xl hover:bg-accent transition-colors cursor-pointer border border-border"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={creator.image || "/placeholder.svg"}
                          alt={creator.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-1">
                            <h3 className="font-semibold text-foreground">{creator.name}</h3>
                          </div>
                        </div>
                        <Link href={`/profile/${creator.id}`} className="text-purple-400 hover:underline text-sm font-medium">Voir le profil</Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
                  <div className="flex items-center space-x-2 mb-6">
                    <Clock className="text-blue-400" size={24} />
                    <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
                  </div>

                  <div className="space-y-3">
                    {[
                      "Luna Rose posted a new video",
                      "Scarlett Divine is live now",
                      "New verified creator: Alex Morgan",
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        className="text-sm text-muted-foreground p-3 bg-card/50 rounded-lg border border-border"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                      >
                        {activity}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ThemeProvider>
  )
}
