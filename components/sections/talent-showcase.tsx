"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ExternalLink, Instagram, Twitter } from "lucide-react"
import { useScrollTrigger } from "@/hooks/use-scroll-trigger"

interface Talent {
  id: string
  name: string
  role: string
  description: string
  image: string
  category: string
  social: {
    instagram?: string
    twitter?: string
    website?: string
  }
  impact: string
}

const talents: Talent[] = [
  {
    id: "maya-chen",
    name: "Maya Chen",
    role: "Artiste numérique & Activiste climat",
    description:
      "Crée des installations immersives qui sensibilisent aux enjeux environnementaux à travers l'art génératif.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Art numérique",
    social: {
      instagram: "@mayachen_art",
      website: "mayachen.art",
    },
    impact: "500K+ personnes sensibilisées",
  },
  {
    id: "jordan-okafor",
    name: "Jordan Okafor",
    role: "Poète urbain & Médiateur social",
    description: "Utilise la poésie slam pour créer des ponts entre les communautés et promouvoir la justice sociale.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Littérature",
    social: {
      instagram: "@jordan_words",
      twitter: "@jordanpoetry",
    },
    impact: "200+ ateliers organisés",
  },
  {
    id: "alex-rivera",
    name: "Alex Rivera",
    role: "Designer UX & Défenseur accessibilité",
    description: "Conçoit des expériences numériques inclusives et milite pour un web accessible à tous.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Design",
    social: {
      twitter: "@alexux",
      website: "alexrivera.design",
    },
    impact: "50+ produits rendus accessibles",
  },
  {
    id: "sam-dubois",
    name: "Sam Dubois",
    role: "Photographe documentaire & Journaliste",
    description: "Documente les mouvements sociaux et donne une voix aux communautés marginalisées.",
    image: "/placeholder.svg?height=400&width=300",
    category: "Photographie",
    social: {
      instagram: "@samdubois_photo",
      website: "samdubois.com",
    },
    impact: "10+ reportages primés",
  },
]

const categories = ["Tous", "Art numérique", "Littérature", "Design", "Photographie"]

export function TalentShowcase() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [hoveredTalent, setHoveredTalent] = useState<string | null>(null)
  const isVisible = useScrollTrigger(0.2)

  const filteredTalents =
    selectedCategory === "Tous" ? talents : talents.filter((talent) => talent.category === selectedCategory)

  return (
    <section id="talents" className="py-24 px-6 bg-gradient-to-b from-black to-gray-900">
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
              Talents
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez les créateur·rice·s qui façonnent l'avenir à travers leur art, leur vision et leur engagement pour
            un monde meilleur.
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

        {/* Talents Grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" layout>
          <AnimatePresence mode="wait">
            {filteredTalents.map((talent, index) => (
              <motion.div
                key={talent.id}
                className="group relative"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                onHoverStart={() => setHoveredTalent(talent.id)}
                onHoverEnd={() => setHoveredTalent(null)}
                layout
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-800 border border-gray-700 group-hover:border-purple-400 transition-all duration-500">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <motion.img
                      src={talent.image}
                      alt={talent.name}
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
                        opacity: hoveredTalent === talent.id ? 1 : 0,
                        scale: hoveredTalent === talent.id ? 1 : 0.8,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {talent.social.instagram && (
                        <motion.a
                          href={`https://instagram.com/${talent.social.instagram.replace("@", "")}`}
                          className="p-2 bg-black/50 rounded-full hover:bg-purple-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Instagram size={16} />
                        </motion.a>
                      )}
                      {talent.social.twitter && (
                        <motion.a
                          href={`https://twitter.com/${talent.social.twitter.replace("@", "")}`}
                          className="p-2 bg-black/50 rounded-full hover:bg-purple-500 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Twitter size={16} />
                        </motion.a>
                      )}
                      {talent.social.website && (
                        <motion.a
                          href={`https://${talent.social.website}`}
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
                    <div className="mb-2">
                      <span className="text-xs text-purple-400 font-medium uppercase tracking-wide">
                        {talent.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                      {talent.name}
                    </h3>

                    <p className="text-sm text-gray-400 mb-3">{talent.role}</p>

                    <p className="text-sm text-gray-300 mb-4 line-clamp-3">{talent.description}</p>

                    <div className="text-xs text-orange-400 font-medium">{talent.impact}</div>
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
