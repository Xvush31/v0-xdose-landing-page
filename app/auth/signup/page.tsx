"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "FAN" as "CREATOR" | "FAN"
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleRoleChange = (role: "CREATOR" | "FAN") => {
    setFormData(prev => ({ ...prev, role }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirection vers login avec message de succès
        router.push("/auth/login?message=Account created successfully! Please sign in.")
      } else {
        setError(data.error || "Something went wrong")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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

        <Card className="backdrop-blur-lg bg-card/80 border-border/50 shadow-2xl">
            <CardContent className="p-8">
            {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
              >
              <h1 className="text-3xl font-bold mb-2">Create Account</h1>
              <p className="text-muted-foreground">Join Xdose today</p>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-center">
                {error}
              </motion.div>
            )}

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Role Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">I am a...</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleRoleChange("FAN")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === "FAN"
                        ? "border-purple-500 bg-purple-500/10 text-purple-500"
                        : "border-border hover:border-purple-500/50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">👥</div>
                      <div className="font-medium">Fan</div>
                      <div className="text-xs text-muted-foreground">Support creators</div>
                        </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange("CREATOR")}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.role === "CREATOR"
                        ? "border-purple-500 bg-purple-500/10 text-purple-500"
                        : "border-border hover:border-purple-500/50"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">⭐</div>
                      <div className="font-medium">Creator</div>
                      <div className="text-xs text-muted-foreground">Share content</div>
                    </div>
                  </button>
                </div>
                    </div>

              {/* Name Input */}
                      <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                        <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your name"
                    value={formData.name}
                            onChange={handleInputChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

              {/* Email Input */}
                      <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                        <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10"
                            required
                          />
                        </div>
                      </div>

              {/* Password Input */}
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                          <Input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="pl-10 pr-10"
                            required
                    minLength={6}
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

              {/* Submit Button */}
              <AnimatedButton
                type="submit"
                disabled={loading}
                className="w-full"
              >
                {loading ? "Creating account..." : "Create Account"}
              </AnimatedButton>

              {/* Login Link */}
              <div className="text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                <Link href="/auth/login" className="text-purple-500 hover:text-purple-400 font-medium">
                    Sign in
                  </Link>
              </div>
            </motion.form>
            </CardContent>
          </Card>
      </div>
    </div>
  )
}
