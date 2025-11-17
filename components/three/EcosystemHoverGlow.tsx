"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";

type GlowSphereProps = {
  color: string;
  size: number;
  hovered: boolean;
  position?: [number, number, number];
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onClick?: () => void;
};

export function GlowSphere({
  color,
  size,
  hovered,
  position = [0, 0, 0],
  onPointerEnter,
  onPointerLeave,
  onClick,
}: GlowSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.4,
        roughness: 0.25,
        metalness: 0.15,
      }),
    [color]
  );

  useEffect(() => {
    return () => {
      material.dispose();
    };
  }, [material]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const target = hovered ? 1.05 : 1;
    const current = meshRef.current.scale.x;
    const next = THREE.MathUtils.damp(current, target, 6, delta);
    meshRef.current.scale.setScalar(next);

    const intensity = hovered ? 1.15 : 0.45;
    material.emissiveIntensity = THREE.MathUtils.damp(
      material.emissiveIntensity,
      intensity,
      6,
      delta
    );
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerEnter={(e) => {
        e.stopPropagation();
        onPointerEnter?.();
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        onPointerLeave?.();
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
    >
      <sphereGeometry args={[size, 48, 48]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
