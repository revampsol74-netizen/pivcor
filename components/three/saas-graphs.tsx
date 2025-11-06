"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

export function SaaSGraphs3D() {
  const a = useRef<THREE.Mesh>(null!)
  const b = useRef<THREE.Mesh>(null!)
  const c = useRef<THREE.Mesh>(null!)
  const trend = useRef<THREE.Mesh>(null!)
  let t = 0

  useFrame((_, d) => {
    t += d
    if (a.current && b.current && c.current) {
      a.current.scale.y = 0.8 + Math.sin(t * 1.2) * 0.3
      b.current.scale.y = 1.0 + Math.sin(t * 1.5 + 0.6) * 0.35
      c.current.scale.y = 0.9 + Math.sin(t * 1.1 + 1.2) * 0.25
    }
    if (trend.current) {
      // gentle pulse
      trend.current.position.y = 0.9 + Math.sin(t * 1.1) * 0.08
    }
  })

  return (
    <Float floatIntensity={0.5} rotationIntensity={0.05} speed={1}>
      <group position={[0, -0.6, 0]}>
        {/* Bars */}
        <mesh ref={a} position={[-0.9, 0.6, 0]}>
          <boxGeometry args={[0.4, 1.2, 0.4]} />
          <meshStandardMaterial
            color={"#00ffff"}
            emissive={"#00ffff"}
            emissiveIntensity={0.18}
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>
        <mesh ref={b} position={[0, 0.6, 0]}>
          <boxGeometry args={[0.4, 1.2, 0.4]} />
          <meshStandardMaterial
            color={"#00f5a0"}
            emissive={"#00f5a0"}
            emissiveIntensity={0.18}
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>
        <mesh ref={c} position={[0.9, 0.6, 0]}>
          <boxGeometry args={[0.4, 1.2, 0.4]} />
          <meshStandardMaterial
            color={"#0ea5e9"}
            emissive={"#0ea5e9"}
            emissiveIntensity={0.12}
            metalness={0.4}
            roughness={0.35}
          />
        </mesh>

        {/* Axis */}
        <mesh position={[0, -0.05, -0.05]}>
          <boxGeometry args={[2.6, 0.05, 0.05]} />
          <meshStandardMaterial color={"#334155"} />
        </mesh>
        <mesh position={[-1.3, 0.65, -0.05]}>
          <boxGeometry args={[0.05, 1.4, 0.05]} />
          <meshStandardMaterial color={"#334155"} />
        </mesh>

        <mesh ref={trend} position={[0, 1.05, 0.05]}>
          <boxGeometry args={[2.3, 0.025, 0.05]} />
          <meshStandardMaterial
            color={"#00ffff"}
            emissive={"#00ffff"}
            emissiveIntensity={0.18}
            metalness={0.3}
            roughness={0.35}
          />
        </mesh>
      </group>
    </Float>
  )
}

export default SaaSGraphs3D
