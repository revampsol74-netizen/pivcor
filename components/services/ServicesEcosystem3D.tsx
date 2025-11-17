"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import {
  EcosystemCore,
  EcosystemOrbit,
  EcosystemEntity,
  PILLAR_ENTITIES,
  SERVICE_ENTITIES,
} from "@/components/three/EcosystemOrbits";
import { createRingMaterial } from "@/components/three/EcosystemShaderMaterials";
import { EcosystemInfoModal } from "@/components/ui/EcosystemInfoModal";

const RING_CONFIG = [
  { id: "ring-1", radius: 1.8, color: "#00E5FF", scrollStart: 0, scrollEnd: 0.28 },
  { id: "ring-2", radius: 3.1, color: "#00C8E0", scrollStart: 0.23, scrollEnd: 0.66 },
  { id: "ring-3", radius: 3.8, color: "#00A4C0", scrollStart: 0.55, scrollEnd: 1 },
];

const CAMERA_BASE = { x: 0, y: 7.2, z: 4.1 };

export default function ServicesEcosystem3D() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeEntity, setActiveEntity] = useState<EcosystemEntity | null>(null);

  return (
    <div className="w-full h-[550px] md:h-[650px] lg:h-[750px] bg-gradient-to-b from-[#0B0B0F] to-[#050509] rounded-3xl border border-white/5 shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)] overflow-hidden">
      <Canvas camera={{ position: [CAMERA_BASE.x, CAMERA_BASE.y, CAMERA_BASE.z], fov: 30 }} dpr={[1, 2]}>
        <color attach="background" args={["#050509"]} />
        <Suspense fallback={null}>
          <ServicesScene
            hoveredId={hoveredId}
            onHover={(entity) => setHoveredId(entity?.id ?? null)}
            onSelect={setActiveEntity}
          />
        </Suspense>
      </Canvas>

      <EcosystemInfoModal entity={activeEntity} onClose={() => setActiveEntity(null)} />
    </div>
  );
}

type SceneProps = {
  hoveredId: string | null;
  onHover: (entity: EcosystemEntity | null) => void;
  onSelect: (entity: EcosystemEntity) => void;
};

function ServicesScene({ hoveredId, onHover, onSelect }: SceneProps) {
  const orbitGroup = useRef<THREE.Group>(null);
  const ringMaterials = useMemo(() => RING_CONFIG.map((ring) => createRingMaterial(ring.color)), []);
  const scrollProgress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    return () => {
      ringMaterials.forEach((mat) => mat.dispose());
    };
  }, [ringMaterials]);

  useEffect(() => {
    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      scrollProgress.current = max > 0 ? window.scrollY / max : 0;
    };
    const onPointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("scroll", onScroll);
    window.addEventListener("pointermove", onPointerMove);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  useFrame((state, delta) => {
    ringMaterials.forEach((material, index) => {
      material.uniforms.uTime.value += delta;
      const config = RING_CONFIG[index];
      const range = config.scrollEnd - config.scrollStart + 0.0001;
      const local = THREE.MathUtils.clamp(
        (scrollProgress.current - config.scrollStart) / range,
        0,
        1
      );
      material.uniforms.uOpacity.value = local;
    });

    const targetX = pointer.current.x * 0.9;
    const targetY = CAMERA_BASE.y + pointer.current.y * 0.3;
    const targetZ = CAMERA_BASE.z - scrollProgress.current * 1;

    state.camera.position.x = THREE.MathUtils.damp(
      state.camera.position.x,
      targetX,
      4,
      delta
    );
    state.camera.position.y = THREE.MathUtils.damp(
      state.camera.position.y,
      targetY,
      4,
      delta
    );
    state.camera.position.z = THREE.MathUtils.damp(
      state.camera.position.z,
      targetZ,
      4,
      delta
    );
    state.camera.lookAt(0, 0, 0);

    if (orbitGroup.current) {
      orbitGroup.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <>
      <ambientLight intensity={0.42} />
      <pointLight position={[4, 7, 4]} color="#FF4141" intensity={1.35} />
      <pointLight position={[-4, 5, -3]} color="#00E5FF" intensity={1.05} />
      <group position={[0, 0, 0]} scale={0.8}>
        <group ref={orbitGroup}>
          {RING_CONFIG.map((config, index) => (
            <mesh key={config.id} rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[config.radius * 0.72, config.radius, 256]} />
              <primitive attach="material" object={ringMaterials[index]} />
            </mesh>
          ))}
        </group>

        <EcosystemCore hoveredId={hoveredId} onHover={onHover} onSelect={onSelect} />

        <EcosystemOrbit
          entities={PILLAR_ENTITIES}
          radius={1.85}
          rotationSpeed={0.22}
          hoveredId={hoveredId}
          onHover={onHover}
          onSelect={onSelect}
          labelSize={0.28}
          ringColor="rgba(0,229,255,0.25)"
          ringThickness={0.04}
          showLinks
          linkColor="rgba(0,229,255,0.35)"
        />

        <EcosystemOrbit
          entities={SERVICE_ENTITIES}
          radius={3.0}
          rotationSpeed={-0.14}
          hoveredId={hoveredId}
          onHover={onHover}
          onSelect={onSelect}
          labelSize={0.2}
          ringColor="rgba(255,255,255,0.2)"
          ringThickness={0.035}
          showLinks
          linkColor="rgba(255,255,255,0.25)"
        />
      </group>
    </>
  );
}
