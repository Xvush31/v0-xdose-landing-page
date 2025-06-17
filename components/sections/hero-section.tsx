"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"
import { ChevronDown, Play, Users, Video } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { RevealText } from "@/components/ui/reveal-text"
import { useMousePosition } from "@/hooks/use-mouse-position"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const controls = useAnimation()
  const mousePosition = useMousePosition()

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const magneticEffect = {
    x: mousePosition.x * 0.02,
    y: mousePosition.y * 0.02,
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 pt-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Spectacular Logo Animation */}
        <motion.div
          className="mb-8"
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            delay: 0.0,
            duration: 1.5,
            type: "spring",
            stiffness: 80,
            damping: 12,
          }}
        >
          <motion.div
            className="w-32 h-32 mx-auto bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 rounded-3xl flex items-center justify-center transform rotate-12 relative overflow-hidden"
            animate={{
              rotate: [12, 15, 12],
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 20px 60px rgba(139, 92, 246, 0.4)",
                "0 25px 80px rgba(236, 72, 153, 0.6)",
                "0 20px 60px rgba(139, 92, 246, 0.4)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.1,
              rotate: 0,
              transition: { duration: 0.3 },
            }}
          >
            <motion.span
              className="text-4xl font-bold text-black transform -rotate-12 relative z-10"
              animate={{
                textShadow: [
                  "0 0 20px rgba(255, 255, 255, 0.8)",
                  "0 0 40px rgba(255, 255, 255, 1)",
                  "0 0 20px rgba(255, 255, 255, 0.8)",
                ],
              }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              X
            </motion.span>

            {/* Floating Particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/60 rounded-full"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${20 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 1, 0.3],
                  scale: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}

            {/* Rotating Shine Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            />
          </motion.div>
        </motion.div>

        {/* Main Headline */}
        <div className="mb-6">
          <RevealText
            text="The premium platform"
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-foreground"
            delay={0.3}
          />
          <RevealText
            text="for adult creators"
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent"
            delay={0.8}
          />
        </div>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          Monetize your content, connect with your audience, and build your personal brand on the most innovative
          platform in the market.
        </motion.p>

        {/* Quick Stats */}
        <motion.div
          className="flex flex-wrap justify-center gap-8 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          {[
            { icon: <Users className="w-5 h-5" />, value: "50K+", label: "Creators" },
            { icon: <Video className="w-5 h-5" />, value: "1M+", label: "Videos" },
            { icon: <Play className="w-5 h-5" />, value: "10M+", label: "Views/month" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex items-center space-x-2 text-muted-foreground"
              whileHover={{ scale: 1.05, color: "hsl(var(--foreground))" }}
            >
              <div className="text-purple-400">{stat.icon}</div>
              <span className="font-bold text-foreground">{stat.value}</span>
              <span>{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          style={magneticEffect}
        >
          <AnimatedButton variant="primary" size="lg" className="group">
            Start Creating
            <motion.div className="ml-2 group-hover:translate-x-1 transition-transform" whileHover={{ x: 4 }}>
              →
            </motion.div>
          </AnimatedButton>

          <AnimatedButton variant="secondary" size="lg">
            Explore Content
          </AnimatedButton>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.0, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="flex flex-col items-center text-muted-foreground"
          >
            <span className="text-sm mb-2">Discover</span>
            <ChevronDown size={20} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
