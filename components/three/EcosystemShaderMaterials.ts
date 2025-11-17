"use client";

import * as THREE from "three";

export const ringVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const ringFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float r = length(centered) * 2.0;
    float inner = 0.8;
    float outer = 1.0;

    float ring = smoothstep(inner, inner - 0.08, r) *
      (1.0 - smoothstep(outer, outer + 0.12, r));

    float glow = 0.3 + 0.7 * sin(uTime * 1.5 + r * 6.2831);
    float intensity = ring * glow;

    vec3 color = uColor * intensity;
    float alpha = clamp(intensity * uOpacity, 0.0, 1.0);

    if (alpha < 0.01) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

export function createRingMaterial(color: string) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color(color) },
      uTime: { value: 0 },
      uOpacity: { value: 0 },
    },
    vertexShader: ringVertexShader,
    fragmentShader: ringFragmentShader,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
}
