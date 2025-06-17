"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Instagram, Twitter, Star, Users, TrendingUp } from "lucide-react"
import { useScrollTrigger } from "@/hooks/use-scroll-trigger"

interface Creator {
  id: string
  name: string
  username: string
  description: string
  image: string
  category: string
  subscribers: string
  earnings: string
  rating: number
  verified: boolean
  featured: boolean
  social: {
    instagram?: string
    twitter?: string
    website?: string
  }
}

const creators: Creator[] = [
  {
    id: "luna-rose",
    name: "Luna Rose",
    username: "@lunarose",
    description:
      "Créatrice de contenu premium avec une approche artistique unique. Spécialisée dans les sessions exclusives.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Premium",
    subscribers: "125K",
    earnings: "€15K/mois",
    rating: 4.9,
    verified: true,
    featured: true,
    social: {
      instagram: "@lunarose_official",
      website: "lunarose.com",
    },
  },
  {
    id: "scarlett-divine",
    name: "Scarlett Divine",
    username: "@scarlettdivine",
    description: "Modèle professionnelle et créatrice de contenu sensuel. Nouvelle série chaque semaine.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Artistique",
    subscribers: "89K",
    earnings: "€12K/mois",
    rating: 4.8,
    verified: true,
    featured: false,
    social: {
      instagram: "@scarlett_divine",
      twitter: "@scarlettdivine",
    },
  },
  {
    id: "alex-morgan",
    name: "Alex Morgan",
    username: "@alexmorgan",
    description: "Créateur de contenu lifestyle et fitness. Contenu exclusif pour une communauté engagée.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Lifestyle",
    subscribers: "67K",
    earnings: "€8K/mois",
    rating: 4.7,
    verified: true,
    featured: false,
    social: {
      instagram: "@alex_morgan_fit",
      website: "alexmorgan.fit",
    },
  },
  {
    id: "maya-chen",
    name: "Maya Chen",
    username: "@mayachen",
    description: "Artiste numérique et créatrice de contenu innovant. Fusion entre art et sensualité.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Art numérique",
    subscribers: "45K",
    earnings: "€6K/mois",
    rating: 4.6,
    verified: false,
    featured: false,
    social: {
      instagram: "@maya_digital_art",
      website: "mayachen.art",
    },
  },
]

const categories = ["Tous", "Premium", "Artistique", "Lifestyle", "Art numérique"]

export function CreatorShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [hoveredCreator, setHoveredCreator] = useState<string | null>(null)
  const isVisible = useScrollTrigger(0.2)

  const filteredCreators =
    selectedCategory === "Tous" ? creators : creators.filter((creator) => creator.category === selectedCategory)

  return (
    <section id="creators" className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Nos{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Créateurs
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez les créateur·rice·s les plus talentueux·ses qui partagent du contenu exclusif et authentique sur
            notre plateforme.
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-3 rounded-full border transition-all duration-300 ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-purple-400 to-pink-500 text-white border-transparent"
                  : "border-gray-600 text-gray-300 hover:border-gray-400 hover:text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Creators Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" layout>
          <AnimatePresence mode="wait">
            {filteredCreators.map((creator, index) => (
              <motion.div
                key={creator.id}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onHoverStart={() => setHoveredCreator(creator.id)}
                onHoverEnd={() => setHoveredCreator(null)}
                layout
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 group-hover:border-purple-400 transition-all duration-500">
                  {/* Featured Badge */}
                  {creator.featured && (
                    <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-orange-400 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                      ⭐ FEATURED
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={creator.image}
                      alt={creator.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />

                    {/* Social Links */}
                    <motion.div
                      className="absolute top-4 right-4 flex gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{
                        opacity: hoveredCreator === creator.id ? 1 : 0,
                        scale: hoveredCreator === creator.id ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {creator.social.instagram && (
                        <motion.a
                          href={`https://instagram.com/${creator.social.instagram.replace("@", "")}`}
                          className="p-2 bg-black/50 rounded-full hover:bg-purple-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Instagram size={16} />
                        </motion.a>
                      )}
                      {creator.social.twitter && (
                        <motion.a
                          href={`https://twitter.com/${creator.social.twitter.replace("@", "")}`}
                          className="p-2 bg-black/50 rounded-full hover:bg-purple-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Twitter size={16} />
                        </motion.a>
                      )}
                      {creator.social.website && (
                        <motion.a
                          href={`https://${creator.social.website}`}
                          className="p-2 bg-black/50 rounded-full hover:bg-purple-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink size={16} />
                        </motion.a>
                      )}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-purple-400 font-medium uppercase tracking-wide">
                        {creator.category}
                      </span>
                      {creator.verified && (
                        <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white">✓</span>
                        </div>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-1 group-hover:text-purple-400 transition-colors">
                      {creator.name}
                    </h3>

                    <p className="text-sm text-gray-400 mb-3">{creator.username}</p>

                    <p className="text-sm text-gray-300 mb-4 line-clamp-3">{creator.description}</p>

                    {/* Stats */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1 text-gray-400">
                          <Users size={14} />
                          <span>{creator.subscribers} abonnés</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star size={14} className="text-yellow-400" fill="currentColor" />
                          <span className="text-yellow-400">{creator.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-green-400 text-sm">
                        <TrendingUp size={14} />
                        <span>{creator.earnings}</span>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
