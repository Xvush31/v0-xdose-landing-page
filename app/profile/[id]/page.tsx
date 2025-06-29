"use client"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { VideoPlayer } from "@/components/ui/VideoPlayer"
import { Eye } from "lucide-react"

// Types clairs
interface Video {
  id: string
  title: string
  playbackId: string
  thumbnail?: string
  status: string
  createdAt: string
}

interface Profile {
  id: string
  name: string
  email: string
  image?: string
  videos: Video[]
}

export default function ProfilePage() {
  const params = useParams() as { id: string }
  const userId = params.id
  
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return
    
    setLoading(true)
    setError(null)
    
    console.log("Chargement du profil:", userId)
    
    fetch(`/api/users/${userId}`)
      .then(res => {
        console.log("Response status:", res.status)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        return res.json()
      })
      .then(data => {
        console.log("Profile data:", data)
        if (data.user) {
          // Filtrer les vidéos prêtes
          const readyVideos = (data.user.videos || []).filter(
            (v: Video) => v.status === "ready" && v.playbackId
          )
          console.log("Vidéos prêtes:", readyVideos)
          
          setProfile({
            ...data.user,
            videos: readyVideos
          })
        } else {
          setError("Profil introuvable")
        }
      })
      .catch((err) => {
        console.error("Erreur profile:", err)
        setError("Erreur lors du chargement du profil")
      })
      .finally(() => {
        setLoading(false)
      })
  }, [userId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">❌ {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Profil non trouvé</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="pt-20">
        <div className="max-w-6xl mx-auto px-4">
          {/* Profile Header */}
          <motion.div
            className="relative -mt-16 md:-mt-20 mb-8"
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
                  src={profile.image || "/placeholder-user.jpg"}
                  alt={profile.name}
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-black object-cover shadow-2xl"
                />
              </motion.div>
              
              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{profile.name}</h1>
                <p className="text-gray-400 text-lg mb-4">{profile.email}</p>
                
                {/* Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span>{profile.videos.length} vidéos</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Videos Grid */}
          {profile.videos.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {profile.videos.map((video, index) => (
                <motion.div
                  key={video.id}
                  className="group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="mb-3">
                    <VideoPlayer 
                      playbackId={video.playbackId}
                      poster={video.thumbnail}
                      className="w-full"
                    />
                  </div>
                  <h3 className="font-semibold mb-2 text-white">{video.title}</h3>
                  <p className="text-gray-400 text-sm">
                    {new Date(video.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-gray-400 text-lg">Aucune vidéo disponible</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
} 