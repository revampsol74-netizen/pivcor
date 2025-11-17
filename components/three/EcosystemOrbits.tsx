"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { EcosystemLabel } from "./EcosystemLabels";
import { GlowSphere } from "./EcosystemHoverGlow";

export type EcosystemEntity = {
  id: string;
  label: string;
  title: string;
  description: string;
  color: string;
  size: number;
};

export const CORE_ENTITY: EcosystemEntity = {
  id: "core",
  label: "DE",
  title: "Digital Ecosystem",
  description:
    "The intelligent core that synchronizes every product, service, and customer interaction across the brand.",
  color: "#FF4141",
  size: 1.05,
};

export const PILLAR_ENTITIES: EcosystemEntity[] = [
  {
    id: "uc",
    label: "UC",
    title: "Unified Customer Experience",
    description: "Orchestrates every touchpoint with cohesive data, personalization, and feedback loops.",
    color: "#00E5FF",
    size: 0.45,
  },
  {
    id: "ia",
    label: "IA",
    title: "Intelligent Automation",
    description: "Links AI copilots and workflow automations that keep the ecosystem operating in real-time.",
    color: "#00C8E0",
    size: 0.45,
  },
  {
    id: "bi",
    label: "BI",
    title: "Business Intelligence",
    description: "Transforms operations telemetry into strategic foresight for revenue, product, and CX teams.",
    color: "#00A4C0",
    size: 0.45,
  },
];

export const SERVICE_ENTITIES: EcosystemEntity[] = [
  {
    id: "webapps",
    label: "Web App Dev",
    title: "Web Application Development",
    description: "Composable web experiences architected for security, scale, and constant experimentation.",
    color: "#7A5CFF",
    size: 0.3,
  },
  {
    id: "ai",
    label: "AI Integration",
    title: "AI Integration",
    description: "Strategic copilots, copiloted workflows, and retrieval stacks wired directly into the core.",
    color: "#FF7DEB",
    size: 0.3,
  },
  {
    id: "automation",
    label: "Automation Systems",
    title: "Automation Systems",
    description: "Rules engines, event streaming, and human-in-the-loop tooling for every operational layer.",
    color: "#3DDAD7",
    size: 0.3,
  },
  {
    id: "blockchain",
    label: "Blockchain Core",
    title: "Blockchain Core",
    description: "Smart-contract orchestration and tokenized business logic extending the Pivcor core.",
    color: "#F7A400",
    size: 0.3,
  },
  {
    id: "mobile",
    label: "Mobile Apps",
    title: "Mobile Applications",
    description: "Native and cross-platform experiences synchronized with user journeys and automation nodes.",
    color: "#66FFB3",
    size: 0.3,
  },
  {
    id: "cloud",
    label: "Cloud Architecture",
    title: "Cloud Architecture",
    description: "Zero-trust, multi-cloud infrastructure keeping data, AI models, and automations responsive.",
    color: "#A7F3FF",
    size: 0.3,
  },
];

export const ECOSYSTEM_MAP = new Map(
  [CORE_ENTITY, ...PILLAR_ENTITIES, ...SERVICE_ENTITIES].map((entry) => [entry.id, entry])
);

type CoreProps = {
  hoveredId: string | null;
  onHover: (entity: EcosystemEntity | null) => void;
  onSelect: (entity: EcosystemEntity) => void;
};

export function EcosystemCore({ hoveredId, onHover, onSelect }: CoreProps) {
  const groupRef = useRef<THREE.Group>(null);
  const hovered = hoveredId === CORE_ENTITY.id;

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef}>
      <GlowSphere
        color={CORE_ENTITY.color}
        size={CORE_ENTITY.size}
        hovered={hovered}
        onPointerEnter={() => onHover(CORE_ENTITY)}
        onPointerLeave={() => onHover(null)}
        onClick={() => onSelect(CORE_ENTITY)}
      />
      <EcosystemLabel
        text={CORE_ENTITY.label}
        secondary={CORE_ENTITY.title}
        position={[0, CORE_ENTITY.size + 0.6, 0]}
        opacity={hovered ? 1 : 0.75}
        size={0.42}
      />
    </group>
  );
}

type OrbitProps = {
  entities: EcosystemEntity[];
  radius: number;
  rotationSpeed: number;
  hoveredId: string | null;
  onHover: (entity: EcosystemEntity | null) => void;
  onSelect: (entity: EcosystemEntity) => void;
  labelSize?: number;
  elevation?: number;
  ringColor?: string;
  showRing?: boolean;
  ringThickness?: number;
  showLinks?: boolean;
  linkColor?: string;
};

export function EcosystemOrbit({
  entities,
  radius,
  rotationSpeed,
  hoveredId,
  onHover,
  onSelect,
  labelSize = 0.26,
  elevation = 0,
  ringColor = "rgba(255,255,255,0.25)",
  showRing = true,
  ringThickness = 0.03,
  showLinks = false,
  linkColor = "rgba(255,255,255,0.5)",
}: OrbitProps) {
  const orbitRef = useRef<THREE.Group>(null);
  const positions = useMemo(() => {
    const total = entities.length;
    return entities.map((entity, index) => {
      const angle = (index / total) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      return { entity, position: [x, elevation, z] as [number, number, number] };
    });
  }, [entities, radius, elevation]);

  useFrame((_, delta) => {
    if (!orbitRef.current) return;
    orbitRef.current.rotation.y += rotationSpeed * delta;
  });

  return (
    <group ref={orbitRef}>
      {showRing ? (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - ringThickness, radius + ringThickness, 256]} />
          <meshBasicMaterial color={ringColor} transparent opacity={0.6} />
        </mesh>
      ) : null}
      {positions.map(({ entity, position }) => {
        const hovered = hoveredId === entity.id;
        return (
          <group key={entity.id}>
            {showLinks ? (
              <Line
                points={[
                  [0, elevation + 0.02, 0],
                  [position[0] * 0.65, elevation + 0.02, position[2] * 0.65],
                  position,
                ]}
                color={linkColor}
                transparent
                opacity={hovered ? 0.9 : 0.35}
                lineWidth={1}
                dashed={false}
              />
            ) : null}
            <GlowSphere
              color={entity.color}
              size={entity.size}
              hovered={hovered}
              position={position}
              onPointerEnter={() => onHover(entity)}
              onPointerLeave={() => onHover(null)}
              onClick={() => onSelect(entity)}
            />
            <EcosystemLabel
              text={entity.label}
              position={[position[0], entity.size + 0.5 + elevation, position[2]]}
              opacity={hovered ? 1 : 0.5}
              size={labelSize}
            />
          </group>
        );
      })}
    </group>
  );
}
