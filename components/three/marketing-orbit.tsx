"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

export function MarketingOrbit3D() {
  const n1 = useRef<THREE.Mesh>(null!)
  const n2 = useRef<THREE.Mesh>(null!)
  const n3 = useRef<THREE.Mesh>(null!)
  let t = 0

  useFrame((_, d) => {
    t += d
    const r1 = 1.2
    const r2 = 1.8
    const r3 = 1.5
    if (n1.current) n1.current.position.set(Math.cos(t) * r1, Math.sin(t) * r1 * 0.6, 0.1)
    if (n2.current) n2.current.position.set(Math.cos(t * 0.7 + 1) * r2, Math.sin(t * 0.7 + 1) * r2 * 0.4, -0.1)
    if (n3.current) n3.current.position.set(Math.cos(t * 1.3 + 2) * r3, Math.sin(t * 1.3 + 2) * r3 * 0.5, 0.15)
  })

  return (
    <Float floatIntensity={0.65} rotationIntensity={0.08} speed={1.1}>
      <group>
        {/* Faint ring plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <ringGeometry args={[0.8, 2.0, 48]} />
          <meshStandardMaterial color={"#0f172a"} opacity={0.6} transparent />
        </mesh>
        {/* Orbiting nodes */}
        <mesh ref={n1}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial
            color={"#00ffff"}
            emissive={"#00ffff"}
            emissiveIntensity={0.22}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
        <mesh ref={n2}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshStandardMaterial
            color={"#00f5a0"}
            emissive={"#00f5a0"}
            emissiveIntensity={0.2}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
        <mesh ref={n3}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshStandardMaterial
            color={"#0ea5e9"}
            emissive={"#0ea5e9"}
            emissiveIntensity={0.15}
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>
      </group>
    </Float>
  )
}

export default MarketingOrbit3D
