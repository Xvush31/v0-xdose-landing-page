"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, User, Instagram, Twitter, Wallet } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

type SessionUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export default function OnboardingPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const user = session?.user as SessionUser | undefined
  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    instagram: "",
    twitter: "",
    wallet: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [redirecting, setRedirecting] = useState(false)

  if (!user) {
    router.push("/auth/login")
    return null
  }

  if (user.role !== "CREATOR") {
    router.push("/profile")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setRedirecting(false)

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          bio: formData.bio,
          instagram: formData.instagram,
          twitter: formData.twitter,
          wallet: formData.wallet,
        }),
      })

      if (response.ok) {
        setRedirecting(true)
        window.location.href = "/profile?message=Profile updated successfully!"
      } else {
        const data = await response.json()
        setError(data.error || "Something went wrong")
      }
    } catch (err) {
      setError("Network error")
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    setRedirecting(true)
    window.location.href = "/profile"
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <span>Back to Profile</span>
          </Link>
        </motion.div>

        <Card className="backdrop-blur-lg bg-card/80 border-border/50 shadow-2xl">
          <CardContent className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl font-bold mb-2">Complete Your Creator Profile</h1>
              <p className="text-muted-foreground">Set up your profile to start earning</p>
            </motion.div>

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
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="your_username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="pl-10"
                    required
                    disabled={loading || redirecting}
                  />
                </div>
                <p className="text-xs text-muted-foreground">This will be your unique identifier on the platform</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Tell your fans about yourself..."
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">A short description to help fans discover you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="instagram"
                      name="instagram"
                      type="text"
                      placeholder="@username"
                      value={formData.instagram}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      id="twitter"
                      name="twitter"
                      type="text"
                      placeholder="@username"
                      value={formData.twitter}
                      onChange={handleInputChange}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wallet">Crypto Wallet Address</Label>
                <div className="relative">
                  <Wallet className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
                  <Input
                    id="wallet"
                    name="wallet"
                    type="text"
                    placeholder="0x..."
                    value={formData.wallet}
                    onChange={handleInputChange}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Your wallet address for receiving payments (optional for now)</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <AnimatedButton
                  type="submit"
                  disabled={loading || redirecting}
                  className="flex-1"
                >
                  {loading ? "Saving..." : redirecting ? "Redirection..." : "Complete Setup"}
                </AnimatedButton>
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors text-muted-foreground"
                  disabled={loading || redirecting}
                >
                  {redirecting ? "Redirection..." : "Skip for Now"}
                </button>
              </div>
            </motion.form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 