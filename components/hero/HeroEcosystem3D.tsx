"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import { EcosystemCore, EcosystemOrbit, EcosystemEntity, PILLAR_ENTITIES, SERVICE_ENTITIES } from "@/components/three/EcosystemOrbits";
import { EcosystemInfoModal } from "@/components/ui/EcosystemInfoModal";

export default function HeroEcosystem3D() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeEntity, setActiveEntity] = useState<EcosystemEntity | null>(null);

  return (
    <div className="w-full h-[420px] md:h-[520px] lg:h-[600px] rounded-3xl border border-white/5 bg-gradient-to-b from-[#0B0B0F] to-[#050509] shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)] overflow-hidden">
      <Canvas camera={{ position: [0, 4.8, 6.5], fov: 32 }} dpr={[1, 2]}>
        <color attach="background" args={["#050509"]} />
        <Suspense fallback={null}>
          <HeroScene
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

function HeroScene({ hoveredId, onHover, onSelect }: SceneProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[4, 5, 3]} intensity={1.3} color="#FF4141" />
      <pointLight position={[-4, -3, -4]} intensity={1.1} color="#00E5FF" />
      <group position={[0, -0.15, 0]} scale={0.88}>
        <EcosystemCore hoveredId={hoveredId} onHover={onHover} onSelect={onSelect} />
        <EcosystemOrbit
          entities={PILLAR_ENTITIES}
          radius={1.9}
          rotationSpeed={0.35}
          hoveredId={hoveredId}
          onHover={onHover}
          onSelect={onSelect}
          labelSize={0.32}
          ringColor="rgba(0,229,255,0.4)"
          ringThickness={0.05}
          showLinks
          linkColor="rgba(0,229,255,0.35)"
        />
        <EcosystemOrbit
          entities={SERVICE_ENTITIES}
          radius={3.1}
          rotationSpeed={-0.22}
          hoveredId={hoveredId}
          onHover={onHover}
          onSelect={onSelect}
          labelSize={0.23}
          ringColor="rgba(255,255,255,0.18)"
          ringThickness={0.05}
          showLinks
          linkColor="rgba(255,255,255,0.25)"
        />
      </group>
    </>
  );
}
