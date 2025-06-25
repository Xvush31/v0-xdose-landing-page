"use client"

import { useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Menu, X, Play, Compass, Upload, User, Sun, Moon } from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useScrollTrigger } from "@/hooks/use-scroll-trigger"
import { AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useSession } from "next-auth/react"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { scrollY } = useScroll()
  const isScrolled = useScrollTrigger(0.1)
  const { data: session } = useSession()

  const navBackground = useTransform(
    scrollY,
    [0, 100],
    ["rgba(0, 0, 0, 0)", theme === "dark" ? "rgba(0, 0, 0, 0.95)" : "rgba(255, 255, 255, 0.95)"],
  )

  const navItems = [
    { label: "Feed", href: "/feed", icon: <Play size={16} /> },
    { label: "Discover", href: "/discover", icon: <Compass size={16} /> },
    { label: "Studio", href: "/studio", icon: <Upload size={16} /> },
    { label: "Profile", href: "/profile", icon: <User size={16} /> },
  ]

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-lg border-b border-border/50"
      style={{ backgroundColor: navBackground }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ delay: 1.2, duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Animated Logo */}
        <Link href="/">
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-400 rounded-xl flex items-center justify-center relative overflow-hidden"
              whileHover={{ rotate: 5 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                  "0 0 30px rgba(236, 72, 153, 0.4)",
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                ],
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
              }}
            >
              <motion.span
                className="text-xl font-bold text-black"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(255, 255, 255, 0.5)",
                    "0 0 20px rgba(255, 255, 255, 0.8)",
                    "0 0 10px rgba(255, 255, 255, 0.5)",
                  ],
                }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              >
                X
              </motion.span>

              {/* Shine Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              />
            </motion.div>

            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
              Xdose
            </span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 + index * 0.1 }}
            >
              <Link
                href={item.href}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors duration-300 relative group"
              >
                <motion.div whileHover={{ y: -2 }}>{item.icon}</motion.div>
                <span>{item.label}</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}

          {/* Theme Toggle */}
          <motion.button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-accent transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {!session && (
            <Link href="/auth/signup" className="w-full">
              <AnimatedButton variant="primary" size="sm">
                Sign Up
              </AnimatedButton>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} whileTap={{ scale: 0.95 }}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}

              <motion.button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center space-x-3 text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </motion.button>

              {!session && (
                <Link href="/auth/signup" className="w-full">
                  <AnimatedButton variant="primary" size="sm" className="w-full">
                    Sign Up
                  </AnimatedButton>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
