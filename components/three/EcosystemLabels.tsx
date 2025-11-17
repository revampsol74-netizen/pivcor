"use client";

import { Billboard, Text } from "@react-three/drei";

type LabelProps = {
  text: string;
  position: [number, number, number];
  opacity?: number;
  size?: number;
  secondary?: string;
  color?: string;
};

export function EcosystemLabel({
  text,
  position,
  opacity = 0.7,
  size = 0.32,
  secondary,
  color = "#ffffff",
}: LabelProps) {
  return (
    <Billboard position={position} follow lockZ>
      <Text
        fontSize={size}
        color={color}
        anchorX="center"
        anchorY="middle"
        fillOpacity={opacity}
        lineHeight={1.15}
        outlineWidth={0.012}
        outlineColor="rgba(0,0,0,0.55)"
        letterSpacing={0.02}
      >
        {text}
      </Text>
      {secondary ? (
        <Text
          position={[0, -size * 1.4, 0]}
          fontSize={size * 0.45}
          color={color}
          anchorX="center"
          anchorY="middle"
          fillOpacity={opacity * 0.9}
          lineHeight={1.15}
          letterSpacing={0.02}
        >
          {secondary}
        </Text>
      ) : null}
    </Billboard>
  );
}
