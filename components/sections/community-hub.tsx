"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useInView } from "framer-motion"
import { MessageCircle, Users, Calendar, Zap, ArrowRight, Check } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"

const communityFeatures = [
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Forums créatifs",
    description: "Échangez avec des artistes du monde entier",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Collaborations",
    description: "Trouvez vos partenaires créatifs idéaux",
  },
  {
    icon: <Calendar className="w-6 h-6" />,
    title: "Événements exclusifs",
    description: "Participez à des masterclasses et workshops",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Opportunités",
    description: "Accédez à des projets et financements",
  },
]

const testimonials = [
  {
    name: "Léa Martinez",
    role: "Illustratrice",
    content: "Xdose m'a permis de connecter avec des activistes et de donner un sens plus profond à mon art.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Thomas Chen",
    role: "Musicien",
    content: "La communauté est incroyable. J'ai trouvé des collaborateurs pour mon projet sur l'écologie urbaine.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
  {
    name: "Aisha Patel",
    role: "Danseuse",
    content: "Grâce à Xdose, ma performance sur les droits des femmes a touché des milliers de personnes.",
    avatar: "/placeholder.svg?height=60&width=60",
  },
]

export function CommunityHub() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail("")
      }, 3000)
    }
  }

  return (
    <section id="community" className="py-24 px-6 bg-gradient-to-b from-gray-900 to-black" ref={ref}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Rejoignez la{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Communauté
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Plus qu'une plateforme, Xdose est un écosystème vivant où les créateur·rice·s s'entraident, collaborent et
            grandissent ensemble.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Community Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-8 text-white">Ce qui vous attend</h3>

            <div className="space-y-6">
              {communityFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="flex items-start gap-4 group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-xl flex items-center justify-center group-hover:from-purple-400/30 group-hover:to-pink-500/30 transition-all duration-300">
                    <div className="text-purple-400 group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors duration-300">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Newsletter Signup */}
            <motion.div
              className="mt-12 p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <h4 className="text-lg font-semibold text-white mb-4">Restez connecté·e</h4>
              <p className="text-gray-400 mb-6">
                Recevez les dernières actualités, opportunités et événements de la communauté.
              </p>

              <form onSubmit={handleSubscribe} className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition-colors"
                  required
                />
                <AnimatedButton type="submit" variant="primary" size="sm" disabled={isSubscribed} className="px-6">
                  {isSubscribed ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <>
                      S'inscrire
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </AnimatedButton>
              </form>

              {isSubscribed && (
                <motion.p
                  className="text-green-400 text-sm mt-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  Merci ! Vous êtes maintenant inscrit·e à notre newsletter.
                </motion.p>
              )}
            </motion.div>
          </motion.div>

          {/* Testimonials */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-8 text-white">Ils témoignent</h3>

            <div className="space-y-6">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl border border-gray-700 hover:border-purple-400/50 transition-all duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 + index * 0.2, duration: 0.6 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-white">{testimonial.name}</h4>
                        <span className="text-purple-400 text-sm">{testimonial.role}</span>
                      </div>
                      <p className="text-gray-300 leading-relaxed">"{testimonial.content}"</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
            >
              <AnimatedButton variant="primary" size="lg">
                Rejoindre maintenant
              </AnimatedButton>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
