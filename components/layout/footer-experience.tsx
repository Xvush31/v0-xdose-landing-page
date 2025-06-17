"use client"

import { motion } from "framer-motion"
import { Instagram, Twitter, Linkedin, Mail, ArrowUp } from "lucide-react"

const footerLinks = {
  Plateforme: [
    { label: "Découvrir", href: "#talents" },
    { label: "Créer", href: "#create" },
    { label: "Collaborer", href: "#collaborate" },
    { label: "Événements", href: "#events" },
  ],
  Communauté: [
    { label: "Forums", href: "#forums" },
    { label: "Mentorship", href: "#mentorship" },
    { label: "Ressources", href: "#resources" },
    { label: "Blog", href: "#blog" },
  ],
  Support: [
    { label: "Centre d'aide", href: "#help" },
    { label: "Contact", href: "#contact" },
    { label: "Partenariats", href: "#partnerships" },
    { label: "Presse", href: "#press" },
  ],
}

const socialLinks = [
  { icon: <Instagram className="w-5 h-5" />, href: "#", label: "Instagram" },
  { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
  { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
  { icon: <Mail className="w-5 h-5" />, href: "#", label: "Email" },
]

export function FooterExperience() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="relative bg-black border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold mb-4">
                <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                  Xdose
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed max-w-md">
                La plateforme qui amplifie les voix créatives qui transforment le monde. Rejoignez une communauté
                d'artistes, penseur·euse·s et innovateur·rice·s militants.
              </p>
            </motion.div>

            {/* Social Links */}
            <motion.div
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-purple-500 hover:text-white transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + categoryIndex * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.5 + categoryIndex * 0.1 + linkIndex * 0.05,
                      duration: 0.4,
                    }}
                    viewport={{ once: true }}
                  >
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-purple-400 transition-colors duration-300 block"
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.p
            className="text-gray-400 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            viewport={{ once: true }}
          >
            © 2024 Xdose. Tous droits réservés. Fait avec ❤️ pour les créateur·rice·s.
          </motion.p>

          <div className="flex items-center gap-6">
            <motion.a
              href="#privacy"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Confidentialité
            </motion.a>
            <motion.a
              href="#terms"
              className="text-gray-400 hover:text-white text-sm transition-colors duration-300"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 1.0, duration: 0.6 }}
              viewport={{ once: true }}
            >
              Conditions
            </motion.a>

            {/* Back to Top */}
            <motion.button
              onClick={scrollToTop}
              className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-purple-500 hover:text-white transition-all duration-300"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.4 }}
              viewport={{ once: true }}
              aria-label="Retour en haut"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Easter Egg - Konami Code */}
      <div className="absolute bottom-4 left-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <span className="text-xs text-gray-600">↑↑↓↓←→←→BA</span>
      </div>
    </footer>
  )
}
