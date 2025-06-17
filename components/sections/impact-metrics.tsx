"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Users, Heart, Zap, Globe } from "lucide-react"

interface Metric {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
  description: string
}

const metrics: Metric[] = [
  {
    icon: <Users className="w-8 h-8" />,
    value: 25000,
    suffix: "+",
    label: "Créateur·rice·s",
    description: "Une communauté grandissante d'artistes engagés",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    value: 1200000,
    suffix: "+",
    label: "Vies touchées",
    description: "Impact direct sur les communautés",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    value: 450,
    suffix: "+",
    label: "Projets lancés",
    description: "Initiatives créatives pour le changement",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    value: 85,
    suffix: "",
    label: "Pays représentés",
    description: "Une portée véritablement mondiale",
  },
]

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000 // 2 seconds
      const steps = 60
      const increment = value / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, value])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function ImpactMetrics() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section id="impact" className="py-24 px-6 bg-gray-900" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Notre{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Impact
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Des chiffres qui témoignent de la puissance de la créativité au service du changement social et culturel.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="text-center group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.8 }}
            >
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Icon Background */}
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl flex items-center justify-center group-hover:from-purple-400/30 group-hover:to-pink-500/30 transition-all duration-500">
                  <div className="text-purple-400 group-hover:text-white transition-colors duration-300">
                    {metric.icon}
                  </div>
                </div>

                {/* Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ scale: 0.8 }}
                  whileHover={{ scale: 1.2 }}
                />
              </motion.div>

              {/* Metric Value */}
              <motion.div
                className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.2 + 0.3, duration: 0.6, type: "spring" }}
              >
                <AnimatedCounter value={metric.value} suffix={metric.suffix} />
              </motion.div>

              {/* Label */}
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors duration-300">
                {metric.label}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <p className="text-lg text-gray-300 mb-6">Prêt·e à faire partie de cette révolution créative ?</p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Rejoindre Xdose
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
