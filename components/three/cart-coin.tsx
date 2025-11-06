"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Float } from "@react-three/drei"
import type * as THREE from "three"

export function CartCoin3D() {
  const coin = useRef<THREE.Mesh>(null!)
  const box1 = useRef<THREE.Mesh>(null!)
  const box2 = useRef<THREE.Mesh>(null!)

  useFrame((_, d) => {
    if (coin.current) {
      coin.current.rotation.y += d * 1.2
      coin.current.rotation.x = 0.6
    }
    if (box1.current) box1.current.rotation.y += d * 0.6
    if (box2.current) box2.current.rotation.x -= d * 0.5
  })

  return (
    <Float floatIntensity={0.6} rotationIntensity={0.08} speed={1.05}>
      <group>
        {/* Coin */}
        <mesh ref={coin} position={[0.9, 0.4, 0]}>
          <cylinderGeometry args={[0.35, 0.35, 0.08, 24]} />
          <meshStandardMaterial
            color={"#f59e0b"}
            emissive={"#f59e0b"}
            emissiveIntensity={0.25}
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
        {/* Boxes */}
        <mesh ref={box1} position={[-0.8, -0.1, 0]}>
          <boxGeometry args={[0.8, 0.5, 0.6]} />
          <meshStandardMaterial color={"#00ffff"} emissive={"#00ffff"} emissiveIntensity={0.15} />
        </mesh>
        <mesh ref={box2} position={[0.1, -0.3, 0.2]}>
          <boxGeometry args={[0.7, 0.4, 0.5]} />
          <meshStandardMaterial color={"#00f5a0"} emissive={"#00f5a0"} emissiveIntensity={0.15} />
        </mesh>
        {/* Faint orbit ring around coin */}
        <mesh position={[0.9, 0.4, -0.02]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.55, 0.01, 12, 48]} />
          <meshStandardMaterial
            color={"#00f5a0"}
            emissive={"#00f5a0"}
            emissiveIntensity={0.12}
            metalness={0.3}
            roughness={0.45}
          />
        </mesh>
      </group>
    </Float>
  )
}

export default CartCoin3D
