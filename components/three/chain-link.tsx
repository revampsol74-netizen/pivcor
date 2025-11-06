"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

export function ChainLink3D() {
  const a = useRef<THREE.Mesh>(null!)
  const b = useRef<THREE.Mesh>(null!)

  useFrame((_, d) => {
    if (!a.current || !b.current) return
    a.current.rotation.x += d * 0.4
    a.current.rotation.y += d * 0.2
    b.current.rotation.y -= d * 0.35
    b.current.rotation.x += d * 0.25
  })

  return (
    <group>
      <mesh ref={a} position={[-0.8, 0, 0]}>
        <torusGeometry args={[1.1, 0.22, 16, 48]} />
        <meshStandardMaterial
          color={"#8b5cf6"}
          emissive={"#8b5cf6"}
          emissiveIntensity={0.3}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
      <mesh ref={b} position={[0.8, 0, 0]} rotation={[Math.PI / 2, 0, Math.PI / 4]}>
        <torusGeometry args={[1.1, 0.22, 16, 48]} />
        <meshStandardMaterial
          color={"#00f5a0"}
          emissive={"#00f5a0"}
          emissiveIntensity={0.25}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
    </group>
  )
}

export default ChainLink3D
