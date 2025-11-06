"use client"

import { useMemo, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

type Props = {
  count?: number
  radius?: number
  density?: number
  speed?: number
}

export function NeonNetwork({ count = 80, radius = 2.6, density = 20, speed = 0.4 }: Props) {
  const points = useMemo(() => {
    const arr: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      const r = radius * (0.75 + Math.random() * 0.25)
      arr.push(
        new THREE.Vector3(r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)),
      )
    }
    return arr
  }, [count, radius])

  const geomRef = useRef<THREE.BufferGeometry>(null!)
  const lineRef = useRef<THREE.LineSegments>(null!)

  // Build line segments between near neighbors
  const { linePositions } = useMemo(() => {
    const maxDist = radius * 1.6
    const segments: number[] = []
    for (let i = 0; i < points.length; i++) {
      let linked = 0
      for (let j = i + 1; j < points.length; j++) {
        if (linked >= 3) break
        if (points[i].distanceTo(points[j]) < maxDist) {
          segments.push(points[i].x, points[i].y, points[i].z)
          segments.push(points[j].x, points[j].y, points[j].z)
          linked++
        }
      }
    }
    return { linePositions: new Float32Array(segments) }
  }, [points, radius])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    // small breathing motion
    points.forEach((p, idx) => {
      const s = 1 + 0.03 * Math.sin(t + idx)
      const dir = p.clone().normalize()
      const np = dir.multiplyScalar(p.length() * s)
      const i = idx * 3
      geomRef.current.attributes.position.array[i] = np.x
      geomRef.current.attributes.position.array[i + 1] = np.y
      geomRef.current.attributes.position.array[i + 2] = np.z
    })
    geomRef.current.attributes.position.needsUpdate = true

    if (lineRef.current) {
      const m = lineRef.current.material as THREE.LineBasicMaterial
      m.opacity = 0.6 + 0.35 * Math.sin(t * 1.2)
      m.needsUpdate = true
    }
  })

  const positions = useMemo(() => {
    const arr = new Float32Array(points.length * 3)
    points.forEach((p, i) => {
      arr[i * 3 + 0] = p.x
      arr[i * 3 + 1] = p.y
      arr[i * 3 + 2] = p.z
    })
    return arr
  }, [points])

  return (
    <group position={[0, 0, 0]}>
      <points>
        <bufferGeometry ref={geomRef}>
          <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.05} color={"#e6f1ff"} transparent opacity={0.8} />
      </points>

      <lineSegments ref={lineRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={"#8b5cf6"} transparent opacity={0.6} />
      </lineSegments>
    </group>
  )
}

export default NeonNetwork
