"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

export function HologramOrb() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame((_, d) => {
    if (!ref.current) return
    ref.current.rotation.x += d * 0.3
    ref.current.rotation.y += d * 0.45
  })
  return (
    <mesh ref={ref}>
      <torusKnotGeometry args={[1.2, 0.35, 180, 24]} />
      <meshPhysicalMaterial
        color={"#00ffff"}
        emissive={"#00ffff"}
        emissiveIntensity={0.25}
        metalness={0.4}
        roughness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.15}
        transmission={0.35}
        ior={1.2}
        transparent
      />
    </mesh>
  )
}

export default HologramOrb
