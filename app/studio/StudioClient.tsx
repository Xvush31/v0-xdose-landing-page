"use client";

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Upload, Video, ImageIcon, Settings, BarChart3, DollarSign, Users } from "lucide-react"
import { Navigation } from "@/components/layout/navigation"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"

type SessionUser = {
  name?: string | null
  email?: string | null
  image?: string | null
  role?: string
}

// Import dynamique des composants motion
const MotionDiv = dynamic(() => import('framer-motion').then(mod => mod.motion.div), { ssr: false })
const MotionButton = dynamic(() => import('framer-motion').then(mod => mod.motion.button), { ssr: false })

export default function StudioClient() {
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
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [confetti, setConfetti] = useState(false)
  const progressTimer = useRef<NodeJS.Timeout | null>(null)

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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setUploadError(null)
    setUploadSuccess(false)
    setUploadProgress(null)
    if (!title || !file) {
      setUploadError("Veuillez renseigner un titre et choisir un fichier vidéo.")
      return
    }
    setUploading(true)
    try {
      // 1. Appel API pour obtenir l'uploadUrl Mux
      const res = await fetch("/api/videos/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      })
      if (!res.ok) {
        const err = await res.json()
        setUploadError(err.error || "Erreur lors de la création de l'upload Mux.")
        setUploading(false)
        return
      }
      const { uploadUrl } = await res.json()
      // 2. Upload direct du fichier à Mux avec suivi de progression
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open("PUT", uploadUrl)
        xhr.setRequestHeader("Content-Type", file.type)
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100)
            setUploadProgress(percent)
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(100)
            resolve()
          } else {
            setUploadError("Erreur lors de l'upload du fichier vidéo vers Mux: " + xhr.statusText)
            setUploading(false)
            reject(new Error(xhr.statusText))
          }
        }
        xhr.onerror = () => {
          setUploadError("Erreur réseau lors de l'upload vidéo.")
          setUploading(false)
          reject(new Error("Erreur réseau"))
        }
        xhr.send(file)
      })
      setUploadSuccess(true)
      setTitle("")
      setFile(null)
    } catch (err: any) {
      setUploadError(err.message || "Erreur inconnue lors de l'upload.")
    } finally {
      setUploading(false)
    }
  }

  // Progression optimiste
  useEffect(() => {
    if (uploading && typeof uploadProgress !== "number") {
      let fakeProgress = 0
      progressTimer.current = setInterval(() => {
        fakeProgress += Math.random() * 2 + 1 // Avance non linéaire
        if (fakeProgress < 95) {
          setUploadProgress(Math.floor(fakeProgress))
        } else {
          setUploadProgress(95)
          if (progressTimer.current) clearInterval(progressTimer.current)
        }
      }, 80)
    }
    if (!uploading && progressTimer.current) {
      clearInterval(progressTimer.current)
    }
    return () => {
      if (progressTimer.current) clearInterval(progressTimer.current)
    }
  }, [uploading])

  // Quand l'upload réel termine, anime 95->100 + confettis
  useEffect(() => {
    if (uploadProgress === 100) {
      setConfetti(true)
      setTimeout(() => setConfetti(false), 2500)
    }
  }, [uploadProgress])

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
          <MotionDiv className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-bold mb-2">
              Studio{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                Créateur
              </span>
            </h1>
            <p className="text-gray-400 text-lg">Gérez votre contenu et suivez vos performances</p>
          </MotionDiv>

          {/* Stats Cards */}
          <MotionDiv
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {stats.map((stat, index) => (
              <MotionDiv
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
              </MotionDiv>
            ))}
          </MotionDiv>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            {user.role === "CREATOR" && (
              <MotionDiv
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold flex items-center space-x-2">
                  <Upload className="text-purple-400" size={24} />
                  <span>Nouveau contenu</span>
                </h2>
                <form onSubmit={handleUpload} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Titre de la vidéo"
                    className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    disabled={uploading}
                  />
                  <div
                    className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                      dragActive ? "border-purple-400 bg-purple-400/10" : "border-gray-600 hover:border-gray-500"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <MotionDiv
                      className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full flex items-center justify-center"
                      animate={{
                        scale: dragActive ? [1, 1.1, 1] : 1,
                        rotate: dragActive ? [0, 5, -5, 0] : 0,
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <Video className="w-8 h-8 text-purple-400" />
                    </MotionDiv>
                    <h3 className="text-xl font-semibold mb-2">
                      {dragActive ? "Déposez vos fichiers ici" : file ? file.name : "Glissez-déposez vos vidéos"}
                    </h3>
                    <p className="text-gray-400 mb-4">Formats supportés: MP4, MOV, AVI (max 2GB)</p>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      id="video-upload-input"
                      onChange={handleFileChange}
                      disabled={uploading}
                    />
                    <label htmlFor="video-upload-input">
                      <AnimatedButton
                        as="span"
                        variant="secondary"
                        size="md"
                        tabIndex={0}
                        role="button"
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            document.getElementById("video-upload-input")?.click();
                          }
                        }}
                      >
                        Choisir des fichiers
                      </AnimatedButton>
                    </label>
                    {/* Barre de progression premium */}
                    {typeof uploadProgress === "number" && (
                      <MotionDiv
                        className="relative w-full h-6 mt-6 rounded-full bg-gray-800 overflow-hidden shadow-lg"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        aria-label="Progression de l'upload"
                        role="progressbar"
                        aria-valuenow={uploadProgress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                      >
                        <MotionDiv
                          className="absolute left-0 top-0 h-full rounded-full"
                          style={{
                            width: `${uploadProgress}%`,
                            background: "linear-gradient(90deg, #a78bfa 0%, #ec4899 50%, #f59e42 100%)",
                            boxShadow: uploadProgress === 100 ? "0 0 16px 4px #a78bfa55" : undefined,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: uploadProgress === 100 ? 0.7 : 0.5, ease: "easeInOut" }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-white text-sm select-none">
                          {uploadProgress === 100 ? (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 20 }}
                              className="flex items-center gap-1"
                            >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="10" fill="#22c55e"/><path d="M6 10.5L9 13.5L14 8.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              Upload terminé, ta vidéo est prête à briller !
                            </motion.span>
                          ) : (
                            `${uploadProgress}%`
                          )}
                        </span>
                        {/* Confettis animés */}
                        {confetti && (
                          <span className="pointer-events-none absolute inset-0 z-20">
                            <ConfettiEffect />
                          </span>
                        )}
                      </MotionDiv>
                    )}
                  </div>
                  {uploadError && <div className="text-red-500 text-sm">{uploadError}</div>}
                  {uploadSuccess && <div className="text-green-500 text-sm">Vidéo uploadée avec succès !</div>}
                  <AnimatedButton type="submit" variant="primary" size="lg" disabled={uploading}>
                    {uploading ? "Upload en cours..." : "Uploader la vidéo"}
                  </AnimatedButton>
                </form>
                {/* Upload Options */}
                <div className="grid grid-cols-2 gap-4">
                  <MotionButton
                    className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-purple-400 transition-colors text-left"
                    whileHover={{ y: -2 }}
                  >
                    <Video className="w-6 h-6 text-purple-400 mb-2" />
                    <h3 className="font-semibold mb-1">Vidéo standard</h3>
                    <p className="text-sm text-gray-400">Upload classique</p>
                  </MotionButton>

                  <MotionButton
                    className="p-4 bg-gray-900 rounded-xl border border-gray-800 hover:border-pink-400 transition-colors text-left"
                    whileHover={{ y: -2 }}
                  >
                    <ImageIcon className="w-6 h-6 text-pink-400 mb-2" />
                    <h3 className="font-semibold mb-1">Photos/GIFs</h3>
                    <p className="text-sm text-gray-400">Contenu image</p>
                  </MotionButton>
                </div>
              </MotionDiv>
            )}

            {/* Management Section */}
            <MotionDiv
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
                  <MotionButton
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
                  </MotionButton>
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
                  ].map((activity, idx) => (
                    <MotionDiv
                      key={idx}
                      className="flex items-center justify-between text-sm"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + idx * 0.1 }}
                    >
                      <span className="text-gray-300">{activity.action}</span>
                      <span className="text-gray-500">{activity.time}</span>
                    </MotionDiv>
                  ))}
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </main>
    </div>
  )
}

// ConfettiEffect composant (inline, simple SVG/JSX pour effet visuel)
function ConfettiEffect() {
  // Génère 24 confettis animés
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}>
      {[...Array(24)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 100 + '%'}
          cy={Math.random() * 20 + 40 + '%'}
          r={Math.random() * 3 + 2}
          fill={["#a78bfa", "#ec4899", "#f59e42", "#22c55e"][i % 4]}
        >
          <animate
            attributeName="cy"
            from={Math.random() * 20 + 40 + '%'}
            to={Math.random() * 80 + 10 + '%'}
            dur={0.9 + Math.random() * 0.7 + 's'}
            begin={0.1 * i + 's'}
            fill="freeze"
          />
          <animate
            attributeName="opacity"
            from="1"
            to="0"
            dur={0.7 + Math.random() * 0.7 + 's'}
            begin={0.1 * i + 's'}
            fill="freeze"
          />
        </circle>
      ))}
    </svg>
  )
} 