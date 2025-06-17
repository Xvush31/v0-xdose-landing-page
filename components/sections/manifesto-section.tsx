"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Quote } from "lucide-react"

const manifestoPoints = [
  {
    title: "L'art comme catalyseur",
    content:
      "Nous croyons que chaque œuvre créative porte en elle le pouvoir de transformer les consciences et d'inspirer l'action collective.",
  },
  {
    title: "La diversité comme force",
    content:
      "Notre communauté célèbre toutes les formes d'expression artistique et toutes les voix, car c'est dans la diversité que naît l'innovation.",
  },
  {
    title: "L'engagement comme mission",
    content:
      "Au-delà de la beauté, nous valorisons l'art qui questionne, qui dérange, qui éveille et qui mobilise pour un monde plus juste.",
  },
  {
    title: "La collaboration comme méthode",
    content:
      "Ensemble, nous sommes plus forts. Xdose facilite les rencontres et les collaborations entre créateur·rice·s du monde entier.",
  },
]

export function ManifestoSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section id="manifesto" className="py-24 px-6 bg-black relative overflow-hidden" ref={containerRef}>
      {/* Background Pattern */}
      <motion.div className="absolute inset-0 opacity-5" style={{ y }}>
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400" />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-20"
          style={{ opacity }}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full mb-8"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <Quote className="w-8 h-8 text-purple-400" />
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Notre{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Manifesto
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Xdose n'est pas qu'une plateforme - c'est un mouvement qui amplifie les voix créatives qui osent rêver d'un
            monde différent et agissent pour le construire.
          </p>
        </motion.div>

        {/* Main Quote */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <blockquote className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed text-gray-100 max-w-5xl mx-auto">
            "Nous croyons que chaque créateur·rice porte en elle/lui le pouvoir de
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent font-semibold">
              {" "}
              transformer le monde
            </span>
            . L'art n'est pas un luxe, c'est une nécessité."
          </blockquote>
        </motion.div>

        {/* Manifesto Points */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {manifestoPoints.map((point, index) => (
            <motion.div
              key={point.title}
              className="group"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 + index * 0.2, duration: 0.8 }}
            >
              <motion.div
                className="relative p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700 group-hover:border-purple-400/50 transition-all duration-500 backdrop-blur-sm"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                {/* Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {index + 1}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-purple-400 transition-colors duration-300">
                  {point.title}
                </h3>

                <p className="text-gray-300 leading-relaxed">{point.content}</p>

                {/* Hover Effect */}
                <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto">
            Vous partagez cette vision ? Rejoignez une communauté qui transforme la passion créative en force de
            changement positif.
          </p>

          <motion.button
            className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 text-lg"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Faire partie du mouvement
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
