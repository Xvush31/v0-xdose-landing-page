"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Upload, Video, ImageIcon, Settings, BarChart3, DollarSign, Users } from "lucide-react"
import { Navigation } from "@/components/layout/navigation"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
}

export default function StudioPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    const user = session?.user as SessionUser | undefined
    if (!session || !user || user.role !== "CREATOR") {
      router.replace("/")
    }
  }, [session, status, router])

  const user = session?.user as SessionUser | undefined
  if (status === "loading" || !session || !user || user.role !== "CREATOR") {
    return null
  }

  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    // Handle file upload logic here
  }

  const stats = [
    { label: "Revenus ce mois", value: "€2,450", icon: <DollarSign className="w-5 h-5" />, change: "+12%" },
    { label: "Vues totales", value: "125K", icon: <BarChart3 className="w-5 h-5" />, change: "+8%" },
    { label: "Abonnés", value: "3,240", icon: <Users className="w-5 h-5" />, change: "+15%" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2">
              Studio{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Créateur
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Gérez votre contenu et suivez vos performances</p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="bg-gray-900 p-6 rounded-2xl border border-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="text-gray-400">{stat.icon}</div>
                  <span className="text-green-400 text-sm font-medium">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <Upload className="text-purple-400" size={24} />
                <span>Nouveau contenu</span>
              </h2>

              {/* Drag & Drop Upload */}
              <motion.div
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  dragActive ? "border-purple-400 bg-purple-400/10" : "border-gray-600 hover:border-gray-500"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full flex items-center justify-center"
                  animate={{
                    scale: dragActive ? [1, 1.1, 1] : 1,
                    rotate: dragActive ? [0, 5, -5, 0] : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <Video className="w-8 h-8 text-purple-400" />
                </motion.div>

                <h3 className="text-xl font-semibold mb-2">
                  {dragActive ? "Déposez vos fichiers ici" : "Glissez-déposez vos vidéos"}
                </h3>
                <p className="text-gray-400 mb-4">Formats supportés: MP4, MOV, AVI (max 2GB)</p>

                <AnimatedButton variant="secondary" size="md">
                  Choisir des fichiers
                </AnimatedButton>
              </motion.div>

              {/* Upload Options */}
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-purple-400 transition-colors text-left"
                  whileHover={{ y: -2 }}
                >
                  <Video className="w-6 h-6 text-purple-400 mb-2" />
                  <h3 className="font-semibold mb-1">Vidéo standard</h3>
                  <p className="text-sm text-gray-400">Upload classique</p>
                </motion.button>

                <motion.button
                  className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-pink-400 transition-colors text-left"
                  whileHover={{ y: -2 }}
                >
                  <ImageIcon className="w-6 h-6 text-pink-400 mb-2" />
                  <h3 className="font-semibold mb-1">Photos/GIFs</h3>
                  <p className="text-sm text-gray-400">Contenu image</p>
                </motion.button>
              </div>
            </motion.div>

            {/* Management Section */}
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold flex items-center space-x-2">
                <Settings className="text-orange-400" size={24} />
                <span>Gestion</span>
              </h2>

              {/* Quick Actions */}
              <div className="space-y-3">
                {[
                  { label: "Mes vidéos", desc: "Gérer le contenu publié", count: "24" },
                  { label: "Brouillons", desc: "Contenus en préparation", count: "3" },
                  { label: "Programmés", desc: "Publications planifiées", count: "5" },
                  { label: "Analyses", desc: "Statistiques détaillées", count: "" },
                ].map((item, index) => (
                  <motion.button
                    key={item.label}
                    className="w-full p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-gray-600 transition-colors text-left flex items-center justify-between"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 5 }}
                  >
                    <div>
                      <h3 className="font-semibold mb-1">{item.label}</h3>
                      <p className="text-sm text-gray-400">{item.desc}</p>
                    </div>
                    {item.count && (
                      <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm">
                        {item.count}
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <h3 className="font-semibold mb-4">Activité récente</h3>
                <div className="space-y-3">
                  {[
                    { action: "Vidéo publiée", time: "il y a 2h", status: "success" },
                    { action: "Commentaire reçu", time: "il y a 4h", status: "info" },
                    { action: "Nouveau abonné", time: "il y a 6h", status: "success" },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <span className="text-gray-300">{activity.action}</span>
                      <span className="text-gray-500">{activity.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
