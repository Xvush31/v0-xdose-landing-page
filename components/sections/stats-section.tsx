"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Users, Video, DollarSign, Globe, TrendingUp, Heart } from "lucide-react"

interface Metric {
  icon: React.ReactNode
  value: number
  suffix: string
  label: string
  description: string
  prefix?: string
}

const metrics: Metric[] = [
  {
    icon: <Users className="w-8 h-8" />,
    value: 150000,
    suffix: "+",
    label: "Créateurs actifs",
    description: "Une communauté grandissante de talents",
  },
  {
    icon: <Video className="w-8 h-8" />,
    value: 2500000,
    suffix: "+",
    label: "Contenus publiés",
    description: "Vidéos, photos et lives exclusifs",
  },
  {
    icon: <DollarSign className="w-8 h-8" />,
    value: 45,
    suffix: "M€",
    label: "Revenus générés",
    description: "Distribués aux créateurs cette année",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    value: 120,
    suffix: "",
    label: "Pays actifs",
    description: "Une portée véritablement mondiale",
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    value: 85,
    suffix: "%",
    label: "Commission créateur",
    description: "Le taux le plus élevé du marché",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    value: 98,
    suffix: "%",
    label: "Satisfaction",
    description: "Taux de satisfaction des créateurs",
  },
]

function AnimatedCounter({ value, suffix, prefix = "" }: { value: number; suffix: string; prefix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
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
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export function StatsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section className="py-24 px-6 bg-black relative overflow-hidden" ref={ref}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Nos{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Performances
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Des chiffres qui témoignent de la confiance et du succès de notre communauté de créateurs.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="text-center group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15, duration: 0.8 }}
            >
              <motion.div
                className="relative mb-6"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Icon Background */}
                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-2xl flex items-center justify-center group-hover:from-purple-400/30 group-hover:to-pink-500/30 transition-all duration-500 relative">
                  <div className="text-purple-400 group-hover:text-white transition-colors duration-300 relative z-10">
                    {metric.icon}
                  </div>

                  {/* Pulse Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-2xl"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
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
                transition={{ delay: index * 0.15 + 0.3, duration: 0.6, type: "spring" }}
              >
                <AnimatedCounter value={metric.value} suffix={metric.suffix} prefix={metric.prefix} />
              </motion.div>

              {/* Label */}
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-purple-400 transition-colors duration-300">
                {metric.label}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{metric.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Message */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <p className="text-lg text-gray-300 mb-6">
            Rejoignez des milliers de créateurs qui ont choisi Xdose pour développer leur activité
          </p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Commencer maintenant
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
