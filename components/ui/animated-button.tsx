"use client"

import type React from "react"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { useMousePosition } from "@/hooks/use-mouse-position"

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
}

export function AnimatedButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: AnimatedButtonProps) {
  const mousePosition = useMousePosition()

  const variants = {
    primary:
      "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25",
    secondary: "border-2 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-accent",
  }

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const magneticEffect = {
    x: mousePosition.x * 0.01,
    y: mousePosition.y * 0.01,
  }

  return (
    <motion.button
      className={cn(
        "relative font-semibold rounded-full transition-all duration-300 flex items-center justify-center overflow-hidden group",
        variants[variant],
        sizes[size],
        className,
      )}
      whileHover={{
        scale: 1.05,
        y: -2,
        ...magneticEffect,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
      {...props}
    >
      {/* Shimmer Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center">{children}</span>
    </motion.button>
  )
}
