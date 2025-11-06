"use client"

import { useState } from "react"
import { Code2 } from "lucide-react"
import dynamic from "next/dynamic"
import { AnimationCodeModal } from "./animation-code-modal"

const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => ({ default: mod.Canvas })), { ssr: false })
const Environment = dynamic(() => import("@react-three/drei").then((mod) => ({ default: mod.Environment })), { ssr: false })
const OrbitControls = dynamic(() => import("@react-three/drei").then((mod) => ({ default: mod.OrbitControls })), { ssr: false })
const HologramOrb = dynamic(() => import("@/components/three/hologram-orb").then((m) => m.HologramOrb), { ssr: false })
const NeonNetwork = dynamic(() => import("@/components/three/neon-network").then((m) => m.NeonNetwork), { ssr: false })

export function AnimationViewer() {
  const [showCodeModal, setShowCodeModal] = useState(false)

  return (
    <>
      <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/60 glass group">
        {/* 3D Canvas */}
        <Canvas className="canvas-overlay" dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[5, 5, 5]} intensity={2} color={"#00ffff"} />
          <HologramOrb />
          <NeonNetwork />
          <Environment preset="night" />
          <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
        </Canvas>

        <button
          onClick={() => setShowCodeModal(true)}
          className="absolute top-4 right-4 flex items-center gap-2 px-3 py-2 bg-primary/80 text-primary-foreground text-sm rounded-md hover:bg-primary transition-all opacity-0 group-hover:opacity-100 neon-glow"
          aria-label="View animation code"
        >
          <Code2 className="w-4 h-4" />
          Code
        </button>

        <a
          href="https://pivcor.com"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 left-4 px-3 py-2 bg-primary/80 text-primary-foreground rounded-md hover:bg-primary transition-colors neon-glow text-xs font-light"
          aria-label="Powered by PIVCOR"
        >
          PIVCOR
        </a>
      </div>

      <AnimationCodeModal isOpen={showCodeModal} onClose={() => setShowCodeModal(false)} />
    </>
  )
}
