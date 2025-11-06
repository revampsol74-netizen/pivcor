"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

export function WebApp3D() {
  const group = useRef<THREE.Group>(null!)
  const t = { rotY: 0 }

  useFrame((_, d) => {
    t.rotY += d * 0.6
    if (group.current) {
      group.current.rotation.y = t.rotY
      group.current.rotation.x = 0.1 * Math.sin(t.rotY * 0.5)
    }
  })

  return (
    <Float floatIntensity={0.6} rotationIntensity={0.1} speed={1}>
      <group ref={group}>
        {/* Browser window body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[3.2, 2, 0.2]} />
          <meshStandardMaterial
            color={"#0ea5e9"}
            metalness={0.5}
            roughness={0.35}
            emissive={"#00ffff"}
            emissiveIntensity={0.12}
          />
        </mesh>

        {/* Top bar */}
        <mesh position={[0, 0.95, 0.11]}>
          <boxGeometry args={[3.2, 0.2, 0.02]} />
          <meshStandardMaterial
            color={"#00f5a0"}
            emissive={"#00f5a0"}
            emissiveIntensity={0.2}
            metalness={0.4}
            roughness={0.4}
          />
        </mesh>

        {/* Screen panel */}
        <mesh position={[0, 0, 0.11]}>
          <planeGeometry args={[2.9, 1.6]} />
          <meshStandardMaterial color={"#0f172a"} />
        </mesh>

        {/* UI blocks */}
        <mesh position={[-0.9, 0.2, 0.12]}>
          <boxGeometry args={[0.8, 0.4, 0.02]} />
          <meshStandardMaterial color={"#00ffff"} emissive={"#00ffff"} emissiveIntensity={0.18} />
        </mesh>
        <mesh position={[0.1, -0.2, 0.12]}>
          <boxGeometry args={[1.7, 0.25, 0.02]} />
          <meshStandardMaterial color={"#00f5a0"} emissive={"#00f5a0"} emissiveIntensity={0.12} />
        </mesh>
      </group>
    </Float>
  )
}

export default WebApp3D
