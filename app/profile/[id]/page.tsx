"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { VideoPlayer } from "@/components/ui/VideoPlayer"
import { Heart, Play } from "lucide-react"

export default function PublicProfilePage() {
  const params = useParams() as { id: string }
  const userId = params.id
  const [profile, setProfile] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setProfile(data.user)
          setVideos(data.user.videos || [])
        } else {
          setError(typeof data.error === "string" ? data.error : "Profil introuvable")
        }
        setLoading(false)
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Erreur lors de la récupération du profil")
        setLoading(false)
      })
  }, [userId])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Chargement...</div>
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  }

  const readyVideos = videos.filter((v: any) => v.status === "ready" && v.playbackId);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Profile Info */}
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
                  src={profile?.image || "/placeholder.svg"}
                  alt={profile?.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black object-cover"
                />
              </motion.div>
              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile?.name}</h1>
                    <p className="text-gray-400 text-lg mb-4">{profile?.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          {/* Videos Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {readyVideos.map((video: any, index: number) => (
              <motion.div
                key={video.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative overflow-hidden rounded-xl mb-3 group">
                  <VideoPlayer key={video.id} playbackId={video.playbackId} poster={video.thumbnail} className="rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105" />
                  {/* Badge VIP */}
                  {index < 2 && (
                    <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-400 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">VIP</span>
                  )}
                  {/* Overlay Play animé au hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 bg-black/60 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                      <Play className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-sm">
                    --:--
                  </div>
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-purple-400 transition-colors">{video.title}</h3>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  )
} 