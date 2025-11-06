"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

export function MobilePhone3D() {
  const phone = useRef<THREE.Group>(null!)
  const sweep = useRef<THREE.Mesh>(null!)
  let t = 0

  useFrame((_, d) => {
    if (!phone.current) return
    t += d
    phone.current.rotation.y += d * 0.8
    phone.current.rotation.x = 0.25
    if (sweep.current) {
      const x = Math.sin(t * 1.2) * 0.5
      sweep.current.position.x = x
      // fade in/out subtly
      const mat = sweep.current.material as THREE.MeshStandardMaterial
      if (mat) mat.emissiveIntensity = 0.08 + (Math.cos(t * 2) + 1) * 0.06
    }
  })

  return (
    <Float floatIntensity={0.7} rotationIntensity={0.2} speed={1.1}>
      <group ref={phone} position={[0, 0, 0]}>
        {/* Body */}
        <mesh>
          <boxGeometry args={[1.2, 2.2, 0.18]} />
          <meshStandardMaterial
            color={"#0ea5e9"}
            metalness={0.5}
            roughness={0.35}
            emissive={"#00ffff"}
            emissiveIntensity={0.1}
          />
        </mesh>
        {/* Screen */}
        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[1.05, 1.9]} />
          <meshStandardMaterial color={"#0f172a"} />
        </mesh>
        {/* Notch */}
        <mesh position={[0, 0.95, 0.096]}>
          <boxGeometry args={[0.5, 0.08, 0.01]} />
          <meshStandardMaterial color={"#00f5a0"} emissive={"#00f5a0"} emissiveIntensity={0.2} />
        </mesh>
        <mesh ref={sweep} position={[0, 0, 0.101]}>
          <planeGeometry args={[0.18, 1.9]} />
          <meshStandardMaterial
            color={"#ffffff"}
            emissive={"#00ffff"}
            emissiveIntensity={0.12}
            transparent
            opacity={0.22}
          />
        </mesh>
      </group>
    </Float>
  )
}

export default MobilePhone3D
