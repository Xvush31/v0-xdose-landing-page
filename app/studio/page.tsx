"use client"
import nextDynamic from "next/dynamic"

const StudioClient = nextDynamic(() => import("./StudioClient"), { ssr: false })

export default function StudioPage() {
  return <StudioClient />
}

export const dynamic = "force-dynamic"
