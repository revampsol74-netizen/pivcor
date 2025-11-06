"use client"

import { useState } from "react"
import { X, Copy, Check } from "lucide-react"
import { copyToClipboard } from "@/lib/clipboard"
import { toast } from "sonner"

interface AnimationCodeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AnimationCodeModal({ isOpen, onClose }: AnimationCodeModalProps) {
  const [copied, setCopied] = useState(false)

  const animationCode = `"use client"

import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import dynamic from "next/dynamic"

const HologramOrb = dynamic(() => import("@/components/three/hologram-orb").then((m) => m.HologramOrb), { ssr: false })
const NeonNetwork = dynamic(() => import("@/components/three/neon-network").then((m) => m.NeonNetwork), { ssr: false })

export function HeroAnimation() {
  return (
    <div className="relative aspect-[4/3] rounded-xl overflow-hidden border border-border/60 glass">
      <Canvas className="canvas-overlay" dpr={[1, 2]} camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[5, 5, 5]} intensity={2} color={"#00ffff"} />
        <HologramOrb />
        <NeonNetwork />
        <Environment preset="night" />
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
      
      {/* Locked PIVCOR Button */}
      <a
        href="https://pivcor.com"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 left-4 px-3 py-2 bg-primary/80 text-primary-foreground text-sm rounded-md hover:bg-primary transition-colors neon-glow"
        aria-label="Powered by PIVCOR"
      >
        PIVCOR
      </a>
    </div>
  )
}`

  const handleCopy = async () => {
    const success = await copyToClipboard(animationCode)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast.success("Code copied to clipboard!")
    } else {
      toast.error("Failed to copy. Please try again.")
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[80vh] mx-4 rounded-lg border border-border/60 glass bg-background/95 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h2 className="text-lg font-semibold">Animation Code</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-accent/20 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4">
          <pre className="bg-black/30 rounded-lg p-4 text-sm text-foreground/90 font-mono overflow-x-auto">
            <code>{animationCode}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-border/30">
          <p className="text-sm text-foreground/60">Copy the code and use it in your project</p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors neon-glow"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Code
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
