"use client"

import { motion } from "framer-motion"
import { Shield, DollarSign, Users, Video, BarChart3, Heart } from "lucide-react"
import { useScrollTrigger } from "@/hooks/use-scroll-trigger"

const features = [
  {
    icon: <DollarSign className="w-8 h-8" />,
    title: "Monétisation optimale",
    description: "Gardez 85% de vos revenus avec nos outils de monétisation avancés",
    color: "from-green-400 to-emerald-500",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Sécurité premium",
    description: "Protection avancée de votre contenu et de vos données personnelles",
    color: "from-blue-400 to-cyan-500",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Communauté engagée",
    description: "Connectez avec une audience qualifiée et fidèle à votre contenu",
    color: "from-purple-400 to-pink-500",
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "Streaming HD/4K",
    description: "Diffusez en haute qualité avec notre infrastructure optimisée",
    color: "from-red-400 to-orange-500",
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: "Analytics détaillées",
    description: "Suivez vos performances avec des statistiques complètes",
    color: "from-indigo-400 to-purple-500",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Interaction directe",
    description: "Messagerie privée et fonctionnalités d'engagement avancées",
    color: "from-pink-400 to-rose-500",
  },
]

export function PlatformFeatures() {
  const isVisible = useScrollTrigger(0.2)

  return (
    <section className="py-24 px-6 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pourquoi choisir{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Xdose
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Une plateforme conçue par et pour les créateurs, avec les outils les plus avancés du marché.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="group relative p-8 bg-gray-800 rounded-2xl border border-gray-700 hover:border-gray-600 transition-all duration-500"
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
            >
              {/* Icon */}
              <motion.div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                whileHover={{ rotate: 5 }}
              >
                <div className="text-white">{feature.icon}</div>
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {feature.description}
              </p>

              {/* Hover Effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}
              />

              {/* Glow Effect */}
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`}
                initial={{ scale: 0.8 }}
                whileHover={{ scale: 1.2 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <p className="text-lg text-gray-300 mb-6">Prêt·e à rejoindre la révolution du contenu créateur ?</p>
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
