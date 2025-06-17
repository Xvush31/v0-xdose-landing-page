"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Share, MoreHorizontal, Play, Heart, Calendar, MapPin, LinkIcon } from "lucide-react"
import { Navigation } from "@/components/layout/navigation"
import { AnimatedButton } from "@/components/ui/animated-button"

const profileData = {
  name: "Luna Rose",
  username: "@lunarose",
  avatar: "/placeholder.svg?height=120&width=120",
  cover: "/placeholder.svg?height=300&width=800",
  verified: true,
  bio: "Créatrice de contenu premium 🔥 | Nouvelle vidéo chaque semaine | DM pour collaborations",
  location: "Paris, France",
  website: "lunarose.com",
  joinDate: "Janvier 2023",
  stats: {
    followers: "125K",
    following: "892",
    likes: "2.1M",
    videos: "156",
  },
}

const userVideos = [
  {
    id: "1",
    thumbnail: "/placeholder.svg?height=200&width=300",
    title: "Session exclusive premium",
    views: "45K",
    likes: "2.1K",
    duration: "15:30",
    isPrivate: false,
  },
  {
    id: "2",
    thumbnail: "/placeholder.svg?height=200&width=300",
    title: "Behind the scenes",
    views: "32K",
    likes: "1.8K",
    duration: "8:45",
    isPrivate: false,
  },
  {
    id: "3",
    thumbnail: "/placeholder.svg?height=200&width=300",
    title: "Contenu privé VIP",
    views: "18K",
    likes: "956",
    duration: "12:20",
    isPrivate: true,
  },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("videos")

  const tabs = [
    { id: "videos", label: "Vidéos", count: profileData.stats.videos },
    { id: "photos", label: "Photos", count: "89" },
    { id: "live", label: "Lives", count: "12" },
    { id: "about", label: "À propos", count: "" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="pt-20">
        {/* Cover & Profile Section */}
        <div className="relative">
          {/* Cover Image */}
          <motion.div
            className="h-64 md:h-80 bg-gradient-to-r from-purple-900 via-pink-900 to-orange-900 relative overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <img
              src={profileData.cover || "/placeholder.svg"}
              alt="Cover"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </motion.div>

          {/* Profile Info */}
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="relative -mt-16 md:-mt-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={profileData.avatar || "/placeholder.svg"}
                    alt={profileData.name}
                    className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black object-cover"
                  />
                  {profileData.verified && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center border-2 border-black">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </motion.div>

                {/* Profile Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <h1 className="text-3xl md:text-4xl font-bold mb-2">{profileData.name}</h1>
                      <p className="text-gray-400 text-lg mb-4">{profileData.username}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <AnimatedButton variant="primary" size="md">
                        S'abonner
                      </AnimatedButton>
                      <motion.button
                        className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Share size={20} />
                      </motion.button>
                      <motion.button
                        className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MoreHorizontal size={20} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio & Info */}
              <motion.div
                className="mt-6 space-y-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-300 max-w-2xl">{profileData.bio}</p>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>{profileData.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <LinkIcon size={16} />
                    <a href={`https://${profileData.website}`} className="text-purple-400 hover:text-purple-300">
                      {profileData.website}
                    </a>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Rejoint en {profileData.joinDate}</span>
                  </div>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="mt-6 flex flex-wrap gap-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                {Object.entries(profileData.stats).map(([key, value]) => (
                  <motion.div key={key} className="text-center" whileHover={{ scale: 1.05 }}>
                    <div className="text-2xl font-bold">{value}</div>
                    <div className="text-gray-400 text-sm capitalize">{key}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Content Tabs */}
        <div className="max-w-6xl mx-auto px-4 mt-8">
          <motion.div
            className="border-b border-gray-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex space-x-8">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-4 px-2 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-500 text-white"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                  whileHover={{ y: -2 }}
                >
                  <span className="font-medium">{tab.label}</span>
                  {tab.count && <span className="ml-2 text-sm bg-gray-800 px-2 py-1 rounded-full">{tab.count}</span>}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Content Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {userVideos.map((video, index) => (
              <motion.div
                key={video.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden rounded-xl mb-3">
                  <img
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <motion.div
                      className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Play className="w-5 h-5 ml-0.5" fill="white" />
                    </motion.div>
                  </div>

                  {/* Duration */}
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>

                  {/* Private indicator */}
                  {video.isPrivate && (
                    <div className="absolute top-2 left-2 bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold">
                      VIP
                    </div>
                  )}
                </div>

                <h3 className="font-semibold mb-2 group-hover:text-purple-400 transition-colors">{video.title}</h3>

                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{video.views} vues</span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Heart size={14} />
                      <span>{video.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
