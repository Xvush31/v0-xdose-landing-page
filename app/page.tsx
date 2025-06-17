"use client"

import { useEffect, useState } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/layout/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { CreatorShowcase } from "@/components/sections/creator-showcase"
import { PlatformFeatures } from "@/components/sections/platform-features"
import { StatsSection } from "@/components/sections/stats-section"
import { CommunitySection } from "@/components/sections/community-section"
import { FooterExperience } from "@/components/layout/footer-experience"
import { ParticleField } from "@/components/ui/particle-field"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { ThemeProvider } from "@/components/theme-provider"

export default function XdoseHomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
        {/* Background Particle Field */}
        {!prefersReducedMotion && (
          <motion.div className="fixed inset-0 z-0" style={{ y: backgroundY }}>
            <ParticleField />
          </motion.div>
        )}

        {/* Main Content */}
        <div className="relative z-10">
          <AnimatePresence>
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Navigation />
                <main>
                  <HeroSection />
                  <CreatorShowcase />
                  <PlatformFeatures />
                  <StatsSection />
                  <CommunitySection />
                </main>
                <FooterExperience />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ThemeProvider>
  )
}
