"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, User, Video, ArrowLeft, Mail, Lock, UserCheck } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

type UserType = "creator" | "viewer" | null

export default function SignUpPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userType, setUserType] = useState<UserType>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    avatar: "",
    twitter: "",
    instagram: "",
    wallet: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (status === "loading") return
    if (session) {
      router.replace("/") // ou une autre page (ex: /profile)
    }
  }, [session, status, router])

  if (status === "loading" || session) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as any;
    if (name === "avatar" && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfile((prev) => ({ ...prev, avatar: ev.target?.result as string }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          username: profile.username || null, // Username optionnel
          password: formData.password,
          role: userType === "creator" ? "CREATOR" : "VIEWER",
          // Champs de profil optionnels pour les créateurs
          ...(userType === "creator" && {
            bio: profile.bio || null,
            avatar: profile.avatar || null,
            twitter: profile.twitter || null,
            instagram: profile.instagram || null,
            wallet: profile.wallet || null,
          }),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Registration failed")
        setLoading(false)
        return
      }
      // Succès : redirection vers la page de connexion
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login?message=Account created successfully! Please sign in with your email and password.")
      }, 2000)
    } catch (err) {
      setError("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dark">
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10" />
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Back Button */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </Link>
          </motion.div>

          <Card className="backdrop-blur-lg bg-card/90 border-border/50 shadow-2xl">
            <CardContent className="p-8">
              {/* Animated Logo */}
              <motion.div
                className="flex justify-center mb-8"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
              >
                <motion.div
                  className="w-16 h-16 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 rounded-2xl flex items-center justify-center relative overflow-hidden"
                  animate={{
                    boxShadow: [
                      "0 0 30px rgba(139, 92, 246, 0.4)",
                      "0 0 50px rgba(236, 72, 153, 0.6)",
                      "0 0 30px rgba(139, 92, 246, 0.4)",
                    ],
                  }}
                  transition={{
                    boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                  }}
                >
                  <motion.span
                    className="text-3xl font-bold text-black"
                    animate={{
                      textShadow: [
                        "0 0 15px rgba(255, 255, 255, 0.5)",
                        "0 0 25px rgba(255, 255, 255, 0.8)",
                        "0 0 15px rgba(255, 255, 255, 0.5)",
                      ],
                    }}
                    transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    X
                  </motion.span>

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                  />

                  {/* Floating Particles */}
                  {[...Array(6)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-white/60 rounded-full"
                      style={{
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 60}%`,
                      }}
                      animate={{
                        y: [0, -10, 0],
                        x: [0, Math.random() * 10 - 5, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2 + Math.random(),
                        repeat: Number.POSITIVE_INFINITY,
                        delay: Math.random() * 2,
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-8"
              >
                <h1 className="text-3xl font-bold mb-2">Join Xdose</h1>
                <p className="text-muted-foreground">Create your account and start your journey</p>
              </motion.div>

              {/* Choix créateur/fan */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-center mb-4 text-white">Sign up as :</h2>
                <div className="flex gap-4 justify-center">
                  <motion.button
                    type="button"
                    onClick={() => setUserType("creator")}
                    className={`flex flex-col items-center px-6 py-4 rounded-xl border-2 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white font-semibold text-lg gap-2 ${
                      userType === "creator"
                        ? "bg-gradient-to-br from-purple-600 to-pink-500 border-purple-500 scale-105"
                        : "bg-white/10 border-white/20 hover:scale-105"
                    }`}
                    whileTap={{ scale: 0.97 }}
                    animate={{ scale: userType === "creator" ? 1.05 : 1 }}
                  >
                    <Video className="w-8 h-8 mb-1" />
                    Creator
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={() => setUserType("viewer")}
                    className={`flex flex-col items-center px-6 py-4 rounded-xl border-2 transition-all duration-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-semibold text-lg gap-2 ${
                      userType === "viewer"
                        ? "bg-gradient-to-br from-blue-600 to-indigo-500 border-blue-500 scale-105"
                        : "bg-white/10 border-white/20 hover:scale-105"
                    }`}
                    whileTap={{ scale: 0.97 }}
                    animate={{ scale: userType === "viewer" ? 1.05 : 1 }}
                  >
                    <User className="w-8 h-8 mb-1" />
                    Fan
                  </motion.button>
                </div>
              </div>

              {/* Formulaire animé selon le choix */}
              <AnimatePresence>
                {userType && (
                  <motion.form
                    key="signup-form"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleSubmit}
                    className="space-y-6 mt-2"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          size={16}
                        />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username (optional)</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={profile.username}
                        onChange={handleProfileChange}
                        placeholder="Your unique username (can be set later)"
                        autoComplete="off"
                        className="mb-2"
                      />
                      <Label htmlFor="avatar">Profile picture</Label>
                      <div className="flex items-center gap-3 mb-2">
                        <input
                          ref={fileInputRef}
                          id="avatar"
                          name="avatar"
                          type="file"
                          accept="image/*"
                          onChange={handleProfileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3 py-1 bg-purple-600 text-white rounded shadow hover:bg-purple-700"
                        >
                          {profile.avatar ? "Change" : "Choose an image"}
                        </button>
                        {profile.avatar && (
                          <img src={profile.avatar} alt="avatar preview" className="w-10 h-10 rounded-full object-cover border-2 border-purple-400" />
                        )}
                      </div>
                      <Label htmlFor="bio">Short bio</Label>
                      <textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleProfileChange}
                        placeholder="Describe yourself in one sentence..."
                        className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white"
                        maxLength={120}
                        rows={2}
                      />
                      {userType === "creator" && (
                        <>
                          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                            <p className="text-sm text-blue-300">
                              💡 <strong>Quick setup:</strong> You can fill in your social media and wallet details later in your profile settings. Focus on getting started first!
                            </p>
                          </div>
                          <Label htmlFor="twitter">Twitter (optional)</Label>
                          <Input
                            id="twitter"
                            name="twitter"
                            type="text"
                            value={profile.twitter}
                            onChange={handleProfileChange}
                            placeholder="@yourusername (can be set later)"
                            className="mb-2"
                          />
                          <Label htmlFor="instagram">Instagram (optional)</Label>
                          <Input
                            id="instagram"
                            name="instagram"
                            type="text"
                            value={profile.instagram}
                            onChange={handleProfileChange}
                            placeholder="@yourusername (can be set later)"
                            className="mb-2"
                          />
                          <Label htmlFor="wallet">Payout wallet (optional)</Label>
                          <Input
                            id="wallet"
                            name="wallet"
                            type="text"
                            value={profile.wallet}
                            onChange={handleProfileChange}
                            placeholder="0x... (can be set later in settings)"
                            className="mb-2"
                          />
                        </>
                      )}
                    </div>

                    {/* Preview profil en temps réel */}
                    <div className="mt-6 flex flex-col items-center bg-white/5 rounded-xl p-4 border border-white/10">
                      <span className="text-gray-400 text-xs mb-2">Profile preview</span>
                      <img
                        src={profile.avatar || "/placeholder-user.jpg"}
                        alt="avatar preview"
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-400 mb-2"
                      />
                      <div className="text-lg font-bold text-white">{profile.username || "Username"}</div>
                      <div className="text-sm text-gray-300 mb-1">{profile.bio || "Your short bio will appear here"}</div>
                      {userType === "creator" && (
                        <div className="flex gap-2 mt-1">
                          {profile.twitter && <span className="text-blue-400">@{profile.twitter}</span>}
                          {profile.instagram && <span className="text-pink-400">@{profile.instagram}</span>}
                          {profile.wallet && <span className="text-green-400">{profile.wallet.slice(0, 8)}...</span>}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          size={16}
                        />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                          size={16}
                        />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="pl-10 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="agreeToTerms"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleInputChange}
                        className="rounded border-border"
                        required
                      />
                      <Label htmlFor="agreeToTerms" className="text-sm">
                        I agree to the{" "}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>

                    {/* Affichage des erreurs ou succès */}
                    {error && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-red-500 text-center">
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 text-green-500 text-center">
                        ✅ Account created successfully! Redirecting to login...
                      </motion.div>
                    )}

                    <AnimatedButton type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
                      {loading ? "Creating..." : "Create Account"}
                    </AnimatedButton>
                  </motion.form>
                )}
              </AnimatePresence>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center"
              >
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
