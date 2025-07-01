"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Share, MoreHorizontal, Play, Heart, Calendar, MapPin, LinkIcon, Pencil } from "lucide-react"
import { Navigation } from "@/components/layout/navigation"
import { AnimatedButton } from "@/components/ui/animated-button"
import { VideoPlayer } from "@/components/ui/VideoPlayer"
import { useSession } from "next-auth/react"

type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const user = session?.user as SessionUser | undefined
  const [profile, setProfile] = useState<any>(null)
  const [videos, setVideos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("videos")
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState<"image" | "cover" | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)

  const tabs = [
    { id: "videos", label: "Videos", count: profile?.stats?.videos || "0" },
    { id: "photos", label: "Photos", count: "89" },
    { id: "live", label: "Lives", count: "12" },
    { id: "about", label: "About", count: "" },
  ]

  useEffect(() => {
    if (status === "loading") return
    if (!user?.id) {
      setError("User not logged in")
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`/api/users/${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setProfile(data.user)
          setVideos(data.user.videos || [])
        } else {
          setError(typeof data.error === "string" ? data.error : "Error retrieving profile")
        }
        setLoading(false)
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Error retrieving profile")
        setLoading(false)
      })
  }, [user, status])

  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        bio: profile.bio || "",
        image: profile.image || "",
        cover: profile.cover || "",
        location: profile.location || "",
        website: profile.website || "",
        twitter: profile.twitter || "",
        instagram: profile.instagram || "",
        birthdate: profile.birthdate ? profile.birthdate.slice(0, 10) : "",
        customLinks: profile.customLinks || [],
      })
    }
  }, [profile])

  const handleChange = (e: any) => {
    const { name, value } = e.target
    setForm((f: any) => ({ ...f, [name]: value }))
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "cover") => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(type)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", "xdose_unsigned")
    const res = await fetch("https://api.cloudinary.com/v1_1/dt959yiaq/image/upload", {
      method: "POST",
      body: formData,
    })
    const data = await res.json()
    if (data.secure_url) {
      setSaving(true)
      const patchRes = await fetch(`/api/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, [type]: data.secure_url }),
      })
      if (patchRes.ok) {
        const updated = await patchRes.json()
        setProfile(updated.user)
        setForm((f: any) => ({ ...f, [type]: data.secure_url }))
      }
      setSaving(false)
    }
    setUploadingImage(null)
  }

  const handleFieldSave = async (field: string, value: string) => {
    setForm((f: any) => ({ ...f, [field]: value }))
    setSaving(true)
    const res = await fetch(`/api/users/${user?.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, [field]: value }),
    })
    if (res.ok) {
      const data = await res.json()
      setProfile(data.user)
    }
    setSaving(false)
    setEditingField(null)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>
  }

  const readyVideos = videos.filter(v => v.status === "ready" && v.playbackId);

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <main className="pt-40">
        {/* Profile Section (sans cover) */}
        <div className="relative">
          {/* Profile Info */}
          <div className="max-w-6xl mx-auto px-4">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
                {/* Avatar */}
                <div
                  className="relative group cursor-pointer w-fit mx-auto"
                  onClick={() => fileInputRef.current?.click()}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
                  role="button"
                  aria-label="Change profile photo"
                >
                  <img
                    src={profile?.image || "/placeholder.svg"}
                    alt="avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-black"
                    draggable={false}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center rounded-full transition-opacity pointer-events-none">
                    <Pencil className="w-6 h-6 text-white mb-1" />
                    <span className="text-white text-xs">Change profile photo</span>
                    {uploadingImage === "image" && (
                      <span className="text-xs text-purple-300 mt-2 animate-pulse">Upload...</span>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleFileChange(e, "image")}
                    tabIndex={-1}
                  />
                </div>

                {/* Profile Details */}
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="mt-4 text-center">
                        {editingField === "name" ? (
                          <input
                            className="text-3xl md:text-4xl font-bold mb-2 bg-black border-b border-purple-400 text-white text-center outline-none"
                            value={form.name}
                            autoFocus
                            onChange={e => setForm((f: any) => ({ ...f, name: e.target.value }))}
                            onBlur={e => handleFieldSave("name", e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") { handleFieldSave("name", (e.target as HTMLInputElement).value) }}}
                          />
                        ) : (
                          <span className="text-3xl md:text-4xl font-bold mb-2 cursor-pointer group" onClick={() => setEditingField("name")}>{form.name || <span className="text-gray-400">Name</span>} <Pencil className="inline w-4 h-4 text-purple-400 opacity-60 group-hover:opacity-100" /></span>
                        )}
                      </div>
                      <p className="text-gray-400 text-lg mb-4">{profile?.username}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      {user?.id !== profile?.id && (
                        <AnimatedButton variant="primary" size="md">
                          Subscribe
                        </AnimatedButton>
                      )}
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
                <div className="mt-2 text-center">
                  {editingField === "bio" ? (
                    <textarea
                      className="w-full max-w-xl mx-auto bg-black border-b border-purple-400 text-white text-center outline-none"
                      value={form.bio}
                      autoFocus
                      onChange={e => setForm((f: any) => ({ ...f, bio: e.target.value }))}
                      onBlur={e => handleFieldSave("bio", e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") { handleFieldSave("bio", (e.target as HTMLTextAreaElement).value) }}}
                    />
                  ) : (
                    <span className="text-gray-300 cursor-pointer group" onClick={() => setEditingField("bio")}>{form.bio || <span className="text-gray-500">Add a bio</span>} <Pencil className="inline w-4 h-4 text-purple-400 opacity-60 group-hover:opacity-100" /></span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <MapPin size={16} />
                    <span>{profile?.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <LinkIcon size={16} />
                    <a href={`https://${profile?.website}`} className="text-purple-400 hover:text-purple-300">
                      {profile?.website}
                    </a>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar size={16} />
                    <span>Joined in {profile?.joinDate}</span>
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
                {Object.entries(profile?.stats || {}).map(([key, value]) => (
                  <motion.div key={key} className="text-center" whileHover={{ scale: 1.05 }}>
                    <div className="text-2xl font-bold">{String(value)}</div>
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
            {readyVideos.length === 0 ? (
              <div className="col-span-full text-center text-gray-400 py-12">No video available</div>
            ) : (
              readyVideos.map((video) => (
                <div key={video.id} className="w-full mb-6">
                  <VideoPlayer playbackId={video.playbackId} poster={video.thumbnail} className="w-full" context="profile" />
                  <h3 className="font-semibold mb-2 text-white">{video.title}</h3>
                  <div className="text-gray-400 text-sm">{video.createdAt}</div>
                </div>
              ))
            )}
          </motion.div>
        </div>

        {/* Edition du profil */}
        <div className="mt-2 text-center">
          {editingField === "location" ? (
            <input
              className="bg-black border-b border-purple-400 text-white text-center outline-none"
              value={form.location}
              autoFocus
              onChange={e => setForm((f: any) => ({ ...f, location: e.target.value }))}
              onBlur={e => handleFieldSave("location", e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { handleFieldSave("location", (e.target as HTMLInputElement).value) }}}
            />
          ) : (
            <span className="text-gray-400 cursor-pointer group" onClick={() => setEditingField("location")}>{form.location || <span className="text-gray-500">Add a location</span>} <Pencil className="inline w-4 h-4 text-purple-400 opacity-60 group-hover:opacity-100" /></span>
          )}
        </div>
        <div className="mt-2 text-center">
          {editingField === "website" ? (
            <input
              className="bg-black border-b border-purple-400 text-white text-center outline-none"
              value={form.website}
              autoFocus
              onChange={e => setForm((f: any) => ({ ...f, website: e.target.value }))}
              onBlur={e => handleFieldSave("website", e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") { handleFieldSave("website", (e.target as HTMLInputElement).value) }}}
            />
          ) : (
            <span className="text-purple-400 cursor-pointer group" onClick={() => setEditingField("website")}>{form.website || <span className="text-gray-500">Add a website</span>} <Pencil className="inline w-4 h-4 text-purple-400 opacity-60 group-hover:opacity-100" /></span>
          )}
        </div>
      </main>
    </div>
  )
}
