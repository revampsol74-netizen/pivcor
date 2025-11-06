"use client"
import dynamic from "next/dynamic"
import { AnimationViewer } from "./animation-viewer"

const HologramOrb = dynamic(() => import("@/components/three/hologram-orb").then((m) => m.HologramOrb), { ssr: false })
const NeonNetwork = dynamic(() => import("@/components/three/neon-network").then((m) => m.NeonNetwork), { ssr: false })

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 hero-bg pointer-events-none" aria-hidden />
      <div className="section relative py-24 md:py-32">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <AnimationViewer />

          <div className="max-w-3xl">
            <h1 className="text-pretty text-4xl md:text-6xl font-semibold tracking-tight">
              Stop Building Projects. Start Building Your Ecosystem.
            </h1>
            <p className="mt-4 text-foreground/80 leading-relaxed md:text-lg">
              We are Pivcor—your global partner for architecting the unified web, mobile, and blockchain "core" your brand needs to scale.
            </p>
            <div className="mt-8 flex items-center gap-4">
              <a
                href="#services"
                className="inline-flex items-center rounded-md px-5 py-3 bg-primary text-primary-foreground neon-glow transition-transform hover:scale-[1.02]"
              >
                Explore Services
              </a>
              <a
                href="#projects"
                className="inline-flex items-center rounded-md px-5 py-3 border border-border/60 hover:bg-accent/10 transition-colors"
                aria-label="View our blueprints"
              >
                View Our Blueprints
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
